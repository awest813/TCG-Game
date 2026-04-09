import React from 'react';
import { useGame } from '../core/GameStateContext';
import { ShopItem } from '../core/types';

const SHOP_INVENTORY: ShopItem[] = [
    { id: 'p1', targetId: 'Metro Pulse', name: 'METRO PULSE PACK', description: 'Core data from the city rhythm.', cost: 200, type: 'PACK', image: '/pack_pulse.png' },
    { id: 'p2', targetId: 'Neural Veil', name: 'NEURAL VEIL PACK', description: 'Technical denial and alloys.', cost: 250, type: 'PACK', image: '/pack_veil.png' },
    { id: 's1', targetId: 'neon-striker', name: 'NEON STRIKER (SINGLE)', description: 'Direct acquisition of the combat classic.', cost: 500, type: 'SINGLE', image: '' },
    { id: 's2', targetId: 'voltlynx', name: 'VOLTLYNX (SINGLE)', description: 'Fast-sync voltage unit.', cost: 450, type: 'SINGLE', image: '' },
    { id: 'c1', targetId: 'Gold Sleeve', name: 'CHAMPION SLEEVES', description: 'Cosmetic module for your data.', cost: 1000, type: 'COSMETIC', image: '' },
];

export const CardShop: React.FC = () => {
    const { state, updateProfile, setScene } = useGame();
    const { profile } = state;

    const buyItem = (item: ShopItem) => {
        if (profile.currency < item.cost) {
            alert("Insufficient Currency!");
            return;
        }

        const newCurrency = profile.currency - item.cost;
        let newInventory = { ...profile.inventory };

        if (item.type === 'PACK') {
            newInventory.packs = [...newInventory.packs, item.targetId];
        } else if (item.type === 'SINGLE') {
            newInventory.cards = [...newInventory.cards, item.targetId];
        } else if (item.type === 'COSMETIC') {
            newInventory.items = [...newInventory.items, item.targetId];
        }

        updateProfile({ currency: newCurrency, inventory: newInventory });
        alert(`Acquired: ${item.name}`);
    };

    return (
        <div className="shop-scene fade-in" style={{ 
            height: '100vh', 
            padding: '60px',
            background: 'linear-gradient(135deg, #050510 0%, #0a0a20 100%)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
        }}>
            <div className="scanlines" />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '80px' }}>
                <div>
                    <h1 className="glow-text" style={{ fontSize: '1rem', letterSpacing: '10px', opacity: 0.5 }}>HUB_COMMERCE_GATEWAY</h1>
                    <h2 style={{ fontSize: '3rem', fontWeight: 900, margin: 0 }}>CARD_MASTER BOUTIQUE</h2>
                </div>
                <div className="glass-panel" style={{ padding: '20px 40px', borderLeft: '5px solid var(--accent-cyan)' }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>AVAILABLE_SYNC</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>{profile.currency}₡</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                {SHOP_INVENTORY.map(item => (
                    <div key={item.id} className="glass-panel shop-card" style={{ 
                        padding: '40px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        minHeight: '450px',
                        background: 'rgba(5,5,15,0.8)',
                        borderBottom: `8px solid ${item.type === 'PACK' ? 'var(--accent-magenta)' : (item.type === 'SINGLE' ? 'var(--accent-cyan)' : 'var(--accent-yellow)')}`
                    }}>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '3px', marginBottom: '10px' }}>{item.type}_MODULE</div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '20px' }}>{item.name}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', flex: 1 }}>{item.description}</p>
                        
                        <div className="glass-morphism" style={{ padding: '15px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>{item.cost}₡</span>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: profile.currency >= item.cost ? 'var(--accent-cyan)' : 'var(--accent-magenta)' }}></div>
                        </div>

                        <button 
                            className={`neo-button ${profile.currency >= item.cost ? 'primary' : ''}`}
                            onClick={() => buyItem(item)}
                            disabled={profile.currency < item.cost}
                            style={{ height: '50px' }}
                        >
                            {profile.currency >= item.cost ? 'ACQUIRE DATA' : 'SYNC_FAILED'}
                        </button>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '60px', textAlign: 'center' }}>
                <button className="neo-button" onClick={() => setScene('DISTRICT_EXPLORE')}>RETURN TO DISTRICT</button>
            </div>
            
            <style>{`
                .shop-card { transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
                .shop-card:hover { transform: translateY(-15px); background: rgba(10,10,30,0.95); box-shadow: 0 20px 50px rgba(0,242,255,0.1); }
            `}</style>
        </div>
    );
};
