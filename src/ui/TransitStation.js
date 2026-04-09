import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { useGame } from '../core/GameStateContext';
import { NPCS } from '../npc/npcs';
export const TransitStation = () => {
    const { state, setScene, updateGameState } = useGame();
    const [hovered, setHovered] = useState(null);
    const [selected, setSelected] = useState(state.location);
    const [routeStatus, setRouteStatus] = useState('Select a district node to view route intel.');
    const [isClosing, setIsClosing] = useState(false);
    const allDistricts = [
        { id: 'SUNSET_TERMINAL', name: 'Sunset Terminal', description: 'Home territory. Casual duels and local energy.', color: '#00f2ff', pos: { x: '25%', y: '65%' }, shops: true, events: true },
        { id: 'MARKET_CENTRAL', name: 'Market Central', description: "The city's major trade artery. High-volume card exchange.", color: '#ffea00', pos: { x: '45%', y: '48%' }, shops: true, events: false },
        { id: 'NEON_MISSION', name: 'Neon Mission', description: 'Flashy arcade culture. Fast-paced combo duels.', color: '#ff00ea', pos: { x: '68%', y: '35%' }, shops: false, events: true },
        { id: 'BAYLINE_WHARF', name: 'Bayline Wharf', description: 'Atmospheric waterfront. Elite Tide trials.', color: '#00aaff', pos: { x: '48%', y: '78%' }, shops: true, events: true },
        { id: 'REDWOOD_HEIGHTS', name: 'Redwood Heights', description: 'Luxury rooftop gardens. Prestige duels.', color: '#7a00ff', pos: { x: '28%', y: '25%' }, shops: false, events: false },
        { id: 'CIVIC_CROWN', name: 'Civic Crown', description: 'The pinnacle. Sanctioned league grand finals.', color: '#ffffff', pos: { x: '82%', y: '18%' }, shops: true, events: true }
    ];
    const unlocked = state.profile.progress.unlockedDistricts;
    const activeDistrict = useMemo(() => { var _a; return (_a = allDistricts.find((district) => district.id === selected)) !== null && _a !== void 0 ? _a : null; }, [allDistricts, selected]);
    const getNPCsInDistrict = (id) => NPCS.filter((npc) => npc.location === id && npc.activeTimes.includes(state.timeOfDay));
    const handleTravel = (id) => {
        setRouteStatus(`Routing train to ${id.replace(/_/g, ' ')}...`);
        updateGameState({ location: id });
        setIsClosing(true);
        window.setTimeout(() => setScene('DISTRICT_EXPLORE'), 800);
    };
    return (_jsxs("div", { className: `transit-app-scene ${isClosing ? 'exit-zoom' : 'fade-in'}`, style: {
            height: '100vh',
            background: 'rgb(5,10,25)',
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,242,255,0.05) 0%, transparent 70%), url("/rotom_map_bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            overflow: 'hidden',
            position: 'relative',
            fontFamily: '"Outfit", sans-serif'
        }, children: [_jsxs("div", { style: { padding: '30px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', borderBottom: '2px solid rgba(255,255,255,0.1)', zIndex: 100 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '20px' }, children: [_jsx("div", { style: { width: '40px', height: '40px', background: 'var(--accent-cyan)', borderRadius: '10px', boxShadow: '0 0 15px var(--accent-cyan)' } }), _jsxs("div", { children: [_jsxs("h1", { style: { margin: 0, fontSize: '1.5rem', fontWeight: '900', letterSpacing: '2px' }, children: ["NEO-RAIL GPS ", _jsx("span", { style: { color: 'var(--accent-cyan)' }, children: "v4.0" })] }), _jsx("div", { style: { fontSize: '0.6rem', opacity: 0.5 }, children: "SYNCHRONIZED WITH GLOBAL CHAMPION CIRCUIT" })] })] }), _jsxs("div", { style: { textAlign: 'right' }, children: [_jsxs("div", { style: { fontSize: '0.8rem', fontWeight: 'bold' }, children: [state.timeOfDay, " // ", new Date().toLocaleTimeString()] }), _jsx("div", { style: { fontSize: '0.6rem', color: 'var(--accent-cyan)', marginTop: '2px' }, children: "METRO GRID: CONNECTED" })] })] }), _jsxs("div", { className: "transit-status-strip", children: [_jsxs("div", { children: [_jsx("div", { className: "transit-status-label", children: "CURRENT DOCK" }), _jsx("div", { className: "transit-status-value", children: state.location.replace(/_/g, ' ') })] }), _jsxs("div", { children: [_jsx("div", { className: "transit-status-label", children: "ROUTE FEED" }), _jsx("div", { className: "transit-status-value", children: routeStatus })] }), _jsx("button", { className: "neo-button", onClick: () => setScene('APARTMENT'), children: "RETURN HOME" })] }), _jsxs("div", { style: { height: '100%', width: '100%', position: 'relative' }, children: [_jsx("div", { className: "transit-grid-lines" }), allDistricts.map((district) => {
                        const hasAccess = unlocked.includes(district.id);
                        const districtNPCs = getNPCsInDistrict(district.id);
                        const isSelected = selected === district.id;
                        return (_jsxs("div", { onMouseEnter: () => {
                                setHovered(district.id);
                                setRouteStatus(hasAccess ? `Previewing ${district.name}.` : `${district.name} is currently locked.`);
                            }, onMouseLeave: () => {
                                setHovered(null);
                                setRouteStatus(activeDistrict ? `Route ready for ${activeDistrict.name}.` : 'Select a district node to view route intel.');
                            }, onClick: () => hasAccess && setSelected(district.id), style: {
                                position: 'absolute',
                                left: district.pos.x,
                                top: district.pos.y,
                                cursor: hasAccess ? 'pointer' : 'not-allowed',
                                zIndex: isSelected ? 30 : 20,
                                transform: 'translate(-50%, -50%)',
                                transition: '0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            }, children: [_jsx("div", { style: {
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
                                    }, children: isSelected && _jsx("span", { style: { color: 'black', fontWeight: '900', fontSize: '2rem' }, children: "!" }) }), hovered === district.id && _jsx("div", { className: "transit-pulse-ring", style: { borderColor: district.color } }), hasAccess && (_jsxs("div", { style: { position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '5px' }, children: [district.shops && _jsx("div", { style: { width: '20px', height: '20px', background: '#ffea00', borderRadius: '50%', border: '2px solid white' } }), district.events && _jsx("div", { style: { width: '20px', height: '20px', background: '#ff00ea', borderRadius: '50%', border: '2px solid white' } }), districtNPCs.length > 0 && _jsx("div", { style: { width: '20px', height: '20px', background: 'var(--accent-cyan)', borderRadius: '50%', border: '2px solid white' } })] })), _jsx("div", { style: { position: 'absolute', top: '120%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', textShadow: '0 2px 4px black' }, children: _jsx("span", { style: { fontSize: '0.8rem', fontWeight: '900', letterSpacing: '1px', opacity: isSelected ? 1 : 0.6 }, children: district.name.toUpperCase() }) })] }, district.id));
                    })] }), selected && activeDistrict ? (_jsxs("div", { className: "glass-panel slide-up", style: { position: 'absolute', bottom: '40px', left: '40px', right: '40px', height: '300px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px', padding: '40px', background: 'rgba(5,5,15,0.95)', borderBottom: `15px solid ${activeDistrict.color}`, zIndex: 100, boxShadow: '0 -20px 50px rgba(0,0,0,0.5)' }, children: [_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }, children: [_jsx("h2", { style: { fontSize: '2.5rem', margin: 0 }, children: activeDistrict.name }), _jsxs("div", { style: { padding: '5px 15px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '0.7rem' }, children: ["CHAPTER ", state.profile.progress.chapter] })] }), _jsx("p", { style: { color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', lineHeight: '1.5', maxWidth: '800px' }, children: activeDistrict.description }), _jsxs("div", { style: { display: 'flex', gap: '30px', marginTop: '30px' }, children: [_jsxs("div", { className: "map-stat", children: [_jsx("span", { className: "stat-label", children: "RESIDENT NPCS" }), _jsx("span", { className: "stat-value", children: getNPCsInDistrict(selected).map((npc) => npc.name).join(', ') || 'NONE' })] }), _jsxs("div", { className: "map-stat", children: [_jsx("span", { className: "stat-label", children: "FACILITIES" }), _jsx("span", { className: "stat-value", children: [...(activeDistrict.shops ? ['Shop'] : []), ...(activeDistrict.events ? ['Arena'] : [])].join(' / ') || 'Residential' })] })] })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'center' }, children: [_jsx("button", { className: "champion-button champion-button-primary compact", onClick: () => handleTravel(selected), style: { color: 'black' }, children: "BOARD TRAIN" }), _jsx("button", { className: "neo-button", onClick: () => setSelected(null), children: "CANCEL" })] })] })) : (_jsx("div", { style: { position: 'absolute', bottom: '40px', left: '40px', opacity: 0.5, letterSpacing: '4px', fontSize: '0.8rem' }, children: "SELECT A STATION NODE TO VIEW DISTRICT INTEL" })), _jsxs("div", { style: { position: 'absolute', top: '170px', right: '40px', textAlign: 'right' }, children: [_jsx("div", { style: { fontSize: '3rem', fontWeight: '900', opacity: 0.1 }, children: "GPS_LNK" }), _jsx("div", { style: { width: '200px', height: '2px', background: 'rgba(255,255,255,0.1)', margin: '10px 0 10px auto' } }), _jsxs("div", { style: { fontSize: '0.7rem', color: 'var(--accent-cyan)' }, children: ["LOCAL_TIME: ", state.timeOfDay] })] }), _jsx("style", { children: `
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
      ` })] }));
};
