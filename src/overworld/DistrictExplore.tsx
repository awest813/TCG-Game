import React, { useState, useEffect } from 'react';
import { useGame } from '../core/GameStateContext';
import { DISTRICT_LOCATIONS, SceneLocation } from '../data/locations';
import { DistrictLocation, LocationAction } from '../data/locations';
import { NPCS } from '../npc/npcs';
import { SystemMenu } from '../ui/SystemMenu';

export const DistrictExplore: React.FC = () => {
  const { state, setScene, updateGameState } = useGame();
  const [currentLocId, setCurrentLocId] = useState<string | null>(null);
  const [activeNPC, setActiveNPC] = useState<any>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const districtScenes = DISTRICT_LOCATIONS[state.location] || [];
  
  // Default to first location in district
  useEffect(() => {
    if (!currentLocId && districtScenes.length > 0) {
        setCurrentLocId(districtScenes[0].id);
    }
  }, [state.location]);

  const currentLoc = districtScenes.find(l => l.id === currentLocId) || districtScenes[0];

  const handleAction = (action: any) => {
      switch (action.type) {
          case 'SCENE_JUMP':
              if (action.targetId === 'home') {
                  setScene('APARTMENT');
                  return;
              }
              setIsTransitioning(true);
              setTimeout(() => {
                  setCurrentLocId(action.targetId);
                  setIsTransitioning(false);
              }, 400);
              break;
          case 'TALK':
              const npc = NPCS.find(n => n.id === action.targetId);
              if (npc) setActiveNPC(npc);
              break;
          case 'SHOP':
              setScene('STORE');
              break;
          case 'EVENT':
              setScene('TOURNAMENT');
              break;
          case 'DUEL':
              setScene('BATTLE');
              break;
      }
  };

  if (!currentLoc) return <div style={{ background: 'black', height: '100vh' }}>INITIALIZING METRO RELAY...</div>;

  return (
    <div className="district-scene fade-in" style={{
      height: '100vh',
      width: '100vw',
      background: 'black',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Layer */}
      <div 
        className={isTransitioning ? 'location-exit' : 'location-enter'}
        style={{
          position: 'absolute',
          inset: 0,
          background: `url(${currentLoc.backgroundImage}) center/cover`,
          transition: '0.4s ease-in-out',
          zIndex: 0
        }}
      />

      {/* Cinematic HUD Overlay */}
      <div className="ui-overlay" style={{ 
          position: 'absolute', 
          top: '40px', 
          left: '40px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px',
          zIndex: 10 
      }}>
        <div className="glass-panel" style={{ padding: '20px 40px', borderRadius: '4px', borderLeft: '10px solid var(--accent-cyan)' }}>
            <h2 className="glow-text" style={{ fontSize: '2.5rem', margin: 0, letterSpacing: '2px' }}>{currentLoc.name.toUpperCase()}</h2>
            <div style={{ color: 'var(--accent-yellow)', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px' }}>{state.location.replace('_', ' ')} // {state.timeOfDay}</div>
        </div>
        
        <div className="glass-morphism" style={{ padding: '15px 30px', borderLeft: '4px solid var(--accent-magenta)', width: 'fit-content' }}>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Objective</div>
            <div style={{ fontSize: '1rem', color: 'white', marginTop: '5px' }}>{state.currentQuest}</div>
        </div>
      </div>

      {/* Right Sidebar: Location Actions */}
      <div className="action-sidebar" style={{
          position: 'absolute',
          right: '40px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          zIndex: 20
      }}>
          {currentLoc.actions.map((action, i) => (
              <button key={i} className="champion-button" style={{ 
                  minWidth: '240px', 
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(5,5,15,0.8)' 
              }} onClick={() => handleAction(action)}>
                  <span className="btn-number">0{i+1}</span>
                  <span className="btn-text" style={{ fontSize: '1rem' }}>{action.label.toUpperCase()}</span>
              </button>
          ))}
          <div style={{ height: '40px' }}></div>
          <button className="neo-button" onClick={() => setShowSettings(true)}>SYSTEM CONFIG</button>
          <button className="neo-button" onClick={() => setScene('TRANSIT')}>NEORAIL STATION</button>
          <button className="neo-button" onClick={() => setScene('APARTMENT')}>RETURN HOME</button>
      </div>

      {showSettings && <SystemMenu onClose={() => setShowSettings(false)} />}

      {/* Narrative Dialog Overlay (Anime Style) */}
      {activeNPC && (
          <div className="dialog-overlay fade-in" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflow: 'hidden' }}>
              <img src={`/avatar_${activeNPC.id}.png`} style={{
                  position: 'absolute',
                  left: '50px',
                  bottom: '0',
                  height: '100%',
                  opacity: 0.9,
                  zIndex: 1
              }} />

              <div className="glass-panel" style={{ 
                  width: '100%', 
                  maxWidth: '800px', 
                  marginLeft: '400px',
                  padding: '60px', 
                  borderLeft: `15px solid ${activeNPC.avatarColor}`,
                  position: 'relative',
                  zIndex: 10
              }}>
                  <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ color: activeNPC.avatarColor, fontSize: '2.5rem', margin: 0, fontWeight: 900, letterSpacing: '4px' }}>{activeNPC.name.toUpperCase()}</h3>
                    <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '5px', letterSpacing: '2px' }}>{activeNPC.role.toUpperCase()}</div>
                  </div>
                  
                  <p style={{ fontSize: '1.8rem', lineHeight: '1.6', color: 'white', fontStyle: 'italic', marginBottom: '80px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    "{activeNPC.dialogue[state.timeOfDay]}"
                  </p>
                  
                  <div style={{ display: 'flex', gap: '25px', justifyContent: 'flex-start' }}>
                      {activeNPC.deck && (
                          <button className="champion-button" style={{ borderColor: activeNPC.avatarColor, padding: '15px 40px' }} onClick={() => setScene('BATTLE')}>
                            CHALLENGE TO DUEL
                          </button>
                      )}
                      <button className="neo-button ghost" style={{ minWidth: '150px' }} onClick={() => setActiveNPC(null)}>GOODBYE</button>
                  </div>
              </div>
          </div>
      )}

      <style>{`
          .location-exit { opacity: 0; transform: scale(1.1); }
          .location-enter { opacity: 1; transform: scale(1); }
      `}</style>
    </div>
  );
};
