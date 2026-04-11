import React, { useMemo, useState } from 'react';
import { useGame } from '../core/GameContext';
import { getTrainerById } from '../data/trainers';
import { NPCS } from '../npc/npcs';
import { getDistrictChampion, getDistrictProfile } from '../visual-novel/world';
import { nextCircuitQuest } from '../core/circuitProgression';
import { TutorialGuide } from './TutorialGuide';
import '../styles/SonsotyoScenes.css';

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
  { id: 'SUNSET_TERMINAL', name: 'Sunset Terminal', description: 'Home territory. Casual duels and local energy.', color: '#7ef2ff', pos: { x: '25%', y: '65%' }, shops: true, events: true },
  { id: 'MARKET_CENTRAL', name: 'Market Central', description: "The city's major trade artery. High-volume card exchange.", color: '#ffe39a', pos: { x: '45%', y: '48%' }, shops: true, events: false },
  { id: 'NEON_MISSION', name: 'Neon Mission', description: 'Flashy arcade culture. Fast-paced combo duels.', color: '#ff8ac6', pos: { x: '68%', y: '35%' }, shops: false, events: true },
  { id: 'BAYLINE_WHARF', name: 'Bayline Wharf', description: 'Atmospheric waterfront. Elite Tide trials.', color: '#55c5ff', pos: { x: '48%', y: '78%' }, shops: true, events: true },
  { id: 'REDWOOD_HEIGHTS', name: 'Redwood Heights', description: 'Luxury rooftop gardens. Prestige duels.', color: '#b6b2ff', pos: { x: '28%', y: '25%' }, shops: false, events: false },
  { id: 'CIVIC_CROWN', name: 'Civic Crown', description: 'The pinnacle. Sanctioned league grand finals.', color: '#ffffff', pos: { x: '82%', y: '18%' }, shops: true, events: true }
];

const LUCY = getTrainerById('lucy');

const TRANSIT_PRACTICE_DRILLS = [
  'Gold chip under a node: that district still has boutique inventory on the line.',
  'Pink chip: arena brackets fire there—good for streak practice before league night.',
  'Cyan chip: handlers and story beats are clocked in on the platform.',
  'Locked nodes stay dark until your clearance list updates from the apartment arc.',
  'After you pick a node, read District Intel, then Board Train—no partial jumps.',
  'If the route feed stalls, re-hover the ring to wake the GPS echo.'
];

export const TransitStation: React.FC = () => {
  const { state, setScene, updateGameState, updateProfile } = useGame();
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(state.location);
  const [routeStatus, setRouteStatus] = useState('Select a district node to view route intel.');
  const [isClosing, setIsClosing] = useState(false);
  const [lucyBriefingSessionHidden, setLucyBriefingSessionHidden] = useState(false);
  const [lucyReplayBriefing, setLucyReplayBriefing] = useState(false);
  const [practiceDrillIndex, setPracticeDrillIndex] = useState(0);

  const lucyPortrait = LUCY?.avatarPath ?? '/lucy_tutorial.png';
  const flags = state.profile.progress.flags;
  const transitGridIntroDone = Boolean(flags.transitLucyGridIntroDone || flags.transitLucyBriefingDismissed);
  const showLucyIntroOverlay =
    ((!transitGridIntroDone && !lucyBriefingSessionHidden) || lucyReplayBriefing) && !isClosing;

  const markGridIntroDone = () => {
    const mergedFlags = {
      ...state.profile.progress.flags,
      transitLucyGridIntroDone: true,
      transitLucyBriefingDismissed: true
    };
    updateProfile({
      progress: {
        ...state.profile.progress,
        flags: mergedFlags
      }
    });
    updateGameState({ currentQuest: nextCircuitQuest(mergedFlags) });
    setLucyReplayBriefing(false);
  };

  const unlocked = state.profile.progress.unlockedDistricts;
  const activeDistrict = useMemo(() => ALL_DISTRICTS.find((district) => district.id === selected) ?? null, [selected]);
  const activeDistrictProfile = useMemo(() => (selected ? getDistrictProfile(selected) : null), [selected]);
  const activeDistrictChampion = useMemo(() => (selected ? getDistrictChampion(selected) : null), [selected]);
  const getNPCsInDistrict = (id: string) => NPCS.filter((npc) => npc.location === id && npc.activeTimes.includes(state.timeOfDay));

  const handleTravel = (id: string) => {
    if (!unlocked.includes(id)) {
      setRouteStatus('Clearance denied — that district is still locked.');
      return;
    }
    setRouteStatus(`Routing train to ${id.replace(/_/g, ' ')}...`);
    updateGameState({ location: id, transitReturn: null });
    setIsClosing(true);
    window.setTimeout(() => setScene('DISTRICT_EXPLORE'), 800);
  };

  const exitTransit = () => {
    const back = state.transitReturn ?? 'APARTMENT';
    updateGameState({ transitReturn: null, currentScene: back });
  };

  return (
    <div
      className={`transit-app-scene sonsotyo-scene ${isClosing ? 'exit-zoom' : 'fade-in'}`}
      style={{
        height: '100vh',
        background:
          'linear-gradient(180deg, rgba(8,10,18,0.82), rgba(4,6,10,0.94)), radial-gradient(circle at 50% 50%, rgba(126,242,255,0.08), transparent 44%), url("/rotom_map_bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div className="sonsotyo-overlay" />
      <div className="sonsotyo-content" style={{ position: 'absolute', inset: 0, padding: '30px', display: 'grid', gridTemplateRows: 'auto auto 1fr auto', gap: '18px' }}>
        <div className="sonsotyo-hero">
          <div className="glass-panel sonsotyo-hero-card">
            <div className="sonsotyo-kicker">Neo-Rail GPS v4.0</div>
            <h1 className="sonsotyo-title" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', marginTop: '10px' }}>Transit Grid</h1>
            <p className="sonsotyo-copy" style={{ maxWidth: '42ch', marginTop: '12px' }}>
              Sleep-city route planning for rival circuits, market detours, and late-night district hopping.
            </p>
          </div>
          <div className="glass-panel sonsotyo-panel">
            <div className="sonsotyo-kicker">Grid Status</div>
            <div style={{ marginTop: '12px', display: 'grid', gap: '10px' }}>
              <div className="sonsotyo-diagnostic">
                <span>Current Dock</span>
                <span className="sonsotyo-value">{state.location.replace(/_/g, ' ')}</span>
              </div>
              <div className="sonsotyo-diagnostic">
                <span>Local Time</span>
                <span className="sonsotyo-value">{state.timeOfDay}</span>
              </div>
              <div className="sonsotyo-diagnostic">
                <span>Route Feed</span>
                <span className="sonsotyo-value">{routeStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {activeDistrict && activeDistrictProfile && (
          <div className="glass-panel sonsotyo-panel" style={{ borderTop: `3px solid ${activeDistrict.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div>
                <div className="sonsotyo-kicker" style={{ color: activeDistrictProfile.crestColor }}>{activeDistrictProfile.arcTitle}</div>
                <div style={{ marginTop: '8px', fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>{activeDistrict.name}</div>
              </div>
              <div className="sonsotyo-pill" style={{ color: activeDistrictProfile.crestColor }}>{activeDistrictProfile.crest}</div>
            </div>
            <div className="sonsotyo-copy" style={{ marginTop: '12px' }}>{activeDistrictProfile.slogan}</div>
          </div>
        )}

        <div style={{ position: 'relative' }}>
          <div className="glass-panel sonsotyo-panel" style={{ position: 'absolute', inset: 0, background: 'rgba(8,10,18,0.34)' }} />
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
                style={{ position: 'absolute', left: district.pos.x, top: district.pos.y, cursor: hasAccess ? 'pointer' : 'not-allowed', zIndex: isSelected ? 30 : 20, transform: 'translate(-50%, -50%)', transition: '0.3s' }}
              >
                <div
                  style={{
                    width: isSelected ? '82px' : '52px',
                    height: isSelected ? '82px' : '52px',
                    background: isSelected ? district.color : hasAccess ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.4)',
                    border: isSelected ? '6px solid white' : hovered === district.id ? '4px solid white' : '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isSelected ? `0 0 50px ${district.color}` : 'none'
                  }}
                >
                  {isSelected && <span style={{ color: '#04101a', fontWeight: 900, fontSize: '2rem' }}>!</span>}
                </div>
                {hovered === district.id && <div className="transit-pulse-ring" style={{ borderColor: district.color }} />}
                <div style={{ position: 'absolute', top: '-38px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                  {hasAccess && district.shops && <div style={{ width: '16px', height: '16px', background: '#ffe39a', borderRadius: '50%', border: '2px solid white' }} />}
                  {hasAccess && district.events && <div style={{ width: '16px', height: '16px', background: '#ff8ac6', borderRadius: '50%', border: '2px solid white' }} />}
                  {hasAccess && districtNPCs.length > 0 && <div style={{ width: '16px', height: '16px', background: 'var(--accent-primary)', borderRadius: '50%', border: '2px solid white' }} />}
                </div>
                <div style={{ position: 'absolute', top: '118%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', textShadow: '0 2px 4px black' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 900, letterSpacing: '1px', opacity: isSelected ? 1 : 0.65 }}>{district.name.toUpperCase()}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '18px' }}>
          {selected && activeDistrict ? (
            <>
              <div className="glass-panel sonsotyo-panel">
                <div className="sonsotyo-kicker">District Intel</div>
                <div style={{ marginTop: '10px', fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>{activeDistrict.name}</div>
                <p className="sonsotyo-copy" style={{ marginTop: '12px' }}>{activeDistrict.description}</p>
                {activeDistrictProfile && <div className="sonsotyo-copy" style={{ marginTop: '14px' }}>{activeDistrictProfile.atmosphere}</div>}
                <div style={{ marginTop: '18px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <TransitStat label="Resident NPCs" value={getNPCsInDistrict(selected).map((npc) => npc.name).join(', ') || 'NONE'} />
                  <TransitStat label="Facilities" value={[...(activeDistrict.shops ? ['Shop'] : []), ...(activeDistrict.events ? ['Arena'] : [])].join(' / ') || 'Residential'} />
                  <TransitStat label="Rival To Watch" value={activeDistrictChampion ? activeDistrictChampion.name : 'Unknown'} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
                <button className="neo-button primary" onClick={() => handleTravel(selected)}>Board Train</button>
                <button className="neo-button" onClick={() => setSelected(null)}>Cancel</button>
              </div>
            </>
          ) : (
            <div className="glass-panel sonsotyo-panel" style={{ gridColumn: '1 / -1' }}>
              <div className="sonsotyo-kicker">Selection Idle</div>
              <div style={{ marginTop: '8px', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>Select a station node to view district intel.</div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button className="neo-button" onClick={exitTransit}>
            {state.transitReturn === 'DISTRICT_EXPLORE' ? 'Back to streets' : 'Back to apartment'}
          </button>
        </div>
      </div>

      {transitGridIntroDone && !isClosing && (
        <div className="transit-lucy-dock" aria-live="polite">
          <div className="transit-lucy-dock-portrait">
            <img src={lucyPortrait} alt="" />
          </div>
          <div className="glass-panel transit-lucy-dock-panel">
            <div className="sonsotyo-kicker" style={{ color: 'var(--accent-yellow)' }}>
              Lucy // Practice channel
            </div>
            <div style={{ marginTop: '8px', fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 800 }}>
              Grid drills and etiquette
            </div>
            <p className="sonsotyo-copy" style={{ marginTop: '10px', fontSize: '0.88rem', lineHeight: 1.55 }}>
              {TRANSIT_PRACTICE_DRILLS[practiceDrillIndex]}
            </p>
            <div className="transit-lucy-dock-actions">
              <button type="button" className="neo-button" onClick={() => setPracticeDrillIndex((i) => (i + 1) % TRANSIT_PRACTICE_DRILLS.length)}>
                Next drill
              </button>
              <button type="button" className="neo-button primary" onClick={() => setLucyReplayBriefing(true)}>
                Replay briefing
              </button>
            </div>
          </div>
        </div>
      )}

      {showLucyIntroOverlay && (
        <TutorialGuide
          dimBackdrop
          onBackdropClick={() => {
            if (lucyReplayBriefing) setLucyReplayBriefing(false);
            else setLucyBriefingSessionHidden(true);
          }}
          portraitSrc={lucyPortrait}
          portraitAlt={`${LUCY?.name ?? 'Lucy'} — ${LUCY?.title ?? 'Circuit Guide'}`}
          title="Lucy // Transit Desk"
          subtitle="Neo-Rail orientation"
          message={`Hey, ${state.profile.name} — welcome to the grid. Every lit node is a district you are cleared for: tap it once to pull intel, then use Board Train when you are ready to drop into that route. Gold chips mean shops are open there; pink means arena brackets; cyan means someone on-site wants to talk.`}
          objective={state.currentQuest}
          actions={
            lucyReplayBriefing
              ? [
                  {
                    label: 'Close briefing',
                    variant: 'primary',
                    onClick: () => setLucyReplayBriefing(false)
                  }
                ]
              : [
                  {
                    label: 'Hide for this visit',
                    variant: 'secondary',
                    onClick: () => setLucyBriefingSessionHidden(true)
                  },
                  {
                    label: 'Continue to grid',
                    variant: 'primary',
                    onClick: markGridIntroDone
                  }
                ]
          }
        />
      )}

      <style>{`
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
        .exit-zoom { animation: exitZoom 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        @keyframes transitPulse { 0% { transform: scale(0.85); opacity: 0.9; } 100% { transform: scale(1.4); opacity: 0; } }
        @keyframes exitZoom { to { transform: scale(3); opacity: 0; filter: blur(20px); } }
        @media (max-width: 900px) {
          .transit-app-scene .sonsotyo-content { grid-template-rows: auto auto minmax(400px, 1fr) auto auto; }
        }
      `}</style>
    </div>
  );
};

const TransitStat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="glass-panel sonsotyo-panel" style={{ padding: '14px' }}>
    <div className="sonsotyo-kicker">{label}</div>
    <div style={{ marginTop: '8px', color: 'var(--accent-primary)', fontWeight: 700 }}>{value}</div>
  </div>
);
