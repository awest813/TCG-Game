import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../core/GameContext';
import { VNRunner } from '../ui/VNRunner';
import { VNEngineState } from '../engine/types';
import { nextCircuitQuest } from '../core/circuitProgression';
import { createApartmentOnboardingSession } from '../visual-novel/scriptRegistry';
import '../styles/SonsotyoScenes.css';

export const ApartmentHub: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, setScene, saveGame, advanceTime, updateProfile, updateGameState } = useGame();
  const [showWakeUp, setShowWakeUp] = useState(state.timeOfDay === 'MORNING');
  const [statusText, setStatusText] = useState('Apartment systems online.');
  const needsOnboarding = !state.profile.progress.flags.onboardingComplete;
  const starter = state.profile.progress.flags.onboardingStarter as string | undefined;
  const canvasId = 'apartment-babylon-canvas';
  const onboardingSession = createApartmentOnboardingSession(starter, canvasId);

  useEffect(() => {
    if (!canvasRef.current) return undefined;

    let isDisposed = false;
    let cleanup: (() => void) | undefined;

    const bootApartmentScene = async () => {
      const { ArcRotateCamera, Color3, Engine, GlowLayer, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Vector3 } = await import('@babylonjs/core');
      if (!canvasRef.current || isDisposed) return;

      const engine = new Engine(canvasRef.current, true);
      const scene = new Scene(engine);
      scene.clearColor = Color3.FromHexString('#050510').toColor4();

      const camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 6, new Vector3(0, 1.5, 0), scene);
      camera.attachControl(canvasRef.current, true);
      camera.lowerRadiusLimit = 4;
      camera.upperRadiusLimit = 10;
      camera.useAutoRotationBehavior = true;

      const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
      light.intensity = 0.4;

      const glow = new GlowLayer('glow', scene);
      glow.intensity = 0.6;

      const ground = MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene);
      const wallLeft = MeshBuilder.CreatePlane('wallLeft', { width: 10, height: 6 }, scene);
      wallLeft.position.z = 5;
      wallLeft.position.y = 3;
      const wallRight = MeshBuilder.CreatePlane('wallRight', { width: 10, height: 6 }, scene);
      wallRight.position.x = -5;
      wallRight.position.y = 3;
      wallRight.rotation.y = Math.PI / 2;

      const roomMat = new StandardMaterial('roomMat', scene);
      roomMat.diffuseColor = new Color3(0.1, 0.1, 0.15);
      roomMat.specularColor = new Color3(0.2, 0.2, 0.3);
      ground.material = wallLeft.material = wallRight.material = roomMat;

      const bed = MeshBuilder.CreateBox('bed', { width: 2, height: 0.5, depth: 4 }, scene);
      bed.position.set(3, 0.25, 3);
      const bedMat = new StandardMaterial('bedMat', scene);
      bedMat.diffuseColor = Color3.FromHexString('#2e1a47');
      bed.material = bedMat;

      const desk = MeshBuilder.CreateBox('desk', { width: 2.5, height: 0.8, depth: 1 }, scene);
      desk.position.set(-3.5, 0.4, 4);
      const deskMat = new StandardMaterial('deskMat', scene);
      deskMat.diffuseColor = new Color3(0.05, 0.05, 0.1);
      desk.material = deskMat;

      const terminal = MeshBuilder.CreateBox('terminal', { size: 0.4 }, scene);
      terminal.position.set(-3.5, 1, 4.2);
      const terminalMat = new StandardMaterial('termMat', scene);
      terminalMat.emissiveColor = Color3.FromHexString('#00f2ff');
      terminal.material = terminalMat;

      const windowMesh = MeshBuilder.CreatePlane('window', { width: 3, height: 2 }, scene);
      windowMesh.position.set(0, 3, 4.95);
      const winMat = new StandardMaterial('winMat', scene);
      const winColors = { MORNING: '#ffaa00', AFTERNOON: '#00aaff', EVENING: '#ff00aa' } as const;
      winMat.emissiveColor = Color3.FromHexString(winColors[state.timeOfDay]);
      windowMesh.material = winMat;

      scene.onPointerDown = (_, pickResult) => {
        if (!pickResult.hit || !pickResult.pickedMesh) return;
        const name = pickResult.pickedMesh.name;
        if (name === 'terminal') {
          setStatusText('Opening sync terminal...');
          setScene('DECK_EDITOR');
        }
        if (name === 'bed' && confirm('Rest until next time block?')) {
          setStatusText('Advancing schedule...');
          advanceTime();
        }
      };

      engine.runRenderLoop(() => scene.render());
      const onResize = () => engine.resize();
      window.addEventListener('resize', onResize);
      cleanup = () => {
        window.removeEventListener('resize', onResize);
        engine.dispose();
      };
    };

    void bootApartmentScene();

    return () => {
      isDisposed = true;
      cleanup?.();
    };
  }, [advanceTime, setScene, state.timeOfDay]);

  return (
    <div className="apartment-container sonsotyo-scene fade-in" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <canvas id={canvasId} ref={canvasRef} style={{ width: '100%', height: '100%', outline: 'none' }} />
      <div className="sonsotyo-overlay" />

      <div className="sonsotyo-content" style={{ position: 'absolute', inset: 0, padding: '34px', display: 'grid', gridTemplateColumns: '360px 1fr 120px', gridTemplateRows: '1fr auto', gap: '20px', pointerEvents: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', pointerEvents: 'auto' }}>
          <div className="glass-panel sonsotyo-panel">
            <div className="sonsotyo-kicker">Apartment Hub</div>
            <div style={{ marginTop: '8px', fontFamily: 'var(--font-display)', fontSize: '2rem' }}>{state.timeOfDay}</div>
            <div className="sonsotyo-copy" style={{ marginTop: '8px' }}>Sunset Heights / Sector 7</div>
          </div>

          <div className="glass-panel sonsotyo-panel">
            <div className="sonsotyo-kicker">Nav Feed</div>
            <div style={{ marginTop: '10px', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>{statusText}</div>
          </div>
        </div>

        <div />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'flex-end', justifyContent: 'center', pointerEvents: 'auto' }}>
          <button className="neo-button" onClick={() => { setStatusText('Opening deck terminal...'); setScene('DECK_EDITOR'); }}>Deck</button>
          <button className="neo-button" onClick={() => setStatusText('Apartment route anchored.')}>Home</button>
          <button className="neo-button primary" onClick={() => { setStatusText('Opening transit planner...'); setScene('TRANSIT'); }}>Transit</button>
        </div>

        <div className="glass-panel sonsotyo-panel" style={{ gridColumn: '1 / span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'auto' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="neo-button" onClick={() => { saveGame(); setStatusText('Progress encrypted and saved.'); }}>Save State</button>
            <button className="neo-button" onClick={() => { setStatusText('Opening sync terminal...'); setScene('DECK_EDITOR'); }}>Terminal</button>
          </div>
          <button className="neo-button primary" onClick={() => { setStatusText('Opening transit planner...'); setScene('TRANSIT'); }}>Go To Metro Station</button>
        </div>
      </div>

      {showWakeUp && (
        <div className="wake-up-overlay" style={{ position: 'fixed', inset: 0, background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, opacity: 0, animation: 'fadeOut 2s forwards' }} onAnimationEnd={() => setShowWakeUp(false)}>
          <h2 className="sonsotyo-title" style={{ fontSize: '3rem' }}>Wake Up</h2>
        </div>
      )}

      {needsOnboarding && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'end', justifyContent: 'center', pointerEvents: 'none', zIndex: 140 }}>
          <div style={{ pointerEvents: 'auto' }}>
            <VNRunner
              scriptUrl={onboardingSession.scriptUrl}
              canvasId={canvasId}
              title={onboardingSession.title}
              subtitle={onboardingSession.subtitle}
              onStateSync={(vnState: VNEngineState) => {
                const reviewedDeck = Boolean(vnState.flags.reviewedDeck);
                const combatResolved = Boolean(vnState.pluginResults.start_3d_combat);
                const playerMood = typeof vnState.variables.playerMood === 'string' ? vnState.variables.playerMood : state.profile.progress.flags.playerMood ?? null;

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
                  currentQuest: nextCircuitQuest({
                    ...state.profile.progress.flags,
                    reviewedDeck,
                    combatResolved,
                    playerMood
                  })
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
                updateGameState({ currentQuest: nextCircuitQuest(mergedFlags) });

                setStatusText('Lucy completed the onboarding route.');
                setScene(vnState.flags.reviewedDeck ? 'DECK_EDITOR' : 'DISTRICT_EXPLORE');
              }}
            />
          </div>
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
