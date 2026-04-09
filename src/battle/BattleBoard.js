import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useBattle } from './useBattle';
import { useGame } from '../core/GameStateContext';
import { getCardById } from '../data/cards';
export const BattleBoard = () => {
    var _a;
    const { state, setScene } = useGame();
    const [showVS, setShowVS] = useState(true);
    const [hoveredCard, setHoveredCard] = useState(null);
    const { battleState, playCard, attack, endTurn } = useBattle(state.profile.inventory.deck, ['ziprail', 'neon-striker', 'voltlynx', 'overdrive-fox', 'quick-transfer', 'ziprail']);
    useEffect(() => {
        const timer = window.setTimeout(() => setShowVS(false), 2500);
        return () => window.clearTimeout(timer);
    }, []);
    const activeField = battleState.field;
    const isPlayerTurn = battleState.isPlayerTurn;
    const fieldStyle = useMemo(() => {
        switch (activeField) {
            case 'neon-grid':
                return { border: '4px solid var(--accent-cyan)', boxShadow: 'inset 0 0 100px rgba(121, 247, 255, 0.2)' };
            case 'garden-haze':
                return { border: '4px solid #44ff88', boxShadow: 'inset 0 0 100px rgba(68, 255, 136, 0.2)' };
            case 'void-rift':
                return { border: '4px solid #7a6cff', boxShadow: 'inset 0 0 100px rgba(122, 108, 255, 0.2)' };
            default:
                return {};
        }
    }, [activeField]);
    if (showVS) {
        return _jsx(VSDisplay, { playerAvatar: "/avatar_player.png", opponentAvatar: "/avatar_kaizen.png", opponentName: "KAIZEN" });
    }
    return (_jsxs("div", { className: `battle-container fade-in ${activeField ? 'field-active' : ''}`, style: Object.assign({ height: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr auto', background: '#050510', backgroundImage: activeField === 'garden-haze'
                ? 'linear-gradient(rgba(0,10,5,0.8), rgba(0,0,0,0.9)), url("/garden_haze_field.png")'
                : 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url("/battle_base_bg.png")', backgroundSize: 'cover', padding: '40px', color: 'white', overflow: 'hidden', transition: '1s', position: 'relative' }, fieldStyle), children: [_jsx("div", { className: "scanlines" }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '20px' }, children: [_jsx("img", { src: "/avatar_kaizen.png", alt: "Kaizen", style: { width: '80px', height: '80px', borderRadius: '50%', border: '4px solid var(--accent-magenta)', padding: '5px', boxShadow: '0 0 20px var(--accent-magenta)' } }), _jsxs("div", { children: [_jsx("div", { style: { fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--accent-magenta)', textShadow: '0 0 10px var(--accent-magenta)' }, children: "KAIZEN" }), _jsx("div", { style: { fontSize: '0.8rem', opacity: 0.6, letterSpacing: '2px' }, children: "RANK B // NEON_MISSION_SEED" })] })] }), _jsx(LifePointTracker, { value: battleState.opponent.prizes, max: 3, color: "var(--accent-magenta)", name: "OPPONENT_STOCKS" })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr', gridTemplateRows: '1fr 1fr', gap: '60px', padding: '40px 0', zIndex: 5 }, children: [_jsxs("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }, children: [_jsx("div", { style: { display: 'flex', gap: '30px' }, children: battleState.opponent.bench.map((entity, index) => (_jsx(BattleSlot, { entity: entity, side: "opponent", onHover: (id) => setHoveredCard(getCardById(id)), onLeave: () => setHoveredCard(null) }, index))) }), _jsx(BattleSlot, { entity: battleState.opponent.active, isActive: true, side: "opponent", onHover: (id) => setHoveredCard(getCardById(id)), onLeave: () => setHoveredCard(null) })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', gap: '20px' }, children: [_jsx("div", { style: { display: 'flex', gap: '30px' }, children: battleState.player.bench.map((entity, index) => (_jsx(BattleSlot, { entity: entity, side: "player", onHover: (id) => setHoveredCard(getCardById(id)), onLeave: () => setHoveredCard(null) }, index))) }), _jsx(BattleSlot, { entity: battleState.player.active, isActive: true, side: "player", onClick: attack, onHover: (id) => setHoveredCard(getCardById(id)), onLeave: () => setHoveredCard(null) })] })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 10, gap: '20px' }, children: [_jsx("div", { style: { display: 'flex', gap: '15px', flexWrap: 'wrap' }, children: battleState.player.hand.map((id, index) => (_jsx("div", { className: "holo-card", style: { borderRadius: '6px' }, children: _jsx(BattleCard, { cardId: id, onClick: () => playCard(id), onHover: () => setHoveredCard(getCardById(id)), onLeave: () => setHoveredCard(null), disabled: !isPlayerTurn || !!battleState.winner }) }, `${id}-${index}`))) }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-end' }, children: [_jsx(LifePointTracker, { value: battleState.player.prizes, max: 3, color: "var(--accent-cyan)", name: "PLAYER_STOCKS" }), _jsxs("div", { style: { display: 'flex', gap: '10px' }, children: [_jsxs("div", { className: "mana-pill", style: { boxShadow: '0 0 15px var(--accent-cyan)' }, children: ["SYNC_ENERGY: ", battleState.player.mana, " EN"] }), _jsx("button", { className: "neo-button primary", onClick: endTurn, disabled: !isPlayerTurn || !!battleState.winner, style: { height: '50px', padding: '0 40px', fontWeight: 900 }, children: isPlayerTurn ? 'CLOSE PHASE' : 'SYNCING...' })] })] })] }), battleState.winner === 'player' && _jsx(EndMatchModal, { title: "VICTORY", color: "var(--accent-cyan)", onExit: () => setScene('DISTRICT_EXPLORE') }), battleState.winner === 'opponent' && _jsx(EndMatchModal, { title: "DEFEAT", color: "var(--accent-magenta)", onExit: () => setScene('MAIN_MENU') }), hoveredCard && (_jsx("div", { style: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 500, pointerEvents: 'none' }, children: _jsxs("div", { className: "glass-panel", style: {
                        background: 'rgba(5,5,15,0.95)',
                        border: '3px solid var(--accent-cyan)',
                        padding: '40px',
                        width: '350px',
                        boxShadow: '0 0 100px rgba(0,242,255,0.3)'
                    }, children: [_jsx("div", { style: { fontSize: '0.7rem', color: 'var(--accent-cyan)', letterSpacing: '2px' }, children: "DATA_INSPECTOR_v4" }), _jsx("h3", { style: { fontSize: '2rem', margin: '10px 0' }, children: hoveredCard.name.toUpperCase() }), _jsxs("div", { style: { color: 'var(--accent-yellow)', fontWeight: 'bold', marginBottom: '20px' }, children: ["COST: ", hoveredCard.cost] }), _jsx("div", { style: { background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '4px', fontSize: '1rem', lineHeight: '1.4' }, children: hoveredCard.rulesText.map((text, index) => (_jsx("p", { style: { margin: 0 }, children: text }, index))) }), _jsx("div", { style: { marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '8px' }, children: (_a = hoveredCard.keywords) === null || _a === void 0 ? void 0 : _a.map((keyword) => (_jsx("div", { style: { background: 'var(--accent-cyan)', color: 'black', padding: '4px 10px', fontSize: '0.6rem', fontWeight: 'bold', borderRadius: '2px' }, children: keyword.toUpperCase() }, keyword))) })] }) })), _jsx("style", { children: `
        .mana-pill {
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid var(--accent-cyan);
          padding: 10px 20px;
          border-radius: 4px;
          color: var(--accent-cyan);
          font-weight: bold;
          display: flex;
          align-items: center;
        }
      ` })] }));
};
const LifePointTracker = ({ value, max, color, name }) => (_jsxs("div", { className: "glass-morphism", style: { padding: '20px 40px', borderLeft: `8px solid ${color}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }, children: [_jsx("div", { style: { fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '4px' }, children: name }), _jsxs("div", { style: { fontSize: '2.5rem', fontWeight: 'bold', color }, children: [value, " ", _jsxs("span", { style: { fontSize: '1rem', opacity: 0.3 }, children: ["/ ", max] })] })] }));
const VSDisplay = ({ playerAvatar, opponentAvatar, opponentName }) => (_jsxs("div", { className: "vs-screen fade-in", style: { height: '100vh', background: 'black', display: 'flex', overflow: 'hidden', position: 'relative' }, children: [_jsxs("div", { style: { flex: 1, position: 'relative' }, children: [_jsx("img", { src: playerAvatar, alt: "Player", style: { height: '100%', width: '100%', objectFit: 'cover', transform: 'scaleX(-1)' } }), _jsx("div", { style: { position: 'absolute', bottom: '40px', left: '40px', fontSize: '4rem', fontWeight: '900', color: 'var(--accent-cyan)' }, children: "PLAYER 1" })] }), _jsx("div", { style: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(-10deg)',
                fontSize: '12rem',
                fontWeight: '900',
                fontStyle: 'italic',
                zIndex: 10,
                textShadow: '0 0 50px rgba(255,255,255,0.5)'
            }, children: "VS" }), _jsxs("div", { style: { flex: 1, position: 'relative' }, children: [_jsx("img", { src: opponentAvatar, alt: opponentName, style: { height: '100%', width: '100%', objectFit: 'cover' } }), _jsx("div", { style: { position: 'absolute', top: '40px', right: '40px', fontSize: '4rem', fontWeight: '900', color: 'var(--accent-magenta)' }, children: opponentName })] })] }));
const BattleSlot = ({ entity, isActive, side, onClick, onHover, onLeave }) => {
    var _a;
    const sourceCard = entity ? getCardById(entity.cardId) : undefined;
    const isDamaged = entity && sourceCard ? entity.currentHealth < sourceCard.health : false;
    return (_jsxs("div", { onClick: entity && side === 'player' && !entity.hasAttacked ? onClick : undefined, onMouseEnter: () => entity && (onHover === null || onHover === void 0 ? void 0 : onHover(entity.cardId)), onMouseLeave: onLeave, style: {
            width: isActive ? '200px' : '140px',
            height: isActive ? '260px' : '180px',
            border: `2px solid ${side === 'player' ? 'var(--accent-cyan)' : 'var(--accent-magenta)'}`,
            borderRadius: '4px',
            background: entity ? 'rgba(5,5,15,0.4)' : 'rgba(255,255,255,0.02)',
            cursor: onClick && entity && !entity.hasAttacked ? 'pointer' : entity ? 'help' : 'default',
            transition: '0.3s',
            position: 'relative'
        }, children: [entity && sourceCard && (_jsxs("div", { className: `holo-projector ${isDamaged ? 'glitch-anim' : ''}`, style: { height: '100%', padding: '15px', display: 'flex', flexDirection: 'column', position: 'relative' }, children: [_jsx("div", { className: "scanlines", style: { opacity: 0.3 } }), _jsx("div", { style: { fontSize: '0.7rem', color: 'var(--accent-cyan)', letterSpacing: '2px', zIndex: 10 }, children: (_a = sourceCard.creatureType) === null || _a === void 0 ? void 0 : _a.toUpperCase() }), _jsx("div", { style: { fontSize: '1rem', fontWeight: 'bold', zIndex: 10 }, children: sourceCard.name.toUpperCase() }), _jsx("div", { style: { flex: 1 } }), _jsxs("div", { style: { fontSize: '2rem', fontWeight: '900', color: 'var(--accent-yellow)', zIndex: 10 }, children: [entity.attack, " ", _jsx("span", { style: { opacity: 0.2 }, children: "/" }), " ", entity.currentHealth] })] })), !entity && _jsx("div", { style: { opacity: 0.1, fontSize: '0.6rem', textAlign: 'center', width: '100%', marginTop: '45%' }, children: "GRID_SLOT" })] }));
};
const BattleCard = ({ cardId, onClick, onHover, onLeave, disabled }) => {
    var _a, _b, _c, _d;
    const card = getCardById(cardId);
    if (!card)
        return null;
    const typeColor = card.creatureType === 'Pulse' ? 'var(--accent-cyan)' : card.creatureType === 'Bloom' ? '#44ff88' : card.creatureType === 'Alloy' ? '#aaaaaa' : 'var(--accent-magenta)';
    return (_jsxs("div", { onClick: disabled ? undefined : onClick, onMouseEnter: onHover, onMouseLeave: onLeave, style: {
            width: '140px',
            height: '200px',
            background: 'rgba(10,10,25,0.98)',
            border: `1px solid ${typeColor}`,
            boxShadow: ((_a = card.attack) !== null && _a !== void 0 ? _a : 0) > 6 ? `0 0 15px ${typeColor}` : 'none',
            cursor: disabled ? 'default' : 'pointer',
            opacity: disabled ? 0.4 : 1,
            transition: '0.2s',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
        }, children: [_jsxs("div", { style: { padding: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("div", { style: { fontSize: '0.65rem', fontWeight: '900', letterSpacing: '1px' }, children: card.name.toUpperCase() }), _jsxs("div", { style: { color: 'var(--accent-yellow)', fontWeight: 'bold', fontSize: '0.8rem' }, children: [card.cost, " EN"] })] }), _jsxs("div", { style: {
                    flex: 1,
                    background: `linear-gradient(to bottom, ${typeColor}22, transparent)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }, children: [_jsx("div", { className: "scanlines", style: { opacity: 0.2 } }), _jsx("div", { style: { width: '60%', height: '60%', background: typeColor, opacity: 0.2, filter: 'blur(20px)', borderRadius: '50%' } }), _jsxs("div", { style: { position: 'absolute', fontSize: '0.5rem', color: typeColor, letterSpacing: '2px', fontWeight: 'bold' }, children: ["DATA_ID: ", card.id.toUpperCase()] })] }), _jsxs("div", { style: { padding: '8px', background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(255,255,255,0.1)' }, children: [_jsx("div", { style: { fontSize: '0.5rem', color: typeColor, letterSpacing: '2px', marginBottom: '4px' }, children: ((_b = card.creatureType) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || 'SUPPORT' }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }, children: [_jsx("div", { style: { fontSize: '0.9rem', fontWeight: '900', color: 'var(--accent-yellow)' }, children: (_c = card.attack) !== null && _c !== void 0 ? _c : '-' }), _jsx("div", { style: { fontSize: '0.9rem', fontWeight: '900', color: 'var(--text-primary)' }, children: (_d = card.health) !== null && _d !== void 0 ? _d : '-' })] })] })] }));
};
const EndMatchModal = ({ title, color, onExit }) => (_jsxs("div", { style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }, children: [_jsx("h1", { style: { fontSize: '10rem', color, fontStyle: 'italic', fontWeight: '900', letterSpacing: '20px' }, children: title }), _jsx("button", { className: "neo-button primary", style: { marginTop: '60px', background: color, minWidth: '300px' }, onClick: onExit, children: "EXIT ARENA" })] }));
