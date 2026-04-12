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
import { ActiveTournament, SceneType } from '../core/types';
import { getTrainerById, mergeSocialState } from '../data/trainers';
import { NPCS } from '../npc/npcs';
import { audioManager } from '../core/AudioManager';
import { createSceneTransition, createTournamentBattleTransition } from '../core/sceneTransitions';
import {
  getCircuitNextStep,
  districtTournamentsForLobby,
  districtUnlockReason,
  isDistrictTournamentUnlocked,
  nextCircuitQuest
} from '../core/circuitProgression';
import {
  formatCredits,
  getBracketEconomyCaption,
  getBracketPotAtWins,
  getBracketSweepPot,
  getNetProfitAfterSweep
} from '../core/economy';
import { SystemMenu } from './SystemMenu';
import { TutorialGuide } from './TutorialGuide';
import '../styles/SonsotyoScenes.css';

const TOAST_MS = 4800;

function lucySweepPanelCopy(tierId: string, tierLabel: string): string {
  const annex =
    tierId === 'shop-beginner-circuit' || tierId === 'storefront-mini' || tierId === 'shop-veteran-gauntlet';
  if (annex) {
    return `${tierLabel}—swept. Annex feed is buzzing and your trophy row just ticked. Cash is banked; queue the next ladder or hit the streets when you want air.`;
  }
  return `${tierLabel} cleared end-to-end. That is a serious line on the sanctioned record—catch your breath, tweak the deck if you need to, then pick the next bracket when you want more heat.`;
}

function lucySweepVoiceLine(tierId: string, tierLabel: string): string {
  const annex =
    tierId === 'shop-beginner-circuit' || tierId === 'storefront-mini' || tierId === 'shop-veteran-gauntlet';
  if (annex) return `${tierLabel} cleared. Annex is cheering you on—nice run.`;
  return `${tierLabel} cleared. Major trophy synced—I'm proud of that sync.`;
}

export const Tournament: React.FC = () => {
  const { state, updateGameState, updateProfile, setScene } = useGame();
  const pendingTierId = state.pendingTournamentId;
  const activeTourney: ActiveTournament | null = state.activeTournament;
  const social = mergeSocialState(state.profile.social);
  const nextStep = getCircuitNextStep(state.profile.progress.flags, state.profile.stats.tournamentsWon);

  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [showSettings, setShowSettings] = React.useState(false);
  const [lucySweep, setLucySweep] = React.useState<{ tierId: string; label: string } | null>(null);
  const toastDismissRef = React.useRef<number | null>(null);
  const banterRivalTimerRef = React.useRef<number | null>(null);
  const bracketVictoryToastKeyRef = React.useRef<string | null>(null);

  const dismissLucySweep = React.useCallback(() => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setLucySweep(null);
  }, []);

  const systemMenuOverlay = showSettings ? <SystemMenu onClose={() => setShowSettings(false)} /> : null;

  const showToast = React.useCallback((message: string) => {
    if (toastDismissRef.current !== null) {
      window.clearTimeout(toastDismissRef.current);
    }
    setToastMessage(message);
    toastDismissRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastDismissRef.current = null;
    }, TOAST_MS);
  }, []);

  React.useEffect(
    () => () => {
      if (toastDismissRef.current !== null) window.clearTimeout(toastDismissRef.current);
      if (banterRivalTimerRef.current !== null) window.clearTimeout(banterRivalTimerRef.current);
    },
    []
  );

  const currentOpponentRelScore = activeTourney
    ? (state.profile.social.trainers[activeTourney.currentOpponentId]?.affinity ?? 0)
    : 0;

  const startTournament = React.useCallback(
    (tier: TournamentTier) => {
      if (state.activeTournament) {
        showToast('You already have an active bracket. Finish it, cash out, or abandon before starting another.');
        return;
      }
      if (tier.locationId !== 'card-shop' && !isDistrictTournamentUnlocked(tier.id, state.profile.progress.flags)) {
        showToast(districtUnlockReason(tier.id, state.profile.progress.flags) ?? 'This bracket is locked.');
        return;
      }
      if (state.profile.currency < tier.entryFee) {
        showToast(`Need ${formatCredits(tier.entryFee)} to enter ${tier.name}.`);
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
    },
    [showToast, state.activeTournament, state.profile.currency, state.profile.progress.flags, updateGameState, updateProfile]
  );

  React.useEffect(() => {
    if (!activeTourney || !pendingTierId) return;
    showToast('A bracket is already running — extra invite discarded.');
    updateGameState({ pendingTournamentId: null });
  }, [activeTourney, pendingTierId, showToast, updateGameState]);

  React.useEffect(() => {
    if (!pendingTierId || activeTourney) return;
    const tier = TOURNAMENT_TIERS.find((t) => t.id === pendingTierId);
    if (!tier) {
      showToast('That bracket invite was invalid — it has been cleared.');
      updateGameState({ pendingTournamentId: null });
      return;
    }
    const flags = state.profile.progress.flags;
    const isLockedDistrict = tier.locationId !== 'card-shop' && !isDistrictTournamentUnlocked(tier.id, flags);
    if (isLockedDistrict) {
      showToast(`${tier.name} is still locked — pending invite cleared.`);
      updateGameState({ pendingTournamentId: null });
      return;
    }
    if (state.profile.currency < tier.entryFee) {
      showToast(`Need ${formatCredits(tier.entryFee)} to enter — pending invite cleared.`);
      updateGameState({ pendingTournamentId: null });
      return;
    }
    startTournament(tier);
    updateGameState({ pendingTournamentId: null });
  }, [activeTourney, pendingTierId, showToast, startTournament, state.profile.currency, state.profile.progress.flags, updateGameState]);

  React.useEffect(() => {
    if (!activeTourney) audioManager.playBGM('TOWN');
    else audioManager.playBGM('TOURNAMENT_LOBBY');
  }, [activeTourney]);

  React.useEffect(() => {
    const toast = state.bracketVictoryToast;
    if (!toast) {
      bracketVictoryToastKeyRef.current = null;
      return;
    }
    const key = `${toast.tierId}:${toast.credits}`;
    if (bracketVictoryToastKeyRef.current === key) return;
    bracketVictoryToastKeyRef.current = key;
    const tier = TOURNAMENT_TIERS.find((t) => t.id === toast.tierId);
    const label = tier?.name ?? toast.tierId;
    showToast(`Trophy sync: ${label} cleared — +${formatCredits(toast.credits)} CR`);
    setLucySweep({ tierId: toast.tierId, label });
    audioManager.speak(lucySweepVoiceLine(toast.tierId, label), 'lucy');
    updateGameState({ bracketVictoryToast: null });
  }, [state.bracketVictoryToast, showToast, updateGameState]);

  React.useEffect(() => {
    if (!activeTourney) return undefined;
    const tier = TOURNAMENT_TIERS.find((e) => e.id === activeTourney.tierId);
    if (!tier) return undefined;
    const currentBanter = getTournamentBanter(activeTourney.currentOpponentId, tier.prestige, currentOpponentRelScore, activeTourney.wins);
    const introTimer = window.setTimeout(() => {
      audioManager.speak(currentBanter.intro, 'announcer');
      banterRivalTimerRef.current = window.setTimeout(() => {
        const npc = NPCS.find((n) => n.id === activeTourney.currentOpponentId);
        audioManager.speak(currentBanter.rival, npc?.archetype ?? 'rival');
        banterRivalTimerRef.current = null;
      }, 4000);
    }, 500);
    return () => {
      window.clearTimeout(introTimer);
      if (banterRivalTimerRef.current !== null) {
        window.clearTimeout(banterRivalTimerRef.current);
        banterRivalTimerRef.current = null;
      }
    };
  }, [activeTourney, currentOpponentRelScore]);

  const renderStars = (count: number) => (
    <div style={{ display: 'flex', gap: '4px', color: 'var(--accent-yellow)' }}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} style={{ fontSize: '0.95rem', opacity: index < count ? 1 : 0.18 }}>★</span>
      ))}
    </div>
  );

  const cashOut = () => {
    if (!activeTourney) return;
    const tier = TOURNAMENT_TIERS.find((entry) => entry.id === activeTourney.tierId);
    if (!tier) return;

    const finalReward = getBracketPotAtWins(tier, activeTourney.wins);
    if (!window.confirm(`Cash out for ${formatCredits(finalReward)} now? You will leave the active bracket.`)) return;

    updateProfile({ currency: state.profile.currency + finalReward });
    const returnScene: SceneType = tier.locationId === 'card-shop' ? 'STORE' : (state.tournamentLobbyReturn ?? 'DISTRICT_EXPLORE');
    updateGameState({
      activeTournament: null,
      currentQuest: nextCircuitQuest(state.profile.progress.flags, state.profile.stats.tournamentsWon),
      tournamentLobbyReturn: null
    });
    showToast(`Credited ${formatCredits(finalReward)}. Bracket closed.`);
    setScene(returnScene);
  };

  const abandonBracket = () => {
    if (!activeTourney) return;
    if (!window.confirm('Forfeit this bracket? Entry fee is not refunded.')) return;
    updateGameState({
      activeTournament: null,
      currentQuest: nextCircuitQuest(state.profile.progress.flags, state.profile.stats.tournamentsWon),
      tournamentLobbyReturn: null
    });
    showToast('Bracket forfeited. You can start again from the lobby or annex.');
  };

  const toastNode = toastMessage ? (
    <div className="tournament-toast" role="status">
      {toastMessage}
    </div>
  ) : null;

  if (!activeTourney) {
    return (
      <>
        {toastNode}
        {systemMenuOverlay}
      <div
        className="tournament-scene sonsotyo-scene sonsotyo-scene--bounded fade-in"
        style={{
          position: 'relative',
          padding: '40px',
          paddingBottom: 'max(40px, env(safe-area-inset-bottom, 0px))',
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
              <p className="sonsotyo-copy" style={{ maxWidth: '52ch', marginTop: '14px' }}>
                Clear all three <strong>Card Annex</strong> backroom brackets to earn your club license, then run the four city majors in order (Sunset → Market → Neon → Crown). Each finite sweep pays credits and adds a <strong>title</strong> to your record; Crown is endless until you cash out.
              </p>
              <div className="tournament-sweep-explainer">
                <div className="sonsotyo-kicker" style={{ color: 'var(--accent-yellow)' }}>What counts as a sweep?</div>
                <div className="tournament-sweep-explainer-title">Finish every round in the bracket without cashing out or losing.</div>
                <div className="sonsotyo-copy" style={{ marginTop: '6px' }}>{nextStep.detail}</div>
              </div>
              <div className="sonsotyo-meta-strip">
                <div className="sonsotyo-pill">Currency {state.profile.currency.toLocaleString('en-US')} CR</div>
                <div className="sonsotyo-pill">Titles {state.profile.stats.tournamentsWon}</div>
                <div className="sonsotyo-pill">Sleep Circuit Active</div>
              </div>
              <div style={{ marginTop: '14px' }}>
                <button type="button" className="neo-button" onClick={() => { audioManager.playSFX('menu_open'); setShowSettings(true); }}>
                  System
                </button>
              </div>
            </div>

            <div className="glass-panel sonsotyo-panel">
              <div className="sonsotyo-kicker">Bracket Forecast</div>
              <div style={{ marginTop: '12px', fontFamily: 'var(--font-display)', fontSize: '1.45rem' }}>Four major tiers, one league ladder.</div>
              <div style={{ marginTop: '18px', display: 'grid', gap: '12px' }}>
                {districtTournamentsForLobby().map((tier) => (
                  <div key={tier.id} className="sonsotyo-diagnostic">
                    <span>{tier.name}</span>
                    <span className="sonsotyo-value">{formatCredits(getBracketSweepPot(tier))} sweep</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sonsotyo-grid cards">
            {districtTournamentsForLobby().map((tier) => {
              const featuredOpponentId = getTournamentOpponent(tier.id, 0);
              const featuredOpponent = NPCS.find((entry) => entry.id === featuredOpponentId);
              const trainer = getTrainerById(featuredOpponentId);
              const tierUnlocked = isDistrictTournamentUnlocked(tier.id, state.profile.progress.flags);
              const lockReason = districtUnlockReason(tier.id, state.profile.progress.flags);
              const canPay = state.profile.currency >= tier.entryFee;
              const canEnter = tierUnlocked && canPay;

              return (
                <div key={tier.id} className="glass-panel sonsotyo-panel" style={{ borderTop: `3px solid ${tier.isEndless ? 'var(--accent-secondary)' : 'var(--accent-primary)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start' }}>
                    <div>
                      <div className="sonsotyo-kicker">{tier.locationId.replace(/-/g, ' ')}</div>
                      <div style={{ marginTop: '10px', fontFamily: 'var(--font-display)', fontSize: '1.45rem' }}>{tier.name}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                      {tier.isEndless && <div className="sonsotyo-pill" style={{ color: 'var(--accent-secondary)' }}>Endless</div>}
                      {!tierUnlocked && <div className="sonsotyo-pill" style={{ borderColor: 'rgba(255,138,198,0.5)', color: 'var(--accent-secondary)' }}>Locked</div>}
                    </div>
                  </div>

                  <div style={{ marginTop: '12px' }}>{renderStars(tier.prestige)}</div>
                  <p className="sonsotyo-copy" style={{ marginTop: '14px' }}>{tier.description}</p>
                  <div className="sonsotyo-copy" style={{ marginTop: '10px' }}>{getTournamentPreviewLine(tier)}</div>
                  {!tierUnlocked && lockReason && (
                    <p className="sonsotyo-copy" style={{ marginTop: '12px', color: 'var(--accent-yellow)', lineHeight: 1.55, fontSize: '0.88rem' }}>
                      {lockReason}
                    </p>
                  )}

                  <div style={{ marginTop: '18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="glass-panel sonsotyo-panel" style={{ padding: '16px' }}>
                      <div className="sonsotyo-kicker">Entry</div>
                      <div style={{ marginTop: '8px', fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--accent-yellow)' }}>
                        {tier.entryFee > 0 ? formatCredits(tier.entryFee) : 'Free'}
                      </div>
                    </div>
                  <div className="glass-panel sonsotyo-panel" style={{ padding: '16px' }}>
                    <div className="sonsotyo-kicker">Sweep cap</div>
                    <div style={{ marginTop: '8px', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>{formatCredits(getBracketSweepPot(tier))}</div>
                      <div className="sonsotyo-caption" style={{ marginTop: '8px', lineHeight: 1.45 }}>
                        {getBracketEconomyCaption(tier)} Full sweep required.
                      </div>
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
                    {trainer && (
                      <>
                        <div style={{ marginTop: '10px', color: 'var(--accent-yellow)', lineHeight: 1.5 }}>{trainer.summary}</div>
                        <div className="sonsotyo-caption" style={{ marginTop: '10px', lineHeight: 1.55, opacity: 0.82 }}>
                          <span style={{ letterSpacing: '0.1em', opacity: 0.65 }}>Personality · </span>
                          {trainer.personality}
                        </div>
                      </>
                    )}
                  </div>

                  <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'center' }}>
                    <div className="sonsotyo-caption">Opponents {getTournamentOpponents(tier.id).length}</div>
                    <button
                      className={`neo-button ${canEnter ? 'primary' : ''}`}
                      onClick={() => startTournament(tier)}
                      disabled={!canEnter}
                    >
                      {!tierUnlocked ? 'Requirements not met' : !canPay ? 'Insufficient Funds' : 'Enter Bracket'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', paddingBottom: '12px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="neo-button"
              onClick={() => {
                audioManager.playSFX('back');
                const dest: SceneType = state.tournamentLobbyReturn ?? 'DISTRICT_EXPLORE';
                updateGameState({ tournamentLobbyReturn: null });
                setScene(dest);
              }}
            >
              {state.tournamentLobbyReturn === 'STORE' ? 'Return to Card Annex' : 'Return to district'}
            </button>
            <button type="button" className="neo-button" onClick={() => { audioManager.playSFX('menu_open'); setShowSettings(true); }}>
              System
            </button>
          </div>
        </div>
        {lucySweep && (
          <TutorialGuide
            overlayZIndex={520}
            dimBackdrop
            onBackdropClick={dismissLucySweep}
            portraitSrc="/bust_lucy.svg"
            portraitAlt="Lucy — circuit guide"
            title="Lucy · Handler ping"
            subtitle="Post-bracket"
            message={lucySweepPanelCopy(lucySweep.tierId, lucySweep.label)}
            objective={state.currentQuest}
            actions={[{ label: 'Got it', variant: 'primary', onClick: dismissLucySweep }]}
          />
        )}
      </div>
      </>
    );
  }

  const tier = TOURNAMENT_TIERS.find((entry) => entry.id === activeTourney.tierId);
  if (!tier) {
    return (
      <>
        {toastNode}
        {systemMenuOverlay}
        <div className="tournament-scene sonsotyo-scene fade-in" style={{ minHeight: '100vh', padding: '40px', display: 'grid', placeItems: 'center' }}>
          <div className="glass-panel sonsotyo-panel" style={{ maxWidth: '480px', padding: '28px', textAlign: 'center' }}>
            <div className="sonsotyo-kicker">Bracket sync error</div>
            <p className="sonsotyo-copy" style={{ marginTop: '14px' }}>
              No tier data for this run. Your save may reference a removed event — the bracket has been cleared.
            </p>
            <div style={{ marginTop: '22px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="neo-button primary"
                onClick={() => {
                  const dest: SceneType = state.tournamentLobbyReturn === 'STORE' ? 'STORE' : 'DISTRICT_EXPLORE';
                  updateGameState({
                    activeTournament: null,
                    tournamentLobbyReturn: null,
                    sceneTransition: createSceneTransition(state.currentScene, dest, {
                      kicker: 'Bracket Exit',
                      title: 'Leaving the current tournament feed',
                      detail: dest === 'STORE' ? 'Returning to the Card Annex floor.' : 'Returning to the district route map.'
                    })
                  });
                }}
              >
                {state.tournamentLobbyReturn === 'STORE' ? 'Return to Card Annex' : 'Return to district'}
              </button>
              <button type="button" className="neo-button" onClick={() => { audioManager.playSFX('menu_open'); setShowSettings(true); }}>
                System
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const currentPot = getBracketPotAtWins(tier, activeTourney.wins);
  const opponent = NPCS.find((entry) => entry.id === activeTourney.currentOpponentId);
  const trainer = getTrainerById(activeTourney.currentOpponentId);
  const relationshipScore = social.trainers[activeTourney.currentOpponentId]?.affinity ?? 0;
  const banter = getTournamentBanter(activeTourney.currentOpponentId, tier.prestige, relationshipScore, activeTourney.wins);
  const roundLabel = getTournamentRoundLabel(tier.id, activeTourney.wins);
  const opponentMeta = getOpponentMeta(activeTourney.currentOpponentId);

  return (
    <>
      {toastNode}
      {systemMenuOverlay}
    <div
      className="tournament-scene sonsotyo-scene sonsotyo-scene--bounded fade-in"
      style={{
        position: 'relative',
        padding: '40px',
        paddingBottom: 'max(40px, env(safe-area-inset-bottom, 0px))',
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
              Each win deepens the bracket and raises your cash-out pot. Lose a duel and the run ends — entry fee is not refunded unless you withdraw first.
            </p>
            <div className="tournament-sweep-explainer">
              <div className="sonsotyo-kicker" style={{ color: 'var(--accent-yellow)' }}>Current objective</div>
              <div className="tournament-sweep-explainer-title">{nextStep.title}</div>
              <div className="sonsotyo-copy" style={{ marginTop: '6px' }}>Stay in the run to chase the full sweep, or withdraw if you want to lock today&apos;s pot early.</div>
            </div>
          </div>

          <div className="glass-panel sonsotyo-panel">
            <div className="sonsotyo-kicker">Estimated Payout</div>
            <div style={{ marginTop: '12px', fontFamily: 'var(--font-display)', fontSize: '2.3rem', color: 'var(--accent-yellow)' }}>{formatCredits(currentPot)}</div>
            <div className="sonsotyo-copy" style={{ marginTop: '10px' }}>
              {activeTourney.wins === 0
                ? 'Entry is already paid. Cash out now to take the base settlement, or fight to grow the pot.'
                : 'Cash out now to lock the pot, or keep climbing while the circuit gets meaner.'}
            </div>
            <div className="sonsotyo-caption" style={{ marginTop: '12px', lineHeight: 1.55 }}>
              {tier.isEndless ? (
                <>
                  Next win lifts cash-out to {formatCredits(getBracketPotAtWins(tier, activeTourney.wins + 1))}. {getBracketEconomyCaption(tier)}
                </>
              ) : (
                <>
                  Full clear pays {formatCredits(getBracketSweepPot(tier))}.
                  {tier.entryFee > 0 && <> Sweep vs entry: {formatCredits(getNetProfitAfterSweep(tier))}.</>}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="sonsotyo-grid two">
          <div className="glass-panel sonsotyo-panel" style={{ borderTop: `3px solid ${banter.accentColor}` }}>
            <div className="sonsotyo-kicker" style={{ color: banter.accentColor }}>{opponentMeta.panelHeaderLabel}</div>
            <div style={{ marginTop: '10px', fontFamily: 'var(--font-display)', fontSize: '2rem' }}>
              {opponent?.name ?? 'Elite Bot'} / {opponent?.role ?? 'Circuit Opponent'}
            </div>
            {trainer && (
              <>
                <div style={{ marginTop: '10px', color: 'var(--accent-yellow)', lineHeight: 1.6 }}>{trainer.summary}</div>
                <div className="sonsotyo-caption" style={{ marginTop: '10px', lineHeight: 1.55, opacity: 0.82 }}>
                  <span style={{ letterSpacing: '0.1em', opacity: 0.65 }}>Personality · </span>
                  {trainer.personality}
                </div>
              </>
            )}

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
              {trainer && (
                <>
                  <div className="sonsotyo-caption" style={{ marginTop: '12px', letterSpacing: '0.1em', opacity: 0.55 }}>
                    Personality
                  </div>
                  <div className="sonsotyo-copy" style={{ marginTop: '6px', lineHeight: 1.55, fontSize: '0.88rem' }}>{trainer.personality}</div>
                </>
              )}
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

            <button
              className="neo-button primary"
              style={{ width: '100%', height: '58px' }}
              onClick={() => {
                audioManager.playSFX('enter_battle');
                updateGameState({
                  sceneTransition: createTournamentBattleTransition(tier.name, opponent?.name ?? 'Elite Bot')
                });
              }}
            >
              Initiate Sync Battle
            </button>
            <button className="neo-button" onClick={() => { audioManager.playSFX('withdraw'); cashOut(); }}>
              Withdraw & Cash Out
            </button>
            <button
              className="neo-button"
              style={{ opacity: 0.85 }}
              onClick={() => {
                audioManager.playSFX('back');
                abandonBracket();
              }}
            >
              Abandon bracket
            </button>
            <button type="button" className="neo-button" onClick={() => { audioManager.playSFX('menu_open'); setShowSettings(true); }}>
              System
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
