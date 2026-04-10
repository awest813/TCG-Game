// Music, SFX & Voice Manager for Neo SF
// Handles BGM transitions, UI feedback, and dynamic voice cues

export type TrackId = 'TITLE' | 'TOWN' | 'BATTLE' | 'CHAMPION' | 'VICTORY' | 'SHOP' | 'TOURNAMENT_LOBBY';

class AudioManager {
    private currentBGM: HTMLAudioElement | null = null;
    private config = {
        masterVolume: 0.8,
        musicVolume: 0.6,
        sfxVolume: 0.7,
        voiceVolume: 0.9,
        isMuted: false
    };

    // Track definitions
    private tracks: Record<TrackId, string> = {
        TITLE: '/audio/bgm_title.mp3',
        TOWN: '/audio/bgm_club_hub.mp3',
        BATTLE: '/audio/bgm_battle_sync.mp3',
        CHAMPION: '/audio/bgm_last_sync.mp3',
        VICTORY: '/audio/bgm_victory.mp3',
        SHOP: '/audio/bgm_card_boutique.mp3',
        TOURNAMENT_LOBBY: '/audio/bgm_tournament_lobby.mp3'
    };

    /**
     * Plays background music. 
     * Handles track switching. In a full implementation, this includes cross-fading.
     */
    playBGM(id: TrackId) {
        if (this.config.isMuted) return;
        
        const path = this.tracks[id];
        if (!path) return;

        // If same track is playing, don't restart
        if (this.currentBGM && this.currentBGM.src.endsWith(path)) return;

        console.log(`[Audio] Playing BGM: ${id}`);
        
        if (this.currentBGM) {
            this.currentBGM.pause();
        }

        const audio = new Audio(path);
        audio.loop = true;
        audio.volume = this.config.musicVolume * this.config.masterVolume;
        
        // Use a silent try-catch because browsers block autoplay without interaction
        audio.play().catch(() => {
            console.warn(`[Audio] BGM Autplay blocked for: ${id}. Interaction required.`);
        });
        
        this.currentBGM = audio;
    }

    /**
     * Plays a one-off sound effect.
     */
    playSFX(id: string) {
        if (this.config.isMuted) return;
        console.log(`[Audio] SFX: ${id}`);
        
        const path = `/audio/sfx_${id}.mp3`;
        const audio = new Audio(path);
        audio.volume = this.config.sfxVolume * this.config.masterVolume;
        audio.play().catch(() => {});
    }

    /**
     * Placeholder Voice Acting system using SpeechSynthesis.
     * This brings the "Potential Voice Acting" request to life instantly.
     */
    speak(text: string, archetype: 'rival' | 'gym-master' | 'elite' | 'champion' | 'announcer' | 'player' = 'announcer') {
        if (this.config.isMuted || !window.speechSynthesis) return;

        // Cancel previous speech to avoid queuing
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.volume = this.config.voiceVolume * this.config.masterVolume;
        
        // Differentiate voices based on character type
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
            default:
                utterance.pitch = 1.0;
                utterance.rate = 1.0;
        }

        window.speechSynthesis.speak(utterance);
    }

    setMute(mute: boolean) {
        this.config.isMuted = mute;
        if (mute && this.currentBGM) {
            this.currentBGM.pause();
        } else if (!mute && this.currentBGM) {
            this.currentBGM.play().catch(() => {});
        }
    }

    setVolume(bus: 'master' | 'music' | 'sfx' | 'voice', value: number) {
        const key = `${bus}Volume` as keyof typeof this.config;
        if (key in this.config) {
            (this.config as any)[key] = Math.max(0, Math.min(1, value));
            
            // Update currently playing BGM volume
            if (this.currentBGM) {
                this.currentBGM.volume = this.config.musicVolume * this.config.masterVolume;
            }
        }
    }
}

export const audioManager = new AudioManager();
