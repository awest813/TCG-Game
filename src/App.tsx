import React, { Suspense } from 'react';
import { useGame } from './core/GameContext';
import { MainMenu } from './ui/MainMenu';
import { DevConsole } from './ui/DevConsole';
import { VisualNovelFrame } from './ui/VisualNovelFrame';

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

const SceneLoadingFallback: React.FC = () => (
  <div
    className="fade-in"
    style={{
      height: '100vh',
      display: 'grid',
      placeItems: 'center',
      background:
        'radial-gradient(circle at 50% 35%, rgba(240,198,124,0.12), transparent 24%), linear-gradient(180deg, rgba(10,8,11,0.96), rgba(8,6,9,1))'
    }}
  >
    <div className="glass-panel" style={{ width: 'min(520px, calc(100vw - 40px))', padding: '28px 30px', textAlign: 'center' }}>
      <div className="system-menu-kicker">Scene Transition</div>
      <div className="glow-text" style={{ marginTop: '10px', fontSize: '2.6rem' }}>Loading Route</div>
      <div style={{ marginTop: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        Pulling the next scene into focus. Heavy systems now load only when their chapter is actually opened.
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const { state } = useGame();
  const [showDev, setShowDev] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === '`') setShowDev(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      default:
        return <MainMenu />;
    }
  };

  return (
    <div className="app-container">
      <Suspense fallback={<SceneLoadingFallback />}>
        {renderScene()}
      </Suspense>
      <VisualNovelFrame />
      {showDev && <DevConsole onClose={() => setShowDev(false)} />}
    </div>
  );
};

export default App;
