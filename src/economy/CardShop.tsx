import React from 'react';
import { useGame } from '../core/GameContext';
import { audioManager } from '../core/AudioManager';
import { ShopItem } from '../core/types';
import { getCardById } from '../data/cards';
import '../styles/SonsotyoScenes.css';

const SHOP_INVENTORY: ShopItem[] = [
  { id: 'p1', targetId: 'Metro Pulse', name: 'METRO PULSE PACK', description: 'Core data from the city rhythm.', cost: 200, type: 'PACK', image: '/pack_pulse.png' },
  { id: 'p2', targetId: 'Neural Veil', name: 'NEURAL VEIL PACK', description: 'Technical denial and alloys.', cost: 250, type: 'PACK', image: '/pack_veil.png' },
  { id: 's1', targetId: 'neon-striker', name: 'NEON STRIKER (SINGLE)', description: 'Direct acquisition of the combat classic.', cost: 500, type: 'SINGLE', image: '' },
  { id: 's2', targetId: 'voltlynx', name: 'VOLTLYNX (SINGLE)', description: 'Fast-sync voltage unit.', cost: 450, type: 'SINGLE', image: '' },
  { id: 'c1', targetId: 'Gold Sleeve', name: 'CHAMPION SLEEVES', description: 'Cosmetic module for your data.', cost: 1000, type: 'COSMETIC', image: '' }
];

export const CardShop: React.FC = () => {
  const { state, updateProfile, updateGameState, setScene } = useGame();
  const { profile } = state;

  React.useEffect(() => {
    audioManager.playBGM('SHOP');
    return () => {
      audioManager.playBGM('TOWN');
    };
  }, []);

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
      <div className="shop-boutique-layer" aria-hidden />
      <div className="sonsotyo-overlay" />
      <div className="scanlines" />

      <div className="sonsotyo-content" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <div className="sonsotyo-hero">
          <div className="glass-panel sonsotyo-hero-card">
            <div className="sonsotyo-kicker">Hub Commerce Gateway</div>
            <h1 className="sonsotyo-title" style={{ fontSize: 'clamp(2.8rem, 6vw, 4.8rem)', marginTop: '10px' }}>Card Master Boutique</h1>
            <p className="sonsotyo-copy" style={{ maxWidth: '46ch', marginTop: '14px' }}>
              A soft-lit shelf line for boosters, curated singles, and prestige flourishes. Neon glass, quiet hum, rare pulls waiting behind the counter glow.
            </p>
            <div className="sonsotyo-meta-strip" style={{ marginTop: '18px' }}>
              <div className="sonsotyo-pill" style={{ borderColor: 'rgba(255,227,154,0.35)' }}>
                Floor audio: boutique loop
              </div>
              <div className="sonsotyo-pill">Stock rotates with district league data</div>
              <div className="sonsotyo-pill" style={{ color: 'var(--accent-secondary)' }}>
                Singles verified
              </div>
            </div>
          </div>

          <div className="glass-panel sonsotyo-panel">
            <div className="sonsotyo-kicker">Available Sync</div>
            <div style={{ marginTop: '12px', fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--accent-primary)' }}>{profile.currency} CR</div>
            <div className="sonsotyo-copy" style={{ marginTop: '10px' }}>Spend carefully or chase rarity heat.</div>
            <div className="shop-shelf-rail" />
            <div className="sonsotyo-caption">Counter closes when you leave the district route.</div>
          </div>
        </div>

        <div className="sonsotyo-grid cards">
          {SHOP_INVENTORY.map((item) => {
            const linkedCard = item.type === 'SINGLE' ? getCardById(item.targetId) : undefined;
            const showcaseSrc = item.image || linkedCard?.image || '';
            const accent =
              item.type === 'PACK' ? 'var(--accent-secondary)' : item.type === 'SINGLE' ? 'var(--accent-primary)' : 'var(--accent-yellow)';

            return (
            <div
              key={item.id}
              className="glass-panel shop-product-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '360px',
                background: 'rgba(5,5,15,0.8)',
                borderTop: `3px solid ${accent}`
              }}
            >
              <div className="sonsotyo-kicker" style={{ marginBottom: '10px' }}>{item.type}_MODULE</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '14px' }}>{item.name}</h3>

              <div className="shop-display-niche">
                {showcaseSrc ? (
                  <img src={showcaseSrc} alt="" />
                ) : (
                  <div className="shop-display-niche--empty" style={{ color: accent }}>
                    {item.type === 'COSMETIC' ? 'Display case' : 'Holo slip'}
                  </div>
                )}
              </div>

              <p className="sonsotyo-copy" style={{ flex: 1 }}>{item.description}</p>

              <div className="glass-panel sonsotyo-panel" style={{ padding: '14px', marginTop: '18px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>{item.cost} CR</span>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: profile.currency >= item.cost ? 'var(--accent-primary)' : 'var(--accent-secondary)' }} />
              </div>

              <button className={`neo-button ${profile.currency >= item.cost ? 'primary' : ''}`} onClick={() => buyItem(item)} disabled={profile.currency < item.cost} style={{ height: '50px' }}>
                {profile.currency >= item.cost ? 'Acquire Data' : 'Sync Failed'}
              </button>
            </div>
            );
          })}
        </div>

        <div className="glass-panel sonsotyo-panel" style={{ padding: '30px', marginTop: '20px', borderLeft: '4px solid var(--accent-secondary)' }}>
          <div className="sonsotyo-kicker">Local Events</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginTop: '8px' }}>Active Shop Tournaments</h2>
          <p className="sonsotyo-copy" style={{ marginTop: '10px', maxWidth: '60ch' }}>
            The backroom is open for regulation brackets. Small buy-ins, fast cycles, and guaranteed credit payouts for the winners.
          </p>
          
          <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div className="glass-panel shop-product-card" style={{ flex: '1', minWidth: '300px', padding: '20px', background: 'rgba(5,5,15,0.6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--accent-primary)' }}>Beginner Initiation</div>
                <div className="sonsotyo-pill" style={{ background: 'var(--accent-primary)', color: 'var(--bg-primary)' }}>FREE</div>
              </div>
              <p className="sonsotyo-copy" style={{ marginTop: '12px', fontSize: '0.9rem' }}>
                Free entry bracket for new duelists. Practice and earn your first credits!
              </p>
              <button 
                className="neo-button primary" 
                style={{ marginTop: '15px', width: '100%' }}
                onClick={() => {
                  updateGameState({ pendingTournamentId: 'shop-beginner-circuit' });
                  setScene('TOURNAMENT');
                }}
              >
                Start Bracket
              </button>
            </div>

            <div className="glass-panel shop-product-card" style={{ flex: '1', minWidth: '300px', padding: '20px', background: 'rgba(5,5,15,0.6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--accent-secondary)' }}>Storefront Mini-Tourney</div>
                <div className="sonsotyo-pill">100 CR Entry</div>
              </div>
              <p className="sonsotyo-copy" style={{ marginTop: '12px', fontSize: '0.9rem' }}>
                A quick 2-round bracket for local regulars. Payout: 400 CR (base).
              </p>
              <button 
                className="neo-button" 
                style={{ marginTop: '15px', width: '100%' }}
                onClick={() => {
                  updateGameState({ pendingTournamentId: 'storefront-mini' });
                  setScene('TOURNAMENT');
                }}
              >
                Access Bracket
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '18px', textAlign: 'center' }}>
          <button className="neo-button" onClick={() => setScene('DISTRICT_EXPLORE')}>Return To District</button>
        </div>
      </div>

    </div>
  );
};
