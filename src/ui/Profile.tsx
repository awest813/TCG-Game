import React, { useState, useMemo } from 'react';
import { useGame } from '../core/GameContext';
import { FACTIONS, getFactionById, TRAINERS, mergeSocialState } from '../data/trainers';
import { getCardById, getCardPalette, CARD_POOL } from '../data/cards';
import { Card, CreatureType, PlayerProfile, SocialState } from '../core/types';

type ProfileTab = 'DOSSIER' | 'INVENTORY' | 'SYNC_ANALYTICS';

export const Profile: React.FC = () => {
  const { state, setScene } = useGame();
  const { profile } = state;
  const [activeTab, setActiveTab] = useState<ProfileTab>('DOSSIER');
  const social = mergeSocialState(profile.social);

  const inventoryCards = useMemo(() => {
    return profile.inventory.cards
      .map(id => getCardById(id))
      .filter((c): c is Card => !!c);
  }, [profile.inventory.cards]);

  const collectionProgress = useMemo(() => {
    const uniqueOwned = new Set(profile.inventory.cards).size;
    return Math.floor((uniqueOwned / CARD_POOL.length) * 100);
  }, [profile.inventory.cards]);

  return (
    <div
      className="profile-scene fade-in"
      style={{
        minHeight: '100vh',
        padding: '40px 60px',
        background: 'linear-gradient(135deg, #050510 0%, #0c0816 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowY: 'auto',
        position: 'relative'
      }}
    >
      <div className="scanlines" />
      
      {/* Header */}
      <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', zIndex: 10 }}>
        <div>
          <h1 className="glow-text" style={{ fontSize: '0.8rem', letterSpacing: '0.4rem', opacity: 0.5, color: 'var(--accent-cyan)' }}>USER_PROFILE_AUTHORIZED</h1>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, margin: '8px 0' }}>{profile.name.toUpperCase()}</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {(['DOSSIER', 'INVENTORY', 'SYNC_ANALYTICS'] as ProfileTab[]).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`neo-button ${activeTab === tab ? 'primary' : ''}`}
              style={{ fontSize: '0.75rem', padding: '12px 24px' }}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '1200px', zIndex: 10 }}>
        {activeTab === 'DOSSIER' && <DossierView profile={profile} social={social} />}
        {activeTab === 'INVENTORY' && <InventoryView cards={inventoryCards} progress={collectionProgress} />}
        {activeTab === 'SYNC_ANALYTICS' && <AnalyticsView stats={profile.stats} />}
      </div>

      <div style={{ marginTop: '50px', display: 'flex', gap: '20px', zIndex: 10 }}>
        <button className="neo-button" style={{ width: '220px' }} onClick={() => setScene('APARTMENT')}>
          RETURN TO HUB
        </button>
        <button className="neo-button" style={{ width: '220px' }} onClick={() => setScene('DISTRICT_EXPLORE')}>
          CITY STREETS
        </button>
      </div>
    </div>
  );
};

const DossierView: React.FC<{ profile: PlayerProfile; social: SocialState }> = ({ profile, social }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '30px' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', borderRight: '4px solid var(--accent-cyan)' }}>
        <div style={{ fontSize: '5rem', opacity: 0.1, fontWeight: 900 }}>{profile.name[0]}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 900, marginTop: '-20px' }}>RANK_{profile.level}</div>
        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <PassportStat label="WINS" value={profile.stats.wins} />
          <PassportStat label="SYMBOLS" value={profile.badges.length} />
        </div>
        <div style={{ marginTop: '24px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>CREDIT_BALANCE</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-yellow)' }}>{profile.currency} DP</div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.2rem', marginBottom: '20px' }}>FACTION_REP</h3>
        <div style={{ display: 'grid', gap: '14px' }}>
          {FACTIONS.map(f => (
            <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: f.accentColor }}>{f.name.toUpperCase()}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{social.factions[f.id].score}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="glass-panel" style={{ padding: '30px' }}>
       <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>KNOWN_CONTACTS</h3>
       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
         {TRAINERS.map(t => {
           const rel = social.trainers[t.id];
           const faction = getFactionById(t.factionId);
           return (
             <div key={t.id} className="glass-morphism" style={{ padding: '16px', borderLeft: `3px solid ${faction.accentColor}` }}>
               <div style={{ fontWeight: 800 }}>{t.name}</div>
               <div style={{ fontSize: '0.65rem', opacity: 0.6, margin: '4px 0 10px' }}>{t.title}</div>
               <div style={{ display: 'flex', gap: '12px', fontSize: '0.7rem' }}>
                 <span style={{ color: 'var(--accent-cyan)' }}>AFF:{rel.affinity}</span>
                 <span style={{ color: 'var(--accent-magenta)' }}>RIV:{rel.rivalry}</span>
               </div>
             </div>
           );
         })}
       </div>
    </div>
  </div>
);

const InventoryView: React.FC<{ cards: Card[]; progress: number }> = ({ cards, progress }) => {
  const [filter, setFilter] = useState<CreatureType | 'ALL'>('ALL');
  
  const filtered = useMemo(() => {
    if (filter === 'ALL') return cards;
    return cards.filter(c => c.creatureType === filter);
  }, [cards, filter]);

  return (
    <div className="glass-panel" style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900 }}>COLLECTION_VAULT</h3>
          <div style={{ color: 'var(--accent-cyan)', fontWeight: 700, marginTop: '4px' }}>DATABASE_SYNC: {progress}% COMPLETE</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['ALL', 'Pulse', 'Bloom', 'Tide', 'Alloy', 'Veil', 'Current'] as const).map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`opt-btn ${filter === f ? 'active' : ''}`}
              style={{ fontSize: '0.6rem', padding: '6px 12px' }}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px', maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
        {filtered.map((card, i) => {
          const pal = getCardPalette(card);
          return (
            <div key={i} className="glass-morphism" style={{ padding: '12px', border: `1px solid ${pal.accent}`, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: '0.55rem', color: pal.accent, marginBottom: '8px' }}>{card.creatureType?.toUpperCase() ?? 'TACTIC'}</div>
              <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{card.name.toUpperCase()}</div>
              {card.image && <img src={card.image} alt="" style={{ width: '100%', marginTop: '10px', borderRadius: '8px', opacity: 0.6 }} />}
              <div style={{ fontSize: '0.7rem', marginTop: '10px', opacity: 0.5 }}>{card.rarity.toUpperCase()}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AnalyticsView: React.FC<{ stats: PlayerProfile['stats'] }> = ({ stats }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '26px' }}>
    <div className="glass-panel" style={{ padding: '30px' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '20px' }}>PERFORMANCE_METRICS</h3>
      <div style={{ display: 'grid', gap: '16px' }}>
         <AnalyticsRow label="ACTIVE_SYNC_TIME" value={`${stats.playTime} MINUTES`} />
         <AnalyticsRow label="MAX_WIN_STREAK" value={String(stats.winStreak)} />
         <AnalyticsRow label="CARDS_DISCOVERED" value={String(stats.cardsCollected)} />
         <AnalyticsRow label="GLOBAL_WIN_RATE" value={`${Math.round((stats.wins / (stats.wins + stats.losses || 1)) * 100)}%`} />
      </div>
    </div>

    <div className="glass-panel" style={{ padding: '30px' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '20px' }}>ARCHETYPE_RESONANCE</h3>
      <div style={{ display: 'grid', gap: '12px' }}>
        {Object.entries(stats.archetypeUsage).map(([type, value]) => {
           const percent = Math.min(100, value * 5); // Just for visual growth
           return (
             <div key={type}>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
                 <span>{type.toUpperCase()}</span>
                 <span>SYNC_LV {value}</span>
               </div>
               <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                 <div style={{ height: '100%', width: `${percent}%`, background: 'var(--accent-cyan)', boxShadow: '0 0 10px var(--accent-cyan)' }} />
               </div>
             </div>
           );
        })}
      </div>
    </div>
  </div>
);

const PassportStat: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="glass-morphism" style={{ padding: '14px 10px', textAlign: 'center' }}>
    <div style={{ fontSize: '0.55rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{label}</div>
    <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{value}</div>
  </div>
);

const AnalyticsRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{label}</span>
    <span style={{ fontWeight: 800, color: 'var(--accent-cyan)' }}>{value}</span>
  </div>
);
