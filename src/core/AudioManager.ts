// Music, SFX & Voice manager — persisted volumes, pooled SFX, scene-aware BGM, dual-deck crossfade.
import type { SceneType } from './types';

export type TrackId = 'TITLE' | 'TOWN' | 'BATTLE' | 'CHAMPION' | 'VICTORY' | 'SHOP' | 'TOURNAMENT_LOBBY';

export type AudioBus = 'master' | 'music' | 'sfx' | 'voice';

export type AudioSettingsSnapshot = {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  voiceVolume: number;
  isMuted: boolean;
};

const STORAGE_KEY = 'neo_sf_audio_settings';
const SFX_POOL_SIZE = 6;
const BGM_CROSSFADE_MS = 900;

const audioDebug = typeof import.meta !== 'undefined' && Boolean(import.meta.env?.DEV);

function log(...args: unknown[]) {
  if (audioDebug) console.log('[Audio]', ...args);
}

type PersistedAudio = {
  master?: number;
  music?: number;
  sfx?: number;
  voice?: number;
  muted?: boolean;
};

function readStorage(): PersistedAudio {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as PersistedAudio;
  } catch {
    return {};
  }
}

function writeStorage(data: PersistedAudio) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota / private mode */
  }
}

function smoothstep(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

function whenAudioCanPlay(el: HTMLAudioElement, fn: () => void) {
  if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    queueMicrotask(fn);
  } else {
    el.addEventListener('canplay', fn, { once: true });
  }
}

class AudioManager {
  private readonly bgmDecks: [HTMLAudioElement, HTMLAudioElement] = [new Audio(), new Audio()];
  private activeDeck: 0 | 1 = 0;
  private currentTrackId: TrackId | null = null;
  private fadeGeneration = 0;
  private isCrossfading = false;
  private crossfadeRaf: number | null = null;

  private sfxPool: HTMLAudioElement[] = [];
  private sfxRoundRobin = 0;

  private config = {
    masterVolume: 0.8,
    musicVolume: 0.6,
    sfxVolume: 0.7,
    voiceVolume: 0.9,
    isMuted: false
  };

  private tracks: Record<TrackId, string> = {
    TITLE: '/audio/bgm_title.mp3',
    TOWN: '/audio/bgm_club_hub.mp3',
    BATTLE: '/audio/bgm_battle_sync.mp3',
    CHAMPION: '/audio/bgm_last_sync.mp3',
    VICTORY: '/audio/bgm_victory.mp3',
    SHOP: '/audio/bgm_card_boutique.mp3',
    TOURNAMENT_LOBBY: '/audio/bgm_tournament_lobby.mp3'
  };

  constructor() {
    this.hydrateFromStorage();
    for (let i = 0; i < SFX_POOL_SIZE; i++) {
      this.sfxPool.push(new Audio());
    }
    this.bgmDecks[0].loop = true;
    this.bgmDecks[1].loop = true;
  }

  private hydrateFromStorage() {
    const disk = readStorage();
    if (typeof disk.master === 'number' && Number.isFinite(disk.master)) {
      this.config.masterVolume = Math.max(0, Math.min(1, disk.master));
    }
    if (typeof disk.music === 'number' && Number.isFinite(disk.music)) {
      this.config.musicVolume = Math.max(0, Math.min(1, disk.music));
    }
    if (typeof disk.sfx === 'number' && Number.isFinite(disk.sfx)) {
      this.config.sfxVolume = Math.max(0, Math.min(1, disk.sfx));
    }
    if (typeof disk.voice === 'number' && Number.isFinite(disk.voice)) {
      this.config.voiceVolume = Math.max(0, Math.min(1, disk.voice));
    }
    if (typeof disk.muted === 'boolean') {
      this.config.isMuted = disk.muted;
    }
  }

  private persist() {
    writeStorage({
      master: this.config.masterVolume,
      music: this.config.musicVolume,
      sfx: this.config.sfxVolume,
      voice: this.config.voiceVolume,
      muted: this.config.isMuted
    });
  }

  getSnapshot(): AudioSettingsSnapshot {
    return {
      masterVolume: this.config.masterVolume,
      musicVolume: this.config.musicVolume,
      sfxVolume: this.config.sfxVolume,
      voiceVolume: this.config.voiceVolume,
      isMuted: this.config.isMuted
    };
  }

  getMasterVolumePercent(): number {
    return Math.round(this.config.masterVolume * 100);
  }

  getBusVolumePercent(bus: 'music' | 'sfx' | 'voice'): number {
    switch (bus) {
      case 'music':
        return Math.round(this.config.musicVolume * 100);
      case 'sfx':
        return Math.round(this.config.sfxVolume * 100);
      case 'voice':
        return Math.round(this.config.voiceVolume * 100);
      default:
        return 0;
    }
  }

  private getBgmGain(): number {
    return this.config.musicVolume * this.config.masterVolume;
  }

  private invalidateFades() {
    this.fadeGeneration++;
    if (this.crossfadeRaf !== null) {
      cancelAnimationFrame(this.crossfadeRaf);
      this.crossfadeRaf = null;
    }
    if (this.isCrossfading) {
      const from = this.bgmDecks[this.activeDeck];
      const to = this.bgmDecks[1 - this.activeDeck];
      try {
        to.pause();
      } catch {
        /* noop */
      }
      to.volume = 0;
      if (from.src) this.applyBgmVolumeToElement(from);
      this.isCrossfading = false;
    }
  }

  /** Default BGM for a scene. Skips `TOURNAMENT` so `Tournament.tsx` can pick lobby vs hub. */
  syncAmbientMusicForScene(scene: SceneType): void {
    if (scene === 'TOURNAMENT') return;

    const map: Partial<Record<SceneType, TrackId>> = {
      MAIN_MENU: 'TITLE',
      STORE: 'SHOP',
      BATTLE: 'BATTLE',
      REWARD: 'VICTORY'
    };

    const track = map[scene] ?? 'TOWN';
    this.playBGM(track);
  }

  playBGM(id: TrackId) {
    if (this.config.isMuted) return;

    const path = this.tracks[id];
    if (!path) return;

    if (this.currentTrackId === id && !this.isCrossfading) {
      this.applyBgmVolumeToActive();
      return;
    }

    log('BGM', id);

    this.invalidateFades();
    const genAtStart = this.fadeGeneration;

    if (this.currentTrackId === null) {
      const el = this.bgmDecks[this.activeDeck];
      el.src = path;
      whenAudioCanPlay(el, () => {
        if (genAtStart !== this.fadeGeneration) return;
        this.applyBgmVolumeToElement(el);
        void el.play().catch(() => log('BGM autoplay blocked', id));
        this.currentTrackId = id;
      });
      return;
    }

    const from = this.bgmDecks[this.activeDeck];
    const to = this.bgmDecks[1 - this.activeDeck];
    const outgoingDeck = this.activeDeck;

    to.src = path;
    to.volume = 0;

    whenAudioCanPlay(to, () => {
      if (genAtStart !== this.fadeGeneration) return;

      void to.play().catch(() => log('incoming BGM play blocked'));
      if (from.src) {
        void from.play().catch(() => undefined);
      }

      this.isCrossfading = true;
      const start = performance.now();

      const step = (now: number) => {
        if (genAtStart !== this.fadeGeneration) return;

        const t = Math.min(1, (now - start) / BGM_CROSSFADE_MS);
        const s = smoothstep(t);
        const g = this.getBgmGain();

        to.volume = g * s;
        if (from.src) {
          from.volume = g * (1 - s);
        }

        if (t < 1) {
          this.crossfadeRaf = requestAnimationFrame(step);
        } else {
          this.crossfadeRaf = null;
          this.isCrossfading = false;
          try {
            from.pause();
          } catch {
            /* noop */
          }
          from.volume = 0;
          to.volume = g;
          this.activeDeck = (1 - outgoingDeck) as 0 | 1;
          this.currentTrackId = id;
        }
      };

      this.crossfadeRaf = requestAnimationFrame(step);
    });
  }

  stopBGM() {
    this.invalidateFades();
    this.bgmDecks[0].pause();
    this.bgmDecks[1].pause();
    this.bgmDecks[0].volume = 0;
    this.bgmDecks[1].volume = 0;
    this.currentTrackId = null;
  }

  private applyBgmVolumeToElement(audio: HTMLAudioElement) {
    audio.volume = this.getBgmGain();
  }

  private applyBgmVolumeToActive() {
    if (this.isCrossfading) return;
    const el = this.bgmDecks[this.activeDeck];
    if (el?.src) this.applyBgmVolumeToElement(el);
  }

  playSFX(id: string) {
    if (this.config.isMuted) return;
    const effective = this.config.sfxVolume * this.config.masterVolume;
    if (effective <= 0) return;

    const path = `/audio/sfx_${id}.mp3`;
    log('SFX', id);

    const audio = this.sfxPool[this.sfxRoundRobin % this.sfxPool.length];
    this.sfxRoundRobin++;

    try {
      audio.pause();
    } catch {
      /* noop */
    }

    audio.src = path;
    audio.volume = effective;
    audio.currentTime = 0;
    void audio.play().catch(() => {
      log('SFX blocked or missing', id);
    });
  }

  speak(
    text: string,
    archetype: 'rival' | 'gym-master' | 'elite' | 'champion' | 'announcer' | 'player' | 'lucy' = 'announcer'
  ) {
    if (this.config.isMuted || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = this.config.voiceVolume * this.config.masterVolume;

    switch (archetype) {
      case 'rival':
        utterance.pitch = 1.2;
        utterance.rate = 1.1;
        break;
      case 'gym-master':
        utterance.pitch = 0.8;
        utterance.rate = 0.9;
        break;
      case 'elite':
        utterance.pitch = 0.75;
        utterance.rate = 0.85;
        break;
      case 'champion':
        utterance.pitch = 0.7;
        utterance.rate = 0.8;
        break;
      case 'announcer':
        utterance.pitch = 1.0;
        utterance.rate = 1.05;
        break;
      case 'lucy':
        utterance.pitch = 1.06;
        utterance.rate = 1.02;
        break;
      default:
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
    }

    window.speechSynthesis.speak(utterance);
  }

  setMute(mute: boolean) {
    this.config.isMuted = mute;
    if (mute) {
      this.invalidateFades();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      this.bgmDecks[0].pause();
      this.bgmDecks[1].pause();
    } else {
      const el = this.bgmDecks[this.activeDeck];
      if (el?.src && this.currentTrackId) {
        this.applyBgmVolumeToElement(el);
        void el.play().catch(() => log('BGM resume blocked'));
      }
    }
    this.persist();
  }

  setVolume(bus: AudioBus, value: number) {
    const clamped = Math.max(0, Math.min(1, value));
    switch (bus) {
      case 'master':
        this.config.masterVolume = clamped;
        break;
      case 'music':
        this.config.musicVolume = clamped;
        break;
      case 'sfx':
        this.config.sfxVolume = clamped;
        break;
      case 'voice':
        this.config.voiceVolume = clamped;
        break;
    }
    this.applyBgmVolumeToActive();
    this.persist();
  }
}

export const audioManager = new AudioManager();
