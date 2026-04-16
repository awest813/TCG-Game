import React, { useMemo } from 'react';
import { useGame } from '../core/GameContext';
import type { SceneType } from '../core/types';
import '../styles/SceneStatusBar.css';

/** Scenes that already ship a full HUD; avoid duplicating context in the strip. */
const STATUS_BAR_HIDDEN: ReadonlySet<SceneType> = new Set([
  'MAIN_MENU',
  'APARTMENT',
  'BATTLE',
  'TOURNAMENT'
]);

const SCENE_SHORT: Partial<Record<SceneType, string>> = {
  DISTRICT_EXPLORE: 'District',
  DECK_EDITOR: 'Deck',
  PACK_OPENING: 'Packs',
  STORE: 'Shop',
  SOCIAL: 'Social',
  TRANSIT: 'Transit',
  SAVE_LOAD: 'Recovery',
  PROFILE: 'Profile',
  VN_SCENE: 'Story',
  REWARD: 'Rewards'
};

export const SceneStatusBar: React.FC = () => {
  const { state } = useGame();
  const scene = state.currentScene;

  const visible = !STATUS_BAR_HIDDEN.has(scene);
  const operator = (state.profile.name?.trim() || 'ROOKIE').toUpperCase();
  const locationLabel = state.location.replace(/_/g, ' ');
  const time = state.timeOfDay;

  const questLine = useMemo(() => {
    if (scene === 'VN_SCENE' && state.vnSession?.title) {
      return state.vnSession.title;
    }
    return state.currentQuest || '—';
  }, [scene, state.currentQuest, state.vnSession?.title]);

  if (!visible) return null;

  return (
    <div className="scene-status-bar" role="region" aria-label="Session status">
      <div className="scene-status-bar__operator">
        <span className="scene-status-bar__operator-label">Pilot</span>
        {operator}
      </div>
      <div className="scene-status-bar__quest">
        <span className="scene-status-bar__quest-label">Quest</span>
        <span className="scene-status-bar__quest-text" title={questLine}>
          {questLine}
        </span>
      </div>
      <div className="scene-status-bar__meta">
        {SCENE_SHORT[scene] ?? scene.replace(/_/g, ' ')} · {time} · {locationLabel}
      </div>
    </div>
  );
};
