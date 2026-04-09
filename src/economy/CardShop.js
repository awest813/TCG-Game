import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useGame } from '../core/GameStateContext';
const SHOP_INVENTORY = [
    { id: 'p1', targetId: 'Metro Pulse', name: 'METRO PULSE PACK', description: 'Core data from the city rhythm.', cost: 200, type: 'PACK', image: '/pack_pulse.png' },
    { id: 'p2', targetId: 'Neural Veil', name: 'NEURAL VEIL PACK', description: 'Technical denial and alloys.', cost: 250, type: 'PACK', image: '/pack_veil.png' },
    { id: 's1', targetId: 'neon-striker', name: 'NEON STRIKER (SINGLE)', description: 'Direct acquisition of the combat classic.', cost: 500, type: 'SINGLE', image: '' },
    { id: 's2', targetId: 'voltlynx', name: 'VOLTLYNX (SINGLE)', description: 'Fast-sync voltage unit.', cost: 450, type: 'SINGLE', image: '' },
    { id: 'c1', targetId: 'Gold Sleeve', name: 'CHAMPION SLEEVES', description: 'Cosmetic module for your data.', cost: 1000, type: 'COSMETIC', image: '' },
];
export const CardShop = () => {
    const { state, updateProfile, setScene } = useGame();
    const { profile } = state;
    const buyItem = (item) => {
        if (profile.currency < item.cost) {
            alert("Insufficient Currency!");
            return;
        }
        const newCurrency = profile.currency - item.cost;
        let newInventory = Object.assign({}, profile.inventory);
        if (item.type === 'PACK') {
            newInventory.packs = [...newInventory.packs, item.targetId];
        }
        else if (item.type === 'SINGLE') {
            newInventory.cards = [...newInventory.cards, item.targetId];
        }
        else if (item.type === 'COSMETIC') {
            newInventory.items = [...newInventory.items, item.targetId];
        }
        updateProfile({ currency: newCurrency, inventory: newInventory });
        alert(`Acquired: ${item.name}`);
    };
    return (_jsxs("div", { className: "shop-scene fade-in", style: {
            height: '100vh',
            padding: '60px',
            background: 'linear-gradient(135deg, #050510 0%, #0a0a20 100%)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
        }, children: [_jsx("div", { className: "scanlines" }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '80px' }, children: [_jsxs("div", { children: [_jsx("h1", { className: "glow-text", style: { fontSize: '1rem', letterSpacing: '10px', opacity: 0.5 }, children: "HUB_COMMERCE_GATEWAY" }), _jsx("h2", { style: { fontSize: '3rem', fontWeight: 900, margin: 0 }, children: "CARD_MASTER BOUTIQUE" })] }), _jsxs("div", { className: "glass-panel", style: { padding: '20px 40px', borderLeft: '5px solid var(--accent-cyan)' }, children: [_jsx("div", { style: { fontSize: '0.6rem', color: 'var(--text-secondary)' }, children: "AVAILABLE_SYNC" }), _jsxs("div", { style: { fontSize: '2rem', fontWeight: 900, color: 'var(--accent-cyan)' }, children: [profile.currency, "\u20A1"] })] })] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }, children: SHOP_INVENTORY.map(item => (_jsxs("div", { className: "glass-panel shop-card", style: {
                        padding: '40px',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '450px',
                        background: 'rgba(5,5,15,0.8)',
                        borderBottom: `8px solid ${item.type === 'PACK' ? 'var(--accent-magenta)' : (item.type === 'SINGLE' ? 'var(--accent-cyan)' : 'var(--accent-yellow)')}`
                    }, children: [_jsxs("div", { style: { fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '3px', marginBottom: '10px' }, children: [item.type, "_MODULE"] }), _jsx("h3", { style: { fontSize: '1.4rem', fontWeight: 900, marginBottom: '20px' }, children: item.name }), _jsx("p", { style: { fontSize: '0.85rem', color: 'var(--text-secondary)', flex: 1 }, children: item.description }), _jsxs("div", { className: "glass-morphism", style: { padding: '15px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("span", { style: { fontSize: '1.5rem', fontWeight: 900 }, children: [item.cost, "\u20A1"] }), _jsx("div", { style: { width: '8px', height: '8px', borderRadius: '50%', background: profile.currency >= item.cost ? 'var(--accent-cyan)' : 'var(--accent-magenta)' } })] }), _jsx("button", { className: `neo-button ${profile.currency >= item.cost ? 'primary' : ''}`, onClick: () => buyItem(item), disabled: profile.currency < item.cost, style: { height: '50px' }, children: profile.currency >= item.cost ? 'ACQUIRE DATA' : 'SYNC_FAILED' })] }, item.id))) }), _jsx("div", { style: { marginTop: 'auto', paddingTop: '60px', textAlign: 'center' }, children: _jsx("button", { className: "neo-button", onClick: () => setScene('DISTRICT_EXPLORE'), children: "RETURN TO DISTRICT" }) }), _jsx("style", { children: `
                .shop-card { transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
                .shop-card:hover { transform: translateY(-15px); background: rgba(10,10,30,0.95); box-shadow: 0 20px 50px rgba(0,242,255,0.1); }
            ` })] }));
};
