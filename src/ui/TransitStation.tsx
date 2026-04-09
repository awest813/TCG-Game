import React, { useState, useEffect } from 'react';
import { useGame } from '../core/GameStateContext';
import { NPCS } from '../npc/npcs';

export const TransitStation: React.FC = () => {
  const { state, setScene, updateGameState } = useGame();
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const allDistricts = [
      { id: "SUNSET_TERMINAL", name: "Sunset Terminal", description: "Home territory. Casual duels and local energy.", color: "#00f2ff", pos: { x: '25%', y: '65%' }, shops: true, events: true },
      { id: "MARKET_CENTRAL", name: "Market Central", description: "The city's major trade artery. High-volume card exchange.", color: "#ffea00", pos: { x: '45%', y: '48%' }, shops: true, events: false },
      { id: "NEON_MISSION", name: "Neon Mission", description: "Flashy arcade culture. Fast-paced combo duels.", color: "#ff00ea", pos: { x: '68%', y: '35%' }, shops: false, events: true },
      { id: "BAYLINE_WHARF", name: "Bayline Wharf", description: "Atmospheric waterfront. Elite Tide trials.", color: "#00aaff", pos: { x: '48%', y: '78%' }, shops: true, events: true },
      { id: "REDWOOD_HEIGHTS", name: "Redwood Heights", description: "Luxury rooftop gardens. Prestige duels.", color: "#7a00ff", pos: { x: '28%', y: '25%' }, shops: false, events: false },
      { id: "CIVIC_CROWN", name: "Civic Crown", description: "The Pinnacle. Sanctioned League Grand Finals.", color: "#ffffff", pos: { x: '82%', y: '18%' }, shops: true, events: true }
  ];

  const unlocked = state.profile.progress.unlockedDistricts;

  // Find NPCs in each district
  const getNPCsInDistrict = (id: string) => NPCS.filter(n => n.location === id && n.activeTimes.includes(state.timeOfDay));

  const handleTravel = (id: string) => {
    updateGameState({ location: id as any });
    setIsClosing(true);
    setTimeout(() => setScene('DISTRICT_EXPLORE'), 800);
  };

  const [isClosing, setIsClosing] = useState(false);

  return (
    <div className={`transit-app-scene ${isClosing ? 'exit-zoom' : 'fade-in'}`} style={{
      height: '100vh',
      background: 'rgb(5,10,25)',
      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,242,255,0.05) 0%, transparent 70%), url("/rotom_map_bg.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: '"Outfit", sans-serif'
    }}>
      {/* Top App Bar */}
      <div style={{ padding: '30px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', borderBottom: '2px solid rgba(255,255,255,0.1)', zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--accent-cyan)', borderRadius: '10px', boxShadow: '0 0 15px var(--accent-cyan)' }}></div>
              <div>
                <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', letterSpacing: '2px' }}>NEO-RAIL GPS <span style={{ color: 'var(--accent-cyan)' }}>v4.0</span></h1>
                <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>SYNCHRONIZED WITH GLOBAL CHAMPION CIRCUIT</div>
              </div>
          </div>
          <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{state.timeOfDay} // {new Date().toLocaleTimeString()}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--accent-cyan)', marginTop: '2px' }}>METRO GRID: CONNECTED</div>
          </div>
      </div>

      {/* Main Map Viewport */}
      <div style={{ height: '100%', width: '100%', position: 'relative' }}>
          {allDistricts.map(dist => {
              const hasAccess = unlocked.includes(dist.id);
              const districtNPCs = getNPCsInDistrict(dist.id);
              const isSelected = selected === dist.id;

              return (
                  <div key={dist.id} 
                       onMouseEnter={() => setHovered(dist.id)}
                       onMouseLeave={() => setHovered(null)}
                       onClick={() => hasAccess && setSelected(dist.id)}
                       style={{
                          position: 'absolute',
                          left: dist.pos.x,
                          top: dist.pos.y,
                          cursor: hasAccess ? 'pointer' : 'not-allowed',
                          zIndex: isSelected ? 30 : 20,
                          transform: 'translate(-50%, -50%)',
                          transition: '0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                       }}
                  >
                      {/* Interaction Node */}
                      <div style={{
                          width: isSelected ? '80px' : '50px',
                          height: isSelected ? '80px' : '50px',
                          background: isSelected ? dist.color : (hasAccess ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.4)'),
                          border: isSelected ? '6px solid white' : (hovered === dist.id ? '4px solid white' : '2px solid rgba(255,255,255,0.3)'),
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: isSelected ? `0 0 50px ${dist.color}` : 'none',
                          transition: '0.3s'
                      }}>
                          {isSelected && <span style={{ color: 'black', fontWeight: '900', fontSize: '2rem' }}>!</span>}
                      </div>

                      {/* District Indicators (Always visible if accessed) */}
                      {hasAccess && (
                          <div style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '5px' }}>
                              {dist.shops && <div style={{ width: '20px', height: '20px', background: '#ffea00', borderRadius: '50%', border: '2px solid white', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black' }}>🛒</div>}
                              {dist.events && <div style={{ width: '20px', height: '20px', background: '#ff00ea', borderRadius: '50%', border: '2px solid white', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black' }}>🏆</div>}
                              {districtNPCs.length > 0 && <div style={{ width: '20px', height: '20px', background: 'var(--accent-cyan)', borderRadius: '50%', border: '2px solid white', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black' }}>👥</div>}
                          </div>
                      )}

                      <div style={{ position: 'absolute', top: '120%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', textShadow: '0 2px 4px black' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: '900', letterSpacing: '1px', opacity: isSelected ? 1 : 0.6 }}>{dist.name.toUpperCase()}</span>
                      </div>
                  </div>
              );
          })}
      </div>

      {/* Info Panel (Bottom Left) */}
      {selected ? (
          <div className="glass-panel slide-up" style={{
              position: 'absolute',
              bottom: '40px',
              left: '40px',
              right: '40px',
              height: '300px',
              display: 'grid',
              gridTemplateColumns: '1fr 300px',
              gap: '40px',
              padding: '40px',
              background: 'rgba(5,5,15,0.95)',
              borderBottom: `15px solid ${allDistricts.find(d => d.id === selected)?.color}`,
              zIndex: 100,
              boxShadow: '0 -20px 50px rgba(0,0,0,0.5)'
          }}>
              <div>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                    <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{selected.replace('_', ' ')}</h2>
                    <div style={{ padding: '5px 15px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '0.7rem' }}>CHAPTER {state.profile.progress.chapter}</div>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', lineHeight: '1.5', maxWidth: '800px' }}>
                    {allDistricts.find(d => d.id === selected)?.description}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '30px', marginTop: '30px' }}>
                      <div className="map-stat">
                          <span className="stat-label">RESIDENT NPCs</span>
                          <span className="stat-value">{getNPCsInDistrict(selected).map(n => n.name).join(', ') || 'NONE'}</span>
                      </div>
                      <div className="map-stat">
                          <span className="stat-label">FACILITIES</span>
                          <span className="stat-value">{[... (allDistricts.find(d => d.id === selected)?.shops ? ['Shop'] : []), ... (allDistricts.find(d => d.id === selected)?.events ? ['Arena'] : [])].join(' • ') || 'Residential'}</span>
                      </div>
                  </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'center' }}>
                  <button className="champion-button" onClick={() => handleTravel(selected)} style={{ borderColor: 'var(--accent-cyan)', background: 'white', color: 'black' }}>
                      BOARD TRAIN
                  </button>
                  <button className="neo-button" onClick={() => setSelected(null)}>CANCEL</button>
              </div>
          </div>
      ) : (
          <div style={{ position: 'absolute', bottom: '40px', left: '40px', opacity: 0.5, letterSpacing: '4px', fontSize: '0.8rem' }}>
            SELECT A STATION NODE TO VIEW DISTRICT INTEL
          </div>
      )}

      {/* Floating HUD Elements */}
      <div style={{ position: 'absolute', top: '150px', right: '40px', textAlign: 'right' }}>
          <div style={{ fontSize: '3rem', fontWeight: '900', opacity: 0.1 }}>GPS_LNK</div>
          <div style={{ width: '200px', height: '2px', background: 'rgba(255,255,255,0.1)', margin: '10px 0 10px auto' }}></div>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>LOCAL_TIME: {state.timeOfDay}</div>
      </div>

      <style>{`
          .stat-label { display: block; font-size: 0.6rem; color: var(--text-secondary); letterSpacing: '2px'; }
          .stat-value { font-size: 1rem; font-weight: bold; color: var(--accent-cyan); }
          .slide-up { animation: slideUp 0.4s cubic-bezier(0.19, 1, 0.22, 1); }
          .exit-zoom { animation: exitZoom 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          
          @keyframes slideUp {
              from { transform: translateY(100px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
          }
          @keyframes exitZoom {
              to { transform: scale(3); opacity: 0; filter: blur(20px); }
          }
      `}</style>
    </div>
  );
};
