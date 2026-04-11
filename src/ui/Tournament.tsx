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

export const Tournament: React.FC = () => {
  const { state, updateGameState, updateProfile, setScene } = useGame();
  const activeTourney: ActiveTournament | null = state.activeTournament;
  const social = mergeSocialState(state.profile.social);

  React.useEffect(() => {
    if (!activeTourney) {
      audioManager.playBGM('TOWN');
    } else {
      audioManager.playBGM('TOURNAMENT_LOBBY');
    }
  }, [activeTourney]);

  React.useEffect(() => {
    if (!activeTourney) return undefined;
    const tier = TOURNAMENT_TIERS.find((e) => e.id === activeTourney.tierId);
    if (!tier) return undefined;
    const relScore = state.profile.social.trainers[activeTourney.currentOpponentId]?.affinity ?? 0;
    const currentBanter = getTournamentBanter(activeTourney.currentOpponentId, tier.prestige, relScore, activeTourney.wins);
    const timer = setTimeout(() => {
      audioManager.speak(currentBanter.intro, 'announcer');
      const rivalTimer = setTimeout(() => {
        const npc = NPCS.find((n) => n.id === activeTourney.currentOpponentId);
        audioManager.speak(currentBanter.rival, npc?.archetype ?? 'rival');
        clearTimeout(rivalTimer);
      }, 4000);
    }, 500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTourney?.currentOpponentId, activeTourney?.wins]);

  const renderStars = (count: number) => {
    return (
      <div style={{ display: 'flex', gap: '3px', color: 'var(--accent-yellow)' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{ fontSize: '0.9rem', opacity: i < count ? 1 : 0.2 }}>
            ★
          </span>
        ))}
      </div>
    );
  };

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
    setScene('DISTRICT_EXPLORE');
  };

  if (!activeTourney) {
    const available = TOURNAMENT_TIERS.filter(() => true);

    return (
      <div
        className="tournament-scene fade-in"
        style={{
          minHeight: '100vh',
          padding: '60px',
          overflowY: 'auto',
          backgroundImage:
            'linear-gradient(180deg, rgba(7,5,10,0.82), rgba(7,5,10,0.95)), radial-gradient(circle at 16% 20%, rgba(125,215,221,0.12), transparent 20%), url(/metro_map_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        <div className="scanlines" style={{ opacity: 0.1 }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="glass-panel" style={{ padding: '26px 28px', marginBottom: '38px', background: 'rgba(7, 10, 16, 0.7)' }}>
            <div className="system-menu-kicker">Circuit Access</div>
            <h1 className="glow-text" style={{ fontSize: '3.2rem', marginTop: '10px' }}>
              LOCAL EVENTS
            </h1>
            <div style={{ marginTop: '10px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '760px' }}>
              Tournament mode now plays like a proper rivalry ladder: every bracket previews the caliber of duelists waiting inside, and every active run tees up a featured opponent with their own pre-fight banter.
            </div>
            <div style={{ marginTop: '18px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <div className="glass-morphism" style={{ padding: '0.7rem 1rem', letterSpacing: '0.14rem', fontSize: '0.74rem' }}>
                CURRENCY: {state.profile.currency} CREDITS
              </div>
              <div className="glass-morphism" style={{ padding: '0.7rem 1rem', letterSpacing: '0.14rem', fontSize: '0.74rem' }}>
                TITLES: {state.profile.stats.tournamentsWon}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(390px, 1fr))', gap: '26px' }}>
            {available.map((tier) => {
              const featuredOpponentId = getTournamentOpponent(tier.id, 0);
              const featuredOpponent = NPCS.find((entry) => entry.id === featuredOpponentId);
              const trainer = getTrainerById(featuredOpponentId);

              return (
                <div
                  key={tier.id}
                  className="glass-panel"
                  style={{
                    padding: '28px',
                    borderLeft: `8px solid ${tier.isEndless ? 'var(--accent-magenta)' : 'var(--accent-cyan)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    background: 'rgba(9, 9, 18, 0.88)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px' }}>
                    <div>
                      <div className="system-menu-kicker">{tier.locationId.replace(/-/g, ' ')}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
                        <h2 style={{ fontSize: '1.7rem', fontWeight: 900, textShadow: tier.prestige >= 4 ? '0 0 15px rgba(240, 198, 124, 0.4)' : 'none' }}>
                          {tier.name.toUpperCase()}
                        </h2>
                      </div>
                      <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {renderStars(tier.prestige)}
                        {tier.prestige >= 4 && (
                          <span style={{ fontSize: '0.6rem', color: 'var(--accent-yellow)', letterSpacing: '0.1rem', fontWeight: 800 }}>
                            PRESTIGE EVENT
                          </span>
                        )}
                      </div>
                    </div>
                    {tier.isEndless && (
                      <div className="glass-morphism" style={{ padding: '0.4rem 0.65rem', fontSize: '0.62rem', letterSpacing: '0.14rem', color: 'var(--accent-magenta)' }}>
                        ENDLESS
                      </div>
                    )}
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tier.description}</p>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{getTournamentPreviewLine(tier)}</div>

                  <div className="glass-morphism" style={{ padding: '16px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', letterSpacing: '0.14rem' }}>ENTRY FEE</div>
                      <div style={{ marginTop: '6px', fontSize: '1.2rem', fontWeight: 800, color: tier.entryFee > 0 ? 'var(--accent-yellow)' : 'var(--accent-cyan)' }}>
                        {tier.entryFee} CREDITS
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', letterSpacing: '0.14rem' }}>BASE PAYOUT</div>
                      <div style={{ marginTop: '6px', fontSize: '1.2rem', fontWeight: 800 }}>{tier.baseReward} CREDITS</div>
                    </div>
                  </div>

                  <div className="glass-morphism" style={{ padding: '16px 18px' }}>
                    <div style={{ fontSize: '0.62rem', color: 'var(--accent-cyan)', letterSpacing: '0.18rem' }}>OPENING MATCHUP</div>
                    <div style={{ marginTop: '8px', fontSize: '1.15rem', fontWeight: 800 }}>
                      {featuredOpponent?.name ?? 'Elite Bot'} // {featuredOpponent?.role ?? 'Circuit Opponent'}
                    </div>
                    <div style={{ marginTop: '8px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {featuredOpponent?.dialogue[state.timeOfDay] ?? 'The bracket feed is waiting for your handshake.'}
                    </div>
                    {trainer && (
                      <div style={{ marginTop: '10px', fontSize: '0.74rem', color: 'var(--accent-yellow)', lineHeight: 1.5 }}>
                        {trainer.summary}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', gap: '16px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Opponents: {getTournamentOpponents(tier.id).length}
                    </div>
                    <button
                      className={`neo-button ${state.profile.currency >= tier.entryFee ? 'primary' : ''}`}
                      onClick={() => startTournament(tier)}
                      disabled={state.profile.currency < tier.entryFee}
                    >
                      {state.profile.currency >= tier.entryFee ? 'ENTER BRACKET' : 'INSUFFICIENT FUNDS'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '46px', textAlign: 'center' }}>
            <button className="neo-button" onClick={() => { audioManager.playSFX('back'); setScene('DISTRICT_EXPLORE'); }}>
              RETURN TO STREETS
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
      className="tournament-scene fade-in"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '60px',
        backgroundImage:
          'linear-gradient(180deg, rgba(7,5,10,0.72), rgba(7,5,10,0.94)), radial-gradient(circle at 78% 16%, rgba(207,101,71,0.16), transparent 24%), url(/civic_crown_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}
    >
      <div className="scanlines" style={{ opacity: 0.1 }} />
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        <div className="glass-panel" style={{ padding: '22px 24px', background: 'rgba(7, 10, 16, 0.72)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '20px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div className="system-menu-kicker">{roundLabel}</div>
                {renderStars(tier.prestige)}
              </div>
              <h1 className="glow-text" style={{ fontSize: '3rem', marginTop: '8px', textShadow: tier.prestige >= 4 ? '0 0 25px rgba(240, 198, 124, 0.6)' : 'none' }}>
                {tier.name.toUpperCase()}
              </h1>
              <div style={{ marginTop: '8px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ color: 'var(--accent-magenta)', fontSize: '0.8rem', letterSpacing: '0.22rem' }}>
                  WINS: {activeTourney.wins} // RELATION LINK: {relationshipScore}
                </div>
                {tier.prestige >= 4 && (
                   <div style={{ color: 'var(--accent-yellow)', fontSize: '0.7rem', letterSpacing: '0.15rem', fontWeight: 800, padding: '2px 8px', border: '1px solid var(--accent-yellow)', borderRadius: '4px' }}>
                    ELITE CIRCUIT
                  </div>
                )}
              </div>
            </div>
            <div className="glass-morphism" style={{ padding: '18px 22px', minWidth: '220px' }}>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', letterSpacing: '0.14rem' }}>ESTIMATED PAYOUT</div>
              <div style={{ marginTop: '8px', fontSize: '2rem', fontWeight: 900, color: 'var(--accent-yellow)' }}>{currentPot} CREDITS</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(320px, 0.8fr)', gap: '28px', marginTop: '28px' }}>
          <div className="glass-panel" style={{ padding: '28px', background: 'rgba(8, 10, 17, 0.78)', borderTop: `3px solid ${banter.accentColor}` }}>
            <div className="system-menu-kicker" style={{ color: banter.accentColor }}>{opponentMeta.panelHeaderLabel}</div>
            <h2 style={{ marginTop: '10px', fontSize: '2.1rem', fontWeight: 900 }}>
              {opponent?.name ?? 'ELITE BOT'} // {opponent?.role ?? 'Circuit Opponent'}
            </h2>
              {trainer && <div style={{ marginTop: '12px', color: 'var(--accent-yellow)', lineHeight: 1.6 }}>{trainer.summary}</div>}

              <div style={{ marginTop: '26px', display: 'grid', gap: '14px' }}>
              <div className="glass-morphism" style={{ padding: '18px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '0.12rem', fontWeight: 800 }}>{banter.announcerLabel}</div>
                <div style={{ marginTop: '10px', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>"{banter.intro}"</div>
              </div>

              <div className="glass-morphism" style={{ padding: '18px 20px', borderLeft: `3px solid ${banter.accentColor}` }}>
                <div style={{ fontSize: '0.64rem', color: banter.accentColor, letterSpacing: '0.16rem' }}>{banter.opponentLabel}</div>
                <div style={{ marginTop: '8px', lineHeight: 1.65 }}>{banter.rival}</div>
              </div>
              <div className="glass-morphism" style={{ padding: '18px 20px', borderLeft: '3px solid var(--accent-cyan)' }}>
                <div style={{ fontSize: '0.64rem', color: 'var(--accent-cyan)', letterSpacing: '0.16rem' }}>{banter.playerLabel}</div>
                <div style={{ marginTop: '8px', lineHeight: 1.65 }}>{banter.player}</div>
              </div>
              <div className="glass-morphism" style={{ padding: '18px 20px', borderLeft: '3px solid var(--accent-yellow)' }}>
                <div style={{ fontSize: '0.64rem', color: 'var(--accent-yellow)', letterSpacing: '0.16rem' }}>TIME OF DAY FEED</div>
                <div style={{ marginTop: '8px', lineHeight: 1.65 }}>
                  {opponent?.dialogue[state.timeOfDay] ?? 'The bracket announcer calls both duelists to the floor.'}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="glass-panel" style={{ padding: '24px', background: 'rgba(8, 10, 17, 0.82)' }}>
              <div className="system-menu-kicker">Opponent Dossier</div>
              <div style={{ marginTop: '10px', fontSize: '1.4rem', fontWeight: 800 }}>{opponent?.name ?? 'Elite Bot'}</div>
              <div style={{ marginTop: '6px', color: 'var(--text-secondary)' }}>{opponent?.role ?? 'Circuit Opponent'}</div>
              <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div className="glass-morphism" style={{ padding: '0.6rem 0.8rem', fontSize: '0.72rem', letterSpacing: '0.12rem' }}>
                  DISTRICT: {opponent?.location ?? 'ARENA'}
                </div>
                <div className="glass-morphism" style={{ padding: '0.6rem 0.8rem', fontSize: '0.72rem', letterSpacing: '0.12rem' }}>
                  ROUND: {roundLabel}
                </div>
                {trainer && (
                  <div className="glass-morphism" style={{ padding: '0.6rem 0.8rem', fontSize: '0.72rem', letterSpacing: '0.12rem' }}>
                    FACTION: {trainer.factionId}
                  </div>
                )}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', background: 'rgba(8, 10, 17, 0.82)' }}>
              <div className="system-menu-kicker">Bracket Pressure</div>
              <div style={{ marginTop: '14px', display: 'grid', gap: '12px' }}>
                {getTournamentOpponents(tier.id).map((opponentId, index) => {
                  const bracketOpponent = NPCS.find((entry) => entry.id === opponentId);
                  const isCurrent = opponentId === activeTourney.currentOpponentId;
                  const isCleared = index < activeTourney.wins;
                  return (
                    <div
                      key={`${tier.id}-${opponentId}-${index}`}
                      className="glass-morphism"
                      style={{
                        padding: '14px 16px',
                        border: isCurrent ? '1px solid rgba(240, 198, 124, 0.36)' : undefined,
                        opacity: isCleared ? 0.55 : 1
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                        <div>
                          <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', letterSpacing: '0.14rem' }}>MATCH {index + 1}</div>
                          <div style={{ marginTop: '6px', fontWeight: 800 }}>{bracketOpponent?.name ?? opponentId}</div>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: isCurrent ? 'var(--accent-yellow)' : isCleared ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}>
                          {isCurrent ? 'LIVE' : isCleared ? 'CLEARED' : 'LOCKED'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button className="neo-button primary" style={{ width: '100%', height: '58px' }} onClick={() => { audioManager.playSFX('enter_battle'); setScene('BATTLE'); }}>
              INITIATE SYNC BATTLE
            </button>
            <button className="neo-button" onClick={() => { audioManager.playSFX('withdraw'); cashOut(); }}>
              WITHDRAW & CASH OUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
