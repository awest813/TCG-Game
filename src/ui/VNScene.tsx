import React from 'react';
import { useGame } from '../core/GameContext';
import { VNEngineState } from '../engine/types';
import { TRAINERS, mergeSocialState } from '../data/trainers';
import { createSceneTransition, createVNExitTransition } from '../core/sceneTransitions';
import { resolveCompletionScene } from '../visual-novel/scriptRegistry';
import { VNRunner } from './VNRunner';

const isScalarVariable = (value: unknown): value is string | number | boolean | null =>
  value === null || ['string', 'number', 'boolean'].includes(typeof value);

const createInitialVNState = (
  flags: Record<string, string | number | boolean | null>,
  trainerAffinity: Record<string, number>,
  currentQuest: string,
  playerName: string,
  timeOfDay: string
) => {
  const relationships: VNEngineState['relationships'] = { ...trainerAffinity };
  const variables: VNEngineState['variables'] = {
    currentQuest,
    playerName,
    timeOfDay
  };
  const vnFlags: VNEngineState['flags'] = {};

  Object.entries(flags).forEach(([key, value]) => {
    if (key.startsWith('relationship_') && typeof value === 'number') {
      relationships[key.replace('relationship_', '')] = value;
      return;
    }

    if (key.startsWith('vnVar_') && isScalarVariable(value)) {
      variables[key.replace('vnVar_', '')] = value;
      return;
    }

    if (typeof value === 'boolean') {
      vnFlags[key] = value;
    }
  });

  return {
    relationships,
    variables,
    flags: vnFlags
  } satisfies Partial<VNEngineState>;
};

const serializeVNSessionState = (vnState: VNEngineState) => {
  const relationshipFlags = Object.entries(vnState.relationships).reduce<Record<string, number>>((accumulator, [key, value]) => {
    accumulator[`relationship_${key}`] = value;
    return accumulator;
  }, {});
  const variableFlags = Object.entries(vnState.variables).reduce<Record<string, string | number | boolean | null>>((accumulator, [key, value]) => {
    if (isScalarVariable(value)) {
      accumulator[`vnVar_${key}`] = value;
    }
    return accumulator;
  }, {});

  return {
    ...relationshipFlags,
    ...variableFlags,
    ...vnState.flags
  };
};

export const VNScene: React.FC = () => {
  const { state, setScene, updateGameState, updateProfile, advanceTime } = useGame();
  const session = state.vnSession;
  const initialStateRef = React.useRef<{ key: string; state?: Partial<VNEngineState> }>({ key: '' });
  const sessionKey = session ? `${session.scriptUrl}:${session.sourceId ?? ''}` : '';
  const normalizedSocial = mergeSocialState(state.profile.social);

  if (!session) {
    initialStateRef.current = { key: '' };
  } else if (initialStateRef.current.key !== sessionKey) {
    const trainerAffinity = TRAINERS.reduce<Record<string, number>>((accumulator, trainer) => {
      accumulator[trainer.id] = normalizedSocial.trainers[trainer.id]?.affinity ?? 0;
      return accumulator;
    }, {});
    initialStateRef.current = {
      key: sessionKey,
      state: createInitialVNState(state.profile.progress.flags, trainerAffinity, state.currentQuest, state.profile.name, state.timeOfDay)
    };
  }

  if (!session) {
    return (
      <div className="fade-in vn-scene-scroll" style={{ display: 'grid', placeItems: 'center', padding: '16px' }}>
        <div className="glass-panel" style={{ width: 'min(560px, 100%)', maxWidth: '100%', padding: '28px 30px', textAlign: 'center' }}>
          <div className="system-menu-kicker">VN Scene</div>
          <div className="glow-text" style={{ marginTop: '10px', fontSize: '2.4rem' }}>No Active Script</div>
          <div style={{ marginTop: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            The route runner was opened without a valid script session.
          </div>
          <button className="neo-button" style={{ marginTop: '18px' }} onClick={() => updateGameState({ currentScene: 'APARTMENT' })}>
            Return to apartment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fade-in vn-scene-scroll"
      style={{
        padding: 'clamp(24px, 10vh, 120px) 24px max(40px, env(safe-area-inset-bottom, 0px))',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <VNRunner
        scriptUrl={session.scriptUrl}
        canvasId={session.canvasId}
        title={session.title}
        subtitle={session.subtitle}
        storageKey={`vn_scene_${session.sourceId ?? 'default'}`}
        initialState={initialStateRef.current.state}
        onStateSync={(vnState: VNEngineState) => {
          const launchBattle = vnState.flags.launchBattle ?? Boolean(vnState.pluginResults.start_3d_combat);
          const shouldAdvanceTime = vnState.flags.advanceTime ?? false;
          const syncedFlags = serializeVNSessionState(vnState);
          const syncedTrainerRelationships = TRAINERS.reduce<typeof normalizedSocial.trainers>((accumulator, trainer) => {
            accumulator[trainer.id] = {
              ...normalizedSocial.trainers[trainer.id],
              affinity: vnState.relationships[trainer.id] ?? normalizedSocial.trainers[trainer.id].affinity
            };
            return accumulator;
          }, { ...normalizedSocial.trainers });
          updateProfile({
            social: {
              trainers: syncedTrainerRelationships,
              factions: normalizedSocial.factions
            },
            progress: {
              ...state.profile.progress,
              flags: {
                ...state.profile.progress.flags,
                ...syncedFlags,
                launchBattle,
                advanceTime: shouldAdvanceTime,
                lastVNSource: session.sourceId ?? '',
                ...(typeof vnState.variables.playerMood === 'string' ? { playerMood: vnState.variables.playerMood } : {})
              }
            }
          });
          if (typeof vnState.variables.currentQuest === 'string') {
            updateGameState({
              currentQuest: vnState.variables.currentQuest
            });
          }
        }}
        onComplete={(vnState: VNEngineState) => {
          const launchBattle = vnState.flags.launchBattle ?? Boolean(vnState.pluginResults.start_3d_combat);
          const shouldAdvanceTime = vnState.flags.advanceTime ?? false;
          const syncedFlags = serializeVNSessionState(vnState);
          const syncedTrainerRelationships = TRAINERS.reduce<typeof normalizedSocial.trainers>((accumulator, trainer) => {
            accumulator[trainer.id] = {
              ...normalizedSocial.trainers[trainer.id],
              affinity: vnState.relationships[trainer.id] ?? normalizedSocial.trainers[trainer.id].affinity
            };
            return accumulator;
          }, { ...normalizedSocial.trainers });
          updateProfile({
            social: {
              trainers: syncedTrainerRelationships,
              factions: normalizedSocial.factions
            },
            progress: {
              ...state.profile.progress,
              flags: {
                ...state.profile.progress.flags,
                ...syncedFlags,
                lastVNSource: session.sourceId ?? ''
              }
            }
          });
          if (shouldAdvanceTime) advanceTime();
          const nextScene = resolveCompletionScene(session, launchBattle);
          updateGameState({
            vnSession: null,
            currentQuest:
              typeof vnState.variables.currentQuest === 'string'
                ? vnState.variables.currentQuest
                : launchBattle
                ? 'A champion duel is about to begin.'
                : state.currentQuest,
            sceneTransition: createVNExitTransition(session, nextScene, launchBattle),
            ...(nextScene === 'DECK_EDITOR' ? { deckEditorReturn: session.returnScene ?? 'DISTRICT_EXPLORE' } : {})
          });
        }}
        onExit={() => {
          updateGameState({ vnSession: null });
          updateGameState({
            sceneTransition: createSceneTransition('VN_SCENE', session.returnScene ?? 'DISTRICT_EXPLORE', {
              kicker: 'Route Exit',
              title: 'Closing narrative channel',
              detail: 'Returning to the previous gameplay surface.'
            })
          });
        }}
      />
    </div>
  );
};
