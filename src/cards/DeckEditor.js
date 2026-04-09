import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { useGame } from '../core/GameStateContext';
import { getCardById, getCardPalette } from '../data/cards';
export const DeckEditor = () => {
    var _a, _b;
    const { state, updateProfile, setScene } = useGame();
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [focusedCardId, setFocusedCardId] = useState((_b = (_a = state.profile.inventory.deck[0]) !== null && _a !== void 0 ? _a : state.profile.inventory.cards[0]) !== null && _b !== void 0 ? _b : null);
    const deck = state.profile.inventory.deck;
    const collection = state.profile.inventory.cards;
    const filteredCollection = useMemo(() => collection.filter((id) => {
        const card = getCardById(id);
        if (!card)
            return false;
        const matchesType = filter === 'ALL' ||
            (filter === 'TACTIC' ? card.cardType !== 'creature' : card.creatureType === filter);
        const matchesSearch = card.name.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesSearch;
    }), [collection, filter, search]);
    const addToDeck = (cardId) => {
        if (deck.length >= 24)
            return;
        updateProfile({
            inventory: Object.assign(Object.assign({}, state.profile.inventory), { deck: [...deck, cardId] })
        });
        setFocusedCardId(cardId);
    };
    const removeFromDeck = (index) => {
        const nextDeck = [...deck];
        nextDeck.splice(index, 1);
        updateProfile({
            inventory: Object.assign(Object.assign({}, state.profile.inventory), { deck: nextDeck })
        });
    };
    const manaCurve = [0, 0, 0, 0, 0, 0, 0];
    deck.forEach((id) => {
        var _a;
        const cost = ((_a = getCardById(id)) === null || _a === void 0 ? void 0 : _a.cost) || 0;
        manaCurve[Math.min(cost, 6)] += 1;
    });
    const maxCurve = Math.max(...manaCurve, 1);
    const averageCost = (deck.reduce((acc, id) => { var _a; return acc + (((_a = getCardById(id)) === null || _a === void 0 ? void 0 : _a.cost) || 0); }, 0) / (deck.length || 1)).toFixed(1);
    const creatureCount = deck.filter((id) => { var _a; return ((_a = getCardById(id)) === null || _a === void 0 ? void 0 : _a.cardType) === 'creature'; }).length;
    const tacticCount = deck.length - creatureCount;
    const focusedCard = getCardById(focusedCardId !== null && focusedCardId !== void 0 ? focusedCardId : '');
    return (_jsxs("div", { className: "deck-editor-scene fade-in", style: {
            height: '100vh',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(360px, 460px)',
            background: 'radial-gradient(circle at top left, rgba(121,247,255,0.12), transparent 24%), linear-gradient(180deg, #030711 0%, #070b18 100%)',
            color: 'white',
            overflow: 'hidden'
        }, children: [_jsxs("div", { style: { padding: '34px', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(121,247,255,0.08)' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '28px', gap: '20px' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.68rem', color: 'var(--accent-cyan)', letterSpacing: '0.24rem' }, children: "TECH BAY / DECK FORGE" }), _jsx("h1", { className: "glow-text", style: { fontSize: '3.4rem', marginTop: '8px' }, children: "MAIN_SYNC" }), _jsx("div", { style: { marginTop: '8px', color: 'var(--text-secondary)' }, children: "Build a 24-card list with a clean curve and a clear identity." })] }), _jsx("input", { type: "text", placeholder: "SEARCH CARD", value: search, onChange: (event) => setSearch(event.target.value), style: { minWidth: '240px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', padding: '12px 16px', borderRadius: '16px', outline: 'none' } })] }), _jsx("div", { style: { display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }, children: ['ALL', 'Pulse', 'Bloom', 'Tide', 'Alloy', 'Veil', 'Current', 'TACTIC'].map((entry) => (_jsx("button", { onClick: () => setFilter(entry), style: {
                                padding: '8px 16px',
                                fontSize: '0.72rem',
                                background: filter === entry ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.05)',
                                color: filter === entry ? 'black' : 'white',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '999px',
                                cursor: 'pointer',
                                transition: '0.2s ease',
                                fontWeight: 700,
                                letterSpacing: '0.08rem'
                            }, children: entry }, entry))) }), _jsx("div", { className: "custom-scroll", style: { flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '18px', paddingRight: '18px' }, children: filteredCollection.map((id, index) => (_jsx(CollectionCard, { id: id, onAdd: () => addToDeck(id), onFocus: () => setFocusedCardId(id) }, `${id}-${index}`))) })] }), _jsxs("div", { style: { background: 'rgba(255,255,255,0.03)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }, children: [_jsxs("div", { className: "glass-panel", style: { padding: '20px', background: 'rgba(7,12,22,0.76)' }, children: [_jsx("div", { style: { fontSize: '0.66rem', color: 'var(--text-secondary)', letterSpacing: '0.22rem' }, children: "LOADOUT SUMMARY" }), _jsxs("div", { style: { marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }, children: [_jsx(Metric, { label: "CARD COUNT", value: `${deck.length} / 24`, accent: deck.length === 24 ? 'var(--accent-cyan)' : 'var(--text-primary)' }), _jsx(Metric, { label: "AVG COST", value: `${averageCost} EN`, accent: "var(--accent-yellow)" }), _jsx(Metric, { label: "CREATURES", value: `${creatureCount}`, accent: "var(--accent-cyan)" }), _jsx(Metric, { label: "TACTICS", value: `${tacticCount}`, accent: "var(--accent-magenta)" })] })] }), _jsxs("div", { className: "glass-panel", style: { padding: '20px', background: 'rgba(7,12,22,0.76)' }, children: [_jsx("div", { style: { fontSize: '0.66rem', color: 'var(--text-secondary)', letterSpacing: '0.22rem', marginBottom: '14px' }, children: "MANA CURVE" }), _jsx("div", { style: { height: '110px', display: 'flex', alignItems: 'end', gap: '8px' }, children: manaCurve.map((count, index) => (_jsxs("div", { style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }, children: [_jsx("div", { style: { width: '100%', height: `${(count / maxCurve) * 72}px`, background: 'linear-gradient(180deg, var(--accent-cyan), rgba(121,247,255,0.24))', borderRadius: '10px 10px 4px 4px', opacity: count > 0 ? 1 : 0.12 } }), _jsxs("div", { style: { fontSize: '0.58rem', opacity: 0.6 }, children: [index, index === 6 ? '+' : ''] })] }, index))) })] }), focusedCard && _jsx(FocusedCardPanel, { card: focusedCard }), _jsxs("div", { className: "glass-panel custom-scroll", style: { flex: 1, overflowY: 'auto', padding: '18px', background: 'rgba(7,12,22,0.76)' }, children: [_jsx("div", { style: { fontSize: '0.66rem', color: 'var(--text-secondary)', letterSpacing: '0.22rem', marginBottom: '14px' }, children: "ACTIVE DECK" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' }, children: deck.map((id, index) => {
                                    const card = getCardById(id);
                                    const palette = getCardPalette(card);
                                    return (_jsxs("button", { onClick: () => {
                                            setFocusedCardId(id);
                                            removeFromDeck(index);
                                        }, style: {
                                            display: 'grid',
                                            gridTemplateColumns: '34px 1fr auto',
                                            gap: '12px',
                                            alignItems: 'center',
                                            padding: '12px 14px',
                                            background: 'rgba(255,255,255,0.04)',
                                            border: `1px solid ${palette.accent}22`,
                                            borderRadius: '14px',
                                            color: 'white',
                                            cursor: 'pointer',
                                            textAlign: 'left'
                                        }, children: [_jsx("div", { style: { color: 'rgba(255,255,255,0.35)', fontWeight: 800 }, children: index + 1 }), _jsxs("div", { children: [_jsx("div", { style: { fontWeight: 700 }, children: card === null || card === void 0 ? void 0 : card.name.toUpperCase() }), _jsx("div", { style: { fontSize: '0.68rem', color: palette.accent, letterSpacing: '0.14rem' }, children: card === null || card === void 0 ? void 0 : card.cardType.toUpperCase() })] }), _jsx("div", { style: { color: 'var(--accent-yellow)', fontWeight: 800 }, children: card === null || card === void 0 ? void 0 : card.cost })] }, `${id}-${index}`));
                                }) })] }), _jsx("button", { className: "champion-button champion-button-primary compact", disabled: deck.length !== 24, onClick: () => setScene('APARTMENT'), style: { color: 'black' }, children: "SYNC & DEPLOY" })] })] }));
};
const Metric = ({ label, value, accent }) => (_jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '0.16rem' }, children: label }), _jsx("div", { style: { marginTop: '6px', fontSize: '1.3rem', fontWeight: 800, color: accent }, children: value })] }));
const CollectionCard = ({ id, onAdd, onFocus }) => {
    var _a, _b, _c, _d;
    const card = getCardById(id);
    if (!card)
        return null;
    const palette = getCardPalette(card);
    return (_jsxs("button", { onClick: () => {
            onFocus();
            onAdd();
        }, style: {
            minHeight: '260px',
            borderRadius: '24px',
            border: `1px solid ${palette.accent}`,
            background: `${palette.panel}, linear-gradient(180deg, ${palette.rarityFinish}, transparent 72%)`,
            boxShadow: `0 16px 34px ${palette.glow}`,
            padding: '16px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'left'
        }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', gap: '8px' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.54rem', color: palette.accent, letterSpacing: '0.16rem' }, children: card.cardType.toUpperCase() }), _jsx("div", { style: { marginTop: '6px', fontSize: '1rem', fontWeight: 800 }, children: card.name })] }), _jsx("div", { style: { color: 'var(--accent-yellow)', fontWeight: 800 }, children: card.cost })] }), _jsx("div", { style: { flex: 1, marginTop: '14px', borderRadius: '18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx("div", { style: { width: '72px', height: '72px', background: palette.glow, borderRadius: '999px', filter: 'blur(12px)' } }) }), _jsx("div", { style: { marginTop: '14px', fontSize: '0.76rem', lineHeight: 1.45, color: 'var(--text-secondary)', minHeight: '42px' }, children: (_b = (_a = card.rulesText) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : 'No effect text loaded.' }), _jsxs("div", { style: { marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }, children: [_jsx("div", { style: { fontSize: '0.6rem', color: palette.accent, letterSpacing: '0.14rem' }, children: card.rarity.toUpperCase() }), _jsx("div", { style: { fontWeight: 800 }, children: card.cardType === 'creature' ? `${(_c = card.attack) !== null && _c !== void 0 ? _c : '-'} / ${(_d = card.health) !== null && _d !== void 0 ? _d : '-'}` : 'TACTIC' })] })] }));
};
const FocusedCardPanel = ({ card }) => {
    var _a, _b, _c;
    const palette = getCardPalette(card);
    return (_jsxs("div", { className: "glass-panel", style: { padding: '20px', background: `${palette.panel}`, border: `1px solid ${palette.accent}` }, children: [_jsx("div", { style: { fontSize: '0.66rem', color: palette.accent, letterSpacing: '0.22rem' }, children: "CARD DETAIL" }), _jsx("div", { style: { marginTop: '10px', fontSize: '1.6rem', fontWeight: 800 }, children: card.name.toUpperCase() }), _jsxs("div", { style: { marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }, children: [_jsx(Tag, { label: card.cardType.toUpperCase(), accent: palette.accent }), card.creatureType && _jsx(Tag, { label: card.creatureType.toUpperCase(), accent: "var(--accent-yellow)" }), _jsx(Tag, { label: `${card.cost} EN`, accent: "var(--text-primary)" })] }), _jsx("div", { style: { marginTop: '14px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }, children: ((_a = card.rulesText) !== null && _a !== void 0 ? _a : ['No effect text loaded.']).join(' ') }), card.cardType === 'creature' && _jsxs("div", { style: { marginTop: '16px', fontSize: '1.2rem', fontWeight: 800 }, children: [(_b = card.attack) !== null && _b !== void 0 ? _b : '-', " / ", (_c = card.health) !== null && _c !== void 0 ? _c : '-'] })] }));
};
const Tag = ({ label, accent }) => (_jsx("div", { style: { padding: '4px 10px', border: `1px solid ${accent}`, borderRadius: '999px', fontSize: '0.6rem', letterSpacing: '0.12rem', color: accent }, children: label }));
