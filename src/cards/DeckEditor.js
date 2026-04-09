import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { useGame } from '../core/GameStateContext';
import { getCardById } from '../data/cards';
export const DeckEditor = () => {
    const { state, updateProfile, setScene } = useGame();
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const deck = state.profile.inventory.deck;
    const collection = state.profile.inventory.cards;
    const filteredCollection = useMemo(() => {
        return collection.filter(id => {
            const card = getCardById(id);
            if (!card)
                return false;
            const matchesType = filter === 'ALL' || card.creatureType === filter;
            const matchesSearch = card.name.toLowerCase().includes(search.toLowerCase());
            return matchesType && matchesSearch;
        });
    }, [collection, filter, search]);
    const addToDeck = (cardId) => {
        if (deck.length >= 24)
            return;
        updateProfile({
            inventory: Object.assign(Object.assign({}, state.profile.inventory), { deck: [...deck, cardId] })
        });
    };
    const removeFromDeck = (index) => {
        const newDeck = [...deck];
        newDeck.splice(index, 1);
        updateProfile({
            inventory: Object.assign(Object.assign({}, state.profile.inventory), { deck: newDeck })
        });
    };
    const manaCurve = [0, 0, 0, 0, 0, 0, 0];
    deck.forEach(id => {
        var _a;
        const cost = ((_a = getCardById(id)) === null || _a === void 0 ? void 0 : _a.cost) || 0;
        manaCurve[Math.min(cost, 6)]++;
    });
    const maxCurve = Math.max(...manaCurve, 1);
    return (_jsxs("div", { className: "deck-editor-scene fade-in", style: {
            height: '100vh',
            display: 'grid',
            gridTemplateColumns: '1fr 450px',
            background: '#020208',
            color: 'white',
            overflow: 'hidden'
        }, children: [_jsxs("div", { style: { padding: '40px', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(0, 242, 255, 0.1)' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }, children: [_jsxs("div", { children: [_jsx("h1", { className: "glow-text", style: { fontSize: '3.5rem', margin: 0 }, children: "TECH_BAY" }), _jsx("div", { style: { color: 'var(--accent-cyan)', fontSize: '0.8rem', letterSpacing: '4px' }, children: "COLLECTION DATABASE // CLOUD_SYNC: OK" })] }), _jsx("div", { style: { display: 'flex', gap: '10px' }, children: _jsx("input", { type: "text", placeholder: "SEARCH CARD...", value: search, onChange: (e) => setSearch(e.target.value), style: {
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'white',
                                        padding: '10px 20px',
                                        borderRadius: '4px',
                                        outline: 'none'
                                    } }) })] }), _jsx("div", { style: { display: 'flex', gap: '8px', marginBottom: '30px', flexWrap: 'wrap' }, children: ['ALL', 'Pulse', 'Bloom', 'Tide', 'Alloy', 'Veil', 'Current'].map(t => (_jsx("button", { onClick: () => setFilter(t), className: `filter-btn ${filter === t ? 'active' : ''}`, style: {
                                padding: '6px 15px',
                                fontSize: '0.7rem',
                                background: filter === t ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.05)',
                                color: filter === t ? 'black' : 'white',
                                border: 'none',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                transition: '0.2s',
                                fontWeight: 'bold',
                                letterSpacing: '1px'
                            }, children: t.toUpperCase() }, t))) }), _jsx("div", { className: "custom-scroll", style: { flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px', paddingRight: '20px' }, children: filteredCollection.map((id, i) => (_jsx(CollectionCard, { id: id, onAdd: () => addToDeck(id) }, i))) })] }), _jsxs("div", { style: { background: 'rgba(255,255,255,0.02)', padding: '40px', display: 'flex', flexDirection: 'column', position: 'relative' }, children: [_jsx("div", { style: { position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, var(--accent-cyan), var(--accent-magenta))' } }), _jsxs("div", { style: { marginBottom: '30px' }, children: [_jsx("div", { style: { fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '2px' }, children: "ACTIVE LOADOUT" }), _jsx("h2", { style: { fontSize: '2.2rem', marginTop: '10px', fontWeight: 900 }, children: "MAIN_SYNC" }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginTop: '20px', alignItems: 'flex-end' }, children: [_jsxs("div", { children: [_jsxs("div", { style: { fontSize: '1.5rem', fontWeight: 'bold', color: deck.length === 24 ? 'var(--accent-cyan)' : 'white' }, children: [deck.length, " / 24"] }), _jsx("div", { style: { fontSize: '0.6rem', opacity: 0.5 }, children: "CARD COUNT" })] }), _jsxs("div", { style: { textAlign: 'right' }, children: [_jsxs("div", { style: { fontSize: '1.2rem', fontWeight: 'bold' }, children: [(deck.reduce((acc, id) => { var _a; return acc + (((_a = getCardById(id)) === null || _a === void 0 ? void 0 : _a.cost) || 0); }, 0) / (deck.length || 1)).toFixed(1), "\u26A1"] }), _jsx("div", { style: { fontSize: '0.6rem', opacity: 0.5 }, children: "AVG_SYNC_COST" })] })] })] }), _jsx("div", { style: { height: '80px', display: 'flex', alignItems: 'flex-end', gap: '4px', marginBottom: '30px', padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }, children: manaCurve.map((count, i) => (_jsxs("div", { style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }, children: [_jsx("div", { style: {
                                        width: '100%',
                                        height: `${(count / maxCurve) * 50}px`,
                                        background: 'var(--accent-cyan)',
                                        borderRadius: '2px 2px 0 0',
                                        opacity: count > 0 ? 0.8 : 0.1,
                                        transition: '0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                    } }), _jsxs("div", { style: { fontSize: '0.5rem', opacity: 0.5 }, children: [i, i === 6 ? '+' : ''] })] }, i))) }), _jsx("div", { className: "custom-scroll", style: { flex: 1, overflowY: 'auto', marginBottom: '30px', paddingRight: '10px' }, children: deck.map((id, i) => {
                            const card = getCardById(id);
                            return (_jsxs("div", { className: "deck-item-anim", onClick: () => removeFromDeck(i), style: {
                                    display: 'flex',
                                    padding: '12px 20px',
                                    background: 'rgba(255,255,255,0.03)',
                                    marginBottom: '6px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    borderLeft: `3px solid ${(card === null || card === void 0 ? void 0 : card.creatureType) ? 'var(--accent-cyan)' : 'var(--accent-magenta)'}`,
                                    animation: 'slideIn 0.3s ease-out'
                                }, children: [_jsx("div", { style: { width: '30px', color: 'rgba(255,255,255,0.2)', fontWeight: 'bold' }, children: i + 1 }), _jsx("div", { style: { flex: 1, fontWeight: 'bold' }, children: card === null || card === void 0 ? void 0 : card.name.toUpperCase() }), _jsx("div", { style: { color: 'var(--accent-yellow)' }, children: card === null || card === void 0 ? void 0 : card.cost })] }, i));
                        }) }), _jsx("button", { className: "champion-button", disabled: deck.length !== 24, onClick: () => setScene('APARTMENT'), style: { width: '100%', padding: '20px', borderRadius: '4px', background: deck.length === 24 ? 'white' : 'transparent' }, children: "SYNC & DEPLOY" })] }), _jsx("style", { children: `
          .filter-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0, 242, 255, 0.2); }
          .deck-item-anim:hover { background: rgba(255,255,255,0.1); transform: translateX(5px); }
          @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
          .custom-scroll::-webkit-scrollbar { width: 4px; }
          .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      ` })] }));
};
const CollectionCard = ({ id, onAdd }) => {
    var _a;
    const card = getCardById(id);
    if (!card)
        return null;
    return (_jsxs("div", { className: "coll-card", onClick: onAdd, style: {
            aspectRatio: '5/7',
            background: 'rgba(5,5,15,0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '20px',
            cursor: 'pointer',
            transition: '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
        }, children: [_jsx("div", { style: { fontSize: '0.6rem', color: 'var(--accent-cyan)', letterSpacing: '2px', marginBottom: '5px' }, children: ((_a = card.creatureType) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || 'SUPPORT' }), _jsx("div", { style: { fontSize: '1.2rem', fontWeight: '900', color: 'white' }, children: card.name }), _jsx("div", { style: { flex: 1 } }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }, children: [_jsxs("div", { style: { fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-yellow)' }, children: [card.cost, _jsx("span", { style: { fontSize: '0.7rem', opacity: 0.5 }, children: "\u26A1" })] }), card.cardType === 'creature' && (_jsx("div", { style: { textAlign: 'right' }, children: _jsxs("div", { style: { fontSize: '1.2rem', fontWeight: '900' }, children: [card.attack, "/", card.health] }) }))] }), _jsx("style", { children: `
                .coll-card:hover {
                    border-color: var(--accent-cyan);
                    background: rgba(0, 242, 255, 0.05);
                    transform: scale(1.05) translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0, 242, 255, 0.15);
                }
                .coll-card:active { transform: scale(0.95); }
            ` })] }));
};
