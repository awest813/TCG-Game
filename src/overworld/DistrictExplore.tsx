import React, { useEffect, useMemo, useState } from 'react';
import { useGame } from '../core/GameContext';
import { DISTRICT_LOCATIONS, LocationAction } from '../data/locations';
import { NPCS } from '../npc/npcs';
import { SystemMenu } from '../ui/SystemMenu';
import { SceneType } from '../core/types';
import { createActionSession, createChampionSession } from '../visual-novel/scriptRegistry';
import { getDistrictChampion, getDistrictProfile } from '../visual-novel/world';
import '../styles/SceneVisuals.css';
import '../styles/SonsotyoScenes.css';

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
          if (nextScene) {
            if (nextScene === 'TOURNAMENT') {
              updateGameState({ tournamentLobbyReturn: 'DISTRICT_EXPLORE' });
            }
            setScene(nextScene);
          } else setStatusText('Route target unavailable.');
        }
        setIsTransitioning(false);
      }, 420);
      return;
    }

    if (action.type === 'TRAVEL') {
      updateGameState({ vnSession: createActionSession(state.location, currentLoc.id, action.label, 'TRAVEL', state.timeOfDay) });
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
      updateGameState({ vnSession: createActionSession(state.location, currentLoc.id, action.label, 'DUEL', state.timeOfDay) });
      setStatusText('Sync battle queued.');
      setScene('VN_SCENE');
      return;
    }

    updateGameState({ vnSession: createActionSession(state.location, currentLoc.id, action.label, 'EVENT', state.timeOfDay) });
    setStatusText(action.label.toLowerCase().includes('rest') ? 'Personal event route opened.' : 'Event route engaged.');
    setScene('VN_SCENE');
  };

  if (!currentLoc) return <div style={{ background: 'black', height: '100vh' }}>INITIALIZING METRO RELAY...</div>;

  return (
    <div className="explore-container sonsotyo-scene fade-in" style={{ height: '100vh', position: 'relative', overflow: 'hidden', background: '#000' }}>
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

      <div className="sonsotyo-overlay" />
      <div className="sonsotyo-content" style={{ position: 'absolute', inset: 0, padding: '34px', display: 'grid', gridTemplateColumns: 'minmax(300px, 420px) 1fr minmax(320px, 380px)', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', alignSelf: 'start' }}>
          <div className="glass-panel sonsotyo-panel">
            <div className="sonsotyo-kicker">Active Club</div>
            <div style={{ marginTop: '10px', fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>{currentLoc.name}</div>
            <div className="sonsotyo-meta-strip">
              <div className="sonsotyo-pill">Phase {state.timeOfDay}</div>
              <div className="sonsotyo-pill">{state.location.replace(/_/g, ' ')}</div>
            </div>
          </div>

          <div className="glass-panel sonsotyo-panel">
            <div className="sonsotyo-kicker">Route Status</div>
            <div style={{ marginTop: '10px', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>{statusText || 'Standing by.'}</div>
            <div className="sonsotyo-copy" style={{ marginTop: '12px' }}>
              {state.location.replace(/_/g, ' ')} / {currentLoc.name}
            </div>
          </div>

          <div className="glass-panel sonsotyo-panel" style={{ marginTop: 'auto' }}>
            <div className="sonsotyo-kicker">Circuit Scouter</div>
            <p style={{ marginTop: '12px', fontSize: '1rem', lineHeight: 1.7, fontStyle: 'italic' }}>"{currentLoc.description}"</p>
            {districtChampion && (
              <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="sonsotyo-kicker" style={{ color: 'var(--accent-yellow)' }}>Champion Presence</div>
                <div style={{ marginTop: '8px', fontWeight: 700 }}>{districtChampion.name} / {districtChampion.role}</div>
                <div className="sonsotyo-copy" style={{ marginTop: '6px' }}>{districtProfile?.signatureStyle}</div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '18px' }}>
          <div className="glass-panel sonsotyo-panel" style={{ width: 'min(100%, 560px)', background: 'rgba(8,10,20,0.42)' }}>
            <div className="sonsotyo-kicker" style={{ color: districtProfile?.crestColor ?? 'var(--accent-primary)' }}>
              {districtProfile?.arcTitle ?? 'District Pulse'}
            </div>
            <h2 className="sonsotyo-title" style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)', marginTop: '10px' }}>
              {districtProfile?.travelLabel ?? currentLoc.name}
            </h2>
            <p className="sonsotyo-copy" style={{ marginTop: '12px' }}>{districtProfile?.slogan ?? 'Routes are humming under the city lights.'}</p>
            <div className="sonsotyo-meta-strip">
              {availableNpcCast.map((npc) => (
                <div key={npc.id} className="sonsotyo-pill">{npc.name}</div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'stretch', justifyContent: 'space-between' }}>
          {districtProfile && (
            <div className="glass-panel sonsotyo-panel" style={{ borderTop: `3px solid ${districtProfile.crestColor}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
                <div>
                  <div className="sonsotyo-kicker" style={{ color: districtProfile.crestColor }}>{districtProfile.arcTitle}</div>
                  <div style={{ marginTop: '8px', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>{districtProfile.travelLabel}</div>
                </div>
                <div className="sonsotyo-pill" style={{ color: districtProfile.crestColor }}>{districtProfile.crest}</div>
              </div>
              <p className="sonsotyo-copy" style={{ marginTop: '12px' }}>{districtProfile.slogan}</p>
            </div>
          )}

          <div className="sonsotyo-action-list">
            {currentLoc.actions.map((action, index) => (
              <button key={`${action.label}-${index}`} className="neo-button sonsotyo-route-button" style={{ background: 'rgba(8,10,20,0.8)' }} onClick={() => handleAction(action)}>
                <span className="sonsotyo-number">0{index + 1}</span>
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>{action.label}</span>
                  <span className="sonsotyo-caption">{action.type.replace('_', ' ')} route</span>
                </span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button className="neo-button" onClick={() => setShowSettings(true)}>System</button>
            <button className="neo-button" onClick={() => setScene('TRANSIT')}>Transit Grid</button>
          </div>
        </div>
      </div>

      {showSettings && <SystemMenu onClose={() => setShowSettings(false)} />}

      <style>{`
        .location-exit { opacity: 0; }
        .location-enter { opacity: 1; }
        @keyframes pulse { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }
        @media (max-width: 1200px) {
          .explore-container .sonsotyo-content {
            grid-template-columns: 1fr;
            overflow-y: auto;
          }
        }
      `}</style>
    </div>
  );
};
