import React from 'react';
import { useGame } from '../core/GameContext';
import { FACTIONS, getFactionById, TRAINERS, mergeSocialState } from '../data/trainers';

export const Profile: React.FC = () => {
  const { state, setScene } = useGame();
  const { profile } = state;
  const social = mergeSocialState(profile.social);

  return (
    <div
      className="profile-scene fade-in"
      style={{
        minHeight: '100vh',
        padding: '60px',
        background:
          'linear-gradient(135deg, rgba(5,5,16,0.96) 0%, rgba(9,11,25,0.96) 100%), radial-gradient(circle at 82% 18%, rgba(125,215,221,0.12), transparent 22%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowY: 'auto'
      }}
    >
      <div className="scanlines" />

      <div style={{ width: '100%', maxWidth: '1180px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', zIndex: 10, gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <h1 className="glow-text" style={{ fontSize: '1rem', letterSpacing: '10px', opacity: 0.5 }}>
            DUELIST_PASSPORT_ACTIVE
          </h1>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 900, margin: '10px 0 0' }}>{profile.name.toUpperCase()}</h2>
          <div style={{ marginTop: '10px', color: 'var(--text-secondary)', maxWidth: '720px', lineHeight: 1.6 }}>
            A consolidated dossier for your anime TCG career: combat rank, linked trainers, and the faction reputations that are shaping how the city sees your climb.
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '20px 40px', borderRight: '5px solid var(--accent-magenta)' }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>FUNDS_SYNC</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{profile.currency} DP</div>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '1180px', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '30px', zIndex: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '26px', minHeight: '320px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,242,255,0.16) 0%, transparent 100%)' }} />
            <div style={{ position: 'relative', textAlign: 'center', paddingTop: '26px' }}>
              <div style={{ fontSize: '6rem', opacity: 0.12 }}>D</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--accent-cyan)', letterSpacing: '4px', marginTop: '8px' }}>PRO-RANK {profile.level}</div>
              <div style={{ width: '86%', height: '6px', background: 'rgba(255,255,255,0.1)', margin: '20px auto', borderRadius: '3px', position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${(profile.xp % 1000) / 10}%`,
                    background: 'var(--accent-cyan)',
                    boxShadow: '0 0 15px var(--accent-cyan)'
                  }}
                />
              </div>
              <div style={{ fontSize: '0.68rem', opacity: 0.6 }}>SYNC RESONANCE: {(profile.xp % 1000) / 10}%</div>
              <div style={{ marginTop: '22px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                <PassportStat label="TOTAL WINS" value={profile.stats.wins} />
                <PassportStat label="DEFEATS" value={profile.stats.losses} />
                <PassportStat label="BIO-SYNC" value={profile.stats.cardsCollected} />
                <PassportStat label="TITLES" value={profile.stats.tournamentsWon} />
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '26px' }}>
            <h3 style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', letterSpacing: '2px', marginBottom: '18px' }}>GRAND_MEDALS_EARNED</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
              {profile.badges.length > 0
                ? profile.badges.map((badge) => (
                    <div
                      key={badge.id}
                      title={badge.description}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}
                    >
                      {badge.icon}
                    </div>
                  ))
                : [1, 2, 3, 4, 5, 6, 7, 8].map((slot) => (
                    <div key={slot} style={{ width: '100%', aspectRatio: '1', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.1)' }} />
                  ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '26px' }}>
            <h3 style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', letterSpacing: '2px', marginBottom: '18px' }}>DUELIST_COLLECTION</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <InventoryRow label="UNOPENED SYNC-PACKS" value={profile.inventory.packs.length} />
              <InventoryRow label="EQUIPPED DECK (BOND SLOTS)" value={profile.inventory.deck.length} />
              <InventoryRow label="ACTIVE BIO-SYNC DATA" value={profile.inventory.cards.length} />
              <InventoryRow label="LEGENDARY SLEEVES" value={profile.inventory.items.length} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div className="system-menu-kicker">Faction Reputation</div>
            <h3 style={{ marginTop: '10px', fontSize: '1.9rem', fontWeight: 900 }}>CITY STANDINGS</h3>
            <div style={{ marginTop: '18px', display: 'grid', gap: '12px' }}>
              {FACTIONS.map((faction) => (
                <div key={faction.id} className="glass-morphism" style={{ padding: '16px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: faction.accentColor, letterSpacing: '0.18rem' }}>{faction.name.toUpperCase()}</div>
                      <div style={{ marginTop: '6px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>{faction.slogan}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.35rem', fontWeight: 900 }}>{social.factions[faction.id].score}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{social.factions[faction.id].rank}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            <div className="system-menu-kicker">Trainer Links</div>
            <h3 style={{ marginTop: '10px', fontSize: '1.9rem', fontWeight: 900 }}>TRAINER ROSTER</h3>
            <div style={{ marginTop: '18px', display: 'grid', gap: '14px' }}>
              {TRAINERS.map((trainer) => {
                const relationship = social.trainers[trainer.id];
                const faction = getFactionById(trainer.factionId);

                return (
                  <div key={trainer.id} className="glass-morphism" style={{ padding: '18px 20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '16px', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: faction.accentColor, letterSpacing: '0.18rem' }}>
                          {trainer.title.toUpperCase()} // {trainer.homeDistrict.replace(/_/g, ' ')}
                        </div>
                        <div style={{ marginTop: '8px', fontSize: '1.2rem', fontWeight: 800 }}>{trainer.name}</div>
                        <div style={{ marginTop: '8px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{trainer.summary}</div>
                      </div>
                      <div style={{ display: 'grid', gap: '8px', minWidth: '180px' }}>
                        <TrainerMetric label="AFFINITY" value={relationship.affinity} accent="var(--accent-cyan)" />
                        <TrainerMetric label="RIVALRY" value={relationship.rivalry} accent="var(--accent-magenta)" />
                        <TrainerMetric label="RESPECT" value={relationship.respect} accent="var(--accent-yellow)" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '34px', display: 'flex', gap: '20px', zIndex: 10 }}>
        <button className="neo-button primary" style={{ width: '200px' }} onClick={() => setScene('APARTMENT')}>
          RETURN TO HUB
        </button>
        <button className="neo-button" style={{ width: '200px' }} onClick={() => setScene('DISTRICT_EXPLORE')}>
          STREET VIEW
        </button>
      </div>
    </div>
  );
};

const PassportStat: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="glass-morphism" style={{ padding: '14px 12px', textAlign: 'center' }}>
    <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>{label}</div>
    <div style={{ fontSize: '1.35rem', fontWeight: 900 }}>{value}</div>
  </div>
);

const TrainerMetric: React.FC<{ label: string; value: number; accent: string }> = ({ label, value, accent }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{label}</div>
    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: accent }}>{value}</div>
  </div>
);

const InventoryRow: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</div>
    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>{value}</div>
  </div>
);
