import React from 'react';
import { useGame } from '../core/GameStateContext';

export const Profile: React.FC = () => {
    const { state, setScene } = useGame();
    const { profile } = state;

    return (
        <div className="profile-scene fade-in" style={{ 
            height: '100vh', 
            padding: '60px',
            background: 'linear-gradient(135deg, #050510 0%, #0a0a20 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <div className="scanlines" />
            
            <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px', zIndex: 10 }}>
                <div>
                    <h1 className="glow-text" style={{ fontSize: '1rem', letterSpacing: '10px', opacity: 0.5 }}>CITIZEN_ID_VERIFIED</h1>
                    <h2 style={{ fontSize: '3rem', fontWeight: 900, margin: 0 }}>{profile.name.toUpperCase()}</h2>
                </div>
                <div className="glass-panel" style={{ padding: '20px 40px', borderRight: '5px solid var(--accent-magenta)' }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>BALANCE</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900 }}>{profile.currency}₡</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', width: '100%', maxWidth: '1000px', zIndex: 10 }}>
                {/* Left Col: Avatar & Badges */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', height: '350px', position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,242,255,0.2) 0%, transparent 100%)' }} />
                        <div style={{ textAlign: 'center', paddingTop: '60px' }}>
                            <div style={{ fontSize: '8rem', opacity: 0.1 }}>👤</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', letterSpacing: '5px', marginTop: '20px' }}>LEVEL {profile.level}</div>
                            <div style={{ width: '80%', height: '4px', background: 'rgba(255,255,255,0.1)', margin: '20px auto', borderRadius: '2px', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${(profile.xp % 1000) / 10}%`, background: 'var(--accent-cyan)', boxShadow: '0 0 10px var(--accent-cyan)' }} />
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '30px' }}>
                        <h3 style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '2px', marginBottom: '20px' }}>EARNED_BADGES</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                            {profile.badges.length > 0 ? profile.badges.map(b => (
                                <div key={b.id} title={b.description} style={{ width: '100%', aspectRatio: '1', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    {b.icon}
                                </div>
                            )) : (
                                [1,2,3,4].map(i => <div key={i} style={{ width: '100%', aspectRatio: '1', background: 'rgba(255,255,255,0.02)', borderRadius: '5px', border: '1px dashed rgba(255,255,255,0.1)' }} />)
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Col: Stats & Inventory */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div className="glass-panel" style={{ padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                        <StatItem label="WINS" value={profile.stats.wins} />
                        <StatItem label="LOSSES" value={profile.stats.losses} />
                        <StatItem label="CARDS" value={profile.stats.cardsCollected} />
                        <StatItem label="TOURNEYS" value={profile.stats.tournamentsWon} />
                    </div>

                    <div className="glass-panel" style={{ padding: '40px', flex: 1 }}>
                         <h3 style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '2px', marginBottom: '30px' }}>INVENTORY_SURPLUS</h3>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                             <InventoryRow label="CREDIT DATA CORES (PACKS)" value={profile.inventory.packs.length} />
                             <InventoryRow label="EQUIPPED HARDWARE (DECK)" value={profile.inventory.deck.length} />
                             <InventoryRow label="COLLECTION SIZE" value={profile.inventory.cards.length} />
                             <InventoryRow label="COSMETIC MODULES" value={profile.inventory.items.length} />
                         </div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: '20px', zIndex: 10 }}>
                <button className="neo-button primary" style={{ width: '200px' }} onClick={() => setScene('APARTMENT')}>RETURN TO HUB</button>
                <button className="neo-button" style={{ width: '200px' }} onClick={() => setScene('DISTRICT_EXPLORE')}>STREET VIEW</button>
            </div>
        </div>
    );
};

const StatItem: React.FC<{ label: string, value: number }> = ({ label, value }) => (
    <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>{label}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{value}</div>
    </div>
);

const InventoryRow: React.FC<{ label: string, value: number }> = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>{value}</div>
    </div>
);
