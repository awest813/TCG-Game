import React, { useMemo, useState } from 'react';
import { useGame } from '../core/GameContext';
import { NPCS } from '../npc/npcs';
import { getDistrictChampion, getDistrictProfile } from '../visual-novel/world';

type DistrictNode = {
  id: string;
  name: string;
  description: string;
  color: string;
  pos: { x: string; y: string };
  shops: boolean;
  events: boolean;
};

const ALL_DISTRICTS: DistrictNode[] = [
  { id: 'SUNSET_TERMINAL', name: 'Sunset Terminal', description: 'Home territory. Casual duels and local energy.', color: '#00f2ff', pos: { x: '25%', y: '65%' }, shops: true, events: true },
  { id: 'MARKET_CENTRAL', name: 'Market Central', description: "The city's major trade artery. High-volume card exchange.", color: '#ffea00', pos: { x: '45%', y: '48%' }, shops: true, events: false },
  { id: 'NEON_MISSION', name: 'Neon Mission', description: 'Flashy arcade culture. Fast-paced combo duels.', color: '#ff00ea', pos: { x: '68%', y: '35%' }, shops: false, events: true },
  { id: 'BAYLINE_WHARF', name: 'Bayline Wharf', description: 'Atmospheric waterfront. Elite Tide trials.', color: '#00aaff', pos: { x: '48%', y: '78%' }, shops: true, events: true },
  { id: 'REDWOOD_HEIGHTS', name: 'Redwood Heights', description: 'Luxury rooftop gardens. Prestige duels.', color: '#7a00ff', pos: { x: '28%', y: '25%' }, shops: false, events: false },
  { id: 'CIVIC_CROWN', name: 'Civic Crown', description: 'The pinnacle. Sanctioned league grand finals.', color: '#ffffff', pos: { x: '82%', y: '18%' }, shops: true, events: true }
];

export const TransitStation: React.FC = () => {
  const { state, setScene, updateGameState } = useGame();
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(state.location);
  const [routeStatus, setRouteStatus] = useState('Select a district node to view route intel.');
  const [isClosing, setIsClosing] = useState(false);

  const unlocked = state.profile.progress.unlockedDistricts;
  const activeDistrict = useMemo(() => ALL_DISTRICTS.find((district) => district.id === selected) ?? null, [selected]);
  const activeDistrictProfile = useMemo(() => (selected ? getDistrictProfile(selected) : null), [selected]);
  const activeDistrictChampion = useMemo(() => (selected ? getDistrictChampion(selected) : null), [selected]);

  const getNPCsInDistrict = (id: string) => NPCS.filter((npc) => npc.location === id && npc.activeTimes.includes(state.timeOfDay));

  const handleTravel = (id: string) => {
    setRouteStatus(`Routing train to ${id.replace(/_/g, ' ')}...`);
    updateGameState({ location: id });
    setIsClosing(true);
    window.setTimeout(() => setScene('DISTRICT_EXPLORE'), 800);
  };

  return (
    <div
      className={`transit-app-scene ${isClosing ? 'exit-zoom' : 'fade-in'}`}
      style={{
        height: '100vh',
        background: 'rgb(5,10,25)',
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,242,255,0.05) 0%, transparent 70%), url("/rotom_map_bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: '"Outfit", sans-serif'
      }}
    >
      <div style={{ padding: '30px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', borderBottom: '2px solid rgba(255,255,255,0.1)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--accent-cyan)', borderRadius: '10px', boxShadow: '0 0 15px var(--accent-cyan)' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', letterSpacing: '2px' }}>
              NEO-RAIL GPS <span style={{ color: 'var(--accent-cyan)' }}>v4.0</span>
            </h1>
            <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>SYNCHRONIZED WITH GLOBAL CHAMPION CIRCUIT</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{state.timeOfDay} // {new Date().toLocaleTimeString()}</div>
          <div style={{ fontSize: '0.6rem', color: 'var(--accent-cyan)', marginTop: '2px' }}>METRO GRID: CONNECTED</div>
        </div>
      </div>

      <div className="transit-status-strip">
        <div>
          <div className="transit-status-label">CURRENT DOCK</div>
          <div className="transit-status-value">{state.location.replace(/_/g, ' ')}</div>
        </div>
        <div>
          <div className="transit-status-label">ROUTE FEED</div>
          <div className="transit-status-value">{routeStatus}</div>
        </div>
        <button className="neo-button" onClick={() => setScene('APARTMENT')}>RETURN HOME</button>
      </div>

      {activeDistrict && activeDistrictProfile && (
        <div
          className="glass-panel fade-in"
          style={{
            position: 'absolute',
            top: '182px',
            left: '40px',
            width: 'min(420px, calc(100vw - 80px))',
            zIndex: 85,
            padding: '20px 22px',
            background: 'rgba(13,10,12,0.82)',
            borderTop: `3px solid ${activeDistrict.color}`
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.18rem', color: activeDistrictProfile.crestColor, textTransform: 'uppercase' }}>
                {activeDistrictProfile.arcTitle}
              </div>
              <div style={{ marginTop: '6px', fontSize: '1.35rem', fontWeight: 800 }}>{activeDistrict.name}</div>
            </div>
            <div style={{ padding: '0.45rem 0.7rem', borderRadius: '999px', border: `1px solid ${activeDistrictProfile.crestColor}`, color: activeDistrictProfile.crestColor, fontSize: '0.68rem', letterSpacing: '0.12rem' }}>
              {activeDistrictProfile.crest}
            </div>
          </div>

          <div style={{ marginTop: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{activeDistrictProfile.slogan}</div>

          <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <div className="transit-status-label">STYLE</div>
              <div className="transit-status-value" style={{ fontSize: '0.9rem' }}>{activeDistrictProfile.signatureStyle}</div>
            </div>
            <div>
              <div className="transit-status-label">CHAMPION</div>
              <div className="transit-status-value" style={{ fontSize: '0.9rem' }}>
                {activeDistrictChampion ? activeDistrictChampion.name : 'Unknown'}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ height: '100%', width: '100%', position: 'relative' }}>
        <div className="transit-grid-lines" />
        {ALL_DISTRICTS.map((district) => {
          const hasAccess = unlocked.includes(district.id);
          const districtNPCs = getNPCsInDistrict(district.id);
          const isSelected = selected === district.id;

          return (
            <div
              key={district.id}
              onMouseEnter={() => {
                setHovered(district.id);
                setRouteStatus(hasAccess ? `Previewing ${district.name}.` : `${district.name} is currently locked.`);
              }}
              onMouseLeave={() => {
                setHovered(null);
                setRouteStatus(activeDistrict ? `Route ready for ${activeDistrict.name}.` : 'Select a district node to view route intel.');
              }}
              onClick={() => hasAccess && setSelected(district.id)}
              style={{
                position: 'absolute',
                left: district.pos.x,
                top: district.pos.y,
                cursor: hasAccess ? 'pointer' : 'not-allowed',
                zIndex: isSelected ? 30 : 20,
                transform: 'translate(-50%, -50%)',
                transition: '0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              <div
                style={{
                  width: isSelected ? '80px' : '50px',
                  height: isSelected ? '80px' : '50px',
                  background: isSelected ? district.color : hasAccess ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.4)',
                  border: isSelected ? '6px solid white' : hovered === district.id ? '4px solid white' : '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isSelected ? `0 0 50px ${district.color}` : 'none',
                  transition: '0.3s'
                }}
              >
                {isSelected && <span style={{ color: 'black', fontWeight: '900', fontSize: '2rem' }}>!</span>}
              </div>

              {hovered === district.id && <div className="transit-pulse-ring" style={{ borderColor: district.color }} />}

              {hasAccess && (
                <div style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '5px' }}>
                  {district.shops && <div style={{ width: '20px', height: '20px', background: '#ffea00', borderRadius: '50%', border: '2px solid white' }} />}
                  {district.events && <div style={{ width: '20px', height: '20px', background: '#ff00ea', borderRadius: '50%', border: '2px solid white' }} />}
                  {districtNPCs.length > 0 && <div style={{ width: '20px', height: '20px', background: 'var(--accent-cyan)', borderRadius: '50%', border: '2px solid white' }} />}
                </div>
              )}

              <div style={{ position: 'absolute', top: '120%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', textShadow: '0 2px 4px black' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '900', letterSpacing: '1px', opacity: isSelected ? 1 : 0.6 }}>{district.name.toUpperCase()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {selected && activeDistrict ? (
        <div className="glass-panel slide-up" style={{ position: 'absolute', bottom: '40px', left: '40px', right: '40px', height: '300px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px', padding: '40px', background: 'rgba(5,5,15,0.95)', borderBottom: `15px solid ${activeDistrict.color}`, zIndex: 100, boxShadow: '0 -20px 50px rgba(0,0,0,0.5)' }}>
          <div>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{activeDistrict.name}</h2>
              <div style={{ padding: '5px 15px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '0.7rem' }}>CHAPTER {state.profile.progress.chapter}</div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', lineHeight: '1.5', maxWidth: '800px' }}>{activeDistrict.description}</p>
            {activeDistrictProfile && (
              <div style={{ marginTop: '18px', padding: '14px 16px', borderRadius: '18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.64rem', color: activeDistrictProfile.crestColor, letterSpacing: '0.18rem', textTransform: 'uppercase' }}>VN Route Dossier</div>
                <div style={{ marginTop: '8px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{activeDistrictProfile.atmosphere}</div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '30px', marginTop: '30px' }}>
              <div className="map-stat">
                <span className="stat-label">RESIDENT NPCS</span>
                <span className="stat-value">{getNPCsInDistrict(selected).map((npc) => npc.name).join(', ') || 'NONE'}</span>
              </div>
              <div className="map-stat">
                <span className="stat-label">FACILITIES</span>
                <span className="stat-value">{[...(activeDistrict.shops ? ['Shop'] : []), ...(activeDistrict.events ? ['Arena'] : [])].join(' / ') || 'Residential'}</span>
              </div>
              {activeDistrictChampion && (
                <div className="map-stat">
                  <span className="stat-label">RIVAL TO WATCH</span>
                  <span className="stat-value">{activeDistrictChampion.name}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'center' }}>
            <button className="champion-button champion-button-primary compact" onClick={() => handleTravel(selected)} style={{ color: 'black' }}>BOARD TRAIN</button>
            <button className="neo-button" onClick={() => setSelected(null)}>CANCEL</button>
          </div>
        </div>
      ) : (
        <div style={{ position: 'absolute', bottom: '40px', left: '40px', opacity: 0.5, letterSpacing: '4px', fontSize: '0.8rem' }}>SELECT A STATION NODE TO VIEW DISTRICT INTEL</div>
      )}

      <div style={{ position: 'absolute', top: '170px', right: '40px', textAlign: 'right' }}>
        <div style={{ fontSize: '3rem', fontWeight: '900', opacity: 0.1 }}>GPS_LNK</div>
        <div style={{ width: '200px', height: '2px', background: 'rgba(255,255,255,0.1)', margin: '10px 0 10px auto' }} />
        <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>LOCAL_TIME: {state.timeOfDay}</div>
      </div>

      <style>{`
        .stat-label { display: block; font-size: 0.6rem; color: var(--text-secondary); letter-spacing: 2px; }
        .stat-value { font-size: 1rem; font-weight: bold; color: var(--accent-cyan); }
        .slide-up { animation: slideUp 0.4s cubic-bezier(0.19, 1, 0.22, 1); }
        .exit-zoom { animation: exitZoom 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .transit-status-strip {
          position: absolute;
          top: 110px;
          left: 40px;
          right: 40px;
          z-index: 80;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 16px 22px;
          background: rgba(5,5,15,0.7);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
        }
        .transit-status-label { font-size: 0.65rem; letter-spacing: 0.16rem; color: var(--text-secondary); }
        .transit-status-value { margin-top: 4px; font-size: 0.95rem; font-weight: 700; }
        .transit-grid-lines {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(121,247,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(121,247,255,0.06) 1px, transparent 1px);
          background-size: 120px 120px;
          mask-image: linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%);
          pointer-events: none;
        }
        .transit-pulse-ring {
          position: absolute;
          inset: -18px;
          border: 2px solid;
          border-radius: 999px;
          animation: transitPulse 1.6s ease-out infinite;
          pointer-events: none;
        }
        @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes transitPulse { 0% { transform: scale(0.85); opacity: 0.9; } 100% { transform: scale(1.4); opacity: 0; } }
        @keyframes exitZoom { to { transform: scale(3); opacity: 0; filter: blur(20px); } }
      `}</style>
    </div>
  );
};
