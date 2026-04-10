import React from 'react';
import { Engine } from '../engine/Engine';
import { BabylonCombatPlugin } from '../engine/plugins/BabylonCombatPlugin';
import { NarrativeScript, NarrativeStep, VNEngineState } from '../engine/types';

const isInteractiveStep = (step: NarrativeStep | null) =>
  step?.type === 'dialogue' || step?.type === 'choice';

const formatSpeakerLabel = (speakerId: string) =>
  speakerId
    .split(/[_-]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');

export const VNRunner: React.FC<{
  scriptUrl: string;
  canvasId?: string;
  storageKey?: string;
  title?: string;
  subtitle?: string;
  initialState?: Partial<VNEngineState>;
  onStateSync?: (state: VNEngineState) => void;
  onComplete?: (state: VNEngineState) => void;
  onExit?: (state: VNEngineState | null) => void;
}> = ({
  scriptUrl,
  canvasId,
  storageKey = 'vn_runner_save',
  title = 'Scene Runner',
  subtitle = 'Narrative Engine',
  initialState,
  onStateSync,
  onComplete,
  onExit
}) => {
  const engineRef = React.useRef<Engine | null>(null);
  const [currentStep, setCurrentStep] = React.useState<NarrativeStep | null>(null);
  const [engineState, setEngineState] = React.useState<VNEngineState | null>(null);
  const [scriptTitle, setScriptTitle] = React.useState<string>(title);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isResolving, setIsResolving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showBacklog, setShowBacklog] = React.useState(false);

  const syncExternalState = React.useCallback(
    (state: VNEngineState) => {
      setEngineState(state);
      onStateSync?.(state);
    },
    [onStateSync]
  );

  const advanceToInteractive = React.useCallback(
    async (engine: Engine) => {
      let step = engine.getCurrentStep();

      while (step && !isInteractiveStep(step)) {
        step = await engine.advance();
      }

      setCurrentStep(step);
      if (!step) {
        onComplete?.(engine.stateManager.getState());
      }
    },
    [onComplete]
  );

  React.useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(scriptUrl);
        if (!response.ok) {
          throw new Error(`Failed to load script: ${response.status}`);
        }

        const script = (await response.json()) as NarrativeScript;
        if (cancelled) return;

        const engine = new Engine(initialState, {
          onStateChange: (state) => {
            if (!cancelled) syncExternalState(state);
          },
          onStepChange: (step) => {
            if (!cancelled) setCurrentStep(step);
          }
        });

        if (canvasId) {
          await engine.pluginManager.register(new BabylonCombatPlugin(engine.eventBus, canvasId));
        }

        engine.loadScript(script);
        engine.start();
        engineRef.current = engine;
        setScriptTitle(script.title);
        syncExternalState(engine.stateManager.getState());
        await advanceToInteractive(engine);
      } catch (caughtError: unknown) {
        if (!cancelled) {
          setError(caughtError instanceof Error ? caughtError.message : 'Unknown VN runner error');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void boot();

    return () => {
      cancelled = true;
      engineRef.current = null;
    };
  }, [advanceToInteractive, canvasId, initialState, scriptUrl, syncExternalState]);

  const handleAdvance = async (choiceId?: string) => {
    const engine = engineRef.current;
    if (!engine || isResolving) return;

    setIsResolving(true);
    try {
      await advanceToInteractive(engine);
      if (choiceId) {
        await engine.advance(choiceId);
        await advanceToInteractive(engine);
      } else {
        await engine.advance();
        await advanceToInteractive(engine);
      }
      engine.save(storageKey);
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : 'Failed to advance script');
    } finally {
      setIsResolving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="tutorial-guide-shell">
        <div className="glass-panel tutorial-guide-panel" style={{ gridTemplateColumns: '1fr', minHeight: '220px' }}>
          <div className="tutorial-guide-content">
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', letterSpacing: '0.24rem' }}>{subtitle}</div>
              <h2 style={{ marginTop: '10px', fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>Loading Script</h2>
              <div className="tutorial-guide-message">Preparing the narrative runner, plugin bridge, and current route state.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tutorial-guide-shell">
        <div className="glass-panel tutorial-guide-panel" style={{ gridTemplateColumns: '1fr', minHeight: '220px' }}>
          <div className="tutorial-guide-content">
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--accent-magenta)', letterSpacing: '0.24rem' }}>{subtitle}</div>
              <h2 style={{ marginTop: '10px', fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>Runner Error</h2>
              <div className="tutorial-guide-message">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentStep || !engineState) return null;

  const stepLabel = currentStep.type === 'dialogue' ? currentStep.speakerId.toUpperCase() : currentStep.type.toUpperCase();
  const recentTranscript = engineState.transcript.slice(-6).reverse();
  const speakerLabel = currentStep.type === 'dialogue' ? formatSpeakerLabel(currentStep.speakerId) : 'Route Control';
  const { background, bgmTrack, portrait, bustLeft, bustRight, focusSide } = engineState.presentation;
  const hasStageVisuals = Boolean(background || portrait || bustLeft || bustRight);
  const stageStyle = background
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(8, 6, 8, 0.18), rgba(8, 6, 8, 0.7)), url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    : undefined;

  return (
    <div className="tutorial-guide-shell">
      <div className="glass-panel tutorial-guide-panel vn-runner-panel" style={{ gridTemplateColumns: '1fr', minHeight: '280px' }}>
        <div className="tutorial-guide-content">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'start' }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', letterSpacing: '0.24rem' }}>{subtitle}</div>
                <h2 style={{ marginTop: '10px', fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{scriptTitle}</h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--accent-yellow)', letterSpacing: '0.18rem' }}>SCENE //</div>
                <div style={{ marginTop: '6px', fontWeight: 700 }}>{engineState.currentSceneId}</div>
              </div>
            </div>

            {hasStageVisuals && (
              <div className="vn-runner-stage" style={stageStyle}>
                <div className="vn-runner-stage-overlay" />
                <div className="vn-runner-stage-grid">
                  <div className={`vn-runner-bust left ${focusSide === 'left' ? 'focus' : ''} ${!bustLeft ? 'empty' : ''}`}>
                    {bustLeft ? (
                      <img src={bustLeft} alt="Left bust portrait" />
                    ) : (
                      <div className="vn-runner-bust-fallback">
                        <span>PLAYER SIDE</span>
                      </div>
                    )}
                  </div>

                  <div className="vn-runner-portrait-column">
                    {portrait ? (
                      <div className={`vn-runner-center-portrait ${focusSide === 'center' ? 'focus' : ''}`}>
                        <img src={portrait} alt={`${speakerLabel} portrait`} />
                      </div>
                    ) : (
                      <div className="vn-runner-stage-copy">
                        <div className="vn-runner-stage-kicker">Scene Tone</div>
                        <div className="vn-runner-stage-title">{speakerLabel}</div>
                      </div>
                    )}
                  </div>

                  <div className={`vn-runner-bust right ${focusSide === 'right' ? 'focus' : ''} ${!bustRight ? 'empty' : ''}`}>
                    {bustRight ? (
                      <img src={bustRight} alt="Right bust portrait" />
                    ) : (
                      <div className="vn-runner-bust-fallback">
                        <span>RIVAL SIDE</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="tutorial-guide-message">
              {currentStep.type === 'dialogue' && currentStep.text}
              {currentStep.type === 'choice' && currentStep.prompt}
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div className="glass-morphism" style={{ padding: '0.55rem 0.9rem', fontSize: '0.74rem', letterSpacing: '0.12rem' }}>
                SPEAKER: {speakerLabel}
              </div>
              <div className="glass-morphism" style={{ padding: '0.55rem 0.9rem', fontSize: '0.74rem', letterSpacing: '0.12rem' }}>
                STEP TYPE: {stepLabel}
              </div>
              <div className="glass-morphism" style={{ padding: '0.55rem 0.9rem', fontSize: '0.74rem', letterSpacing: '0.12rem' }}>
                PAUSED: {engineState.paused ? 'YES' : 'NO'}
              </div>
              {background && (
                <div className="glass-morphism" style={{ padding: '0.55rem 0.9rem', fontSize: '0.74rem', letterSpacing: '0.12rem' }}>
                  BG: {background}
                </div>
              )}
              {bgmTrack && (
                <div className="glass-morphism" style={{ padding: '0.55rem 0.9rem', fontSize: '0.74rem', letterSpacing: '0.12rem' }}>
                  BGM: {bgmTrack}
                </div>
              )}
              {focusSide && (
                <div className="glass-morphism" style={{ padding: '0.55rem 0.9rem', fontSize: '0.74rem', letterSpacing: '0.12rem' }}>
                  FOCUS: {focusSide.toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div>
            {showBacklog && recentTranscript.length > 0 && (
              <div style={{ marginBottom: '16px', padding: '14px 16px', borderRadius: '18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.66rem', letterSpacing: '0.16rem', color: 'var(--accent-yellow)', textTransform: 'uppercase' }}>Backlog</div>
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {recentTranscript.map((entry) => (
                    <div key={entry.id} style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{entry.speakerId ?? entry.type}</strong> {entry.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep.type === 'choice' ? (
              <div className="tutorial-guide-actions">
                {currentStep.options.map((option) => (
                  <button
                    key={option.id}
                    className={option.id === currentStep.options[0]?.id ? 'neo-button primary' : 'neo-button'}
                    onClick={() => {
                      void handleAdvance(option.id);
                    }}
                    disabled={isResolving}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            ) : (
              <div className="tutorial-guide-actions">
                <button
                  className="neo-button primary"
                  onClick={() => {
                    void handleAdvance();
                  }}
                  disabled={isResolving}
                >
                  Continue
                </button>
              </div>
            )}

            <div className="tutorial-guide-actions" style={{ marginTop: '12px' }}>
              <button className="neo-button" onClick={() => setShowBacklog((value) => !value)}>
                {showBacklog ? 'Hide Backlog' : 'Show Backlog'}
              </button>
              <button
                className="neo-button"
                onClick={() => {
                  const engine = engineRef.current;
                  if (!engine) return;
                  engine.save(storageKey);
                }}
              >
                Save Route
              </button>
              {onExit && (
                <button className="neo-button" onClick={() => onExit(engineState)}>
                  Exit Route
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
