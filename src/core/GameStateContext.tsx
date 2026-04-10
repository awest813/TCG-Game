import React, { useState } from 'react';
import { GameContext } from './GameContext';
import { GameState, NewGameConfig, PlayerProfile, SceneType, TimeOfDay } from './types';

const INITIAL_QUEST = 'Tutorial: Talk to Maya in your Apartment';

const STARTER_LOADOUTS: Record<NewGameConfig['starter'], { partnerId: string; species: string; deck: string[]; collection: string[]; packs: string[]; quest: string }> = {
  Pulse: {
    partnerId: 'ziprail-p1',
    species: 'Ziprail',
    deck: ['ziprail', 'ziprail', 'neon-striker', 'neon-striker', 'voltlynx', 'voltlynx', 'signalmite', 'signalmite', 'quick-transfer', 'quick-transfer', 'rooftop-remedy', 'rooftop-remedy'],
    collection: ['ziprail', 'ziprail', 'rail-bastion', 'neon-striker', 'neon-striker', 'voltlynx', 'voltlynx', 'overdrive-fox', 'signalmite', 'signalmite', 'quick-transfer', 'quick-transfer', 'signal-boost', 'rooftop-remedy', 'rooftop-remedy', 'power-cell'],
    packs: ['Metro Pulse', 'Metro Pulse'],
    quest: 'Tutorial: Visit the terminal and learn your Pulse opener.'
  },
  Bloom: {
    partnerId: 'mosshop-p1',
    species: 'Mosshop',
    deck: ['mosshop', 'mosshop', 'verdajack', 'verdajack', 'spore-scout', 'spore-scout', 'signalmite', 'signalmite', 'rooftop-remedy', 'rooftop-remedy', 'quick-transfer', 'system-refresh'],
    collection: ['mosshop', 'mosshop', 'lush-golem', 'verdajack', 'verdajack', 'spore-scout', 'spore-scout', 'bloom-whisper', 'seedling-bot', 'solar-rose', 'quick-transfer', 'system-refresh', 'rooftop-remedy', 'rooftop-remedy', 'stim-patch', 'power-cell'],
    packs: ['Garden Shift', 'Metro Pulse'],
    quest: 'Tutorial: Talk to Maya and test your Bloom sustain plan.'
  },
  Tide: {
    partnerId: 'wharfin-p1',
    species: 'Wharfin',
    deck: ['wharfin', 'wharfin', 'mist-glider', 'mist-glider', 'coral-guard', 'coral-guard', 'quick-transfer', 'quick-transfer', 'system-refresh', 'system-refresh', 'rooftop-remedy', 'power-cell'],
    collection: ['wharfin', 'wharfin', 'tidal-whale', 'mist-glider', 'mist-glider', 'coral-guard', 'coral-guard', 'wave-rider', 'data-diver', 'quick-transfer', 'quick-transfer', 'system-refresh', 'system-refresh', 'rooftop-remedy', 'stim-patch', 'power-cell'],
    packs: ['Neon Echo', 'Bayline Current'],
    quest: 'Tutorial: Learn how to control tempo with your Tide starter.'
  }
};

const createProfile = (config?: NewGameConfig): PlayerProfile => {
  const starter = config?.starter ?? 'Pulse';
  const loadout = STARTER_LOADOUTS[starter];

  return {
    name: config?.name?.trim() || 'Neo_Rookie',
    currency: 1250,
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
      cardsCollected: loadout.collection.length
    },
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
    currentQuest: config ? STARTER_LOADOUTS[starter].quest : startInMenu ? 'Explore Sunset Terminal' : INITIAL_QUEST,
    activeTournament: null
  };
};

const isTimeOfDay = (value: unknown): value is TimeOfDay =>
  value === 'MORNING' || value === 'AFTERNOON' || value === 'EVENING';

const isSceneType = (value: unknown): value is SceneType =>
  [
    'MAIN_MENU',
    'APARTMENT',
    'DISTRICT_EXPLORE',
    'DECK_EDITOR',
    'PACK_OPENING',
    'STORE',
    'BATTLE',
    'REWARD',
    'SOCIAL',
    'TOURNAMENT',
    'TRANSIT',
    'SAVE_LOAD',
    'PROFILE'
  ].includes(String(value));

const isGameState = (value: unknown): value is GameState => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<GameState>;
  return (
    !!candidate.profile &&
    typeof candidate.location === 'string' &&
    typeof candidate.currentQuest === 'string' &&
    isSceneType(candidate.currentScene) &&
    isTimeOfDay(candidate.timeOfDay)
  );
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(createInitialState());

  const setScene = (scene: SceneType) => {
    setState((prev) => ({ ...prev, currentScene: scene }));
  };

  const updateProfile = (update: Partial<PlayerProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...update }
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

  const saveGame = () => {
    localStorage.setItem('neo_sf_save', JSON.stringify(state));
    console.log('Game Saved');
  };

  const loadGame = () => {
    const saved = localStorage.getItem('neo_sf_save');
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (isGameState(parsed)) {
        setState(parsed);
        return true;
      }
    }
    return false;
  };

  const resetGame = (config?: NewGameConfig) => {
    setState(createInitialState(config ?? { name: 'Neo_Rookie', starter: 'Pulse' }, false));
  };

  return <GameContext.Provider value={{ state, setScene, updateProfile, updateGameState, advanceTime, saveGame, loadGame, resetGame }}>{children}</GameContext.Provider>;
};
