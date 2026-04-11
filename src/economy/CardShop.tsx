import React from 'react';
import { useGame } from '../core/GameContext';
import { ShopItem } from '../core/types';
import '../styles/SonsotyoScenes.css';

const SHOP_INVENTORY: ShopItem[] = [
  { id: 'p1', targetId: 'Metro Pulse', name: 'METRO PULSE PACK', description: 'Core data from the city rhythm.', cost: 200, type: 'PACK', image: '/pack_pulse.png' },
  { id: 'p2', targetId: 'Neural Veil', name: 'NEURAL VEIL PACK', description: 'Technical denial and alloys.', cost: 250, type: 'PACK', image: '/pack_veil.png' },
  { id: 's1', targetId: 'neon-striker', name: 'NEON STRIKER (SINGLE)', description: 'Direct acquisition of the combat classic.', cost: 500, type: 'SINGLE', image: '' },
  { id: 's2', targetId: 'voltlynx', name: 'VOLTLYNX (SINGLE)', description: 'Fast-sync voltage unit.', cost: 450, type: 'SINGLE', image: '' },
  { id: 'c1', targetId: 'Gold Sleeve', name: 'CHAMPION SLEEVES', description: 'Cosmetic module for your data.', cost: 1000, type: 'COSMETIC', image: '' }
];

export const CardShop: React.FC = () => {
  const { state, updateProfile, setScene } = useGame();
  const { profile } = state;

  const buyItem = (item: ShopItem) => {
    if (profile.currency < item.cost) {
      alert('Insufficient Currency!');
      return;
    }

    const newCurrency = profile.currency - item.cost;
    const newInventory = { ...profile.inventory };

    if (item.type === 'PACK') newInventory.packs = [...newInventory.packs, item.targetId];
    else if (item.type === 'SINGLE') newInventory.cards = [...newInventory.cards, item.targetId];
    else if (item.type === 'COSMETIC') newInventory.items = [...newInventory.items, item.targetId];

    updateProfile({ currency: newCurrency, inventory: newInventory });
    alert(`Acquired: ${item.name}`);
  };

  return (
    <div
      className="shop-scene sonsotyo-scene fade-in"
      style={{
        minHeight: '100vh',
        padding: '40px',
        background:
          'linear-gradient(180deg, rgba(8,10,18,0.82), rgba(4,6,10,0.94)), radial-gradient(circle at 18% 18%, rgba(126,242,255,0.12), transparent 22%), url(/market_arcade_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        position: 'relative'
      }}
    >
      <div className="sonsotyo-overlay" />
      <div className="scanlines" />

      <div className="sonsotyo-content" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <div className="sonsotyo-hero">
          <div className="glass-panel sonsotyo-hero-card">
            <div className="sonsotyo-kicker">Hub Commerce Gateway</div>
            <h1 className="sonsotyo-title" style={{ fontSize: 'clamp(2.8rem, 6vw, 4.8rem)', marginTop: '10px' }}>Card Master Boutique</h1>
            <p className="sonsotyo-copy" style={{ maxWidth: '46ch', marginTop: '14px' }}>
              A sleep-lit market shelf for packs, singles, and prestige flourishes.
            </p>
          </div>

          <div className="glass-panel sonsotyo-panel">
            <div className="sonsotyo-kicker">Available Sync</div>
            <div style={{ marginTop: '12px', fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--accent-primary)' }}>{profile.currency} CR</div>
            <div className="sonsotyo-copy" style={{ marginTop: '10px' }}>Spend carefully or chase rarity heat.</div>
          </div>
        </div>

        <div className="sonsotyo-grid cards">
          {SHOP_INVENTORY.map((item) => (
            <div
              key={item.id}
              className="glass-panel shop-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '360px',
                background: 'rgba(5,5,15,0.8)',
                borderTop: `3px solid ${item.type === 'PACK' ? 'var(--accent-secondary)' : item.type === 'SINGLE' ? 'var(--accent-primary)' : 'var(--accent-yellow)'}`
              }}
            >
              <div className="sonsotyo-kicker" style={{ marginBottom: '10px' }}>{item.type}_MODULE</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '14px' }}>{item.name}</h3>
              <p className="sonsotyo-copy" style={{ flex: 1 }}>{item.description}</p>

              <div className="glass-panel sonsotyo-panel" style={{ padding: '14px', marginTop: '18px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>{item.cost} CR</span>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: profile.currency >= item.cost ? 'var(--accent-primary)' : 'var(--accent-secondary)' }} />
              </div>

              <button className={`neo-button ${profile.currency >= item.cost ? 'primary' : ''}`} onClick={() => buyItem(item)} disabled={profile.currency < item.cost} style={{ height: '50px' }}>
                {profile.currency >= item.cost ? 'Acquire Data' : 'Sync Failed'}
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '18px', textAlign: 'center' }}>
          <button className="neo-button" onClick={() => setScene('DISTRICT_EXPLORE')}>Return To District</button>
        </div>
      </div>

      <style>{`
        .shop-card { transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
        .shop-card:hover { transform: translateY(-10px); background: rgba(10,10,30,0.95); box-shadow: 0 20px 50px rgba(0,242,255,0.1); }
      `}</style>
    </div>
  );
};
