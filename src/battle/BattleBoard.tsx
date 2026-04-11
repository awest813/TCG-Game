import React, { useEffect, useMemo, useState } from 'react';
import { useBattle } from './useBattle';
import { useGame } from '../core/GameContext';
import { Card } from '../core/types';
import {
  mergeFlagsAfterTournamentVictory,
  nextCircuitQuest,
  unlockedDistrictsAfterVictory
} from '../core/circuitProgression';
import { getBracketPotAtWins } from '../core/economy';
import { getTournamentBracketSize, getTournamentOpponent, TOURNAMENT_TIERS } from '../core/TournamentManager';
import { applyTrainerRelationshipDelta, getTrainerById, mergeSocialState } from '../data/trainers';
import { getCardById, getCardPalette } from '../data/cards';
import { NPCS } from '../npc/npcs';
import { audioManager } from '../core/AudioManager';
import { BattleArena3D } from './BattleArena3D';
import { BattleEntity } from './BattleEngine';
import './BattleBoard.css';

type FieldTheme = {
  accent: string;
  label: string;
  mood: string;
  stageStyle?: React.CSSProperties;
};

export const BattleBoard: React.FC = () => {
  const { state, setScene, updateGameState, updateProfile } = useGame();
  const [showVS, setShowVS] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<Card | null>(null);
  const [damageMarkers, setDamageMarkers] = useState<{ id: string; value: number; x: number; y: number }[]>([]);
  const [boardShake, setBoardShake] = useState(false);

  const activeTournament = state.activeTournament;
  const social = mergeSocialState(state.profile.social);
  const tournamentTier = activeTournament ? TOURNAMENT_TIERS.find((entry) => entry.id === activeTournament.tierId) : null;
  const opponentId = activeTournament?.currentOpponentId ?? 'kaizen';
  const opponent = NPCS.find((entry) => entry.id === opponentId);
  const trainer = getTrainerById(opponentId);
  const opponentName = opponent?.name ?? 'KAIZEN';
  const opponentAvatar = trainer?.avatarPath ?? (opponentId === 'kaizen' ? '/avatar_kaizen.png' : '/avatar_player.png');
  const playerDeck = useMemo(() => {
    const ids = [...state.profile.inventory.deck];
    if (ids.length === 0) {
      return ['ziprail', 'ziprail', 'neon-striker', 'signalmite', 'quick-transfer'];
    }
    return ids;
  }, [state.profile.inventory.deck]);
  const opponentDeck = useMemo(
    () => [...(trainer?.deck ?? ['ziprail', 'neon-striker', 'voltlynx', 'overdrive-fox', 'quick-transfer', 'ziprail'])],
    [trainer?.deck]
  );

  const { battleState, playCard, attack, endTurn } = useBattle(playerDeck, opponentDeck);

  const activeField = battleState.field;
  const isPlayerTurn = battleState.isPlayerTurn;
  const latestEvents = battleState.log.slice(-4).reverse();
  const playerPrizesTaken = 3 - battleState.player.prizes;
  const opponentPrizesTaken = 3 - battleState.opponent.prizes;

  useEffect(() => {
    audioManager.playBGM('BATTLE');
    audioManager.playSFX('vs_impact');
    const timer = window.setTimeout(() => setShowVS(false), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  const announceEvent = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.15;
    utterance.pitch = 0.9;
    utterance.volume = 0.55;
    const voices = window.speechSynthesis.getVoices();
    const target = voices.find((voice) => voice.name.includes('Google') || voice.name.includes('Robot') || voice.lang.startsWith('en')) ?? voices[0];
    if (target) utterance.voice = target;
    window.speechSynthesis.speak(utterance);
  };

  const triggerShake = () => {
    setBoardShake(true);
    window.setTimeout(() => setBoardShake(false), 400);
  };

  const spawnMarker = (value: number) => {
    const id = Math.random().toString(36).slice(2, 9);
    const x = 40 + Math.random() * 20;
    const y = 40 + Math.random() * 20;
    setDamageMarkers((prev) => [...prev, { id, value, x, y }]);
    window.setTimeout(() => setDamageMarkers((prev) => prev.filter((marker) => marker.id !== id)), 1000);
  };

  useEffect(() => {
    if (activeField) {
      const fieldName = activeField.replace(/-/g, ' ').toUpperCase();
      announceEvent(`FIELD_SYNC: ${fieldName} INITIALIZED.`);
    }
  }, [activeField]);

  useEffect(() => {
    if (battleState.turn > 0) {
      const turnLabel = battleState.isPlayerTurn ? 'PLAYER' : 'OPPONENT';
      announceEvent(`TURN CYCLE ${battleState.turn}: ${turnLabel} CONTROL.`);
    }
  }, [battleState.turn, battleState.isPlayerTurn]);

  const fieldTheme = useMemo<FieldTheme>(() => {
    switch (activeField) {
      case 'neon-grid':
        return {
          accent: 'var(--accent-primary)',
          label: 'Neon Grid',
          mood: 'Arcade voltage and rail-light pressure.',
          stageStyle: { boxShadow: 'inset 0 0 120px rgba(121, 247, 255, 0.18)' }
        };
      case 'garden-haze':
        return {
          accent: '#9df5be',
          label: 'Garden Haze',
          mood: 'Soft bio-lights and lucid bloom drift.',
          stageStyle: { boxShadow: 'inset 0 0 120px rgba(157, 245, 190, 0.16)' }
        };
      case 'void-rift':
        return {
          accent: 'var(--accent-lavender)',
          label: 'Void Rift',
          mood: 'Dream static folding into midnight glass.',
          stageStyle: { boxShadow: 'inset 0 0 120px rgba(182, 178, 255, 0.18)' }
        };
      case 'alloy-foundry':
        return {
          accent: '#d5dae2',
          label: 'Alloy Foundry',
          mood: 'Steel glow under sleepless factory fog.',
          stageStyle: { boxShadow: 'inset 0 0 120px rgba(213, 218, 226, 0.16)' }
        };
      default:
        return {
          accent: 'var(--accent-secondary)',
          label: 'Night Circuit',
          mood: 'Moonlit signal drift above the arena.'
        };
    }
  }, [activeField]);
  const handleAttack = () => {
    if (!battleState.isPlayerTurn || !battleState.player.active) return;
    audioManager.playSFX('attack_resolve');
    triggerShake();
    spawnMarker(battleState.player.active.attack);
    attack();
  };

  const handleVictoryExit = () => {
    if (!activeTournament) {
      setScene('APARTMENT');
      return;
    }
    if (!tournamentTier) {
      updateGameState({ activeTournament: null, tournamentLobbyReturn: null });
      setScene('TOURNAMENT');
      return;
    }

    const nextWins = activeTournament.wins + 1;
    const officialBracketSize = getTournamentBracketSize(activeTournament.tierId);
    if (nextWins >= officialBracketSize && activeTournament.tierId !== 'crown-unlimited') {
      const finalReward = getBracketPotAtWins(tournamentTier, nextWins);
      const socialWithTrainer = trainer
        ? applyTrainerRelationshipDelta(state.profile, trainer.id, { affinity: 1, rivalry: 1, respect: 2, lastResult: 'WIN' })
        : social;

      const mergedFlags = mergeFlagsAfterTournamentVictory(activeTournament.tierId, state.profile.progress.flags);
      const expandedDistricts =
        unlockedDistrictsAfterVictory(activeTournament.tierId, state.profile.progress.unlockedDistricts) ??
        state.profile.progress.unlockedDistricts;

      updateProfile({
        currency: state.profile.currency + finalReward,
        stats: {
          ...state.profile.stats,
          wins: state.profile.stats.wins + 1,
          tournamentsWon: state.profile.stats.tournamentsWon + 1
        },
        social: socialWithTrainer,
        progress: {
          ...state.profile.progress,
          flags: mergedFlags,
          unlockedDistricts: expandedDistricts
        }
      });
      updateGameState({ activeTournament: null, currentQuest: nextCircuitQuest(mergedFlags) });
      setScene('TOURNAMENT');
      return;
    }

    updateGameState({
      activeTournament: {
        ...activeTournament,
        wins: nextWins,
        currentOpponentId: getTournamentOpponent(activeTournament.tierId, nextWins)
      }
    });
    setScene('TOURNAMENT');
  };

  const handleDefeatExit = () => {
    if (activeTournament) {
      updateProfile({ stats: { ...state.profile.stats, losses: state.profile.stats.losses + 1 } });
      updateGameState({
        activeTournament: null,
        currentQuest: nextCircuitQuest(state.profile.progress.flags)
      });
      setScene('TOURNAMENT');
      return;
    }
    setScene('APARTMENT');
  };

  if (showVS) {
    return <VSDisplay playerAvatar="/avatar_player.png" opponentAvatar={opponentAvatar} opponentName={opponentName.toUpperCase()} />;
  }

  return (
    <>
      <div
        className={`battle-container battle-sonsotyo fade-in ${activeField ? 'field-active' : ''}`}
        style={{
          backgroundImage:
            activeField === 'garden-haze' ? 'url("/assets/fields/garden-haze.svg")' : 'url("/assets/fields/battle-base.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="battle-backdrop" />
        <div className="scanlines" />
        <BattleArena3D
          playerActive={battleState.player.active}
          opponentActive={battleState.opponent.active}
          playerBench={battleState.player.bench}
          opponentBench={battleState.opponent.bench}
          field={activeField}
        />

        <div className="battle-grid">
          <div className="battle-topbar">
            <div className="glass-panel battle-rival-panel">
              <img className="battle-rival-avatar" src={opponentAvatar} alt={opponentName} />
              <div>
                <div className="battle-kicker">Sonsotyo Dream Match</div>
                <div className="battle-rival-name" style={{ color: fieldTheme.accent }}>{opponentName}</div>
                <div className="battle-rival-sub">{fieldTheme.mood}</div>
              </div>
              <div className="battle-field-chip">
                <span>Field</span>
                <strong style={{ color: fieldTheme.accent }}>{fieldTheme.label}</strong>
              </div>
            </div>

            <div className="glass-panel battle-feed">
              <div className="battle-mini-label">Signal Feed</div>
              <div className="battle-feed-list">
                {latestEvents.map((event, index) => (
                  <div key={index} className={`battle-feed-item ${index === 0 ? 'is-latest' : ''}`}>
                    {event}
                  </div>
                ))}
              </div>
              <div className="battle-turn-pill" style={{ color: isPlayerTurn ? 'var(--accent-primary)' : 'var(--accent-secondary)' }}>
                <span>{isPlayerTurn ? 'Player Tempo' : 'Rival Tempo'}</span>
                <strong>TURN {battleState.turn}</strong>
              </div>
            </div>
          </div>

          <div className="battle-main">
            <div className="battle-stage" style={{ transform: boardShake ? 'translate(4px, 2px)' : 'none' }}>
              <div className="battle-stage-header">
                <BattleStat label="Dream Sync" value={battleState.player.mana.toString()} detail={`${battleState.player.maxMana} max energy`} accent="var(--accent-primary)" />
                <BattleStat label="Prize Pressure" value={`${playerPrizesTaken}-${opponentPrizesTaken}`} detail="captured marks" accent="var(--accent-yellow)" />
                <BattleStat label="Sleep Phase" value={battleState.phase} detail={isPlayerTurn ? 'initiative in hand' : 'rival sequence live'} accent={isPlayerTurn ? 'var(--accent-primary)' : 'var(--accent-secondary)'} />
              </div>

              <div className="glass-panel battle-stage-shell" style={fieldTheme.stageStyle}>
                <div className="battle-lanes">
                  <FieldRow side="opponent" active={battleState.opponent.active} bench={battleState.opponent.bench} onHover={(id) => setHoveredCard(getCardById(id) ?? null)} onLeave={() => setHoveredCard(null)} />
                  <FieldRow side="player" active={battleState.player.active} bench={battleState.player.bench} onHover={(id) => setHoveredCard(getCardById(id) ?? null)} onLeave={() => setHoveredCard(null)} onAttack={handleAttack} />
                </div>
              </div>
            </div>

            <div className="battle-sidebar">
              <LifePointTracker value={battleState.opponent.prizes} name="Enemy Prizes" color="var(--accent-secondary)" />
              <LifePointTracker value={battleState.player.prizes} name="Local Prizes" color="var(--accent-primary)" />
              <div className="glass-panel battle-energy">
                <div className="battle-mini-label">Energy Weave</div>
                <div className="battle-energy-bar">
                  <div className="battle-energy-fill" style={{ width: `${(battleState.player.mana / Math.max(1, battleState.player.maxMana)) * 100}%` }} />
                </div>
                <div className="battle-energy-meta">
                  <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>{battleState.player.mana}/{battleState.player.maxMana}</strong>
                  <span className="battle-mini-label" style={{ color: isPlayerTurn ? 'var(--accent-primary)' : 'var(--accent-secondary)' }}>{isPlayerTurn ? 'Your Window' : 'Locked'}</span>
                </div>
              </div>
              {hoveredCard ? <CardInspector card={hoveredCard} /> : <IdleInspector opponentName={opponentName} fieldLabel={fieldTheme.label} />}
            </div>
          </div>

          <div className="battle-bottom">
            <div className="glass-panel battle-hand">
              <div className="battle-hand-header">
                <div>
                  <div className="battle-mini-label">Hand Array</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Playable Pulse</div>
                </div>
                <div className="battle-field-chip">
                  <span>Cards</span>
                  <strong>{battleState.player.hand.length}</strong>
                </div>
              </div>
              <div className="battle-hand-list">
                {battleState.player.hand.map((cardId, index) => (
                  <BattleCard
                    key={index}
                    cardId={cardId}
                    onClick={() => {
                      audioManager.playSFX('card_play');
                      playCard(cardId);
                    }}
                    onHover={() => setHoveredCard(getCardById(cardId) ?? null)}
                    onLeave={() => setHoveredCard(null)}
                    disabled={!isPlayerTurn || Boolean(battleState.winner)}
                  />
                ))}
              </div>
            </div>

            <div className="glass-panel battle-controls">
              <div className="battle-mini-label">Command</div>
              <div className="battle-controls-copy">Strike from the active unit or fade the tempo and pass control when the sequence feels right.</div>
              <button
                className="neo-button primary"
                onClick={() => {
                  audioManager.playSFX('turn_end');
                  endTurn();
                }}
                disabled={!isPlayerTurn || Boolean(battleState.winner)}
                style={{ width: '100%' }}
              >
                {isPlayerTurn ? 'End Sync' : 'Processing'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {damageMarkers.map((marker) => (
        <div
          key={marker.id}
          className="damage-marker"
          style={{ position: 'fixed', left: `${marker.x}%`, top: `${marker.y}%`, color: 'var(--accent-secondary)', fontSize: '5rem', fontWeight: 900, zIndex: 1000, pointerEvents: 'none', textShadow: '0 0 20px rgba(0,0,0,0.8)' }}
        >
          -{marker.value}
        </div>
      ))}

      {battleState.winner === 'player' && <EndMatchModal title="VICTORY" color="var(--accent-primary)" onExit={handleVictoryExit} />}
      {battleState.winner === 'opponent' && <EndMatchModal title="DEFEAT" color="var(--accent-secondary)" onExit={handleDefeatExit} />}

      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1.1); opacity: 1; }
          100% { transform: translateY(-140px) scale(1.6); opacity: 0; }
        }
        .damage-marker { animation: float-up 0.8s forwards ease-out; }
      `}</style>
    </>
  );
};

const BattleStat: React.FC<{ label: string; value: string; detail: string; accent: string }> = ({ label, value, detail, accent }) => (
  <div className="glass-panel battle-stat">
    <div className="battle-stat-label">{label}</div>
    <div className="battle-stat-value" style={{ color: accent }}>{value}</div>
    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{detail}</div>
  </div>
);

const FieldRow: React.FC<{
  side: string;
  active: BattleEntity | null;
  bench: (BattleEntity | null)[];
  onHover: (id: string) => void;
  onLeave: () => void;
  onAttack?: () => void;
}> = ({ side, active, bench, onHover, onLeave, onAttack }) => (
  <div className="battle-row">
    <div className="battle-row-label">{side === 'player' ? 'Dreamer Side' : 'Rival Side'}</div>
    <div className="battle-row-slots" style={{ justifyContent: side === 'player' ? 'flex-start' : 'flex-end' }}>
      {side === 'opponent' && bench.map((entity, index) => <BattleSlot key={index} entity={entity} onHover={onHover} onLeave={onLeave} />)}
      <BattleSlot entity={active} isActive onClick={onAttack} onHover={onHover} onLeave={onLeave} />
      {side === 'player' && bench.map((entity, index) => <BattleSlot key={index} entity={entity} onHover={onHover} onLeave={onLeave} />)}
    </div>
  </div>
);

const BattleSlot: React.FC<{
  entity: BattleEntity | null;
  isActive?: boolean;
  onClick?: () => void;
  onHover: (id: string) => void;
  onLeave: () => void;
}> = ({ entity, isActive, onClick, onHover, onLeave }) => {
  const card = entity ? getCardById(entity.cardId) : null;
  const palette = getCardPalette(card);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => entity && onHover(entity.cardId)}
      onMouseLeave={onLeave}
      className={`battle-slot ${isActive ? 'is-active' : 'is-bench'} ${entity ? 'has-entity' : 'is-empty'}`}
      style={{ borderColor: entity ? palette.accent : 'rgba(255,255,255,0.12)', background: entity ? palette.panel : 'rgba(8,12,24,0.32)' }}
    >
      {entity && (
        <div className="battle-slot-shell">
          <div className="battle-slot-type" style={{ color: palette.accent }}>{isActive ? 'Active' : 'Bench'}</div>
          <div className="battle-slot-name">{card?.name.toUpperCase()}</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: palette.accent }}>
            <div className="battle-slot-orb" style={{ background: palette.glow }} />
          </div>
          <div className="battle-slot-stats">
            <div style={{ color: 'var(--accent-yellow)' }}>{entity.attack}</div>
            <div>{entity.currentHealth}</div>
          </div>
        </div>
      )}
    </div>
  );
};

const BattleCard: React.FC<{ cardId: string; onClick: () => void; onHover: () => void; onLeave: () => void; disabled: boolean }> = ({ cardId, onClick, onHover, onLeave, disabled }) => {
  const card = getCardById(cardId);
  const palette = getCardPalette(card);

  return (
    <button disabled={disabled} onClick={onClick} onMouseEnter={onHover} onMouseLeave={onLeave} className="battle-card" style={{ borderColor: palette.accent, background: palette.panel, opacity: disabled ? 0.4 : 1 }}>
      <div className="battle-card-name">{card?.name.toUpperCase()}</div>
      <div className="battle-card-art" style={{ boxShadow: `inset 0 0 40px ${palette.glow}` }} />
      <div className="battle-card-footer">
        <div>
          <div className="battle-card-cost" style={{ color: palette.accent }}>{card?.cost} EN</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.76rem', marginTop: '4px' }}>{card?.cardType.toUpperCase()}</div>
        </div>
        <div className="battle-card-stats">{card?.attack ?? '-'} / {card?.health ?? '-'}</div>
      </div>
    </button>
  );
};

const LifePointTracker: React.FC<{ value: number; name: string; color: string }> = ({ value, name, color }) => (
  <div className="glass-panel battle-prizes">
    <div className="battle-mini-label">{name}</div>
    <div className="battle-prize-value" style={{ color }}>{value}/3</div>
    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Marks left before collapse.</div>
  </div>
);

const VSDisplay: React.FC<{ playerAvatar: string; opponentAvatar: string; opponentName: string }> = ({ playerAvatar, opponentAvatar, opponentName }) => (
  <div className="battle-vs-screen fade-in">
    <img className="battle-vs-portrait" src={playerAvatar} alt="P1" />
    <div className="battle-vs-center">
      <div className="battle-kicker">Sonsotyo Sequence</div>
      <div className="battle-vs-mark">VS</div>
      <div className="battle-vs-opponent">{opponentName}</div>
    </div>
    <img className="battle-vs-portrait" src={opponentAvatar} alt="P2" />
  </div>
);

const EndMatchModal: React.FC<{ title: string; color: string; onExit: () => void }> = ({ title, color, onExit }) => (
  <div className="battle-modal">
    <div className="glass-panel battle-modal-panel">
      <div className="battle-modal-title" style={{ color }}>{title}</div>
      <div className="battle-modal-copy">The sequence has settled. Step back into the city and carry the result forward.</div>
      <button className="neo-button primary" style={{ padding: '18px 42px', margin: '32px auto 0' }} onClick={onExit}>Exit Circuit</button>
    </div>
  </div>
);

const IdleInspector: React.FC<{ opponentName: string; fieldLabel: string }> = ({ opponentName, fieldLabel }) => (
  <div className="glass-panel battle-inspector">
    <div className="battle-mini-label">Hover Readout</div>
    <div style={{ marginTop: '10px', fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>Sonsotyo Lens</div>
    <div style={{ marginTop: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
      Float over a card to inspect its dreamprint. {opponentName} is currently threading the {fieldLabel} channel.
    </div>
  </div>
);

const CardInspector: React.FC<{ card: Card }> = ({ card }) => {
  const palette = getCardPalette(card);

  return (
    <div className="glass-panel battle-inspector" style={{ background: palette.panel, borderColor: palette.accent }}>
      <div className="battle-mini-label" style={{ color: palette.accent }}>{card.cardType.toUpperCase()}</div>
      <h3 style={{ marginTop: '10px', fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>{card.name.toUpperCase()}</h3>
      <div style={{ margin: '14px 0', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{card.rulesText?.[0] ?? 'No passive text loaded.'}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>{card.attack ?? '-'} / {card.health ?? '-'}</div>
    </div>
  );
};
