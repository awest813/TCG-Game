import React, { useEffect, useMemo, useState } from 'react';
import { useBattle } from './useBattle';
import { useGame } from '../core/GameContext';
import { Card } from '../core/types';
import { getCardById, getCardPalette } from '../data/cards';
import { BattleEntity } from './BattleEngine';

export const BattleBoard: React.FC = () => {
  const { state, setScene } = useGame();
  const [showVS, setShowVS] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<Card | null>(null);
  const { battleState, playCard, attack, endTurn } = useBattle(
    state.profile.inventory.deck,
    ['ziprail', 'neon-striker', 'voltlynx', 'overdrive-fox', 'quick-transfer', 'ziprail']
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setShowVS(false), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  const activeField = battleState.field;
  const isPlayerTurn = battleState.isPlayerTurn;
  const latestEvents = battleState.log.slice(-4).reverse();

  const fieldStyle = useMemo(() => {
    switch (activeField) {
      case 'neon-grid':
        return { border: '3px solid var(--accent-cyan)', boxShadow: 'inset 0 0 120px rgba(121, 247, 255, 0.18)' };
      case 'garden-haze':
        return { border: '3px solid #8effa7', boxShadow: 'inset 0 0 120px rgba(142, 255, 167, 0.14)' };
      case 'void-rift':
        return { border: '3px solid #7a6cff', boxShadow: 'inset 0 0 120px rgba(122, 108, 255, 0.18)' };
      case 'alloy-foundry':
        return { border: '3px solid #d5dae2', boxShadow: 'inset 0 0 120px rgba(213, 218, 226, 0.16)' };
      default:
        return {};
    }
  }, [activeField]);

  if (showVS) {
    return <VSDisplay playerAvatar="/avatar_player.png" opponentAvatar="/avatar_kaizen.png" opponentName="KAIZEN" />;
  }

  return (
    <div
      className={`battle-container fade-in ${activeField ? 'field-active' : ''}`}
      style={{
        height: '100vh',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        background: '#050510',
        backgroundImage:
          activeField === 'garden-haze'
            ? 'linear-gradient(rgba(5,18,10,0.82), rgba(0,0,0,0.92)), url("/garden_haze_field.png")'
            : 'linear-gradient(rgba(2,6,18,0.88), rgba(0,0,0,0.92)), url("/battle_base_bg.png")',
        backgroundSize: 'cover',
        padding: '28px',
        color: 'white',
        overflow: 'hidden',
        transition: '0.8s',
        position: 'relative',
        ...fieldStyle
      }}
    >
      <div className="scanlines" />
      <div className="battle-atmosphere" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'start', zIndex: 10 }}>
        <div className="glass-panel" style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(7,12,22,0.72)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img src="/avatar_kaizen.png" alt="Kaizen" style={{ width: '72px', height: '72px', borderRadius: '20px', objectFit: 'cover', border: '2px solid var(--accent-magenta)' }} />
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', letterSpacing: '0.24rem' }}>OPPONENT LINK</div>
              <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--accent-magenta)' }}>KAIZEN</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.66)' }}>Rank B / Combat seed active</div>
            </div>
          </div>
          <BattleGauge label="FIELD STATE" value={activeField ? activeField.replace(/-/g, ' ').toUpperCase() : 'DEFAULT ARENA'} accent="var(--accent-yellow)" />
        </div>

        <div className="glass-panel" style={{ minWidth: '250px', padding: '18px 20px', background: 'rgba(7,12,22,0.72)' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', letterSpacing: '0.22rem', marginBottom: '10px' }}>RECENT EVENTS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {latestEvents.map((event, index) => (
              <div key={`${event}-${index}`} style={{ fontSize: '0.82rem', lineHeight: 1.4, color: index === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {event}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '28px', padding: '24px 0', zIndex: 5 }}>
        <FieldRow
          title="Opponent Side"
          side="opponent"
          active={battleState.opponent.active}
          bench={battleState.opponent.bench}
          onHover={(id) => setHoveredCard(getCardById(id) ?? null)}
          onLeave={() => setHoveredCard(null)}
        />
        <FieldRow
          title="Player Side"
          side="player"
          active={battleState.player.active}
          bench={battleState.player.bench}
          onHover={(id) => setHoveredCard(getCardById(id) ?? null)}
          onLeave={() => setHoveredCard(null)}
          onAttack={attack}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '18px', alignItems: 'end', zIndex: 10 }}>
        <div className="glass-panel" style={{ padding: '18px', background: 'rgba(7,12,22,0.72)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', letterSpacing: '0.24rem' }}>HAND ARRAY</div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>{battleState.player.hand.length} cards ready</div>
            </div>
            <div style={{ color: isPlayerTurn ? 'var(--accent-cyan)' : 'var(--text-secondary)', fontWeight: 700 }}>
              {isPlayerTurn ? 'PLAYER MAIN PHASE' : 'OPPONENT RESOLVING'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {battleState.player.hand.map((id, index) => (
              <BattleCard
                key={`${id}-${index}`}
                cardId={id}
                onClick={() => playCard(id)}
                onHover={() => setHoveredCard(getCardById(id) ?? null)}
                onLeave={() => setHoveredCard(null)}
                disabled={!isPlayerTurn || !!battleState.winner}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', minWidth: '300px' }}>
          <LifePointTracker value={battleState.opponent.prizes} max={3} color="var(--accent-magenta)" name="OPPONENT PRIZES" />
          <LifePointTracker value={battleState.player.prizes} max={3} color="var(--accent-cyan)" name="PLAYER PRIZES" />
          <div className="glass-panel" style={{ padding: '18px 20px', background: 'rgba(7,12,22,0.72)' }}>
            <BattleGauge label="SYNC ENERGY" value={`${battleState.player.mana} / ${battleState.player.maxMana}`} accent="var(--accent-cyan)" />
            <button className="neo-button primary" onClick={endTurn} disabled={!isPlayerTurn || !!battleState.winner} style={{ marginTop: '14px', width: '100%', justifyContent: 'center', display: 'flex' }}>
              {isPlayerTurn ? 'END TURN' : 'WAITING...'}
            </button>
          </div>
        </div>
      </div>

      {battleState.winner === 'player' && <EndMatchModal title="VICTORY" color="var(--accent-cyan)" onExit={() => setScene('DISTRICT_EXPLORE')} />}
      {battleState.winner === 'opponent' && <EndMatchModal title="DEFEAT" color="var(--accent-magenta)" onExit={() => setScene('MAIN_MENU')} />}

      {hoveredCard && <CardInspector card={hoveredCard} />}

      <style>{`
        .battle-atmosphere {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(121,247,255,0.12), transparent 24%),
            radial-gradient(circle at 80% 18%, rgba(255,95,207,0.16), transparent 26%),
            linear-gradient(180deg, transparent, rgba(0,0,0,0.3));
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

const FieldRow: React.FC<{
  title: string;
  side: 'player' | 'opponent';
  active: BattleEntity | null;
  bench: (BattleEntity | null)[];
  onHover: (id: string) => void;
  onLeave: () => void;
  onAttack?: () => void;
}> = ({ title, side, active, bench, onHover, onLeave, onAttack }) => (
  <div className="glass-panel" style={{ padding: '18px', background: 'rgba(7,12,22,0.62)', display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px', alignItems: 'center' }}>
    <div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', letterSpacing: '0.24rem' }}>{title.toUpperCase()}</div>
      <div style={{ marginTop: '8px', fontSize: '1.1rem', fontWeight: 700 }}>{side === 'player' ? 'Active attack route' : 'Enemy threat board'}</div>
    </div>
    <div style={{ display: 'flex', gap: '18px', alignItems: 'center', justifyContent: side === 'player' ? 'flex-start' : 'flex-end' }}>
      {side === 'opponent' && <EntityStack entities={bench} side={side} onHover={onHover} onLeave={onLeave} />}
      <BattleSlot entity={active} isActive side={side} onClick={onAttack} onHover={onHover} onLeave={onLeave} />
      {side === 'player' && <EntityStack entities={bench} side={side} onHover={onHover} onLeave={onLeave} />}
    </div>
  </div>
);

const EntityStack: React.FC<{ entities: (BattleEntity | null)[]; side: 'player' | 'opponent'; onHover: (id: string) => void; onLeave: () => void }> = ({ entities, side, onHover, onLeave }) => (
  <div style={{ display: 'flex', gap: '14px' }}>
    {entities.map((entity, index) => (
      <BattleSlot key={index} entity={entity} side={side} onHover={onHover} onLeave={onLeave} />
    ))}
  </div>
);

const LifePointTracker: React.FC<{ value: number; max: number; color: string; name: string }> = ({ value, max, color, name }) => (
  <div className="glass-panel" style={{ padding: '16px 18px', background: 'rgba(7,12,22,0.72)' }}>
    <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', letterSpacing: '0.24rem' }}>{name}</div>
    <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <div style={{ fontSize: '2rem', fontWeight: 800, color }}>{value}</div>
      <div style={{ color: 'var(--text-secondary)' }}>/{max}</div>
    </div>
  </div>
);

const BattleGauge: React.FC<{ label: string; value: string; accent: string }> = ({ label, value, accent }) => (
  <div>
    <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', letterSpacing: '0.22rem' }}>{label}</div>
    <div style={{ marginTop: '8px', fontSize: '1rem', fontWeight: 800, color: accent }}>{value}</div>
  </div>
);

const VSDisplay: React.FC<{ playerAvatar: string; opponentAvatar: string; opponentName: string }> = ({ playerAvatar, opponentAvatar, opponentName }) => (
  <div className="vs-screen fade-in" style={{ height: '100vh', background: 'linear-gradient(135deg, #050816, #13081a)', display: 'flex', overflow: 'hidden', position: 'relative' }}>
    <div style={{ flex: 1, position: 'relative' }}>
      <img src={playerAvatar} alt="Player" style={{ height: '100%', width: '100%', objectFit: 'cover', transform: 'scaleX(-1)', opacity: 0.82 }} />
      <div style={{ position: 'absolute', bottom: '40px', left: '40px', fontSize: '4rem', fontWeight: '900', color: 'var(--accent-cyan)' }}>PLAYER 1</div>
    </div>
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-8deg)', fontSize: '11rem', fontWeight: '900', fontStyle: 'italic', zIndex: 10, textShadow: '0 0 50px rgba(255,255,255,0.5)' }}>VS</div>
    <div style={{ flex: 1, position: 'relative' }}>
      <img src={opponentAvatar} alt={opponentName} style={{ height: '100%', width: '100%', objectFit: 'cover', opacity: 0.82 }} />
      <div style={{ position: 'absolute', top: '40px', right: '40px', fontSize: '4rem', fontWeight: '900', color: 'var(--accent-magenta)' }}>{opponentName}</div>
    </div>
  </div>
);

const BattleSlot: React.FC<{
  entity: BattleEntity | null;
  isActive?: boolean;
  side: 'player' | 'opponent';
  onClick?: () => void;
  onHover?: (id: string) => void;
  onLeave?: () => void;
}> = ({ entity, isActive, side, onClick, onHover, onLeave }) => {
  const card = entity ? getCardById(entity.cardId) : undefined;
  const palette = getCardPalette(card);
  const isDamaged = entity && card ? entity.currentHealth < (card.health ?? entity.currentHealth) : false;

  return (
    <div
      onClick={entity && side === 'player' && !entity.hasAttacked ? onClick : undefined}
      onMouseEnter={() => entity && onHover?.(entity.cardId)}
      onMouseLeave={onLeave}
      style={{
        width: isActive ? '190px' : '132px',
        minHeight: isActive ? '248px' : '168px',
        padding: isActive ? '14px' : '12px',
        borderRadius: '22px',
        border: `1px solid ${palette.accent}`,
        background: `${palette.panel}, linear-gradient(180deg, rgba(255,255,255,0.04), transparent)`,
        boxShadow: `0 18px 42px ${palette.glow}`,
        cursor: onClick && entity && !entity.hasAttacked ? 'pointer' : entity ? 'help' : 'default',
        opacity: entity ? 1 : 0.36,
        transition: '0.24s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {entity && card ? (
        <>
          <div className="scanlines" style={{ opacity: 0.16 }} />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
              <div style={{ fontSize: '0.56rem', color: palette.accent, letterSpacing: '0.18rem' }}>{card.creatureType?.toUpperCase()}</div>
              {isActive && <div style={{ fontSize: '0.54rem', color: 'var(--text-secondary)', letterSpacing: '0.18rem' }}>ACTIVE</div>}
            </div>
            <div style={{ marginTop: '8px', fontWeight: 800, lineHeight: 1.05 }}>{card.name.toUpperCase()}</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ width: isActive ? '84px' : '62px', height: isActive ? '84px' : '62px', borderRadius: '999px', background: palette.glow, filter: 'blur(10px)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'end' }}>
              <div>
                <div style={{ fontSize: '0.56rem', color: 'var(--text-secondary)' }}>ATK</div>
                <div style={{ fontSize: isActive ? '1.7rem' : '1.3rem', fontWeight: 800, color: 'var(--accent-yellow)' }}>{entity.attack}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.56rem', color: 'var(--text-secondary)' }}>HP</div>
                <div style={{ fontSize: isActive ? '1.7rem' : '1.3rem', fontWeight: 800, color: isDamaged ? 'var(--accent-magenta)' : 'var(--text-primary)' }}>{entity.currentHealth}</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', letterSpacing: '0.18rem', color: 'rgba(255,255,255,0.28)' }}>EMPTY SLOT</div>
      )}
    </div>
  );
};

const BattleCard: React.FC<{ cardId: string; onClick: () => void; onHover: () => void; onLeave: () => void; disabled: boolean }> = ({ cardId, onClick, onHover, onLeave, disabled }) => {
  const card = getCardById(cardId);
  if (!card) return null;
  const palette = getCardPalette(card);

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      disabled={disabled}
      style={{
        width: '168px',
        minHeight: '236px',
        borderRadius: '24px',
        border: `1px solid ${palette.accent}`,
        background: `${palette.panel}, linear-gradient(180deg, ${palette.rarityFinish}, transparent 70%)`,
        boxShadow: `0 18px 36px ${palette.glow}`,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.42 : 1,
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        display: 'flex',
        flexDirection: 'column',
        padding: '14px',
        position: 'relative',
        overflow: 'hidden',
        color: 'inherit',
        textAlign: 'left'
      }}
    >
      <div className="scanlines" style={{ opacity: 0.12 }} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: '0.54rem', color: palette.accent, letterSpacing: '0.18rem' }}>{card.cardType.toUpperCase()}</div>
            <div style={{ marginTop: '6px', fontSize: '1rem', fontWeight: 800, lineHeight: 1.1 }}>{card.name.toUpperCase()}</div>
          </div>
          <div style={{ minWidth: '44px', textAlign: 'right', color: 'var(--accent-yellow)', fontWeight: 800 }}>{card.cost}</div>
        </div>

        <div style={{ flex: 1, borderRadius: '18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '68%', height: '68%', borderRadius: '999px', background: palette.glow, filter: 'blur(14px)' }} />
          <div style={{ position: 'absolute', bottom: '10px', fontSize: '0.58rem', letterSpacing: '0.16rem', color: palette.accent }}>{card.set ?? 'CORE SET'}</div>
        </div>

        <div style={{ fontSize: '0.74rem', lineHeight: 1.45, color: 'var(--text-secondary)', minHeight: '52px' }}>
          {card.rulesText?.[0] ?? 'No effect text loaded.'}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
          <div style={{ fontSize: '0.62rem', color: palette.accent, letterSpacing: '0.18rem' }}>{card.rarity.toUpperCase()}</div>
          <div style={{ fontWeight: 800, fontSize: '1rem' }}>{card.cardType === 'creature' ? `${card.attack ?? '-'} / ${card.health ?? '-'}` : 'TACTIC'}</div>
        </div>
      </div>
    </button>
  );
};

const CardInspector: React.FC<{ card: Card }> = ({ card }) => {
  const palette = getCardPalette(card);
  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 500, pointerEvents: 'none' }}>
      <div className="glass-panel" style={{ background: `${palette.panel}`, border: `2px solid ${palette.accent}`, padding: '28px', width: '360px', boxShadow: `0 0 80px ${palette.glow}` }}>
        <div style={{ fontSize: '0.68rem', color: palette.accent, letterSpacing: '0.22rem' }}>CARD INSPECTOR</div>
        <h3 style={{ fontSize: '2rem', margin: '12px 0 8px' }}>{card.name.toUpperCase()}</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <Chip label={card.cardType.toUpperCase()} accent={palette.accent} />
          {card.creatureType && <Chip label={card.creatureType.toUpperCase()} accent="var(--accent-yellow)" />}
          <Chip label={`${card.cost} EN`} accent="var(--text-primary)" />
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', fontSize: '0.92rem', lineHeight: 1.5 }}>
          {(card.rulesText ?? ['No effect text loaded.']).map((text, index) => (
            <p key={index} style={{ margin: index === 0 ? 0 : '10px 0 0' }}>{text}</p>
          ))}
        </div>
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
          <div style={{ color: 'var(--text-secondary)' }}>{card.set ?? 'CORE SET'}</div>
          {card.cardType === 'creature' && <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{card.attack ?? '-'} / {card.health ?? '-'}</div>}
        </div>
      </div>
    </div>
  );
};

const Chip: React.FC<{ label: string; accent: string }> = ({ label, accent }) => (
  <div style={{ padding: '5px 10px', borderRadius: '999px', border: `1px solid ${accent}`, fontSize: '0.62rem', letterSpacing: '0.16rem', color: accent }}>
    {label}
  </div>
);

const EndMatchModal: React.FC<{ title: string; color: string; onExit: () => void }> = ({ title, color, onExit }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
    <h1 style={{ fontSize: '9rem', color, fontStyle: 'italic', fontWeight: '900', letterSpacing: '18px' }}>{title}</h1>
    <button className="neo-button primary" style={{ marginTop: '46px', background: color, minWidth: '280px' }} onClick={onExit}>
      EXIT ARENA
    </button>
  </div>
);
