import React, { Suspense } from 'react';
import { audioManager } from './core/AudioManager';
import { useGame } from './core/GameContext';
import { SceneTransition } from './core/types';
import { MainMenu } from './ui/MainMenu';
import { DevConsole } from './ui/DevConsole';
import { VisualNovelFrame } from './ui/VisualNovelFrame';
import { PhoneFrame } from './ui/PhoneFrame';

const ApartmentHub = React.lazy(async () => {
  const module = await import('./overworld/ApartmentHub');
  return { default: module.ApartmentHub };
});

const DistrictExplore = React.lazy(async () => {
  const module = await import('./overworld/DistrictExplore');
  return { default: module.DistrictExplore };
});

const BattleBoard = React.lazy(async () => {
  const module = await import('./battle/BattleBoard');
  return { default: module.BattleBoard };
});

const DeckEditor = React.lazy(async () => {
  const module = await import('./cards/DeckEditor');
  return { default: module.DeckEditor };
});

const PackOpening = React.lazy(async () => {
  const module = await import('./cards/PackOpening');
  return { default: module.PackOpening };
});

const CardShop = React.lazy(async () => {
  const module = await import('./economy/CardShop');
  return { default: module.CardShop };
});

const SocialHangout = React.lazy(async () => {
  const module = await import('./social/SocialHangout');
  return { default: module.SocialHangout };
});

const Tournament = React.lazy(async () => {
  const module = await import('./ui/Tournament');
  return { default: module.Tournament };
});

const TransitStation = React.lazy(async () => {
  const module = await import('./ui/TransitStation');
  return { default: module.TransitStation };
});

const Profile = React.lazy(async () => {
  const module = await import('./ui/Profile');
  return { default: module.Profile };
});

const VNScene = React.lazy(async () => {
  const module = await import('./ui/VNScene');
  return { default: module.VNScene };
});

const SaveLoad = React.lazy(async () => {
  const module = await import('./ui/SaveLoad');
  return { default: module.SaveLoad };
});

const SceneLoadingFallback: React.FC<{ transition?: SceneTransition | null }> = ({ transition }) => (
  <div className="app-scene-suspense fade-in" role="status" aria-live="polite" aria-busy="true">
    <div className="glass-panel app-scene-suspense-card">
      <div className="app-scene-suspense-kicker">{transition?.kicker ?? 'System boot'}</div>
      <div className="app-scene-suspense-title">{transition?.title ?? 'Loading scene...'}</div>
      <p className="app-scene-suspense-copy">{transition?.detail ?? 'Retrieving sector packets.'}</p>
      <div className="app-scene-suspense-bar" aria-hidden="true">
        <div className="app-scene-suspense-bar-fill" />
      </div>
    </div>
  </div>
);

const SceneTransitionOverlay: React.FC<{ transition: SceneTransition }> = ({ transition }) => (
  <div className={`app-scene-transition app-scene-transition--${transition.variant.toLowerCase()} app-scene-transition--${transition.phase.toLowerCase()}`} role="status" aria-live="polite" aria-busy="true">
    <div className="app-scene-transition-grid" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
    <div className="glass-panel app-scene-transition-card">
      <div className="app-scene-transition-kicker">{transition.kicker}</div>
      <div className="app-scene-transition-title">{transition.title}</div>
      <p className="app-scene-transition-copy">{transition.detail}</p>
      <div className="app-scene-transition-bar" aria-hidden="true">
        <div className="app-scene-transition-bar-fill" />
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const { state, updateGameState } = useGame();
  const [showDev, setShowDev] = React.useState(false);
  const transitionTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === '`') setShowDev(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  React.useEffect(() => {
    audioManager.syncAmbientMusicForScene(state.currentScene);
  }, [state.currentScene]);

  React.useEffect(() => {
    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }

    const transition = state.sceneTransition;
    if (!transition) return undefined;

    if (transition.phase === 'OUT' && state.currentScene === transition.fromScene) {
      transitionTimerRef.current = window.setTimeout(() => {
        updateGameState({
          currentScene: transition.toScene,
          sceneTransition: { ...transition, phase: 'IN' }
        });
      }, 220);
      return () => {
        if (transitionTimerRef.current !== null) {
          window.clearTimeout(transitionTimerRef.current);
          transitionTimerRef.current = null;
        }
      };
    }

    if (transition.phase === 'IN' && state.currentScene === transition.toScene) {
      transitionTimerRef.current = window.setTimeout(() => {
        updateGameState({ sceneTransition: null });
      }, 360);
      return () => {
        if (transitionTimerRef.current !== null) {
          window.clearTimeout(transitionTimerRef.current);
          transitionTimerRef.current = null;
        }
      };
    }

    return undefined;
  }, [state.currentScene, state.sceneTransition, updateGameState]);

  const renderScene = () => {
    switch (state.currentScene) {
      case 'MAIN_MENU':
        return <MainMenu />;
      case 'APARTMENT':
        return <ApartmentHub />;
      case 'DISTRICT_EXPLORE':
        return <DistrictExplore />;
      case 'BATTLE':
        return <BattleBoard />;
      case 'DECK_EDITOR':
        return <DeckEditor />;
      case 'STORE':
        return <CardShop />;
      case 'PACK_OPENING':
        return <PackOpening />;
      case 'SOCIAL':
        return <SocialHangout />;
      case 'TOURNAMENT':
        return <Tournament />;
      case 'TRANSIT':
        return <TransitStation />;
      case 'PROFILE':
        return <Profile />;
      case 'VN_SCENE':
        return <VNScene />;
      case 'SAVE_LOAD':
        return <SaveLoad />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <PhoneFrame>
      <a href="#main-content" className="skip-to-content">
        Skip to game
      </a>
      <div className="app-container" style={{ height: '100%', position: 'relative' }}>
        <Suspense fallback={<SceneLoadingFallback transition={state.sceneTransition} />}>
          <main id="main-content" className="app-main" tabIndex={-1}>
            {renderScene()}
          </main>
        </Suspense>
        {state.sceneTransition && <SceneTransitionOverlay transition={state.sceneTransition} />}
        <VisualNovelFrame />
        {showDev && <DevConsole onClose={() => setShowDev(false)} />}
      </div>
    </PhoneFrame>
  );
};

export default App;
