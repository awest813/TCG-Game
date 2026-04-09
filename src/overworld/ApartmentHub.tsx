import React, { useEffect, useRef, useState } from 'react';
import { ArcRotateCamera, Color3, Engine, GlowLayer, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Vector3 } from '@babylonjs/core';
import { useGame } from '../core/GameStateContext';
import { TutorialGuide } from '../ui/TutorialGuide';

export const ApartmentHub: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, setScene, saveGame, advanceTime, updateProfile } = useGame();
  const [showWakeUp, setShowWakeUp] = useState(state.timeOfDay === 'MORNING');
  const [statusText, setStatusText] = useState('Apartment systems online.');
  const needsOnboarding = !state.profile.progress.flags.onboardingComplete;
  const starter = state.profile.progress.flags.onboardingStarter as string | undefined;

  useEffect(() => {
    if (!canvasRef.current) return undefined;

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
    const winColors = {
      MORNING: Color3.FromHexString('#ffaa00'),
      AFTERNOON: Color3.FromHexString('#00aaff'),
      EVENING: Color3.FromHexString('#ff00aa')
    };
    winMat.emissiveColor = winColors[state.timeOfDay];
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

    engine.runRenderLoop(() => {
      scene.render();
    });

    const onResize = () => engine.resize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      engine.dispose();
    };
  }, [advanceTime, setScene, state.timeOfDay]);

  return (
    <div className="apartment-container fade-in" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', outline: 'none' }} />

      <div className="ui-overlay" style={{ position: 'absolute', top: '40px', left: '40px', pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h1 className="glow-text" style={{ fontSize: '3rem', margin: 0 }}>APARTMENT</h1>

        <div className="glass-morphism" style={{ padding: '15px 30px', borderLeft: '5px solid var(--accent-magenta)' }}>
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '2px' }}>{state.timeOfDay}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Sunset Heights // Sector 7</div>
        </div>

        <div className="glass-morphism" style={{ padding: '10px 20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)', boxShadow: '0 0 10px var(--accent-cyan)' }} />
          <span style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>SYSTEMS NOMINAL</span>
        </div>

        <div className="glass-morphism" style={{ padding: '12px 18px', maxWidth: '340px', pointerEvents: 'auto' }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '3px', marginBottom: '4px' }}>NAV_FEED</div>
          <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{statusText}</div>
        </div>
      </div>

      <div style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div className="sidebar-icon" onClick={() => { setStatusText('Opening deck terminal...'); setScene('DECK_EDITOR'); }}>DE</div>
        <div className="sidebar-icon" onClick={() => setStatusText('Apartment route anchored.')}>HB</div>
        <div className="sidebar-icon" onClick={() => { setStatusText('Opening transit planner...'); setScene('TRANSIT'); }}>TR</div>
      </div>

      <div className="bottom-nav glass-panel" style={{ position: 'absolute', bottom: '40px', left: '40px', right: '40px', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '100px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button className="neo-button" onClick={() => { saveGame(); setStatusText('Progress encrypted and saved.'); }}>SAVE STATE</button>
          <button className="neo-button" onClick={() => { setStatusText('Opening sync terminal...'); setScene('DECK_EDITOR'); }}>TERMINAL</button>
        </div>
        <button className="neo-button primary" onClick={() => { setStatusText('Opening transit planner...'); setScene('TRANSIT'); }} style={{ padding: '15px 40px' }}>
          GO TO METRO STATION
        </button>
      </div>

      {showWakeUp && (
        <div className="wake-up-overlay" style={{ position: 'fixed', inset: 0, background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, opacity: 0, animation: 'fadeOut 2s forwards' }} onAnimationEnd={() => setShowWakeUp(false)}>
          <h2 className="glow-text" style={{ fontSize: '3rem' }}>WAKE UP</h2>
        </div>
      )}

      {needsOnboarding && (
        <TutorialGuide
          title="Lucy // Rookie Link Coach"
          subtitle="FIRST SESSION GUIDE"
          message={`Welcome home, ${state.profile.name}. I tuned your ${starter ?? 'starter'} loadout and left the sync terminal hot. First thing: open the terminal so I can walk you through the deck you just picked.`}
          objective="Use the TERMINAL button or the glowing desk terminal to inspect your starter deck."
          actions={[
            {
              label: 'OPEN TERMINAL',
              onClick: () => {
                setStatusText('Lucy routed you to the sync terminal.');
                setScene('DECK_EDITOR');
              }
            },
            {
              label: 'SKIP INTRO',
              variant: 'secondary',
              onClick: () =>
                updateProfile({
                  progress: {
                    ...state.profile.progress,
                    flags: {
                      ...state.profile.progress.flags,
                      onboardingComplete: true
                    }
                  }
                })
            }
          ]}
        />
      )}

      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; pointer-events: all; }
          70% { opacity: 1; }
          100% { opacity: 0; pointer-events: none; }
        }
      `}</style>
    </div>
  );
};
