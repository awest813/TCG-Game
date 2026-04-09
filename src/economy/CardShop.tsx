import React, { useState } from 'react';
import { useGame } from '../core/GameStateContext';

export const CardShop: React.FC = () => {
  const { state, updateProfile, setScene } = useGame();
  const [balance, setBalance] = useState(state.profile.credits);

  const buyPack = (cost: number, name: string) => {
    if (balance < cost) {
        alert("Insufficient Credits!");
        return;
    }
    setBalance(prev => prev - cost);
    updateProfile({
        credits: balance - cost,
        inventory: {
            ...state.profile.inventory,
            packs: [...state.profile.inventory.packs, name]
        }
    });
    if (confirm(`Purchased ${name}! Go to decryption center now?`)) {
        setScene('PACK_OPENING');
    }
  };

  return (
    <div className="shop-scene fade-in" style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '40px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '60px' }}>
          <div>
              <h1 className="glow-text" style={{ fontSize: '3rem' }}>SUNSET CARD SHOP</h1>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '2px' }}>EXCHANGE CREDITS FOR DECRYPTED DATA PACKS</div>
          </div>
          <div className="glass-panel" style={{ padding: '15px 40px', fontSize: '1.5rem', borderRadius: '50px', border: '2px solid var(--accent-yellow)', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '1rem', opacity: 0.5 }}>BALANCE:</span>
              <span style={{ color: 'var(--accent-yellow)', fontWeight: 'bold' }}>{balance} ₡</span>
          </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', paddingBottom: '40px' }}>
          {/* Pack 1 */}
          <div className="glass-panel shop-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: 'var(--accent-cyan)' }}></div>
              <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1.5rem', letterSpacing: '2px' }}>METRO PULSE</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '20px 0', lineHeight: '1.6' }}>The city's core rhythm. Contains standard Pulse and Current units suitable for most tactical decks.</p>
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>200 ₡</span>
                  <button className="neo-button" style={{ borderColor: 'var(--accent-cyan)' }} onClick={() => buyPack(200, "Metro Pulse")}>PURCHASE</button>
              </div>
          </div>

          {/* Pack 2 */}
          <div className="glass-panel shop-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: 'var(--accent-magenta)' }}></div>
              <h3 style={{ color: 'var(--accent-magenta)', fontSize: '1.5rem', letterSpacing: '2px' }}>NEURAL VEIL</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '20px 0', lineHeight: '1.6' }}>Specialized disruption data. Focuses on Veil and Alloy units designed for technical denial strategies.</p>
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>250 ₡</span>
                  <button className="neo-button" style={{ borderColor: 'var(--accent-magenta)' }} onClick={() => buyPack(250, "Neural Veil")}>PURCHASE</button>
              </div>
          </div>

          {/* Special */}
          <div className="glass-panel shop-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: 'var(--accent-yellow)' }}></div>
              <h3 style={{ color: 'var(--accent-yellow)', fontSize: '1.5rem', letterSpacing: '2px' }}>DAILY SPECIAL</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '20px 0', lineHeight: '1.6' }}>A high-yield utility bundle of support and item cards sourced from the Market Central overflow.</p>
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>150 ₡</span>
                  <button className="neo-button" style={{ borderColor: 'var(--accent-yellow)' }} onClick={() => buyPack(150, "Utility Bundle")}>PURCHASE</button>
              </div>
          </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto' }}>
          <button className="neo-button" style={{ minWidth: '300px' }} onClick={() => setScene('DISTRICT_EXPLORE')}>RETURN TO DISTRICT</button>
      </div>

      <style>{`
          .shop-card { transition: transform 0.3s, box-shadow 0.3s; }
          .shop-card:hover { transform: translateY(-10px); box-shadow: 0 10px 40px rgba(0,0,0,0.4); }
      `}</style>
    </div>
  );
};
