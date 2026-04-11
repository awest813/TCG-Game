import React, { useEffect, useMemo, useState } from 'react';
import { useBattle } from './useBattle';
import { useGame } from '../core/GameContext';
import { Card } from '../core/types';
import { getTournamentBracketSize, getTournamentOpponent, getTournamentRoundLabel, TOURNAMENT_TIERS } from '../core/TournamentManager';
import { applyFactionReputationDelta, applyTrainerRelationshipDelta, getFactionById, getTrainerById, mergeSocialState } from '../data/trainers';
import { getCardById, getCardPalette } from '../data/cards';
import { BattleEntity } from './BattleEngine';
import { NPCS } from '../npc/npcs';
import { audioManager } from '../core/AudioManager';
import { BattleArena3D } from './BattleArena3D';

export const BattleBoard: React.FC = () => {
  const { state, setScene, updateGameState, updateProfile } = useGame();
  const [showVS, setShowVS] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<Card | null>(null);
  
  const activeTournament = state.activeTournament;
  const social = mergeSocialState(state.profile.social);
  const tournamentTier = activeTournament ? TOURNAMENT_TIERS.find((entry) => entry.id === activeTournament.tierId) : null;
  const opponentId = activeTournament?.currentOpponentId ?? 'kaizen';
  const opponent = NPCS.find((entry) => entry.id === opponentId);
  const trainer = getTrainerById(opponentId);
  const faction = trainer ? getFactionById(trainer.factionId) : null;
  const opponentName = opponent?.name ?? 'KAIZEN';
  const opponentAvatar = trainer?.avatarPath ?? (opponentId === 'kaizen' ? '/avatar_kaizen.png' : '/avatar_player.png');
  const playerDeck = useMemo(() => [...state.profile.inventory.deck], [state.profile.inventory.deck]);
  const opponentDeck = useMemo(() => [...(trainer?.deck ?? ['ziprail', 'neon-striker', 'voltlynx', 'overdrive-fox', 'quick-transfer', 'ziprail'])], [trainer?.deck]);
  
  const { battleState, playCard, attack, endTurn } = useBattle(
      playerDeck,
      opponentDeck
  );

  const activeField = battleState.field;
  const isPlayerTurn = battleState.isPlayerTurn;
  const latestEvents = battleState.log.slice(-4).reverse();

  const [damageMarkers, setDamageMarkers] = useState<{ id: string; value: number; x: number; y: number }[]>([]);
  const [boardShake, setBoardShake] = useState(false);

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
    const target = voices.find(v => v.name.includes('Google') || v.name.includes('Robot') || v.lang.startsWith('en')) || voices[0];
    if (target) utterance.voice = target;
    window.speechSynthesis.speak(utterance);
  };

  const triggerShake = () => {
    setBoardShake(true);
    setTimeout(() => setBoardShake(false), 400);
  };

  const spawnMarker = (value: number) => {
    const id = Math.random().toString(36).slice(2, 9);
    const x = 40 + Math.random() * 20;
    const y = 40 + Math.random() * 20;
    setDamageMarkers(prev => [...prev, { id, value, x, y }]);
    setTimeout(() => setDamageMarkers(prev => prev.filter(m => m.id !== id)), 1000);
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

  const handleAttack = async () => {
    if (!battleState.isPlayerTurn || !battleState.player.active) return;
    audioManager.playSFX('attack_resolve');
    triggerShake();
    spawnMarker(battleState.player.active.attack);
    attack();
  };

  const fieldStyle = useMemo(() => {
    switch (activeField) {
      case 'neon-grid': return { border: '3px solid var(--accent-cyan)', boxShadow: 'inset 0 0 120px rgba(121, 247, 255, 0.18)' };
      case 'garden-haze': return { border: '3px solid #8effa7', boxShadow: 'inset 0 0 120px rgba(142, 255, 167, 0.14)' };
      case 'void-rift': return { border: '3px solid #7a6cff', boxShadow: 'inset 0 0 120px rgba(122, 108, 255, 0.18)' };
      case 'alloy-foundry': return { border: '3px solid #d5dae2', boxShadow: 'inset 0 0 120px rgba(213, 218, 226, 0.16)' };
      default: return {};
    }
  }, [activeField]);

  const handleVictoryExit = () => {
    if (!activeTournament || !tournamentTier) { setScene('DISTRICT_EXPLORE'); return; }
    const nextWins = activeTournament.wins + 1;
    const officialBracketSize = getTournamentBracketSize(activeTournament.tierId);
    if (nextWins >= officialBracketSize && activeTournament.tierId !== 'crown-unlimited') {
      const finalReward = Math.floor(tournamentTier.baseReward * (1 + nextWins * tournamentTier.rarityMultiplier));
      const socialWithTrainer = trainer ? applyTrainerRelationshipDelta(state.profile, trainer.id, { affinity: 1, rivalry: 1, respect: 2, lastResult: 'WIN' }) : social;
      updateProfile({ currency: state.profile.currency + finalReward, stats: { ...state.profile.stats, wins: state.profile.stats.wins + 1, tournamentsWon: state.profile.stats.tournamentsWon + 1 }, social: socialWithTrainer });
      updateGameState({ activeTournament: null, currentQuest: `${tournamentTier.name} conquered.` });
      setScene('TOURNAMENT');
      return;
    }
    updateGameState({ activeTournament: { ...activeTournament, wins: nextWins, currentOpponentId: getTournamentOpponent(activeTournament.tierId, nextWins) } });
    setScene('TOURNAMENT');
  };

  const handleDefeatExit = () => {
    if (activeTournament) {
      updateProfile({ stats: { ...state.profile.stats, losses: state.profile.stats.losses + 1 } });
      updateGameState({ activeTournament: null });
      setScene('TOURNAMENT');
      return;
    }
    setScene('MAIN_MENU');
  };

  if (showVS) {
    return <VSDisplay playerAvatar="/avatar_player.png" opponentAvatar={opponentAvatar} opponentName={opponentName.toUpperCase()} />;
  }

  return (
    <>
      <div
        className={`battle-container fade-in ${activeField ? 'field-active' : ''}`}
        style={{
          height: '100vh',
          display: 'grid', gridTemplateRows: 'auto 1fr auto',
          background: '#050510',
          backgroundImage: activeField === 'garden-haze' ? 'url("/garden_haze_field.png")' : 'url("/battle_base_bg.png")',
          backgroundSize: 'cover', padding: '28px', color: 'white', overflow: 'hidden', position: 'relative', ...fieldStyle
        }}
      >
        <div className="scanlines" />
        <BattleArena3D 
          playerActive={battleState.player.active} opponentActive={battleState.opponent.active}
          playerBench={battleState.player.bench} opponentBench={battleState.opponent.bench}
          field={activeField}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', zIndex: 10 }}>
          <div className="glass-panel" style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img src={opponentAvatar} alt={opponentName} style={{ width: '64px', height: '64px', borderRadius: '16px', border: '2px solid var(--accent-magenta)' }} />
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-magenta)' }}>{opponentName.toUpperCase()}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>LINK_STABLE // SEED_ACTIVE</div>
              </div>
            </div>
            <BattleGauge label="ARENA_SYNC" value={activeField ? activeField.toUpperCase() : 'DEFAULT'} accent="var(--accent-yellow)" />
          </div>
          <div className="glass-panel" style={{ padding: '14px 18px', minWidth: '220px' }}>
            {latestEvents.map((ev, i) => <div key={i} style={{ fontSize: '0.75rem', opacity: i === 0 ? 1 : 0.5, marginBottom: '4px' }}>{ev}</div>)}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '20px', padding: '20px 0', zIndex: 5, transform: boardShake ? 'translate(4px, 2px)' : 'none' }}>
          <FieldRow side="opponent" active={battleState.opponent.active} bench={battleState.opponent.bench} onHover={(id) => setHoveredCard(getCardById(id) ?? null)} onLeave={() => setHoveredCard(null)} />
          <FieldRow side="player" active={battleState.player.active} bench={battleState.player.bench} onHover={(id) => setHoveredCard(getCardById(id) ?? null)} onLeave={() => setHoveredCard(null)} onAttack={handleAttack} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '18px', alignItems: 'end', zIndex: 10 }}>
          <div className="glass-panel" style={{ padding: '18px', flex: 1 }}>
            <div style={{ display: 'flex', gap: '14px' }}>
              {battleState.player.hand.map((id, i) => (
                <BattleCard key={i} cardId={id} onClick={() => { audioManager.playSFX('card_play'); playCard(id); }} onHover={() => setHoveredCard(getCardById(id) ?? null)} onLeave={() => setHoveredCard(null)} disabled={!isPlayerTurn || !!battleState.winner} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '280px' }}>
            <LifePointTracker value={battleState.opponent.prizes} name="ENEMY_PRIZES" color="var(--accent-magenta)" />
            <LifePointTracker value={battleState.player.prizes} name="LOCAL_PRIZES" color="var(--accent-cyan)" />
            <div className="glass-panel" style={{ padding: '16px' }}>
                <BattleGauge label="SYNC_ENERGY" value={`${battleState.player.mana}/${battleState.player.maxMana}`} accent="var(--accent-cyan)" />
                <button className="neo-button primary" onClick={() => { audioManager.playSFX('turn_end'); endTurn(); }} disabled={!isPlayerTurn || !!battleState.winner} style={{ width: '100%', marginTop: '12px', justifyContent: 'center' }}>
                    {isPlayerTurn ? 'END_SYNC' : 'PROCESSING...'}
                </button>
            </div>
          </div>
        </div>
      </div>

      {damageMarkers.map(m => (
        <div key={m.id} className="damage-marker" style={{ position: 'fixed', left: `${m.x}%`, top: `${m.y}%`, color: 'var(--accent-magenta)', fontSize: '5rem', fontWeight: 900, zIndex: 1000, pointerEvents: 'none', textShadow: '0 0 20px rgba(0,0,0,0.8)' }}>
          -{m.value}
        </div>
      ))}

      {hoveredCard && <CardInspector card={hoveredCard} />}

      {battleState.winner === 'player' && <EndMatchModal title="VICTORY" color="var(--accent-cyan)" onExit={handleVictoryExit} />}
      {battleState.winner === 'opponent' && <EndMatchModal title="DEFEAT" color="var(--accent-magenta)" onExit={handleDefeatExit} />}

      <style>{`
        @keyframes float-up { 0% { transform: translateY(0) scale(1.1); opacity: 1; } 100% { transform: translateY(-140px) scale(1.6); opacity: 0; } }
        .damage-marker { animation: float-up 0.8s forwards ease-out; }
      `}</style>
    </>
  );
};

const FieldRow: React.FC<{ side: string; active: any; bench: any[]; onHover: any; onLeave: any; onAttack?: any }> = ({ side, active, bench, onHover, onLeave, onAttack }) => (
  <div className="glass-panel" style={{ padding: '14px', background: 'rgba(7,12,22,0.6)', display: 'grid', gridTemplateColumns: '160px 1fr', gap: '20px', alignItems: 'center' }}>
    <div style={{ fontSize: '0.65rem', letterSpacing: '0.2rem', color: 'var(--text-secondary)' }}>{side.toUpperCase()}_SECTOR</div>
    <div style={{ display: 'flex', gap: '14px', justifyContent: side === 'player' ? 'flex-start' : 'flex-end' }}>
      {side === 'opponent' && bench.map((e, i) => <BattleSlot key={i} entity={e} onHover={onHover} onLeave={onLeave} />)}
      <BattleSlot entity={active} isActive onClick={onAttack} onHover={onHover} onLeave={onLeave} />
      {side === 'player' && bench.map((e, i) => <BattleSlot key={i} entity={e} onHover={onHover} onLeave={onLeave} />)}
    </div>
  </div>
);

const BattleSlot: React.FC<{ entity: any; isActive?: boolean; onClick?: any; onHover?: any; onLeave?: any }> = ({ entity, isActive, onClick, onHover, onLeave }) => {
    const card = entity ? getCardById(entity.cardId) : null;
    const pal = getCardPalette(card);
    return (
        <div 
            onClick={onClick} onMouseEnter={() => entity && onHover(entity.cardId)} onMouseLeave={onLeave}
            style={{ 
                width: isActive ? '160px' : '110px', height: isActive ? '210px' : '150px', 
                border: `1px solid ${pal.accent}`, borderRadius: '16px', background: pal.panel, opacity: entity ? 1 : 0.2, cursor: entity ? 'pointer' : 'default',
                display: 'flex', flexDirection: 'column', padding: '10px', position: 'relative'
            }}
        >
            {entity && (
                <>
                    <div style={{ fontSize: '0.55rem', color: pal.accent }}>{card?.name.toUpperCase()}</div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '40px', height: '40px', background: pal.glow, borderRadius: '99px', filter: 'blur(8px)' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900 }}>
                        <div style={{ color: 'var(--accent-yellow)' }}>{entity.attack}</div>
                        <div style={{ color: 'white' }}>{entity.currentHealth}</div>
                    </div>
                </>
            )}
        </div>
    );
};

const BattleCard: React.FC<{ cardId: string; onClick: any; onHover: any; onLeave: any; disabled: boolean }> = ({ cardId, onClick, onHover, onLeave, disabled }) => {
    const card = getCardById(cardId);
    const pal = getCardPalette(card);
    return (
        <button 
            disabled={disabled} onClick={onClick} onMouseEnter={onHover} onMouseLeave={onLeave}
            style={{ 
                width: '130px', height: '180px', borderRadius: '14px', border: `1px solid ${pal.accent}`, 
                background: pal.panel, opacity: disabled ? 0.4 : 1, transition: '0.2s'
             }}
        >
            <div style={{ fontSize: '0.8rem', fontWeight: 900 }}>{card?.name.toUpperCase()}</div>
            <div style={{ fontSize: '0.6rem', color: pal.accent }}>{card?.cost} EN</div>
        </button>
    );
};

const LifePointTracker: React.FC<{ value: number; name: string; color: string }> = ({ value, name, color }) => (
    <div className="glass-panel" style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.15rem' }}>{name}</div>
        <div style={{ fontSize: '1.4rem', fontWeight: 900, color }}>{value}/3</div>
    </div>
);

const BattleGauge: React.FC<{ label: string; value: string; accent: string }> = ({ label, value, accent }) => (
    <div>
        <div style={{ fontSize: '0.55rem', opacity: 0.6 }}>{label}</div>
        <div style={{ fontSize: '1rem', fontWeight: 900, color: accent }}>{value}</div>
    </div>
);

const VSDisplay: React.FC<{ playerAvatar: string; opponentAvatar: string; opponentName: string }> = ({ playerAvatar, opponentAvatar, opponentName }) => (
  <div className="vs-screen fade-in" style={{ height: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '60px' }}>
    <img src={playerAvatar} alt="P1" style={{ width: '400px', height: '600px', objectFit: 'cover' }} />
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: '10rem', fontWeight: 900, fontStyle: 'italic' }}>VS</div>
        <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-magenta)' }}>{opponentName}</div>
    </div>
    <img src={opponentAvatar} alt="P2" style={{ width: '400px', height: '600px', objectFit: 'cover' }} />
  </div>
);

const EndMatchModal: React.FC<{ title: string; color: string; onExit: any }> = ({ title, color, onExit }) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '8rem', color }}>{title}</h1>
        <button className="neo-button primary" style={{ background: color, padding: '20px 60px', marginTop: '40px' }} onClick={onExit}>EXIT_CIRCUIT</button>
    </div>
);

const CardInspector: React.FC<{ card: Card }> = ({ card }) => {
    const pal = getCardPalette(card);
    return (
        <div style={{ position: 'fixed', right: '40px', top: '40px', width: '280px', padding: '24px', background: pal.panel, border: `2px solid ${pal.accent}`, borderRadius: '20px', zIndex: 500 }}>
             <h3 style={{ fontSize: '1.5rem' }}>{card.name.toUpperCase()}</h3>
             <div style={{ margin: '12px 0', fontSize: '0.85rem' }}>{card.rulesText?.[0]}</div>
             <div style={{ fontWeight: 900 }}>{card.attack} / {card.health}</div>
        </div>
    );
};
