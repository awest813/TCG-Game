import React from 'react';
import { useGame } from '../core/GameContext';
import {
  getTournamentBanter,
  getTournamentOpponent,
  getTournamentPreviewLine,
  getTournamentRoundLabel,
  getTournamentOpponents,
  getOpponentMeta,
  TOURNAMENT_TIERS,
  TournamentTier
} from '../core/TournamentManager';
import { ActiveTournament } from '../core/types';
import { getTrainerById, mergeSocialState } from '../data/trainers';
import { NPCS } from '../npc/npcs';
import { audioManager } from '../core/AudioManager';
import '../styles/SonsotyoScenes.css';

export const Tournament: React.FC = () => {
  const { state, updateGameState, updateProfile, setScene } = useGame();
  const pendingTierId = state.pendingTournamentId;
  const activeTourney: ActiveTournament | null = state.activeTournament;
  const social = mergeSocialState(state.profile.social);

  React.useEffect(() => {
    if (!pendingTierId || activeTourney) return;
    const tier = TOURNAMENT_TIERS.find((t) => t.id === pendingTierId);
    if (!tier) return;
    if (state.profile.currency >= tier.entryFee) {
      startTournament(tier);
      updateGameState({ pendingTournamentId: null });
    }
  }, [pendingTierId, activeTourney]);
  const currentOpponentRelScore = activeTourney
    ? (state.profile.social.trainers[activeTourney.currentOpponentId]?.affinity ?? 0)
    : 0;

  React.useEffect(() => {
    if (!activeTourney) audioManager.playBGM('TOWN');
    else audioManager.playBGM('TOURNAMENT_LOBBY');
  }, [activeTourney]);

  React.useEffect(() => {
    if (!activeTourney) return undefined;
    const tier = TOURNAMENT_TIERS.find((e) => e.id === activeTourney.tierId);
    if (!tier) return undefined;
    const currentBanter = getTournamentBanter(activeTourney.currentOpponentId, tier.prestige, currentOpponentRelScore, activeTourney.wins);
    const timer = setTimeout(() => {
      audioManager.speak(currentBanter.intro, 'announcer');
      const rivalTimer = setTimeout(() => {
        const npc = NPCS.find((n) => n.id === activeTourney.currentOpponentId);
        audioManager.speak(currentBanter.rival, npc?.archetype ?? 'rival');
        clearTimeout(rivalTimer);
      }, 4000);
    }, 500);
    return () => clearTimeout(timer);
  }, [activeTourney, currentOpponentRelScore]);

  const renderStars = (count: number) => (
    <div style={{ display: 'flex', gap: '4px', color: 'var(--accent-yellow)' }}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} style={{ fontSize: '0.95rem', opacity: index < count ? 1 : 0.18 }}>★</span>
      ))}
    </div>
  );

  const startTournament = (tier: TournamentTier) => {
    if (state.profile.currency < tier.entryFee) {
      alert('Insufficient Credits for entry.');
      return;
    }

    updateProfile({ currency: state.profile.currency - tier.entryFee });
    const newActive: ActiveTournament = {
      tierId: tier.id,
      wins: 0,
      currentOpponentId: getTournamentOpponent(tier.id, 0),
      status: 'ACTIVE'
    };
    audioManager.playSFX('select');
    updateGameState({ activeTournament: newActive });
  };

  const cashOut = () => {
    if (!activeTourney) return;
    const tier = TOURNAMENT_TIERS.find((entry) => entry.id === activeTourney.tierId);
    if (!tier) return;

    const finalReward = Math.floor(tier.baseReward * (1 + activeTourney.wins * tier.rarityMultiplier));
    alert(`Withdrawn from Circuit. Cashing out winning pot: ${finalReward} credits.`);
    updateProfile({ currency: state.profile.currency + finalReward });
    updateGameState({ activeTournament: null });
    
    if (tier.locationId === 'card-shop') {
      setScene('STORE');
    } else {
      setScene('DISTRICT_EXPLORE');
    }
  };

  if (!activeTourney) {
    return (
      <div
        className="tournament-scene sonsotyo-scene fade-in"
        style={{
          minHeight: '100vh',
          padding: '40px',
          overflowY: 'auto',
          backgroundImage:
            'linear-gradient(180deg, rgba(7,8,15,0.76), rgba(6,8,12,0.92)), radial-gradient(circle at 14% 18%, rgba(126,242,255,0.12), transparent 20%), url(/metro_map_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="sonsotyo-overlay" />
        <div className="scanlines" style={{ opacity: 0.1 }} />
        <div className="sonsotyo-content" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div className="sonsotyo-hero">
            <div className="glass-panel sonsotyo-hero-card">
              <div className="sonsotyo-kicker">Circuit Access</div>
              <h1 className="sonsotyo-title" style={{ fontSize: 'clamp(2.8rem, 6vw, 4.6rem)', marginTop: '10px' }}>Local Events</h1>
              <p className="sonsotyo-copy" style={{ maxWidth: '48ch', marginTop: '14px' }}>
                A rivalry ladder wrapped in moonlit glass. Every bracket previews the mood, cost, and opening threat before you step in.
              </p>
              <div className="sonsotyo-meta-strip">
                <div className="sonsotyo-pill">Currency {state.profile.currency}</div>
                <div className="sonsotyo-pill">Titles {state.profile.stats.tournamentsWon}</div>
                <div className="sonsotyo-pill">Sleep Circuit Active</div>
              </div>
            </div>

            <div className="glass-panel sonsotyo-panel">
              <div className="sonsotyo-kicker">Bracket Forecast</div>
              <div style={{ marginTop: '12px', fontFamily: 'var(--font-display)', fontSize: '1.45rem' }}>Four routes, one city pulse.</div>
              <div style={{ marginTop: '18px', display: 'grid', gap: '12px' }}>
                {TOURNAMENT_TIERS.map((tier) => (
                  <div key={tier.id} className="sonsotyo-diagnostic">
                    <span>{tier.name}</span>
                    <span className="sonsotyo-value">{tier.baseReward} CR</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sonsotyo-grid cards">
            {TOURNAMENT_TIERS.map((tier) => {
              const featuredOpponentId = getTournamentOpponent(tier.id, 0);
              const featuredOpponent = NPCS.find((entry) => entry.id === featuredOpponentId);
              const trainer = getTrainerById(featuredOpponentId);

              return (
                <div key={tier.id} className="glass-panel sonsotyo-panel" style={{ borderTop: `3px solid ${tier.isEndless ? 'var(--accent-secondary)' : 'var(--accent-primary)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start' }}>
                    <div>
                      <div className="sonsotyo-kicker">{tier.locationId.replace(/-/g, ' ')}</div>
                      <div style={{ marginTop: '10px', fontFamily: 'var(--font-display)', fontSize: '1.45rem' }}>{tier.name}</div>
                    </div>
                    {tier.isEndless && <div className="sonsotyo-pill" style={{ color: 'var(--accent-secondary)' }}>Endless</div>}
                  </div>

                  <div style={{ marginTop: '12px' }}>{renderStars(tier.prestige)}</div>
                  <p className="sonsotyo-copy" style={{ marginTop: '14px' }}>{tier.description}</p>
                  <div className="sonsotyo-copy" style={{ marginTop: '10px' }}>{getTournamentPreviewLine(tier)}</div>

                  <div style={{ marginTop: '18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="glass-panel sonsotyo-panel" style={{ padding: '16px' }}>
                      <div className="sonsotyo-kicker">Entry</div>
                      <div style={{ marginTop: '8px', fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--accent-yellow)' }}>{tier.entryFee} CR</div>
                    </div>
                    <div className="glass-panel sonsotyo-panel" style={{ padding: '16px' }}>
                      <div className="sonsotyo-kicker">Payout</div>
                      <div style={{ marginTop: '8px', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>{tier.baseReward} CR</div>
                    </div>
                  </div>

                  <div className="glass-panel sonsotyo-panel" style={{ marginTop: '16px', padding: '16px' }}>
                    <div className="sonsotyo-kicker">Opening Matchup</div>
                    <div style={{ marginTop: '10px', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
                      {featuredOpponent?.name ?? 'Elite Bot'} / {featuredOpponent?.role ?? 'Circuit Opponent'}
                    </div>
                    <div className="sonsotyo-copy" style={{ marginTop: '10px' }}>
                      {featuredOpponent?.dialogue[state.timeOfDay] ?? 'The bracket feed is waiting for your handshake.'}
                    </div>
                    {trainer && <div style={{ marginTop: '10px', color: 'var(--accent-yellow)', lineHeight: 1.5 }}>{trainer.summary}</div>}
                  </div>

                  <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'center' }}>
                    <div className="sonsotyo-caption">Opponents {getTournamentOpponents(tier.id).length}</div>
                    <button className={`neo-button ${state.profile.currency >= tier.entryFee ? 'primary' : ''}`} onClick={() => startTournament(tier)} disabled={state.profile.currency < tier.entryFee}>
                      {state.profile.currency >= tier.entryFee ? 'Enter Bracket' : 'Insufficient Funds'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', paddingBottom: '12px' }}>
            <button className="neo-button" onClick={() => { 
                audioManager.playSFX('back'); 
                setScene('DISTRICT_EXPLORE'); 
            }}>
              Return To Streets
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tier = TOURNAMENT_TIERS.find((entry) => entry.id === activeTourney.tierId);
  if (!tier) return null;

  const currentPot = Math.floor(tier.baseReward * (1 + activeTourney.wins * tier.rarityMultiplier));
  const opponent = NPCS.find((entry) => entry.id === activeTourney.currentOpponentId);
  const trainer = getTrainerById(activeTourney.currentOpponentId);
  const relationshipScore = social.trainers[activeTourney.currentOpponentId]?.affinity ?? 0;
  const banter = getTournamentBanter(activeTourney.currentOpponentId, tier.prestige, relationshipScore, activeTourney.wins);
  const roundLabel = getTournamentRoundLabel(tier.id, activeTourney.wins);
  const opponentMeta = getOpponentMeta(activeTourney.currentOpponentId);

  return (
    <div
      className="tournament-scene sonsotyo-scene fade-in"
      style={{
        minHeight: '100vh',
        padding: '40px',
        backgroundImage:
          'linear-gradient(180deg, rgba(7,8,15,0.76), rgba(6,8,12,0.92)), radial-gradient(circle at 82% 16%, rgba(255,138,198,0.14), transparent 24%), url(/civic_crown_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="sonsotyo-overlay" />
      <div className="scanlines" style={{ opacity: 0.1 }} />
      <div className="sonsotyo-content" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <div className="sonsotyo-hero">
          <div className="glass-panel sonsotyo-hero-card">
            <div className="sonsotyo-kicker">{roundLabel}</div>
            <h1 className="sonsotyo-title" style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', marginTop: '10px' }}>{tier.name}</h1>
            <div style={{ marginTop: '14px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              {renderStars(tier.prestige)}
              <div className="sonsotyo-pill">Wins {activeTourney.wins}</div>
              <div className="sonsotyo-pill">Relation {relationshipScore}</div>
            </div>
            <p className="sonsotyo-copy" style={{ marginTop: '14px', maxWidth: '48ch' }}>
              The room is tuned to rivalry, and the payout grows warmer every round you survive.
            </p>
          </div>

          <div className="glass-panel sonsotyo-panel">
            <div className="sonsotyo-kicker">Estimated Payout</div>
            <div style={{ marginTop: '12px', fontFamily: 'var(--font-display)', fontSize: '2.3rem', color: 'var(--accent-yellow)' }}>{currentPot} CR</div>
            <div className="sonsotyo-copy" style={{ marginTop: '10px' }}>
              Cash out now to lock the pot, or keep climbing while the circuit gets meaner.
            </div>
          </div>
        </div>

        <div className="sonsotyo-grid two">
          <div className="glass-panel sonsotyo-panel" style={{ borderTop: `3px solid ${banter.accentColor}` }}>
            <div className="sonsotyo-kicker" style={{ color: banter.accentColor }}>{opponentMeta.panelHeaderLabel}</div>
            <div style={{ marginTop: '10px', fontFamily: 'var(--font-display)', fontSize: '2rem' }}>
              {opponent?.name ?? 'Elite Bot'} / {opponent?.role ?? 'Circuit Opponent'}
            </div>
            {trainer && <div style={{ marginTop: '10px', color: 'var(--accent-yellow)', lineHeight: 1.6 }}>{trainer.summary}</div>}

            <div style={{ marginTop: '20px', display: 'grid', gap: '14px' }}>
              <div className="glass-panel sonsotyo-panel" style={{ padding: '16px' }}>
                <div className="sonsotyo-kicker">{banter.announcerLabel}</div>
                <div className="sonsotyo-copy" style={{ marginTop: '10px', fontStyle: 'italic' }}>"{banter.intro}"</div>
              </div>
              <div className="glass-panel sonsotyo-panel" style={{ padding: '16px', borderLeft: `3px solid ${banter.accentColor}` }}>
                <div className="sonsotyo-kicker" style={{ color: banter.accentColor }}>{banter.opponentLabel}</div>
                <div style={{ marginTop: '10px', lineHeight: 1.65 }}>{banter.rival}</div>
              </div>
              <div className="glass-panel sonsotyo-panel" style={{ padding: '16px', borderLeft: '3px solid var(--accent-primary)' }}>
                <div className="sonsotyo-kicker" style={{ color: 'var(--accent-primary)' }}>{banter.playerLabel}</div>
                <div style={{ marginTop: '10px', lineHeight: 1.65 }}>{banter.player}</div>
              </div>
            </div>
          </div>

          <div className="sonsotyo-side-stack">
            <div className="glass-panel sonsotyo-panel">
              <div className="sonsotyo-kicker">Opponent Dossier</div>
              <div style={{ marginTop: '12px', fontFamily: 'var(--font-display)', fontSize: '1.45rem' }}>{opponent?.name ?? 'Elite Bot'}</div>
              <div className="sonsotyo-copy" style={{ marginTop: '6px' }}>{opponent?.role ?? 'Circuit Opponent'}</div>
              <div className="sonsotyo-meta-strip">
                <div className="sonsotyo-pill">District {opponent?.location ?? 'Arena'}</div>
                <div className="sonsotyo-pill">Round {roundLabel}</div>
                {trainer && <div className="sonsotyo-pill">Faction {trainer.factionId}</div>}
              </div>
            </div>

            <div className="glass-panel sonsotyo-panel">
              <div className="sonsotyo-kicker">Bracket Pressure</div>
              <div style={{ marginTop: '14px', display: 'grid', gap: '10px' }}>
                {getTournamentOpponents(tier.id).map((opponentId, index) => {
                  const bracketOpponent = NPCS.find((entry) => entry.id === opponentId);
                  const isCurrent = opponentId === activeTourney.currentOpponentId;
                  const isCleared = index < activeTourney.wins;
                  return (
                    <div key={`${tier.id}-${opponentId}-${index}`} className="sonsotyo-diagnostic" style={{ opacity: isCleared ? 0.55 : 1 }}>
                      <span>Match {index + 1} / {bracketOpponent?.name ?? opponentId}</span>
                      <span className="sonsotyo-value" style={{ color: isCurrent ? 'var(--accent-yellow)' : isCleared ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                        {isCurrent ? 'Live' : isCleared ? 'Cleared' : 'Locked'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button className="neo-button primary" style={{ width: '100%', height: '58px' }} onClick={() => { audioManager.playSFX('enter_battle'); setScene('BATTLE'); }}>
              Initiate Sync Battle
            </button>
            <button className="neo-button" onClick={() => { audioManager.playSFX('withdraw'); cashOut(); }}>
              Withdraw & Cash Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
