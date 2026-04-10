import React, { useEffect, useMemo, useState } from 'react';
import { useGame } from '../core/GameContext';
import { DISTRICT_LOCATIONS, LocationAction } from '../data/locations';
import { NPCS } from '../npc/npcs';
import { SystemMenu } from '../ui/SystemMenu';
import { SceneType } from '../core/types';
import { createActionSession, createChampionSession } from '../visual-novel/scriptRegistry';
import { getDistrictChampion, getDistrictProfile } from '../visual-novel/world';
import '../styles/SceneVisuals.css';

export const DistrictExplore: React.FC = () => {
  const { state, setScene, updateGameState } = useGame();
  const [currentLocId, setCurrentLocId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [statusText, setStatusText] = useState('District link stable.');

  const districtScenes = useMemo(() => DISTRICT_LOCATIONS[state.location] ?? [], [state.location]);
  const districtProfile = useMemo(() => getDistrictProfile(state.location), [state.location]);
  const districtChampion = useMemo(() => getDistrictChampion(state.location), [state.location]);
  const availableNpcCast = useMemo(
    () => NPCS.filter((npc) => npc.location === state.location && npc.activeTimes.includes(state.timeOfDay)),
    [state.location, state.timeOfDay]
  );

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
  }, [state.location, districtScenes]);

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
      updateGameState({
        vnSession: createActionSession(state.location, currentLoc.id, action.label, 'TRAVEL', state.timeOfDay)
      });
      setStatusText('Opening Neo-Rail route planner...');
      setScene('VN_SCENE');
      return;
    }

    if (action.type === 'TALK') {
      const npc = NPCS.find((entry) => entry.id === action.targetId);
      if (npc) {
        const session = createChampionSession(npc.id, state.timeOfDay);
        if (session) {
          updateGameState({ vnSession: session });
          setStatusText(`${npc.name} route opened.`);
          setScene('VN_SCENE');
        }
      }
      return;
    }

    if (action.type === 'SHOP') {
      setStatusText('Opening market uplink...');
      setScene('STORE');
      return;
    }

    if (action.type === 'DUEL') {
      updateGameState({
        vnSession: createActionSession(state.location, currentLoc.id, action.label, 'DUEL', state.timeOfDay)
      });
      setStatusText('Sync battle queued.');
      setScene('VN_SCENE');
      return;
    }

    if (action.label.toLowerCase().includes('rest')) {
      updateGameState({
        vnSession: createActionSession(state.location, currentLoc.id, action.label, 'EVENT', state.timeOfDay)
      });
      setStatusText('Personal event route opened.');
      setScene('VN_SCENE');
      return;
    }

    updateGameState({
      vnSession: createActionSession(state.location, currentLoc.id, action.label, 'EVENT', state.timeOfDay)
    });
    setStatusText('Event route engaged.');
    setScene('VN_SCENE');
  };

  if (!currentLoc) return <div style={{ background: 'black', height: '100vh' }}>INITIALIZING METRO RELAY...</div>;

  return (
    <div className="explore-container fade-in" style={{ height: '100vh', position: 'relative', overflow: 'hidden', background: '#000' }}>
      <div className={`scene-background-container ${isTransitioning ? 'location-exit' : 'location-enter'}`} style={{ transition: 'opacity 0.4s ease' }}>
        <div className="alive-background" style={{ backgroundImage: `url(${currentLoc.backgroundImage})` }} />
        <div className="data-overlay" />
        <div className="particle-field">
          {Array.from({ length: 20 }).map((_, index) => (
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

      {districtProfile && (
        <div
          className="glass-panel fade-in"
          style={{
            position: 'absolute',
            top: 132,
            right: 40,
            zIndex: 10,
            width: 'min(420px, calc(100vw - 80px))',
            padding: '18px 22px',
            background: 'rgba(13,10,12,0.82)',
            borderTop: `3px solid ${districtProfile.crestColor}`
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: '0.62rem', color: districtProfile.crestColor, letterSpacing: '0.18rem', textTransform: 'uppercase' }}>
                {districtProfile.arcTitle}
              </div>
              <div style={{ marginTop: '6px', fontSize: '1.18rem', fontWeight: 800 }}>{districtProfile.travelLabel}</div>
            </div>
            <div style={{ padding: '0.4rem 0.65rem', borderRadius: '999px', border: `1px solid ${districtProfile.crestColor}`, color: districtProfile.crestColor, fontSize: '0.68rem' }}>
              {districtProfile.crest}
            </div>
          </div>
          <div style={{ marginTop: '12px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{districtProfile.slogan}</div>
          <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {availableNpcCast.map((npc) => (
              <div
                key={npc.id}
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: '0.74rem',
                  letterSpacing: '0.08rem'
                }}
              >
                {npc.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {(
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

      {(
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

      {(
        <div className="glass-panel fade-in" style={{ position: 'absolute', left: 60, bottom: 60, width: '450px', padding: '30px', zIndex: 10, background: 'rgba(5,5,15,0.7)', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--accent-cyan)', marginBottom: '10px', letterSpacing: '4px' }}>CIRCUIT_SCOUTER //</div>
          <p style={{ margin: 0, fontSize: '1rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, fontStyle: 'italic', fontWeight: 300 }}>"{currentLoc.description}"</p>
          {districtChampion && (
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '0.62rem', color: 'var(--accent-yellow)', letterSpacing: '0.16rem', textTransform: 'uppercase' }}>Champion Presence</div>
              <div style={{ marginTop: '6px', fontWeight: 700 }}>{districtChampion.name} // {districtChampion.role}</div>
              <div style={{ marginTop: '4px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {districtProfile?.signatureStyle}
              </div>
            </div>
          )}
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
