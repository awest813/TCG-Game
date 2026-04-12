import React, { useState } from 'react';
import { GameContext } from './GameContext';
import { GameState, NewGameConfig, PlayerProfile, SceneType, TimeOfDay } from './types';
import { migrateCircuitFlags } from './circuitProgression';
import { DEFAULT_STARTING_CREDITS } from './economy';
import { AUTOSAVE_STORAGE_KEY, parsePersistedGameState } from './gameStatePersistence';
import { sanitizeGameState } from './gameStateSanitize';
import { createDefaultSocialState, mergeSocialState } from '../data/trainers';

const INITIAL_QUEST = 'Tutorial: Talk to Maya in your apartment, then follow Lucy’s briefing.';

const STARTER_LOADOUTS: Record<NewGameConfig['starter'], { partnerId: string; species: string; deck: string[]; collection: string[]; packs: string[]; quest: string }> = {
  Pulse: {
    partnerId: 'ziprail-p1',
    species: 'Ziprail',
    deck: ['ziprail', 'ziprail', 'neon-striker', 'neon-striker', 'voltlynx', 'voltlynx', 'signalmite', 'signalmite', 'quick-transfer', 'quick-transfer', 'rooftop-remedy', 'rooftop-remedy'],
    collection: ['ziprail', 'ziprail', 'rail-bastion', 'neon-striker', 'neon-striker', 'voltlynx', 'voltlynx', 'overdrive-fox', 'signalmite', 'signalmite', 'quick-transfer', 'quick-transfer', 'signal-boost', 'rooftop-remedy', 'rooftop-remedy', 'power-cell'],
    packs: ['Metro Pulse', 'Metro Pulse'],
    quest: 'Tutorial: Apartment onboarding → Transit map → Card Annex beginner bracket → Sunset regional.'
  },
  Bloom: {
    partnerId: 'mosshop-p1',
    species: 'Mosshop',
    deck: ['mosshop', 'mosshop', 'verdajack', 'verdajack', 'spore-scout', 'spore-scout', 'signalmite', 'signalmite', 'rooftop-remedy', 'rooftop-remedy', 'quick-transfer', 'system-refresh'],
    collection: ['mosshop', 'mosshop', 'lush-golem', 'verdajack', 'verdajack', 'spore-scout', 'spore-scout', 'bloom-whisper', 'seedling-bot', 'solar-rose', 'quick-transfer', 'system-refresh', 'rooftop-remedy', 'rooftop-remedy', 'stim-patch', 'power-cell'],
    packs: ['Garden Shift', 'Metro Pulse'],
    quest: 'Tutorial: Apartment onboarding → Transit map → Card Annex beginner bracket → Sunset regional.'
  },
  Tide: {
    partnerId: 'wharfin-p1',
    species: 'Wharfin',
    deck: ['wharfin', 'wharfin', 'mist-glider', 'mist-glider', 'coral-guard', 'coral-guard', 'quick-transfer', 'quick-transfer', 'system-refresh', 'system-refresh', 'rooftop-remedy', 'power-cell'],
    collection: ['wharfin', 'wharfin', 'tidal-whale', 'mist-glider', 'mist-glider', 'coral-guard', 'coral-guard', 'wave-rider', 'data-diver', 'quick-transfer', 'quick-transfer', 'system-refresh', 'system-refresh', 'rooftop-remedy', 'stim-patch', 'power-cell'],
    packs: ['Neon Echo', 'Bayline Current'],
    quest: 'Tutorial: Apartment onboarding → Transit map → Card Annex beginner bracket → Sunset regional.'
  }
};

const createProfile = (config?: NewGameConfig): PlayerProfile => {
  const starter = config?.starter ?? 'Pulse';
  const loadout = STARTER_LOADOUTS[starter];

  return {
    name: config?.name?.trim() || 'Neo_Rookie',
    currency: DEFAULT_STARTING_CREDITS,
    level: 1,
    xp: 0,
    inventory: {
      cards: [...loadout.collection],
      packs: [...loadout.packs],
      deck: [...loadout.deck],
      items: ['Basic Holo-Sleeve']
    },
    mainBioSync: {
      id: loadout.partnerId,
      species: loadout.species,
      happiness: 80,
      hunger: 20,
      bondLevel: 1
    },
    primaryPartner: {
      id: loadout.partnerId,
      species: loadout.species,
      happiness: 80,
      hunger: 20,
      bondLevel: 1
    },
    badges: [],
    stats: {
      wins: 0,
      losses: 0,
      tournamentsWon: 0,
      cardsCollected: loadout.collection.length,
      playTime: 0,
      winStreak: 0,
      archetypeUsage: {
        Pulse: 0,
        Bloom: 0,
        Tide: 0,
        Alloy: 0,
        Veil: 0,
        Current: 0
      }
    },
    social: createDefaultSocialState(),
    progress: {
      unlockedDistricts: ['APARTMENT', 'SUNSET_TERMINAL'],
      flags: {
        onboardingStarter: starter,
        onboardingComplete: false
      },
      storyProgress: 0,
      chapter: 1
    }
  };
};

const createInitialState = (config?: NewGameConfig, startInMenu = true): GameState => {
  const starter = config?.starter ?? 'Pulse';
  return {
    profile: createProfile(config),
    currentScene: config || !startInMenu ? 'APARTMENT' : 'MAIN_MENU',
    location: 'APARTMENT',
    timeOfDay: 'MORNING',
    currentQuest: config
      ? STARTER_LOADOUTS[starter].quest
      : startInMenu
        ? 'Title screen: Continue loads your autosave. New game opens the apartment tutorial (Lucy), then Transit and the Card Annex.'
        : INITIAL_QUEST,
    activeTournament: null,
    pendingTournamentId: null,
    tournamentLobbyReturn: null,
    deckEditorReturn: null,
    transitReturn: null,
    profileReturn: null,
    bracketVictoryToast: null,
    vnSession: null,
    visuals: {
      presentationTier: 'HIGH'
    }
  };
};

const normalizeProfile = (profile: PlayerProfile): PlayerProfile => {
  const starter = typeof profile.progress?.flags?.onboardingStarter === 'string' ? profile.progress.flags.onboardingStarter : 'Pulse';
  const starterLoadout = STARTER_LOADOUTS[starter as NewGameConfig['starter']] ?? STARTER_LOADOUTS.Pulse;

  const safeCurrency = Math.max(0, Math.min(99_999_999, Math.floor(Number(profile.currency) || 0)));
  const safeName = typeof profile.name === 'string' && profile.name.trim() ? profile.name.trim() : 'Neo_Rookie';

  return {
    ...profile,
    name: safeName,
    currency: safeCurrency,
    inventory: {
      cards: profile.inventory?.cards ?? [...starterLoadout.collection],
      packs: profile.inventory?.packs ?? [...starterLoadout.packs],
      deck: profile.inventory?.deck ?? [...starterLoadout.deck],
      items: profile.inventory?.items ?? ['Basic Holo-Sleeve']
    },
    stats: {
      wins: Math.max(0, Math.floor(Number(profile.stats?.wins) || 0)),
      losses: Math.max(0, Math.floor(Number(profile.stats?.losses) || 0)),
      tournamentsWon: Math.max(0, Math.floor(Number(profile.stats?.tournamentsWon) || 0)),
      cardsCollected: Math.max(0, Math.floor(Number(profile.stats?.cardsCollected) || profile.inventory?.cards?.length || starterLoadout.collection.length)),
      playTime: Math.max(0, Math.floor(Number(profile.stats?.playTime) || 0)),
      winStreak: Math.max(0, Math.floor(Number(profile.stats?.winStreak) || 0)),
      archetypeUsage: profile.stats?.archetypeUsage ?? { Pulse: 0, Bloom: 0, Tide: 0, Alloy: 0, Veil: 0, Current: 0 }
    },
    social: mergeSocialState(profile.social),
    progress: {
      unlockedDistricts: profile.progress?.unlockedDistricts ?? ['APARTMENT', 'SUNSET_TERMINAL'],
      flags: migrateCircuitFlags({
        onboardingStarter: starter,
        onboardingComplete: false,
        ...(profile.progress?.flags ?? {})
      }),
      storyProgress: profile.progress?.storyProgress ?? 0,
      chapter: profile.progress?.chapter ?? 1
    }
  };
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(createInitialState());

  const setScene = (scene: SceneType) => {
    setState((prev) => ({ ...prev, currentScene: scene }));
  };

  const updateProfile = (update: Partial<PlayerProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...update,
        inventory: update.inventory
          ? { ...prev.profile.inventory, ...update.inventory }
          : prev.profile.inventory,
        stats: update.stats
          ? { ...prev.profile.stats, ...update.stats }
          : prev.profile.stats,
        social: update.social
          ? {
              trainers: {
                ...prev.profile.social.trainers,
                ...update.social.trainers
              },
              factions: {
                ...prev.profile.social.factions,
                ...update.social.factions
              }
            }
          : prev.profile.social,
        progress: update.progress
          ? {
              ...prev.profile.progress,
              ...update.progress,
              unlockedDistricts: update.progress.unlockedDistricts ?? prev.profile.progress.unlockedDistricts,
              flags: update.progress.flags
                ? { ...prev.profile.progress.flags, ...update.progress.flags }
                : prev.profile.progress.flags
            }
          : prev.profile.progress
      }
    }));
  };

  const updateGameState = (update: Partial<GameState>) => {
    setState((prev) => ({ ...prev, ...update }));
  };

  const advanceTime = () => {
    const times: TimeOfDay[] = ['MORNING', 'AFTERNOON', 'EVENING'];
    const currentIndex = times.indexOf(state.timeOfDay);
    const nextIndex = (currentIndex + 1) % times.length;
    setState((prev) => ({ ...prev, timeOfDay: times[nextIndex] }));
  };

  const applyLoadedGame = (loaded: GameState) => {
    const sanitized = sanitizeGameState(loaded);
    setState({
      ...sanitized,
      profile: normalizeProfile(sanitized.profile),
      tournamentLobbyReturn: sanitized.tournamentLobbyReturn ?? null,
      deckEditorReturn: sanitized.deckEditorReturn ?? null,
      transitReturn: sanitized.transitReturn ?? null,
      profileReturn: sanitized.profileReturn ?? null
    });
  };

  const saveGame = () => {
    localStorage.setItem(AUTOSAVE_STORAGE_KEY, JSON.stringify(state));
  };

  const loadGame = () => {
    const saved = localStorage.getItem(AUTOSAVE_STORAGE_KEY);
    const parsed = saved ? parsePersistedGameState(saved) : null;
    if (!parsed) return false;
    applyLoadedGame(parsed);
    return true;
  };

  const hydrateGameState = (loaded: GameState) => {
    applyLoadedGame(loaded);
  };

  const resetGame = (config?: NewGameConfig) => {
    setState(createInitialState(config ?? { name: 'Neo_Rookie', starter: 'Pulse' }, false));
  };

  return (
    <GameContext.Provider
      value={{ state, setScene, updateProfile, updateGameState, advanceTime, saveGame, loadGame, hydrateGameState, resetGame }}
    >
      {children}
    </GameContext.Provider>
  );
};
