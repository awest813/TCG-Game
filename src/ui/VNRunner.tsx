import React from 'react';
import { audioManager } from '../core/AudioManager';
import { fetchJson } from '../content/fetchContent';
import { Engine } from '../engine/Engine';
import { BabylonCombatPlugin } from '../engine/plugins/BabylonCombatPlugin';
import { NarrativeScript, NarrativeStep, VNEngineState } from '../engine/types';
import '../styles/SonsotyoScenes.css';
import '../styles/VNPresentation.css';
import { VNHelpOverlay } from '../vn/VNHelpOverlay';
import { VNQuickMenu } from '../vn/VNQuickMenu';
import { VNToast } from '../vn/VNToast';
import {
  readAutoDelayMs,
  readTextScale,
  readTextSpeed,
  readWindowAlpha,
  VN_TEXT_CPS,
  VN_TEXT_SCALE,
  writeAutoDelayMs,
  writeTextScale,
  writeTextSpeed,
  writeWindowAlpha
} from '../vn/vnPreferences';
import type { VNTextScale, VNTextSpeed } from '../vn/vnPreferences';
import {
  dialogueLineKey,
  isDialogueLineSeen,
  markDialogueLineSeen,
  scriptFingerprint
} from '../vn/vnSeenLines';
import { readPersisted, writePersisted } from '../vn/vnStorage';
import { useVNLineReveal } from '../vn/useVNLineReveal';

const isInteractiveStep = (step: NarrativeStep | null) =>
  step?.type === 'dialogue' || step?.type === 'choice';

const formatSpeakerLabel = (speakerId: string) =>
  speakerId
    .split(/[_-]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');

const formatPresentationLabel = (value: string) =>
  value
    .replace(/^.*\//, '')
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

/** With Skip on, advance dialogue lines this fast (instant text + short gap). */
const VN_SKIP_ADVANCE_MS = 95;

const ROLLBACK_STACK_CAP = 24;

const readVnToggle = (key: string): boolean => readPersisted(key) === '1';

const writeVnToggle = (key: string, on: boolean) => {
  writePersisted(key, on ? '1' : '0');
};

export const VNRunner: React.FC<{
  scriptUrl: string;
  canvasId?: string;
  storageKey?: string;
  title?: string;
  subtitle?: string;
  /** `immersive` hides debug telemetry and uses a single glass sheet — for story scenes. */
  presentationMode?: 'default' | 'immersive';
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
  presentationMode = 'default',
  initialState,
  onStateSync,
  onComplete,
  onExit
}) => {
  const onStateSyncRef = React.useRef(onStateSync);
  const onCompleteRef = React.useRef(onComplete);
  const onExitRef = React.useRef(onExit);
  onStateSyncRef.current = onStateSync;
  onCompleteRef.current = onComplete;
  onExitRef.current = onExit;

  const engineRef = React.useRef<Engine | null>(null);
  const [currentStep, setCurrentStep] = React.useState<NarrativeStep | null>(null);
  const [engineState, setEngineState] = React.useState<VNEngineState | null>(null);
  const [scriptTitle, setScriptTitle] = React.useState<string>(title);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isResolving, setIsResolving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showBacklog, setShowBacklog] = React.useState(false);
  const [showQuickMenu, setShowQuickMenu] = React.useState(false);
  /** Ren’Py-style: advance after each line completes. */
  const [autoPlay, setAutoPlay] = React.useState(() => readVnToggle('vn-immersive-auto'));
  /** Rush mode: full line at once + fast advance. */
  const [skipMode, setSkipMode] = React.useState(() => readVnToggle('vn-immersive-skip'));
  const [textSpeed, setTextSpeed] = React.useState<VNTextSpeed>(() => readTextSpeed());
  const [autoDelayMs, setAutoDelayMs] = React.useState(() => readAutoDelayMs());
  const [windowAlpha, setWindowAlpha] = React.useState(() => readWindowAlpha());
  const [textScale, setTextScale] = React.useState<VNTextScale>(() => readTextScale());
  const [showHelp, setShowHelp] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);
  const [mutedUi, setMutedUi] = React.useState(() => audioManager.getSnapshot().isMuted);
  const backlogScrollRef = React.useRef<HTMLDivElement | null>(null);
  const rollbackStackRef = React.useRef<VNEngineState[]>([]);
  const quickSaveKey = React.useMemo(() => `${storageKey}__qsave`, [storageKey]);
  const [, bumpRollbackUi] = React.useReducer((x: number) => x + 1, 0);
  const immersive = presentationMode === 'immersive';
  const scriptFp = React.useMemo(() => scriptFingerprint(scriptUrl), [scriptUrl]);
  const [ctrlHeld, setCtrlHeld] = React.useState(false);
  const [hideChrome, setHideChrome] = React.useState(false);
  const longPressTimerRef = React.useRef<number | null>(null);

  const clearLongPressTimer = React.useCallback(() => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const onTouchStartLongPress = React.useCallback(
    (e: React.TouchEvent) => {
      if (showQuickMenu || showHelp) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest?.('button, a, input, textarea, select, [role="dialog"]')) return;
      clearLongPressTimer();
      longPressTimerRef.current = window.setTimeout(() => {
        longPressTimerRef.current = null;
        setShowQuickMenu(true);
      }, 560);
    },
    [clearLongPressTimer, showHelp, showQuickMenu]
  );

  const onTouchEndLongPress = React.useCallback(() => {
    clearLongPressTimer();
  }, [clearLongPressTimer]);

  const syncExternalState = React.useCallback((next: VNEngineState) => {
    setEngineState(next);
    onStateSyncRef.current?.(next);
  }, []);

  const advanceToInteractive = React.useCallback(async (engine: Engine) => {
    let step = engine.getCurrentStep();

    while (step && !isInteractiveStep(step)) {
      step = await engine.advance();
    }

    setCurrentStep(step);
    if (!step) {
      onCompleteRef.current?.(engine.stateManager.getState());
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      try {
        setIsLoading(true);
        setError(null);
        rollbackStackRef.current = [];
        bumpRollbackUi();

        const script = await fetchJson<NarrativeScript>(scriptUrl);
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
  }, [advanceToInteractive, bumpRollbackUi, canvasId, initialState, scriptUrl, syncExternalState]);

  const handleAdvance = async (choiceId?: string) => {
    const engine = engineRef.current;
    if (!engine || isResolving) return;

    setIsResolving(true);
    try {
      await advanceToInteractive(engine);
      const rollbackSnapshot = engine.stateManager.getState();
      const stepBefore = engine.getCurrentStep();
      if (choiceId) {
        await engine.advance(choiceId);
        await advanceToInteractive(engine);
      } else {
        await engine.advance();
        await advanceToInteractive(engine);
      }
      rollbackStackRef.current.push(rollbackSnapshot);
      if (rollbackStackRef.current.length > ROLLBACK_STACK_CAP) {
        rollbackStackRef.current.shift();
      }
      if (stepBefore?.type === 'dialogue') {
        markDialogueLineSeen(
          dialogueLineKey(scriptFp, rollbackSnapshot.currentSceneId, rollbackSnapshot.currentStepIndex)
        );
      }
      bumpRollbackUi();
      engine.save(storageKey);
      try {
        engine.save(`${storageKey}__auto`);
      } catch {
        /* ignore quota */
      }
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : 'Failed to advance script');
    } finally {
      setIsResolving(false);
    }
  };

  const handleQuickSave = React.useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.save(quickSaveKey);
    setToast('Quick save stored');
  }, [quickSaveKey]);

  const handleQuickLoad = React.useCallback(() => {
    const engine = engineRef.current;
    if (!engine || isResolving) return;
    let ok = false;
    try {
      ok = engine.load(quickSaveKey);
    } catch {
      setToast('Quick save data could not be read');
      return;
    }
    if (!ok) {
      setToast('No quick save in this slot');
      return;
    }
    setIsResolving(true);
    void (async () => {
      try {
        rollbackStackRef.current = [];
        bumpRollbackUi();
        await advanceToInteractive(engine);
        syncExternalState(engine.stateManager.getState());
        engine.save(storageKey);
        setToast('Quick load applied');
      } catch (caughtError: unknown) {
        setError(caughtError instanceof Error ? caughtError.message : 'Quick load failed');
      } finally {
        setIsResolving(false);
      }
    })();
  }, [advanceToInteractive, bumpRollbackUi, isResolving, quickSaveKey, storageKey, syncExternalState]);

  const handleRollback = React.useCallback(() => {
    const engine = engineRef.current;
    if (!engine || isResolving) return;
    const snap = rollbackStackRef.current.pop();
    if (!snap) return;

    setIsResolving(true);
    void (async () => {
      try {
        engine.stateManager.replace(snap);
        await advanceToInteractive(engine);
        bumpRollbackUi();
        engine.save(storageKey);
      } catch (caughtError: unknown) {
        setError(caughtError instanceof Error ? caughtError.message : 'Rollback failed');
      } finally {
        setIsResolving(false);
      }
    })();
  }, [advanceToInteractive, bumpRollbackUi, isResolving, storageKey]);

  const dialogueLine =
    currentStep?.type === 'dialogue'
      ? currentStep.text
      : currentStep?.type === 'choice'
        ? currentStep.prompt
        : '';

  const lineStepKey = engineState
    ? `${engineState.currentSceneId}|${currentStep?.type ?? 'idle'}|${dialogueLine.length}|${dialogueLine.slice(0, 80)}`
    : 'idle';

  const dialogueSeenKey =
    immersive && engineState && currentStep?.type === 'dialogue'
      ? dialogueLineKey(scriptFp, engineState.currentSceneId, engineState.currentStepIndex)
      : null;
  const lineSeen = dialogueSeenKey ? isDialogueLineSeen(dialogueSeenKey) : true;
  const restrictSkipToSeenOnly = skipMode && ctrlHeld;
  const lineRevealEnabled = Boolean(
    immersive &&
      currentStep?.type === 'dialogue' &&
      (!skipMode || (restrictSkipToSeenOnly && !lineSeen))
  );

  const lineCharsPerSec = VN_TEXT_CPS[textSpeed];

  const { shown: lineShown, complete: lineComplete, forceReveal } = useVNLineReveal(
    dialogueLine,
    lineStepKey,
    lineRevealEnabled,
    lineCharsPerSec
  );

  const handleAdvanceRef = React.useRef(handleAdvance);
  React.useEffect(() => {
    handleAdvanceRef.current = handleAdvance;
  });

  React.useEffect(() => {
    if (!immersive || currentStep?.type !== 'dialogue') return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const el = e.target as HTMLElement | null;
      if (el?.closest?.('input, textarea, select')) return;
      if (showQuickMenu || showHelp) return;
      e.preventDefault();
      if (hideChrome && currentStep?.type === 'dialogue') {
        setHideChrome(false);
        return;
      }
      if (!lineComplete) forceReveal();
      else void handleAdvanceRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [immersive, currentStep?.type, lineComplete, forceReveal, showHelp, showQuickMenu, hideChrome]);

  React.useEffect(() => {
    if (!immersive) return;
    if (currentStep?.type !== 'dialogue') setHideChrome(false);
  }, [immersive, currentStep?.type]);

  /** Track Ctrl for “skip read text only” (Ctrl + Skip). */
  React.useEffect(() => {
    if (!immersive) return undefined;
    const down = (e: KeyboardEvent) => {
      if (e.key === 'Control') setCtrlHeld(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === 'Control') setCtrlHeld(false);
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [immersive]);

  React.useEffect(() => {
    if (!immersive) return undefined;
    const onBlur = () => setCtrlHeld(false);
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, [immersive]);

  /** Auto / Skip: timed advance after line is ready (dialogue only; choices stay manual). */
  React.useEffect(() => {
    if (!immersive || currentStep?.type !== 'dialogue') return undefined;
    if (showQuickMenu || showHelp) return undefined;
    if (!lineComplete || isResolving) return undefined;
    if (!autoPlay && !skipMode) return undefined;
    if (restrictSkipToSeenOnly && !lineSeen) return undefined;

    const delayMs = skipMode ? VN_SKIP_ADVANCE_MS : autoDelayMs;
    const id = window.setTimeout(() => {
      void handleAdvanceRef.current();
    }, delayMs);
    return () => window.clearTimeout(id);
  }, [
    immersive,
    currentStep?.type,
    lineStepKey,
    lineComplete,
    isResolving,
    autoPlay,
    skipMode,
    autoDelayMs,
    showHelp,
    showQuickMenu,
    restrictSkipToSeenOnly,
    lineSeen
  ]);

  /** Esc / F1 / F5 / F9 / M / Alt+R / H / Tab — immersive shortcuts. */
  React.useEffect(() => {
    if (!immersive) return undefined;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest?.('input, textarea, select')) return;

      if (e.key === 'F1') {
        e.preventDefault();
        setShowHelp(true);
        return;
      }

      if (e.key === 'F5') {
        e.preventDefault();
        handleQuickSave();
        return;
      }

      if (e.key === 'F9') {
        e.preventDefault();
        handleQuickLoad();
        return;
      }

      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        const next = !audioManager.getSnapshot().isMuted;
        audioManager.setMute(next);
        setMutedUi(next);
        return;
      }

      if (e.key === 'Tab' || e.key === '`') {
        if (showQuickMenu || showHelp) return;
        e.preventDefault();
        setHideChrome((v) => !v);
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        if (showHelp) setShowHelp(false);
        else if (showQuickMenu) setShowQuickMenu(false);
        else if (showBacklog) setShowBacklog(false);
        else setShowQuickMenu(true);
        return;
      }

      if (e.altKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleRollback();
        return;
      }

      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setShowBacklog((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleQuickLoad, handleQuickSave, handleRollback, immersive, showBacklog, showHelp, showQuickMenu]);

  React.useEffect(() => {
    return () => clearLongPressTimer();
  }, [clearLongPressTimer]);

  React.useEffect(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  React.useEffect(() => {
    if (!immersive || !showBacklog) return;
    const el = backlogScrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [immersive, showBacklog, engineState?.transcript?.length]);

  if (isLoading) {
    return (
      <div className={immersive ? 'tutorial-guide-shell vn-immersive-shell' : 'tutorial-guide-shell'}>
        <div
          className={`glass-panel tutorial-guide-panel vn-runner-panel${immersive ? ' vn-runner-panel--immersive' : ''}`}
          style={{ gridTemplateColumns: '1fr', minHeight: immersive ? 'min(240px, 42vh)' : '220px', padding: immersive ? 0 : undefined }}
          aria-busy="true"
          aria-live="polite"
          aria-label={immersive ? 'Loading story' : 'Loading narrative runner'}
        >
          {immersive ? (
            <div className="vn-loading-immersive">
              <div className="vn-loading-kicker">{subtitle}</div>
              <div className="vn-loading-shimmer vn-loading-shimmer--title" />
              <div className="vn-loading-shimmer" />
              <div className="vn-loading-shimmer vn-loading-shimmer--short" />
              <p className="vn-loading-hint">Loading script…</p>
            </div>
          ) : (
            <div className="tutorial-guide-content" style={{ minHeight: 0, padding: '18px 20px' }}>
              <div className="vn-immersive-kicker">{subtitle}</div>
              <h2 style={{ marginTop: '10px', fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>Loading…</h2>
              <div className="tutorial-guide-message">Preparing the narrative runner, plugin bridge, and current route state.</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={immersive ? 'tutorial-guide-shell vn-immersive-shell' : 'tutorial-guide-shell'}>
        <div
          className={`glass-panel tutorial-guide-panel vn-runner-panel${immersive ? ' vn-runner-panel--immersive' : ''}`}
          style={{ gridTemplateColumns: '1fr', minHeight: immersive ? 'auto' : '220px', padding: immersive ? '18px 20px' : undefined }}
        >
          <div className="tutorial-guide-content" style={{ minHeight: 0 }}>
            <div className={immersive ? 'vn-immersive-body' : undefined}>
              <div className="vn-immersive-kicker" style={{ color: 'rgba(255, 138, 198, 0.85)' }}>
                {subtitle}
              </div>
              <h2
                style={
                  immersive
                    ? { marginTop: 8, fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-main)' }
                    : { marginTop: '10px', fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }
                }
              >
                {immersive ? 'Couldn’t load story' : 'Runner Error'}
              </h2>
              <div className={immersive ? 'vn-immersive-dialogue' : 'tutorial-guide-message'}>{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentStep || !engineState) return null;

  const stepLabel = currentStep.type === 'dialogue' ? currentStep.speakerId.toUpperCase() : currentStep.type.toUpperCase();
  const recentTranscript = engineState.transcript.slice(-32).reverse();
  const speakerLabel = currentStep.type === 'dialogue' ? formatSpeakerLabel(currentStep.speakerId) : 'Route Control';
  const { background, bgmTrack, portrait, bustLeft, bustRight, focusSide } = engineState.presentation;
  const hasStageVisuals = Boolean(background || portrait || bustLeft || bustRight);
  const stageStyle = background
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(8, 6, 8, 0.14), rgba(8, 6, 8, 0.74)), url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    : undefined;

  const backlogBlock =
    showBacklog && recentTranscript.length > 0 ? (
      <div className={immersive ? 'vn-immersive-backlog' : 'vn-runner-backlog-panel'} style={immersive ? undefined : { marginBottom: '16px', padding: '14px 16px', borderRadius: '18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {!immersive && (
          <div style={{ fontSize: '0.66rem', letterSpacing: '0.16rem', color: 'var(--accent-yellow)', textTransform: 'uppercase' }}>Backlog</div>
        )}
        <div
          ref={immersive ? backlogScrollRef : undefined}
          className={immersive ? 'vn-immersive-backlog-scroll' : undefined}
          style={{ marginTop: immersive ? 0 : '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}
        >
          {recentTranscript.map((entry) => (
            <div key={entry.id} style={{ color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: immersive ? '0.85rem' : undefined }}>
              <strong style={{ color: 'var(--text-primary)' }}>{entry.speakerId ?? entry.type}</strong> {entry.text}
            </div>
          ))}
        </div>
      </div>
    ) : null;

  if (immersive) {
    const effectiveHideChrome = hideChrome && currentStep.type === 'dialogue';

    const onRenMessageActivate = () => {
      if (currentStep.type !== 'dialogue') return;
      if (!lineComplete) {
        forceReveal();
        return;
      }
      void handleAdvance();
    };

    return (
      <div
        className="tutorial-guide-shell vn-immersive-shell"
        onContextMenu={(e) => {
          e.preventDefault();
          if (showHelp) return;
          setShowQuickMenu(true);
        }}
        onTouchStart={onTouchStartLongPress}
        onTouchEnd={onTouchEndLongPress}
        onTouchCancel={onTouchEndLongPress}
      >
        <div
          className={`glass-panel tutorial-guide-panel vn-runner-panel vn-runner-panel--immersive vn-ren-frame${
            effectiveHideChrome ? ' vn-ren-frame--chrome-hidden' : ''
          }`}
          style={{
            gridTemplateColumns: '1fr',
            ['--vn-text-scale' as string]: String(VN_TEXT_SCALE[textScale])
          }}
        >
          <div
            className={`vn-runner-stage vn-runner-stage--immersive vn-ren-stage${hasStageVisuals ? '' : ' vn-runner-stage--placeholder'}`}
            style={hasStageVisuals ? stageStyle : undefined}
            onClick={effectiveHideChrome ? () => setHideChrome(false) : undefined}
            onKeyDown={effectiveHideChrome ? (ev) => ev.key === 'Enter' && setHideChrome(false) : undefined}
            role={effectiveHideChrome ? 'button' : undefined}
            tabIndex={effectiveHideChrome ? 0 : undefined}
            aria-label={effectiveHideChrome ? 'Show story controls' : undefined}
            aria-hidden={!hasStageVisuals}
          >
            <div className="vn-runner-stage-overlay" />
            <div className="vn-runner-stage-grid">
              <div className={`vn-runner-bust left ${focusSide === 'left' ? 'focus' : ''} ${!bustLeft ? 'empty' : ''}`}>
                {bustLeft ? (
                  <img src={bustLeft} alt="" />
                ) : (
                  <div className="vn-runner-bust-fallback" aria-hidden>
                    <span> </span>
                  </div>
                )}
              </div>
              <div className="vn-runner-portrait-column">
                {portrait ? (
                  <div className={`vn-runner-center-portrait ${focusSide === 'center' ? 'focus' : ''}`}>
                    <img src={portrait} alt="" />
                  </div>
                ) : (
                  <div className="vn-runner-stage-copy">
                    <div className="vn-immersive-kicker" style={{ textAlign: 'center' }}>
                      {scriptTitle}
                    </div>
                  </div>
                )}
              </div>
              <div className={`vn-runner-bust right ${focusSide === 'right' ? 'focus' : ''} ${!bustRight ? 'empty' : ''}`}>
                {bustRight ? (
                  <img src={bustRight} alt="" />
                ) : (
                  <div className="vn-runner-bust-fallback" aria-hidden>
                    <span> </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="vn-ren-toolbar" role="toolbar" aria-label="Story tools">
            <div className="vn-ren-toolbar-cluster" role="group" aria-label="Reading mode">
              <button
                type="button"
                className={`vn-ren-tool${autoPlay ? ' vn-ren-tool--on' : ''}`}
                aria-pressed={autoPlay}
                onClick={() => {
                  const next = !autoPlay;
                  setAutoPlay(next);
                  writeVnToggle('vn-immersive-auto', next);
                }}
              >
                Auto
              </button>
              <button
                type="button"
                className={`vn-ren-tool${skipMode ? ' vn-ren-tool--on' : ''}`}
                aria-pressed={skipMode}
                onClick={() => {
                  const next = !skipMode;
                  setSkipMode(next);
                  writeVnToggle('vn-immersive-skip', next);
                }}
              >
                Skip
              </button>
            </div>
            <div className="vn-ren-toolbar-cluster">
              <button type="button" className="vn-ren-tool" onClick={() => setShowQuickMenu(true)}>
                Menu
              </button>
              <button
                type="button"
                className={`vn-ren-tool${effectiveHideChrome ? ' vn-ren-tool--on' : ''}`}
                aria-pressed={effectiveHideChrome}
                onClick={() => setHideChrome((v) => !v)}
              >
                Hide UI
              </button>
              <button type="button" className="vn-ren-tool" onClick={() => setShowBacklog((v) => !v)}>
                {showBacklog ? 'Hide log' : 'History'}
              </button>
              <button type="button" className="vn-ren-tool" onClick={handleQuickSave}>
                Q.Save
              </button>
              <button type="button" className="vn-ren-tool" onClick={() => void handleQuickLoad()}>
                Q.Load
              </button>
              <button
                type="button"
                className={`vn-ren-tool${mutedUi ? ' vn-ren-tool--on' : ''}`}
                aria-pressed={mutedUi}
                onClick={() => {
                  const next = !audioManager.getSnapshot().isMuted;
                  audioManager.setMute(next);
                  setMutedUi(next);
                }}
              >
                {mutedUi ? 'Unmute' : 'Mute'}
              </button>
              <button type="button" className="vn-ren-tool" onClick={() => setShowHelp(true)}>
                Help
              </button>
              <button
                type="button"
                className="vn-ren-tool"
                onClick={() => {
                  const engine = engineRef.current;
                  if (!engine) return;
                  engine.save(storageKey);
                }}
              >
                Save
              </button>
              {onExit && (
                <button type="button" className="vn-ren-tool" onClick={() => onExit(engineState)}>
                  Exit
                </button>
              )}
            </div>
          </div>

          {currentStep.type === 'dialogue' ? (
            <button
              type="button"
              className="vn-ren-message"
              style={{ opacity: windowAlpha }}
              onClick={onRenMessageActivate}
              disabled={isResolving}
              aria-label={lineComplete ? 'Advance dialogue' : 'Reveal line'}
            >
              <span className="vn-ren-name">{speakerLabel}</span>
              <span key={lineStepKey} className="vn-ren-body">
                {lineShown}
              </span>
              <span className={`vn-ren-cue ${lineComplete ? 'vn-ren-cue--ready' : ''}`} aria-hidden>
                ▶
              </span>
            </button>
          ) : (
            <div className="vn-ren-message vn-ren-message--static" style={{ opacity: windowAlpha }} aria-live="polite">
              <span className="vn-ren-name">Decision</span>
              <span className="vn-ren-body">{lineShown}</span>
            </div>
          )}

          {backlogBlock}

          {currentStep.type === 'choice' && (
            <div className="vn-immersive-actions vn-immersive-actions--choices">
              {currentStep.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="vn-immersive-btn vn-immersive-btn--primary"
                  onClick={() => {
                    void handleAdvance(option.id);
                  }}
                  disabled={isResolving}
                >
                  {option.text}
                </button>
              ))}
            </div>
          )}
        </div>

        <VNQuickMenu
          open={showQuickMenu}
          onClose={() => setShowQuickMenu(false)}
          textSpeed={textSpeed}
          onTextSpeed={(s) => {
            setTextSpeed(s);
            writeTextSpeed(s);
          }}
          autoDelayMs={autoDelayMs}
          onAutoDelayMs={(ms) => {
            setAutoDelayMs(ms);
            writeAutoDelayMs(ms);
          }}
          windowAlpha={windowAlpha}
          onWindowAlpha={(a) => {
            setWindowAlpha(a);
            writeWindowAlpha(a);
          }}
          textScale={textScale}
          onTextScale={(s) => {
            setTextScale(s);
            writeTextScale(s);
          }}
          rollbackAvailable={rollbackStackRef.current.length > 0}
          onRollback={() => {
            setShowQuickMenu(false);
            handleRollback();
          }}
          onFullscreen={() => {
            void document.documentElement.requestFullscreen?.().catch(() => undefined);
          }}
          onAudioChanged={() => setMutedUi(audioManager.getSnapshot().isMuted)}
        />

        <VNHelpOverlay open={showHelp} onClose={() => setShowHelp(false)} />
        <VNToast message={toast} />

        {effectiveHideChrome && (
          <button type="button" className="vn-chrome-restore neo-button" onClick={() => setHideChrome(false)}>
            Show UI
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="tutorial-guide-shell">
      <div className="glass-panel tutorial-guide-panel vn-runner-panel" style={{ gridTemplateColumns: '1fr', minHeight: '280px' }}>
        <div className="tutorial-guide-content">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'start' }}>
              <div>
                <div className="sonsotyo-kicker" style={{ color: 'var(--accent-primary)' }}>{subtitle}</div>
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

            <div className="tutorial-guide-message" style={{ color: 'var(--text-bright)' }}>
              {dialogueLine}
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div className="glass-morphism vn-runner-signal-chip" style={{ padding: '0.55rem 0.9rem', fontSize: '0.74rem', letterSpacing: '0.12rem' }}>
                SPEAKER: {speakerLabel}
              </div>
              <div className="glass-morphism vn-runner-signal-chip" style={{ padding: '0.55rem 0.9rem', fontSize: '0.74rem', letterSpacing: '0.12rem' }}>
                STEP TYPE: {stepLabel}
              </div>
              <div className="glass-morphism vn-runner-signal-chip" style={{ padding: '0.55rem 0.9rem', fontSize: '0.74rem', letterSpacing: '0.12rem' }}>
                PAUSED: {engineState.paused ? 'YES' : 'NO'}
              </div>
              {background && (
                <div className="glass-morphism vn-runner-signal-chip" style={{ padding: '0.55rem 0.9rem', fontSize: '0.74rem', letterSpacing: '0.12rem' }}>
                  BG: {formatPresentationLabel(background)}
                </div>
              )}
              {bgmTrack && (
                <div className="glass-morphism vn-runner-signal-chip" style={{ padding: '0.55rem 0.9rem', fontSize: '0.74rem', letterSpacing: '0.12rem' }}>
                  BGM: {formatPresentationLabel(bgmTrack)}
                </div>
              )}
              {focusSide && (
                <div className="glass-morphism vn-runner-signal-chip" style={{ padding: '0.55rem 0.9rem', fontSize: '0.74rem', letterSpacing: '0.12rem' }}>
                  FOCUS: {focusSide.toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div>
            {backlogBlock}

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
