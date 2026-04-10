import { createContext, useContext } from 'react';
import { GameState, NewGameConfig, PlayerProfile, SceneType } from './types';

export interface GameContextType {
  state: GameState;
  setScene: (scene: SceneType) => void;
  updateProfile: (update: Partial<PlayerProfile>) => void;
  updateGameState: (update: Partial<GameState>) => void;
  advanceTime: () => void;
  saveGame: () => void;
  loadGame: () => boolean;
  resetGame: (config?: NewGameConfig) => void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
