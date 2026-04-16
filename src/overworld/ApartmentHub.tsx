import React, { useState } from 'react';
import { useGame } from '../core/GameContext';
import { VNRunner } from '../ui/VNRunner';
import { VNEngineState } from '../engine/types';
import { getCircuitNextStep, hasLucyOnboardingComplete, hasShopBeginnerCleared, migrateCircuitFlags, nextCircuitQuest } from '../core/circuitProgression';
import { createSceneTransition } from '../core/sceneTransitions';
import { FirstSessionChecklist } from '../ui/FirstSessionChecklist';
import { SystemMenu } from '../ui/SystemMenu';
import { createApartmentOnboardingSession } from '../visual-novel/scriptRegistry';
import { audioManager } from '../core/AudioManager';
import '../styles/SonsotyoScenes.css';
import '../styles/VNPresentation.css';

export const ApartmentHub: React.FC = () => {
  const { state, saveGame, updateProfile, updateGameState } = useGame();
  const [showWakeUp, setShowWakeUp] = useState(state.timeOfDay === 'MORNING');
  const [showSettings, setShowSettings] = useState(false);
  const [statusText, setStatusText] = useState('Apartment systems online.');
  const circuitFlags = migrateCircuitFlags(state.profile.progress.flags);
  const showFirstSessionShell = !hasShopBeginnerCleared(circuitFlags);
  const needsLucyVN = !hasLucyOnboardingComplete(circuitFlags);
  const lucyStoryFocus = showFirstSessionShell && needsLucyVN;
  const nextStep = getCircuitNextStep(circuitFlags, state.profile.stats.tournamentsWon);
  const starter = state.profile.progress.flags.onboardingStarter as string | undefined;
  const onboardingSession = createApartmentOnboardingSession(starter);

  return (
    <div
      className={`apartment-container sonsotyo-scene sonsotyo-scene-surface--apartments fade-in${lucyStoryFocus ? ' apartment-container--lucy-story' : ''}`}
      style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
    >
      {showSettings && <SystemMenu onClose={() => setShowSettings(false)} />}
      <div className="sonsotyo-overlay" />

      <div
        className="sonsotyo-content"
        style={{
          position: 'absolute',
          inset: 0,
          padding: lucyStoryFocus ? '24px 20px' : '34px',
          display: 'grid',
          gridTemplateColumns: lucyStoryFocus ? 'minmax(0, 1fr) 120px' : '360px 1fr 120px',
          gridTemplateRows: '1fr auto',
          gap: '20px',
          pointerEvents: 'none'
        }}
      >
        <div style={{ display: lucyStoryFocus ? 'none' : 'flex', flexDirection: 'column', gap: '16px', pointerEvents: 'auto' }}>
          <div className="glass-panel sonsotyo-panel">
            <div className="sonsotyo-kicker">Apartment Hub</div>
            <div style={{ marginTop: '8px', fontFamily: 'var(--font-display)', fontSize: '2rem' }}>{state.timeOfDay}</div>
            <div className="sonsotyo-copy" style={{ marginTop: '8px' }}>Sunset Heights / Sector 7</div>
          </div>

          <div className="glass-panel sonsotyo-panel">
            <div className="sonsotyo-kicker">Nav Feed</div>
            <div style={{ marginTop: '10px', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>{statusText}</div>
          </div>

          <div className="glass-panel sonsotyo-panel apartment-next-step-panel">
            <div className="sonsotyo-kicker" style={{ color: 'var(--accent-yellow)' }}>
              Next move · {nextStep.phase}
            </div>
            <div style={{ marginTop: '10px', fontFamily: 'var(--font-display)', fontSize: '1.15rem', lineHeight: 1.4 }}>{nextStep.title}</div>
            <div className="sonsotyo-copy" style={{ marginTop: '10px' }}>{nextStep.detail}</div>
          </div>
        </div>

        <div />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'flex-end', justifyContent: 'center', pointerEvents: 'auto' }}>
          <button
            type="button"
            className="neo-button"
            onClick={() => {
              audioManager.playSFX('menu_open');
              setShowSettings(true);
            }}
          >
            System
          </button>
          <button
            className="neo-button"
            onClick={() => {
              setStatusText('Opening deck terminal...');
              updateGameState({
                deckEditorReturn: 'APARTMENT',
                sceneTransition: createSceneTransition(state.currentScene, 'DECK_EDITOR', {
                  kicker: 'Apartment To Deck',
                  title: 'Opening deck terminal',
                  detail: 'Mounting the apartment sync console and your active list.'
                })
              });
            }}
          >
            Deck
          </button>
          <div className="sonsotyo-caption" style={{ textAlign: 'right', maxWidth: '120px', lineHeight: 1.4 }}>
            Current sector: apartment
          </div>
          <button
            className="neo-button primary"
            onClick={() => {
              setStatusText(needsLucyVN ? 'Finish Lucy first, then transit opens.' : 'Opening transit planner...');
              if (needsLucyVN) return;
              updateGameState({
                transitReturn: 'APARTMENT',
                sceneTransition: createSceneTransition(state.currentScene, 'TRANSIT', {
                  kicker: 'Apartment To Transit',
                  title: 'Opening transit planner',
                  detail: 'Pulling station routes, district unlocks, and current rail timings.'
                })
              });
            }}
          >
            Transit
          </button>
        </div>

        <div
          className="glass-panel sonsotyo-panel apartment-hub-bottom-bar"
          style={{
            gridColumn: '1 / span 2',
            display: lucyStoryFocus ? 'none' : 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pointerEvents: 'auto'
          }}
        >
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="neo-button"
              onClick={() => {
                audioManager.playSFX('menu_open');
                setShowSettings(true);
              }}
            >
              System
            </button>
            <button className="neo-button" onClick={() => { saveGame(); setStatusText('Progress encrypted and saved.'); }}>Save State</button>
            <button
              className="neo-button"
              onClick={() => {
                setStatusText('Opening sync terminal...');
                updateGameState({
                  deckEditorReturn: 'APARTMENT',
                  sceneTransition: createSceneTransition(state.currentScene, 'DECK_EDITOR', {
                    kicker: 'Apartment To Deck',
                    title: 'Opening sync terminal',
                    detail: 'Mounting deck tools, collection cache, and route notes.'
                  })
                });
              }}
            >
              Terminal
            </button>
          </div>
          <button
            className="neo-button primary"
            onClick={() => {
              setStatusText('Opening transit planner...');
              updateGameState({
                transitReturn: 'APARTMENT',
                sceneTransition: createSceneTransition(state.currentScene, 'TRANSIT', {
                  kicker: 'Apartment To Transit',
                  title: 'Opening transit planner',
                  detail: 'Pulling station routes, district unlocks, and current rail timings.'
                })
              });
            }}
          >
            Go to metro station
          </button>
        </div>
      </div>

      {showWakeUp && (
        <div className="wake-up-overlay" style={{ position: 'fixed', inset: 0, background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, opacity: 0, animation: 'fadeOut 2s forwards' }} onAnimationEnd={() => setShowWakeUp(false)}>
          <h2 className="sonsotyo-title" style={{ fontSize: '3rem' }}>Wake Up</h2>
        </div>
      )}

      {showFirstSessionShell && (
        <div className="apartment-first-session-shell" aria-live="polite">
          <FirstSessionChecklist
            placement="stacked"
            variant={needsLucyVN ? 'compact' : 'default'}
            lucyStepDetail="Apartment briefing (story panel below when active)"
          />

          {needsLucyVN && (
            <div className="apartment-first-session-vn">
              <div className="apartment-first-session-vn-inner">
                <VNRunner
                  presentationMode="immersive"
                  scriptUrl={onboardingSession.scriptUrl}
                  title={onboardingSession.title}
                  subtitle={onboardingSession.subtitle}
                  onStateSync={(vnState: VNEngineState) => {
                    const reviewedDeck = Boolean(vnState.flags.reviewedDeck);
                    const combatResolved = Boolean(vnState.pluginResults.start_3d_combat);
                    const playerMood =
                      typeof vnState.variables.playerMood === 'string' ? vnState.variables.playerMood : state.profile.progress.flags.playerMood ?? null;

                    updateProfile({
                      progress: {
                        ...state.profile.progress,
                        flags: {
                          ...state.profile.progress.flags,
                          reviewedDeck,
                          combatResolved,
                          playerMood
                        }
                      }
                    });

                    updateGameState({
                      currentQuest: nextCircuitQuest(
                        {
                          ...state.profile.progress.flags,
                          reviewedDeck,
                          combatResolved,
                          playerMood
                        },
                        state.profile.stats.tournamentsWon
                      )
                    });

                    if (combatResolved) setStatusText('Babylon plugin handoff complete. Narrative link restored.');
                  }}
                  onComplete={(vnState: VNEngineState) => {
                    const mergedFlags = {
                      ...state.profile.progress.flags,
                      onboardingComplete: true,
                      reviewedDeck: Boolean(vnState.flags.reviewedDeck),
                      combatResolved: Boolean(vnState.pluginResults.start_3d_combat)
                    };
                    updateProfile({
                      progress: {
                        ...state.profile.progress,
                        flags: mergedFlags
                      }
                    });
                    updateGameState({ currentQuest: nextCircuitQuest(mergedFlags, state.profile.stats.tournamentsWon) });

                    setStatusText('Lucy completed the onboarding route.');
                    if (vnState.flags.reviewedDeck) {
                      updateGameState({
                        deckEditorReturn: 'APARTMENT',
                        sceneTransition: createSceneTransition('APARTMENT', 'DECK_EDITOR', {
                          kicker: 'Onboarding Complete',
                          title: 'Lucy is sending you to the deck terminal',
                          detail: 'Your starter route is complete. Review the list before stepping out.'
                        })
                      });
                    } else {
                      setStatusText('Lucy completed the onboarding route. Opening transit orientation...');
                      updateGameState({
                        transitReturn: 'APARTMENT',
                        sceneTransition: createSceneTransition('APARTMENT', 'TRANSIT', {
                          kicker: 'Onboarding Complete',
                          title: 'Lucy is handing you off to transit control',
                          detail: 'Starter onboarding is clear. The next step is the station grid and your first bracket route.'
                        })
                      });
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; pointer-events: all; }
          70% { opacity: 1; }
          100% { opacity: 0; pointer-events: none; }
        }
        @media (max-width: 900px) {
          .apartment-container .sonsotyo-content {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr auto auto;
          }
        }
      `}</style>
    </div>
  );
};
