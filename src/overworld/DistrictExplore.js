import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useGame } from '../core/GameStateContext';
import { DISTRICT_LOCATIONS } from '../data/locations';
import { NPCS } from '../npc/npcs';
import { SystemMenu } from '../ui/SystemMenu';
import '../styles/SceneVisuals.css';
export const DistrictExplore = () => {
    const { state, setScene, advanceTime } = useGame();
    const [currentLocId, setCurrentLocId] = useState(null);
    const [activeDialogue, setActiveDialogue] = useState(null);
    const [typedText, setTypedText] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [statusText, setStatusText] = useState('District link stable.');
    const districtScenes = DISTRICT_LOCATIONS[state.location] || [];
    const jumpMap = useMemo(() => ({
        'deck-editor': 'DECK_EDITOR',
        apartment: 'APARTMENT',
        transit: 'TRANSIT',
        tournament: 'TOURNAMENT',
        battle: 'BATTLE',
        store: 'STORE',
        profile: 'PROFILE'
    }), []);
    useEffect(() => {
        var _a, _b;
        setCurrentLocId((_b = (_a = districtScenes[0]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null);
        setActiveDialogue(null);
    }, [state.location, districtScenes]);
    useEffect(() => {
        if (!activeDialogue)
            return undefined;
        setTypedText('');
        let i = 0;
        const interval = window.setInterval(() => {
            setTypedText(activeDialogue.text.slice(0, i + 1));
            i += 1;
            if (i >= activeDialogue.text.length)
                window.clearInterval(interval);
        }, 24);
        return () => window.clearInterval(interval);
    }, [activeDialogue]);
    useEffect(() => {
        if (!statusText)
            return undefined;
        const timeout = window.setTimeout(() => setStatusText(''), 2800);
        return () => window.clearTimeout(timeout);
    }, [statusText]);
    const currentLoc = districtScenes.find((location) => location.id === currentLocId) || districtScenes[0];
    const resolveSceneJump = (targetId) => {
        if (!targetId)
            return null;
        if (jumpMap[targetId])
            return jumpMap[targetId];
        return targetId.replace(/-/g, '_').toUpperCase();
    };
    const advanceTimeLabel = () => {
        if (state.timeOfDay === 'MORNING')
            return 'AFTERNOON';
        if (state.timeOfDay === 'AFTERNOON')
            return 'EVENING';
        return 'MORNING';
    };
    const handleAction = (action) => {
        if (action.type === 'SCENE_JUMP') {
            setIsTransitioning(true);
            setStatusText(`Routing to ${action.label.toUpperCase()}...`);
            window.setTimeout(() => {
                const destination = districtScenes.find((location) => location.id === action.targetId);
                if (destination) {
                    setCurrentLocId(destination.id);
                    setStatusText(`Local route changed to ${destination.name}.`);
                }
                else {
                    const nextScene = resolveSceneJump(action.targetId);
                    if (nextScene)
                        setScene(nextScene);
                    else
                        setStatusText('Route target unavailable.');
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
    if (!currentLoc)
        return _jsx("div", { style: { background: 'black', height: '100vh' }, children: "INITIALIZING METRO RELAY..." });
    return (_jsxs("div", { className: "explore-container fade-in", style: { height: '100vh', position: 'relative', overflow: 'hidden', background: '#000' }, children: [_jsxs("div", { className: `scene-background-container ${isTransitioning ? 'location-exit' : 'location-enter'}`, style: { transition: 'opacity 0.4s ease' }, children: [_jsx("div", { className: "alive-background", style: { backgroundImage: `url(${currentLoc.backgroundImage})` } }), _jsx("div", { className: "data-overlay" }), _jsx("div", { className: "particle-field", children: [...Array(20)].map((_, index) => (_jsx("div", { className: "data-particle", style: { left: `${(index * 13) % 100}%`, top: `${(index * 17) % 100}%`, animationDelay: `${(index % 7) * 0.8}s`, opacity: 0.18 + ((index % 4) * 0.09) } }, index))) })] }), _jsxs("div", { style: { position: 'absolute', top: 40, left: 40, zIndex: 10, display: 'flex', alignItems: 'center', gap: '20px' }, children: [_jsxs("div", { className: "glass-panel", style: { padding: '15px 30px', borderLeft: '5px solid var(--accent-cyan)', background: 'rgba(5,5,15,0.8)' }, children: [_jsx("div", { style: { fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '4px' }, children: "ACTIVE CLUB //" }), _jsx("div", { style: { fontSize: '1.4rem', fontWeight: 900 }, children: currentLoc.name.toUpperCase() })] }), _jsxs("div", { className: "glass-panel", style: { padding: '15px 30px', background: 'rgba(5,5,15,0.8)' }, children: [_jsx("div", { style: { fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '2px' }, children: "CHASE PHASE //" }), _jsx("div", { style: { fontWeight: 'bold', color: 'var(--accent-yellow)', fontSize: '1.2rem' }, children: state.timeOfDay })] })] }), !activeDialogue && (_jsxs("div", { className: "district-nav-status glass-panel", children: [_jsx("div", { className: "district-nav-status-label", children: "ROUTE STATUS" }), _jsx("div", { className: "district-nav-status-value", children: statusText || 'Standing by.' }), _jsxs("div", { className: "district-nav-breadcrumb", children: [_jsx("span", { children: state.location.replace(/_/g, ' ') }), _jsx("span", { children: "/" }), _jsx("span", { children: currentLoc.name })] })] })), !activeDialogue && (_jsxs("div", { style: { position: 'absolute', right: 60, bottom: 60, zIndex: 10, display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-end' }, children: [currentLoc.actions.map((action, index) => (_jsxs("button", { className: "champion-button", style: { minWidth: '320px', minHeight: '74px', background: 'rgba(5,5,15,0.9)' }, onClick: () => handleAction(action), children: [_jsxs("span", { className: "btn-number", children: ["0", index + 1] }), _jsxs("span", { className: "btn-copy", children: [_jsx("span", { className: "btn-text", children: action.label.toUpperCase() }), _jsxs("span", { className: "btn-caption", children: [action.type.replace('_', ' '), " ROUTE"] })] })] }, `${action.label}-${index}`))), _jsx("div", { style: { height: '20px' } }), _jsx("button", { className: "neo-button", style: { fontSize: '0.7rem' }, onClick: () => setShowSettings(true), children: "SYSTEM_OS_v2.0" }), _jsx("button", { className: "neo-button", style: { fontSize: '0.7rem' }, onClick: () => setScene('TRANSIT'), children: "TRANSIT_GRID" })] })), !activeDialogue && (_jsxs("div", { className: "glass-panel fade-in", style: { position: 'absolute', left: 60, bottom: 60, width: '450px', padding: '30px', zIndex: 10, background: 'rgba(5,5,15,0.7)', borderBottom: '2px solid rgba(255,255,255,0.1)' }, children: [_jsx("div", { style: { fontSize: '0.6rem', color: 'var(--accent-cyan)', marginBottom: '10px', letterSpacing: '4px' }, children: "CIRCUIT_SCOUTER //" }), _jsxs("p", { style: { margin: 0, fontSize: '1rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, fontStyle: 'italic', fontWeight: 300 }, children: ["\"", currentLoc.description, "\""] })] })), activeDialogue && (_jsx("div", { className: "dialogue-overlay fade-in", style: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }, children: _jsxs("div", { style: { position: 'relative', width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '40px' }, children: [_jsxs("div", { className: "dialogue-box", style: { width: '100%', minHeight: '220px' }, onClick: () => setActiveDialogue(null), children: [_jsxs("div", { className: "dialogue-name-tag", style: { background: activeDialogue.npc.avatarColor }, children: [activeDialogue.npc.name.toUpperCase(), " // ", activeDialogue.npc.role.toUpperCase()] }), _jsx("div", { className: "typing-text", style: { fontSize: '1.8rem' }, children: typedText }), _jsx("div", { style: { position: 'absolute', right: 30, bottom: 20, fontSize: '0.7rem', color: 'var(--accent-cyan)', animation: 'pulse 1s infinite' }, children: "[ CLICK TO ADVANCE ]" })] }), _jsxs("div", { style: { display: 'flex', gap: '20px' }, children: [activeDialogue.npc.deck && _jsx("button", { className: "neo-button primary", style: { width: '250px' }, onClick: () => setScene('BATTLE'), children: "CHALLENGE TO DUEL" }), _jsx("button", { className: "neo-button", style: { width: '150px' }, onClick: () => setActiveDialogue(null), children: "END CONVERSATION" })] })] }) })), showSettings && _jsx(SystemMenu, { onClose: () => setShowSettings(false) }), _jsx("style", { children: `
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
      ` })] }));
};
