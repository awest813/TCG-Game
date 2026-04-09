import React, { createContext, useContext, useState } from 'react';
import { GameState, PlayerProfile, SceneType, TimeOfDay } from './types';

interface GameContextType {
  state: GameState;
  setScene: (scene: SceneType) => void;
  updateProfile: (update: Partial<PlayerProfile>) => void;
  updateGameState: (update: Partial<GameState>) => void;
  advanceTime: () => void;
  saveGame: () => void;
  loadGame: () => boolean;
  resetGame: () => void;
}

const INITIAL_QUEST = "Tutorial: Talk to Maya in your Apartment";

const DEFAULT_PROFILE: PlayerProfile = {
  name: "Neo_Rookie",
  currency: 1250,
  level: 1,
  xp: 0,
  inventory: {
    cards: [
        "ziprail", "ziprail", "neon-striker", "neon-striker", 
        "voltlynx", "voltlynx", "signalmite", "signalmite",
        "quick-transfer", "quick-transfer", "rooftop-remedy", "rooftop-remedy",
        "iron-mite", "iron-mite", "mosshop", "mosshop"
    ],
    packs: ["Metro Pulse", "Metro Pulse"],
    deck: [
        "ziprail", "ziprail", "neon-striker", "neon-striker", 
        "voltlynx", "voltlynx", "signalmite", "signalmite",
        "quick-transfer", "quick-transfer", "rooftop-remedy", "rooftop-remedy"
    ],
    items: ["Basic Holo-Sleeve"]
  },
  mainBioSync: {
      id: "ziprail-p1",
      species: "Ziprail",
      happiness: 80,
      hunger: 20,
      bondLevel: 1
  },
  primaryPartner: {
      id: "ziprail-p1",
      species: "Ziprail",
      happiness: 80,
      hunger: 20,
      bondLevel: 1
  },
  badges: [],
  stats: {
    wins: 0,
    losses: 0,
    tournamentsWon: 0,
    cardsCollected: 16
  },
  progress: {
    unlockedDistricts: ["APARTMENT", "SUNSET_TERMINAL"],
    flags: {},
    storyProgress: 0,
    chapter: 1
  }
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>({
    profile: DEFAULT_PROFILE,
    currentScene: "MAIN_MENU",
    location: "APARTMENT",
    timeOfDay: "MORNING",
    currentQuest: "Explore Sunset Terminal",
    activeTournament: null
  });

  const setScene = (scene: SceneType) => {
    setState(prev => ({ ...prev, currentScene: scene }));
  };

  const updateProfile = (update: Partial<PlayerProfile>) => {
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, ...update }
    }));
  };

  const updateGameState = (update: Partial<GameState>) => {
    setState(prev => ({ ...prev, ...update }));
  };

  const advanceTime = () => {
    const times: TimeOfDay[] = ["MORNING", "AFTERNOON", "EVENING"];
    const currentIndex = times.indexOf(state.timeOfDay);
    const nextIndex = (currentIndex + 1) % times.length;
    setState(prev => ({ ...prev, timeOfDay: times[nextIndex] }));
  };

  const saveGame = () => {
    localStorage.setItem('neo_sf_save', JSON.stringify(state));
    console.log("Game Saved");
  };

  const loadGame = () => {
    const saved = localStorage.getItem('neo_sf_save');
    if (saved) {
      setState(JSON.parse(saved));
      return true;
    }
    return false;
  };

  const resetGame = () => {
      setState({
          profile: DEFAULT_PROFILE,
          currentScene: "APARTMENT",
          location: "APARTMENT",
          timeOfDay: "MORNING",
          currentQuest: INITIAL_QUEST,
          activeTournament: null
      });
  };

  return (
    <GameContext.Provider value={{ state, setScene, updateProfile, updateGameState, advanceTime, saveGame, loadGame, resetGame }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};
