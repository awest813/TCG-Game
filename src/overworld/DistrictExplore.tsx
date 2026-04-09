import React, { useEffect, useMemo, useState } from 'react';
import { useGame } from '../core/GameStateContext';
import { DISTRICT_LOCATIONS, LocationAction } from '../data/locations';
import { NPCS, NPC } from '../npc/npcs';
import { SystemMenu } from '../ui/SystemMenu';
import { SceneType } from '../core/types';
import '../styles/SceneVisuals.css';

export const DistrictExplore: React.FC = () => {
  const { state, setScene, advanceTime } = useGame();
  const [currentLocId, setCurrentLocId] = useState<string | null>(null);
  const [activeDialogue, setActiveDialogue] = useState<{ npc: NPC; text: string } | null>(null);
  const [typedText, setTypedText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [statusText, setStatusText] = useState('District link stable.');

  const districtScenes = DISTRICT_LOCATIONS[state.location as keyof typeof DISTRICT_LOCATIONS] || [];

  const jumpMap = useMemo<Record<string, SceneType>>(
    () => ({
      'deck-editor': 'DECK_EDITOR',
      apartment: 'APARTMENT',
      transit: 'TRANSIT',
      tournament: 'TOURNAMENT',
      battle: 'BATTLE',
      store: 'STORE',
      profile: 'PROFILE'
    }),
    []
  );

  useEffect(() => {
    setCurrentLocId(districtScenes[0]?.id ?? null);
    setActiveDialogue(null);
  }, [state.location, districtScenes]);

  useEffect(() => {
    if (!activeDialogue) return undefined;

    setTypedText('');
    let i = 0;
    const interval = window.setInterval(() => {
      setTypedText(activeDialogue.text.slice(0, i + 1));
      i += 1;
      if (i >= activeDialogue.text.length) window.clearInterval(interval);
    }, 24);
    return () => window.clearInterval(interval);
  }, [activeDialogue]);

  useEffect(() => {
    if (!statusText) return undefined;
    const timeout = window.setTimeout(() => setStatusText(''), 2800);
    return () => window.clearTimeout(timeout);
  }, [statusText]);

  const currentLoc = districtScenes.find((location) => location.id === currentLocId) || districtScenes[0];

  const resolveSceneJump = (targetId?: string): SceneType | null => {
    if (!targetId) return null;
    if (jumpMap[targetId]) return jumpMap[targetId];
    return targetId.replace(/-/g, '_').toUpperCase() as SceneType;
  };

  const advanceTimeLabel = () => {
    if (state.timeOfDay === 'MORNING') return 'AFTERNOON';
    if (state.timeOfDay === 'AFTERNOON') return 'EVENING';
    return 'MORNING';
  };

  const handleAction = (action: LocationAction) => {
    if (action.type === 'SCENE_JUMP') {
      setIsTransitioning(true);
      setStatusText(`Routing to ${action.label.toUpperCase()}...`);
      window.setTimeout(() => {
        const destination = districtScenes.find((location) => location.id === action.targetId);
        if (destination) {
          setCurrentLocId(destination.id);
          setStatusText(`Local route changed to ${destination.name}.`);
        } else {
          const nextScene = resolveSceneJump(action.targetId);
          if (nextScene) setScene(nextScene);
          else setStatusText('Route target unavailable.');
        }
        setIsTransitioning(false);
      }, 420);
      return;
    }

    if (action.type === 'TRAVEL') {
      setStatusText('Opening Neo-Rail route planner...');
      setScene('TRANSIT');
      return;
    }

    if (action.type === 'TALK') {
      const npc = NPCS.find((entry) => entry.id === action.targetId);
      if (npc) {
        setActiveDialogue({ npc, text: npc.dialogue[state.timeOfDay] || 'Duel with me!' });
        setStatusText(`${npc.name} connected.`);
      }
      return;
    }

    if (action.type === 'SHOP') {
      setStatusText('Opening market uplink...');
      setScene('STORE');
      return;
    }

    if (action.type === 'DUEL') {
      setStatusText('Sync battle queued.');
      setScene('BATTLE');
      return;
    }

    if (action.label.toLowerCase().includes('rest')) {
      const nextTime = advanceTimeLabel();
      advanceTime();
      setStatusText(`Schedule advanced to ${nextTime}.`);
      return;
    }

    setStatusText('Tournament uplink engaged.');
    setScene('TOURNAMENT');
  };

  if (!currentLoc) return <div style={{ background: 'black', height: '100vh' }}>INITIALIZING METRO RELAY...</div>;

  return (
    <div className="explore-container fade-in" style={{ height: '100vh', position: 'relative', overflow: 'hidden', background: '#000' }}>
      <div className={`scene-background-container ${isTransitioning ? 'location-exit' : 'location-enter'}`} style={{ transition: 'opacity 0.4s ease' }}>
        <div className="alive-background" style={{ backgroundImage: `url(${currentLoc.backgroundImage})` }} />
        <div className="data-overlay" />
        <div className="particle-field">
          {[...Array(20)].map((_, index) => (
            <div
              key={index}
              className="data-particle"
              style={{ left: `${(index * 13) % 100}%`, top: `${(index * 17) % 100}%`, animationDelay: `${(index % 7) * 0.8}s`, opacity: 0.18 + ((index % 4) * 0.09) }}
            />
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', top: 40, left: 40, zIndex: 10, display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '15px 30px', borderLeft: '5px solid var(--accent-cyan)', background: 'rgba(5,5,15,0.8)' }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '4px' }}>ACTIVE CLUB //</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{currentLoc.name.toUpperCase()}</div>
        </div>
        <div className="glass-panel" style={{ padding: '15px 30px', background: 'rgba(5,5,15,0.8)' }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '2px' }}>CHASE PHASE //</div>
          <div style={{ fontWeight: 'bold', color: 'var(--accent-yellow)', fontSize: '1.2rem' }}>{state.timeOfDay}</div>
        </div>
      </div>

      {!activeDialogue && (
        <div className="district-nav-status glass-panel">
          <div className="district-nav-status-label">ROUTE STATUS</div>
          <div className="district-nav-status-value">{statusText || 'Standing by.'}</div>
          <div className="district-nav-breadcrumb">
            <span>{state.location.replace(/_/g, ' ')}</span>
            <span>/</span>
            <span>{currentLoc.name}</span>
          </div>
        </div>
      )}

      {!activeDialogue && (
        <div style={{ position: 'absolute', right: 60, bottom: 60, zIndex: 10, display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-end' }}>
          {currentLoc.actions.map((action, index) => (
            <button key={`${action.label}-${index}`} className="champion-button" style={{ minWidth: '320px', minHeight: '74px', background: 'rgba(5,5,15,0.9)' }} onClick={() => handleAction(action)}>
              <span className="btn-number">0{index + 1}</span>
              <span className="btn-copy">
                <span className="btn-text">{action.label.toUpperCase()}</span>
                <span className="btn-caption">{action.type.replace('_', ' ')} ROUTE</span>
              </span>
            </button>
          ))}
          <div style={{ height: '20px' }} />
          <button className="neo-button" style={{ fontSize: '0.7rem' }} onClick={() => setShowSettings(true)}>SYSTEM_OS_v2.0</button>
          <button className="neo-button" style={{ fontSize: '0.7rem' }} onClick={() => setScene('TRANSIT')}>TRANSIT_GRID</button>
        </div>
      )}

      {!activeDialogue && (
        <div className="glass-panel fade-in" style={{ position: 'absolute', left: 60, bottom: 60, width: '450px', padding: '30px', zIndex: 10, background: 'rgba(5,5,15,0.7)', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--accent-cyan)', marginBottom: '10px', letterSpacing: '4px' }}>CIRCUIT_SCOUTER //</div>
          <p style={{ margin: 0, fontSize: '1rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, fontStyle: 'italic', fontWeight: 300 }}>"{currentLoc.description}"</p>
        </div>
      )}

      {activeDialogue && (
        <div className="dialogue-overlay fade-in" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div className="dialogue-box" style={{ width: '100%', minHeight: '220px' }} onClick={() => setActiveDialogue(null)}>
              <div className="dialogue-name-tag" style={{ background: activeDialogue.npc.avatarColor }}>
                {activeDialogue.npc.name.toUpperCase()} // {activeDialogue.npc.role.toUpperCase()}
              </div>
              <div className="typing-text" style={{ fontSize: '1.8rem' }}>{typedText}</div>
              <div style={{ position: 'absolute', right: 30, bottom: 20, fontSize: '0.7rem', color: 'var(--accent-cyan)', animation: 'pulse 1s infinite' }}>[ CLICK TO ADVANCE ]</div>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              {activeDialogue.npc.deck && <button className="neo-button primary" style={{ width: '250px' }} onClick={() => setScene('BATTLE')}>CHALLENGE TO DUEL</button>}
              <button className="neo-button" style={{ width: '150px' }} onClick={() => setActiveDialogue(null)}>END CONVERSATION</button>
            </div>
          </div>
        </div>
      )}

      {showSettings && <SystemMenu onClose={() => setShowSettings(false)} />}

      <style>{`
        .location-exit { opacity: 0; }
        .location-enter { opacity: 1; }
        .district-nav-status {
          position: absolute;
          top: 132px;
          left: 40px;
          z-index: 10;
          width: min(460px, calc(100vw - 80px));
          padding: 18px 22px;
          background: rgba(5,5,15,0.76);
        }
        .district-nav-status-label {
          font-size: 0.62rem;
          letter-spacing: 0.18rem;
          color: var(--text-secondary);
        }
        .district-nav-status-value {
          margin-top: 6px;
          font-size: 1rem;
          font-weight: 700;
        }
        .district-nav-breadcrumb {
          margin-top: 10px;
          display: flex;
          gap: 8px;
          color: var(--accent-cyan);
          font-size: 0.75rem;
          letter-spacing: 0.08rem;
          text-transform: uppercase;
        }
        @keyframes pulse { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }
      `}</style>
    </div>
  );
};
