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

type SceneLoaderFlavor = {
  bgAsset: string;
  iconAsset: string;
  label: string;
  telemetry: [string, string, string];
  checklist: [string, string, string];
};

const loaderFlavorByVariant: Record<SceneTransition['variant'], SceneLoaderFlavor> = {
  DEFAULT: {
    bgAsset: '/assets/bg/onboarding-route.svg',
    iconAsset: '/assets/ui/icon-core.svg',
    label: 'Scene relay',
    telemetry: ['Cache sync', 'UI shell', 'Packet restore'],
    checklist: ['Seal outgoing scene', 'Mount next channel', 'Release player control']
  },
  VN: {
    bgAsset: '/assets/bg/vn-stage-orbit.svg',
    iconAsset: '/assets/ui/icon-signal.svg',
    label: 'Narrative uplink',
    telemetry: ['Portrait feed', 'Branch state', 'Dialogue lattice'],
    checklist: ['Resolve route source', 'Hydrate VN state', 'Fade stage lighting']
  },
  BATTLE: {
    bgAsset: '/assets/bg/sweep-protocol.svg',
    iconAsset: '/assets/ui/icon-core.svg',
    label: 'Combat staging',
    telemetry: ['Deck lock', 'Field rules', 'Rival telemetry'],
    checklist: ['Freeze match seed', 'Calibrate arena HUD', 'Authorize duel start']
  },
  TOURNAMENT: {
    bgAsset: '/assets/bg/card-annex.svg',
    iconAsset: '/assets/ui/icon-route.svg',
    label: 'Bracket desk',
    telemetry: ['Entry ledger', 'Round table', 'Announcer feed'],
    checklist: ['Read current bracket', 'Sync payout board', 'Prep live pairing']
  },
  TRAVEL: {
    bgAsset: '/assets/bg/onboarding-route.svg',
    iconAsset: '/assets/ui/icon-route.svg',
    label: 'Metro routing',
    telemetry: ['Rail lanes', 'District gate', 'Station uplink'],
    checklist: ['Ping transit graph', 'Confirm destination', 'Open route control']
  }
};

const renderLoaderScreen = (transition?: SceneTransition | null, mode: 'fallback' | 'overlay' = 'fallback') => {
  const flavor = transition ? loaderFlavorByVariant[transition.variant] : loaderFlavorByVariant.DEFAULT;
  const kicker = transition?.kicker ?? 'System boot';
  const title = transition?.title ?? 'Loading scene...';
  const detail = transition?.detail ?? 'Retrieving sector packets.';

  return (
    <div
      className={`app-scene-loader app-scene-loader--${mode} ${transition ? `app-scene-loader--${transition.variant.toLowerCase()}` : 'app-scene-loader--default'} ${transition ? `app-scene-loader--${transition.phase.toLowerCase()}` : ''}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
      style={{ ['--app-loader-bg' as string]: `url(${flavor.bgAsset})` }}
    >
      <div className="app-scene-loader-grid" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="app-scene-loader-orbit" aria-hidden="true" />
      <div className="glass-panel app-scene-loader-card">
        <div className="app-scene-loader-topline">
          <div className="app-scene-loader-kicker">{kicker}</div>
          <div className="app-scene-loader-label">{flavor.label}</div>
        </div>
        <div className="app-scene-loader-hero">
          <div className="app-scene-loader-icon-shell" aria-hidden="true">
            <img className="app-scene-loader-icon" src={flavor.iconAsset} alt="" />
          </div>
          <div className="app-scene-loader-copyblock">
            <div className="app-scene-loader-title">{title}</div>
            <p className="app-scene-loader-copy">{detail}</p>
          </div>
        </div>
        <div className="app-scene-loader-telemetry">
          {flavor.telemetry.map((item) => (
            <span key={item} className="app-scene-loader-pill">{item}</span>
          ))}
        </div>
        <div className="app-scene-loader-visual" aria-hidden="true" />
        <div className="app-scene-loader-lower">
          <div className="app-scene-loader-checklist">
            {flavor.checklist.map((item, index) => (
              <div key={item} className="app-scene-loader-check">
                <span className="app-scene-loader-check-index">0{index + 1}</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="app-scene-loader-signal">
            <div className="app-scene-loader-signal-label">Transfer signal</div>
            <div className="app-scene-loader-bar" aria-hidden="true">
              <div className="app-scene-loader-bar-fill" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SceneLoadingFallback: React.FC<{ transition?: SceneTransition | null }> = ({ transition }) =>
  renderLoaderScreen(transition, 'fallback');

const SceneTransitionOverlay: React.FC<{ transition: SceneTransition }> = ({ transition }) =>
  renderLoaderScreen(transition, 'overlay');

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
