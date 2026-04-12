import React, { useMemo, useState } from 'react';
import { useGame } from '../core/GameContext';
import { FACTIONS, getFactionById, TRAINERS, mergeSocialState } from '../data/trainers';
import { getCardById, getCardPalette, CARD_POOL, resolveCardImage } from '../data/cards';
import { Card, CreatureType, PlayerProfile, SocialState } from '../core/types';
import { SonsotyoDiagnosticRow, SonsotyoHeroCard, SonsotyoKicker, SonsotyoPanel, SonsotyoPill, SonsotyoTitle } from './SonsotyoUI';
import '../styles/SonsotyoScenes.css';

type ProfileTab = 'DOSSIER' | 'INVENTORY' | 'SYNC_ANALYTICS';

export const Profile: React.FC = () => {
  const { state, setScene, updateGameState } = useGame();
  const { profile } = state;
  const [activeTab, setActiveTab] = useState<ProfileTab>('DOSSIER');
  const social = mergeSocialState(profile.social);

  const inventoryCards = useMemo(() => profile.inventory.cards.map((id) => getCardById(id)).filter((card): card is Card => Boolean(card)), [profile.inventory.cards]);
  const collectionProgress = useMemo(() => Math.floor((new Set(profile.inventory.cards).size / CARD_POOL.length) * 100), [profile.inventory.cards]);

  return (
    <div
      className="profile-scene sonsotyo-scene fade-in"
      style={{
        minHeight: '100vh',
        padding: '36px',
        overflowY: 'auto',
        background:
          'linear-gradient(180deg, rgba(8,10,18,0.82), rgba(4,6,10,0.94)), radial-gradient(circle at 16% 18%, rgba(126,242,255,0.14), transparent 22%), url(/sunset_apartments_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="sonsotyo-overlay" />
      <div className="scanlines" />

      <div className="sonsotyo-content" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <div className="sonsotyo-hero">
          <SonsotyoHeroCard>
            <SonsotyoKicker>User Profile Authorized</SonsotyoKicker>
            <SonsotyoTitle style={{ fontSize: 'clamp(2.6rem, 6vw, 4.8rem)', marginTop: '10px' }}>{profile.name}</SonsotyoTitle>
            <p className="sonsotyo-copy" style={{ maxWidth: '44ch', marginTop: '14px' }}>
              A soft-glass passport for your duel route: stats, contacts, cards, and the shape of your playstyle over time.
            </p>
            <div className="sonsotyo-meta-strip">
              <SonsotyoPill>Rank {profile.level}</SonsotyoPill>
              <SonsotyoPill>Credits {profile.currency.toLocaleString('en-US')} CR</SonsotyoPill>
              <SonsotyoPill>Badges {profile.badges.length}</SonsotyoPill>
            </div>
          </SonsotyoHeroCard>

          <SonsotyoPanel>
            <SonsotyoKicker>Shell Navigation</SonsotyoKicker>
            <div style={{ marginTop: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {(['DOSSIER', 'INVENTORY', 'SYNC_ANALYTICS'] as ProfileTab[]).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`neo-button ${activeTab === tab ? 'primary' : ''}`}>
                  {tab.replace('_', ' ')}
                </button>
              ))}
            </div>
            <div style={{ marginTop: '18px' }}>
              <SonsotyoDiagnosticRow label="Collection" value={`${collectionProgress}%`} />
              <SonsotyoDiagnosticRow label="Duels won" value={profile.stats.wins} />
              <SonsotyoDiagnosticRow label="Bracket titles" value={profile.stats.tournamentsWon} />
              <SonsotyoDiagnosticRow label="Win streak" value={profile.stats.winStreak} />
            </div>
          </SonsotyoPanel>
        </div>

        <div>
          {activeTab === 'DOSSIER' && <DossierView profile={profile} social={social} />}
          {activeTab === 'INVENTORY' && <InventoryView cards={inventoryCards} progress={collectionProgress} />}
          {activeTab === 'SYNC_ANALYTICS' && <AnalyticsView stats={profile.stats} />}
        </div>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', paddingBottom: '10px', flexWrap: 'wrap' }}>
          <button
            className="neo-button"
            onClick={() => {
              const dest = state.profileReturn ?? 'APARTMENT';
              updateGameState({ profileReturn: null, currentScene: dest });
            }}
          >
            {state.profileReturn === 'MAIN_MENU' ? 'Return to title' : 'Return to apartment'}
          </button>
          {state.profileReturn !== 'MAIN_MENU' && (
            <button className="neo-button" onClick={() => setScene('DISTRICT_EXPLORE')}>
              Open city streets
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const DossierView: React.FC<{ profile: PlayerProfile; social: SocialState }> = ({ profile, social }) => (
  <div className="sonsotyo-grid two">
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <SonsotyoPanel>
        <SonsotyoKicker>Passport</SonsotyoKicker>
        <div style={{ marginTop: '10px', fontFamily: 'var(--font-display)', fontSize: '4.2rem', opacity: 0.18 }}>
          {(profile.name.trim()[0] ?? '?').toUpperCase()}
        </div>
        <div style={{ marginTop: '-16px', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Rank {profile.level}</div>
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <PassportStat label="Duels" value={profile.stats.wins} />
          <PassportStat label="Titles" value={profile.stats.tournamentsWon} />
          <PassportStat label="Symbols" value={profile.badges.length} />
          <PassportStat label="Losses" value={profile.stats.losses} />
        </div>
        <div style={{ marginTop: '18px' }}>
          <SonsotyoKicker>Credit Balance</SonsotyoKicker>
          <div style={{ marginTop: '8px', fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--accent-yellow)' }}>
            {profile.currency.toLocaleString('en-US')} CR
          </div>
        </div>
      </SonsotyoPanel>

      <SonsotyoPanel>
        <SonsotyoKicker>Faction standing</SonsotyoKicker>
        <p className="sonsotyo-copy" style={{ marginTop: '10px', fontSize: '0.82rem', lineHeight: 1.5 }}>
          Rep rises from story beats and circuit results. Rank gates how NPCs read you on the street.
        </p>
        <div style={{ marginTop: '14px', display: 'grid', gap: '12px' }}>
          {FACTIONS.map((faction) => {
            const rep = social.factions[faction.id];
            return (
              <SonsotyoDiagnosticRow
                key={faction.id}
                label={
                  <span>
                    <span style={{ color: faction.accentColor }}>{faction.name}</span>
                    <span className="sonsotyo-caption" style={{ display: 'block', marginTop: '4px', textTransform: 'none', letterSpacing: '0.04em', opacity: 0.78, lineHeight: 1.4 }}>
                      {faction.slogan}
                    </span>
                  </span>
                }
                value={`${rep.rank} · ${rep.score}`}
              />
            );
          })}
        </div>
      </SonsotyoPanel>
    </div>

    <SonsotyoPanel>
      <SonsotyoKicker>Known Contacts</SonsotyoKicker>
      <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {TRAINERS.map((trainer) => {
          const relationship = social.trainers[trainer.id];
          const faction = getFactionById(trainer.factionId);
          return (
            <div key={trainer.id} className="glass-panel sonsotyo-panel" style={{ padding: '0', borderLeft: `3px solid ${faction.accentColor}`, overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: '0' }}>
                {trainer.portraitPath && (
                  <div style={{ width: '80px', minWidth: '80px', background: 'rgba(0,0,0,0.4)', overflow: 'hidden', flexShrink: 0 }}>
                    <img
                      src={trainer.portraitPath}
                      alt={trainer.name}
                      style={{ width: '80px', height: '108px', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                    />
                  </div>
                )}
                <div style={{ padding: '14px 14px 14px 12px', flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: faction.accentColor }}>{trainer.name}</div>
                  <div className="sonsotyo-caption" style={{ marginTop: '3px' }}>{trainer.title}</div>
                  {trainer.specialty && (
                    <div className="sonsotyo-caption" style={{ marginTop: '6px', opacity: 0.65, fontSize: '0.7rem', lineHeight: 1.4 }}>{trainer.specialty}</div>
                  )}
                  <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)' }}>AFF {relationship.affinity}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-secondary)' }}>RIV {relationship.rivalry}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-yellow)' }}>RES {relationship.respect}</span>
                  </div>
                </div>
              </div>
              <div style={{ padding: '8px 14px 10px', borderTop: `1px solid rgba(255,255,255,0.06)` }}>
                <div className="sonsotyo-caption" style={{ fontSize: '0.65rem', letterSpacing: '0.12em', opacity: 0.5, marginBottom: '4px' }}>PERSONALITY</div>
                <div style={{ fontSize: '0.72rem', opacity: 0.78, lineHeight: 1.5 }}>{trainer.personality}</div>
              </div>
            </div>
          );
        })}
      </div>
    </SonsotyoPanel>
  </div>
);

const InventoryView: React.FC<{ cards: Card[]; progress: number }> = ({ cards, progress }) => {
  const [filter, setFilter] = useState<CreatureType | 'ALL'>('ALL');
  const filtered = useMemo(() => (filter === 'ALL' ? cards : cards.filter((card) => card.creatureType === filter)), [cards, filter]);

  return (
    <div className="glass-panel sonsotyo-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <div className="sonsotyo-kicker">Collection Vault</div>
          <div style={{ marginTop: '8px', fontFamily: 'var(--font-display)', fontSize: '1.7rem' }}>Database Sync {progress}%</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(['ALL', 'Pulse', 'Bloom', 'Tide', 'Alloy', 'Veil', 'Current'] as const).map((entry) => (
            <button key={entry} onClick={() => setFilter(entry)} className={`neo-button ${filter === entry ? 'primary' : ''}`}>
              {entry}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px', maxHeight: '560px', overflowY: 'auto', paddingRight: '8px' }}>
        {filtered.map((card, index) => {
          const palette = getCardPalette(card);
          return (
            <div key={index} className="glass-panel sonsotyo-panel" style={{ padding: '14px', borderColor: palette.accent }}>
              <div className="sonsotyo-kicker" style={{ color: palette.accent }}>{card.creatureType?.toUpperCase() ?? 'TACTIC'}</div>
              <div style={{ marginTop: '8px', fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>{card.name.toUpperCase()}</div>
              <img src={resolveCardImage(card)} alt="" style={{ width: '100%', marginTop: '12px', borderRadius: '14px', opacity: 0.76 }} />
              <div className="sonsotyo-caption" style={{ marginTop: '10px' }}>{card.rarity.toUpperCase()}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AnalyticsView: React.FC<{ stats: PlayerProfile['stats'] }> = ({ stats }) => (
  <div className="sonsotyo-grid two">
    <SonsotyoPanel>
      <SonsotyoKicker>Performance Metrics</SonsotyoKicker>
      <div style={{ marginTop: '16px', display: 'grid', gap: '12px' }}>
        <AnalyticsRow label="Active Sync Time" value={`${stats.playTime} MINUTES`} />
        <AnalyticsRow label="Current win streak" value={String(stats.winStreak)} />
        <AnalyticsRow label="Cards Discovered" value={String(stats.cardsCollected)} />
        <AnalyticsRow
          label="Duel win rate"
          value={`${Math.round((stats.wins / Math.max(1, stats.wins + stats.losses)) * 100)}%`}
        />
      </div>
    </SonsotyoPanel>

    <SonsotyoPanel>
      <SonsotyoKicker>Archetype Resonance</SonsotyoKicker>
      <div style={{ marginTop: '16px', display: 'grid', gap: '14px' }}>
        {Object.entries(stats.archetypeUsage).map(([type, value]) => {
          const percent = Math.min(100, value * 5);
          return (
            <div key={type}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                <span>{type.toUpperCase()}</span>
                <span className="sonsotyo-value">SYNC LV {value}</span>
              </div>
              <div className="sonsotyo-progress">
                <span style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </SonsotyoPanel>
  </div>
);

const PassportStat: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <SonsotyoPanel style={{ padding: '14px', textAlign: 'center' }}>
    <SonsotyoKicker>{label}</SonsotyoKicker>
    <div style={{ marginTop: '6px', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>{value}</div>
  </SonsotyoPanel>
);

const AnalyticsRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <SonsotyoDiagnosticRow label={label} value={value} />
);
