import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useBattle } from './useBattle';
import { useGame } from '../core/GameStateContext';
import { getCardById, getCardPalette } from '../data/cards';
export const BattleBoard = () => {
    const { state, setScene } = useGame();
    const [showVS, setShowVS] = useState(true);
    const [hoveredCard, setHoveredCard] = useState(null);
    const { battleState, playCard, attack, endTurn } = useBattle(state.profile.inventory.deck, ['ziprail', 'neon-striker', 'voltlynx', 'overdrive-fox', 'quick-transfer', 'ziprail']);
    useEffect(() => {
        const timer = window.setTimeout(() => setShowVS(false), 2200);
        return () => window.clearTimeout(timer);
    }, []);
    const activeField = battleState.field;
    const isPlayerTurn = battleState.isPlayerTurn;
    const latestEvents = battleState.log.slice(-4).reverse();
    const fieldStyle = useMemo(() => {
        switch (activeField) {
            case 'neon-grid':
                return { border: '3px solid var(--accent-cyan)', boxShadow: 'inset 0 0 120px rgba(121, 247, 255, 0.18)' };
            case 'garden-haze':
                return { border: '3px solid #8effa7', boxShadow: 'inset 0 0 120px rgba(142, 255, 167, 0.14)' };
            case 'void-rift':
                return { border: '3px solid #7a6cff', boxShadow: 'inset 0 0 120px rgba(122, 108, 255, 0.18)' };
            case 'alloy-foundry':
                return { border: '3px solid #d5dae2', boxShadow: 'inset 0 0 120px rgba(213, 218, 226, 0.16)' };
            default:
                return {};
        }
    }, [activeField]);
    if (showVS) {
        return _jsx(VSDisplay, { playerAvatar: "/avatar_player.png", opponentAvatar: "/avatar_kaizen.png", opponentName: "KAIZEN" });
    }
    return (_jsxs("div", { className: `battle-container fade-in ${activeField ? 'field-active' : ''}`, style: Object.assign({ height: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr auto', background: '#050510', backgroundImage: activeField === 'garden-haze'
                ? 'linear-gradient(rgba(5,18,10,0.82), rgba(0,0,0,0.92)), url("/garden_haze_field.png")'
                : 'linear-gradient(rgba(2,6,18,0.88), rgba(0,0,0,0.92)), url("/battle_base_bg.png")', backgroundSize: 'cover', padding: '28px', color: 'white', overflow: 'hidden', transition: '0.8s', position: 'relative' }, fieldStyle), children: [_jsx("div", { className: "scanlines" }), _jsx("div", { className: "battle-atmosphere" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'start', zIndex: 10 }, children: [_jsxs("div", { className: "glass-panel", style: { padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(7,12,22,0.72)' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '16px' }, children: [_jsx("img", { src: "/avatar_kaizen.png", alt: "Kaizen", style: { width: '72px', height: '72px', borderRadius: '20px', objectFit: 'cover', border: '2px solid var(--accent-magenta)' } }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.72rem', color: 'var(--text-secondary)', letterSpacing: '0.24rem' }, children: "OPPONENT LINK" }), _jsx("div", { style: { fontWeight: 800, fontSize: '1.5rem', color: 'var(--accent-magenta)' }, children: "KAIZEN" }), _jsx("div", { style: { fontSize: '0.78rem', color: 'rgba(255,255,255,0.66)' }, children: "Rank B / Combat seed active" })] })] }), _jsx(BattleGauge, { label: "FIELD STATE", value: activeField ? activeField.replace(/-/g, ' ').toUpperCase() : 'DEFAULT ARENA', accent: "var(--accent-yellow)" })] }), _jsxs("div", { className: "glass-panel", style: { minWidth: '250px', padding: '18px 20px', background: 'rgba(7,12,22,0.72)' }, children: [_jsx("div", { style: { fontSize: '0.68rem', color: 'var(--text-secondary)', letterSpacing: '0.22rem', marginBottom: '10px' }, children: "RECENT EVENTS" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '10px' }, children: latestEvents.map((event, index) => (_jsx("div", { style: { fontSize: '0.82rem', lineHeight: 1.4, color: index === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }, children: event }, `${event}-${index}`))) })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateRows: '1fr 1fr', gap: '28px', padding: '24px 0', zIndex: 5 }, children: [_jsx(FieldRow, { title: "Opponent Side", side: "opponent", active: battleState.opponent.active, bench: battleState.opponent.bench, onHover: (id) => { var _a; return setHoveredCard((_a = getCardById(id)) !== null && _a !== void 0 ? _a : null); }, onLeave: () => setHoveredCard(null) }), _jsx(FieldRow, { title: "Player Side", side: "player", active: battleState.player.active, bench: battleState.player.bench, onHover: (id) => { var _a; return setHoveredCard((_a = getCardById(id)) !== null && _a !== void 0 ? _a : null); }, onLeave: () => setHoveredCard(null), onAttack: attack })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr auto', gap: '18px', alignItems: 'end', zIndex: 10 }, children: [_jsxs("div", { className: "glass-panel", style: { padding: '18px', background: 'rgba(7,12,22,0.72)' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.68rem', color: 'var(--text-secondary)', letterSpacing: '0.24rem' }, children: "HAND ARRAY" }), _jsxs("div", { style: { fontSize: '1rem', fontWeight: 700 }, children: [battleState.player.hand.length, " cards ready"] })] }), _jsx("div", { style: { color: isPlayerTurn ? 'var(--accent-cyan)' : 'var(--text-secondary)', fontWeight: 700 }, children: isPlayerTurn ? 'PLAYER MAIN PHASE' : 'OPPONENT RESOLVING' })] }), _jsx("div", { style: { display: 'flex', gap: '14px', flexWrap: 'wrap' }, children: battleState.player.hand.map((id, index) => (_jsx(BattleCard, { cardId: id, onClick: () => playCard(id), onHover: () => { var _a; return setHoveredCard((_a = getCardById(id)) !== null && _a !== void 0 ? _a : null); }, onLeave: () => setHoveredCard(null), disabled: !isPlayerTurn || !!battleState.winner }, `${id}-${index}`))) })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '14px', minWidth: '300px' }, children: [_jsx(LifePointTracker, { value: battleState.opponent.prizes, max: 3, color: "var(--accent-magenta)", name: "OPPONENT PRIZES" }), _jsx(LifePointTracker, { value: battleState.player.prizes, max: 3, color: "var(--accent-cyan)", name: "PLAYER PRIZES" }), _jsxs("div", { className: "glass-panel", style: { padding: '18px 20px', background: 'rgba(7,12,22,0.72)' }, children: [_jsx(BattleGauge, { label: "SYNC ENERGY", value: `${battleState.player.mana} / ${battleState.player.maxMana}`, accent: "var(--accent-cyan)" }), _jsx("button", { className: "neo-button primary", onClick: endTurn, disabled: !isPlayerTurn || !!battleState.winner, style: { marginTop: '14px', width: '100%', justifyContent: 'center', display: 'flex' }, children: isPlayerTurn ? 'END TURN' : 'WAITING...' })] })] })] }), battleState.winner === 'player' && _jsx(EndMatchModal, { title: "VICTORY", color: "var(--accent-cyan)", onExit: () => setScene('DISTRICT_EXPLORE') }), battleState.winner === 'opponent' && _jsx(EndMatchModal, { title: "DEFEAT", color: "var(--accent-magenta)", onExit: () => setScene('MAIN_MENU') }), hoveredCard && _jsx(CardInspector, { card: hoveredCard }), _jsx("style", { children: `
        .battle-atmosphere {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(121,247,255,0.12), transparent 24%),
            radial-gradient(circle at 80% 18%, rgba(255,95,207,0.16), transparent 26%),
            linear-gradient(180deg, transparent, rgba(0,0,0,0.3));
          pointer-events: none;
        }
      ` })] }));
};
const FieldRow = ({ title, side, active, bench, onHover, onLeave, onAttack }) => (_jsxs("div", { className: "glass-panel", style: { padding: '18px', background: 'rgba(7,12,22,0.62)', display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px', alignItems: 'center' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.68rem', color: 'var(--text-secondary)', letterSpacing: '0.24rem' }, children: title.toUpperCase() }), _jsx("div", { style: { marginTop: '8px', fontSize: '1.1rem', fontWeight: 700 }, children: side === 'player' ? 'Active attack route' : 'Enemy threat board' })] }), _jsxs("div", { style: { display: 'flex', gap: '18px', alignItems: 'center', justifyContent: side === 'player' ? 'flex-start' : 'flex-end' }, children: [side === 'opponent' && _jsx(EntityStack, { entities: bench, side: side, onHover: onHover, onLeave: onLeave }), _jsx(BattleSlot, { entity: active, isActive: true, side: side, onClick: onAttack, onHover: onHover, onLeave: onLeave }), side === 'player' && _jsx(EntityStack, { entities: bench, side: side, onHover: onHover, onLeave: onLeave })] })] }));
const EntityStack = ({ entities, side, onHover, onLeave }) => (_jsx("div", { style: { display: 'flex', gap: '14px' }, children: entities.map((entity, index) => (_jsx(BattleSlot, { entity: entity, side: side, onHover: onHover, onLeave: onLeave }, index))) }));
const LifePointTracker = ({ value, max, color, name }) => (_jsxs("div", { className: "glass-panel", style: { padding: '16px 18px', background: 'rgba(7,12,22,0.72)' }, children: [_jsx("div", { style: { fontSize: '0.68rem', color: 'var(--text-secondary)', letterSpacing: '0.24rem' }, children: name }), _jsxs("div", { style: { marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }, children: [_jsx("div", { style: { fontSize: '2rem', fontWeight: 800, color }, children: value }), _jsxs("div", { style: { color: 'var(--text-secondary)' }, children: ["/", max] })] })] }));
const BattleGauge = ({ label, value, accent }) => (_jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.68rem', color: 'var(--text-secondary)', letterSpacing: '0.22rem' }, children: label }), _jsx("div", { style: { marginTop: '8px', fontSize: '1rem', fontWeight: 800, color: accent }, children: value })] }));
const VSDisplay = ({ playerAvatar, opponentAvatar, opponentName }) => (_jsxs("div", { className: "vs-screen fade-in", style: { height: '100vh', background: 'linear-gradient(135deg, #050816, #13081a)', display: 'flex', overflow: 'hidden', position: 'relative' }, children: [_jsxs("div", { style: { flex: 1, position: 'relative' }, children: [_jsx("img", { src: playerAvatar, alt: "Player", style: { height: '100%', width: '100%', objectFit: 'cover', transform: 'scaleX(-1)', opacity: 0.82 } }), _jsx("div", { style: { position: 'absolute', bottom: '40px', left: '40px', fontSize: '4rem', fontWeight: '900', color: 'var(--accent-cyan)' }, children: "PLAYER 1" })] }), _jsx("div", { style: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-8deg)', fontSize: '11rem', fontWeight: '900', fontStyle: 'italic', zIndex: 10, textShadow: '0 0 50px rgba(255,255,255,0.5)' }, children: "VS" }), _jsxs("div", { style: { flex: 1, position: 'relative' }, children: [_jsx("img", { src: opponentAvatar, alt: opponentName, style: { height: '100%', width: '100%', objectFit: 'cover', opacity: 0.82 } }), _jsx("div", { style: { position: 'absolute', top: '40px', right: '40px', fontSize: '4rem', fontWeight: '900', color: 'var(--accent-magenta)' }, children: opponentName })] })] }));
const BattleSlot = ({ entity, isActive, side, onClick, onHover, onLeave }) => {
    var _a, _b;
    const card = entity ? getCardById(entity.cardId) : undefined;
    const palette = getCardPalette(card);
    const isDamaged = entity && card ? entity.currentHealth < ((_a = card.health) !== null && _a !== void 0 ? _a : entity.currentHealth) : false;
    return (_jsx("div", { onClick: entity && side === 'player' && !entity.hasAttacked ? onClick : undefined, onMouseEnter: () => entity && (onHover === null || onHover === void 0 ? void 0 : onHover(entity.cardId)), onMouseLeave: onLeave, style: {
            width: isActive ? '190px' : '132px',
            minHeight: isActive ? '248px' : '168px',
            padding: isActive ? '14px' : '12px',
            borderRadius: '22px',
            border: `1px solid ${palette.accent}`,
            background: `${palette.panel}, linear-gradient(180deg, rgba(255,255,255,0.04), transparent)`,
            boxShadow: `0 18px 42px ${palette.glow}`,
            cursor: onClick && entity && !entity.hasAttacked ? 'pointer' : entity ? 'help' : 'default',
            opacity: entity ? 1 : 0.36,
            transition: '0.24s ease',
            position: 'relative',
            overflow: 'hidden'
        }, children: entity && card ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "scanlines", style: { opacity: 0.16 } }), _jsxs("div", { style: { position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', gap: '10px' }, children: [_jsx("div", { style: { fontSize: '0.56rem', color: palette.accent, letterSpacing: '0.18rem' }, children: (_b = card.creatureType) === null || _b === void 0 ? void 0 : _b.toUpperCase() }), isActive && _jsx("div", { style: { fontSize: '0.54rem', color: 'var(--text-secondary)', letterSpacing: '0.18rem' }, children: "ACTIVE" })] }), _jsx("div", { style: { marginTop: '8px', fontWeight: 800, lineHeight: 1.05 }, children: card.name.toUpperCase() }), _jsx("div", { style: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }, children: _jsx("div", { style: { width: isActive ? '84px' : '62px', height: isActive ? '84px' : '62px', borderRadius: '999px', background: palette.glow, filter: 'blur(10px)' } }) }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'end' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.56rem', color: 'var(--text-secondary)' }, children: "ATK" }), _jsx("div", { style: { fontSize: isActive ? '1.7rem' : '1.3rem', fontWeight: 800, color: 'var(--accent-yellow)' }, children: entity.attack })] }), _jsxs("div", { style: { textAlign: 'right' }, children: [_jsx("div", { style: { fontSize: '0.56rem', color: 'var(--text-secondary)' }, children: "HP" }), _jsx("div", { style: { fontSize: isActive ? '1.7rem' : '1.3rem', fontWeight: 800, color: isDamaged ? 'var(--accent-magenta)' : 'var(--text-primary)' }, children: entity.currentHealth })] })] })] })] })) : (_jsx("div", { style: { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', letterSpacing: '0.18rem', color: 'rgba(255,255,255,0.28)' }, children: "EMPTY SLOT" })) }));
};
const BattleCard = ({ cardId, onClick, onHover, onLeave, disabled }) => {
    var _a, _b, _c, _d, _e;
    const card = getCardById(cardId);
    if (!card)
        return null;
    const palette = getCardPalette(card);
    return (_jsxs("button", { onClick: disabled ? undefined : onClick, onMouseEnter: onHover, onMouseLeave: onLeave, disabled: disabled, style: {
            width: '168px',
            minHeight: '236px',
            borderRadius: '24px',
            border: `1px solid ${palette.accent}`,
            background: `${palette.panel}, linear-gradient(180deg, ${palette.rarityFinish}, transparent 70%)`,
            boxShadow: `0 18px 36px ${palette.glow}`,
            cursor: disabled ? 'default' : 'pointer',
            opacity: disabled ? 0.42 : 1,
            transition: 'transform 0.18s ease, box-shadow 0.18s ease',
            display: 'flex',
            flexDirection: 'column',
            padding: '14px',
            position: 'relative',
            overflow: 'hidden',
            color: 'inherit',
            textAlign: 'left'
        }, children: [_jsx("div", { className: "scanlines", style: { opacity: 0.12 } }), _jsxs("div", { style: { position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'start' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.54rem', color: palette.accent, letterSpacing: '0.18rem' }, children: card.cardType.toUpperCase() }), _jsx("div", { style: { marginTop: '6px', fontSize: '1rem', fontWeight: 800, lineHeight: 1.1 }, children: card.name.toUpperCase() })] }), _jsx("div", { style: { minWidth: '44px', textAlign: 'right', color: 'var(--accent-yellow)', fontWeight: 800 }, children: card.cost })] }), _jsxs("div", { style: { flex: 1, borderRadius: '18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: [_jsx("div", { style: { width: '68%', height: '68%', borderRadius: '999px', background: palette.glow, filter: 'blur(14px)' } }), _jsx("div", { style: { position: 'absolute', bottom: '10px', fontSize: '0.58rem', letterSpacing: '0.16rem', color: palette.accent }, children: (_a = card.set) !== null && _a !== void 0 ? _a : 'CORE SET' })] }), _jsx("div", { style: { fontSize: '0.74rem', lineHeight: 1.45, color: 'var(--text-secondary)', minHeight: '52px' }, children: (_c = (_b = card.rulesText) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : 'No effect text loaded.' }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'end' }, children: [_jsx("div", { style: { fontSize: '0.62rem', color: palette.accent, letterSpacing: '0.18rem' }, children: card.rarity.toUpperCase() }), _jsx("div", { style: { fontWeight: 800, fontSize: '1rem' }, children: card.cardType === 'creature' ? `${(_d = card.attack) !== null && _d !== void 0 ? _d : '-'} / ${(_e = card.health) !== null && _e !== void 0 ? _e : '-'}` : 'TACTIC' })] })] })] }));
};
const CardInspector = ({ card }) => {
    var _a, _b, _c, _d;
    const palette = getCardPalette(card);
    return (_jsx("div", { style: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 500, pointerEvents: 'none' }, children: _jsxs("div", { className: "glass-panel", style: { background: `${palette.panel}`, border: `2px solid ${palette.accent}`, padding: '28px', width: '360px', boxShadow: `0 0 80px ${palette.glow}` }, children: [_jsx("div", { style: { fontSize: '0.68rem', color: palette.accent, letterSpacing: '0.22rem' }, children: "CARD INSPECTOR" }), _jsx("h3", { style: { fontSize: '2rem', margin: '12px 0 8px' }, children: card.name.toUpperCase() }), _jsxs("div", { style: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }, children: [_jsx(Chip, { label: card.cardType.toUpperCase(), accent: palette.accent }), card.creatureType && _jsx(Chip, { label: card.creatureType.toUpperCase(), accent: "var(--accent-yellow)" }), _jsx(Chip, { label: `${card.cost} EN`, accent: "var(--text-primary)" })] }), _jsx("div", { style: { background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', fontSize: '0.92rem', lineHeight: 1.5 }, children: ((_a = card.rulesText) !== null && _a !== void 0 ? _a : ['No effect text loaded.']).map((text, index) => (_jsx("p", { style: { margin: index === 0 ? 0 : '10px 0 0' }, children: text }, index))) }), _jsxs("div", { style: { marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }, children: [_jsx("div", { style: { color: 'var(--text-secondary)' }, children: (_b = card.set) !== null && _b !== void 0 ? _b : 'CORE SET' }), card.cardType === 'creature' && _jsxs("div", { style: { fontSize: '1.3rem', fontWeight: 800 }, children: [(_c = card.attack) !== null && _c !== void 0 ? _c : '-', " / ", (_d = card.health) !== null && _d !== void 0 ? _d : '-'] })] })] }) }));
};
const Chip = ({ label, accent }) => (_jsx("div", { style: { padding: '5px 10px', borderRadius: '999px', border: `1px solid ${accent}`, fontSize: '0.62rem', letterSpacing: '0.16rem', color: accent }, children: label }));
const EndMatchModal = ({ title, color, onExit }) => (_jsxs("div", { style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }, children: [_jsx("h1", { style: { fontSize: '9rem', color, fontStyle: 'italic', fontWeight: '900', letterSpacing: '18px' }, children: title }), _jsx("button", { className: "neo-button primary", style: { marginTop: '46px', background: color, minWidth: '280px' }, onClick: onExit, children: "EXIT ARENA" })] }));
