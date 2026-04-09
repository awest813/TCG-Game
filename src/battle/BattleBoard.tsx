import React, { useState, useEffect, useMemo } from 'react';
import { useBattle } from './useBattle';
import { useGame } from '../core/GameStateContext';
import { getCardById } from '../data/cards';

export const BattleBoard: React.FC = () => {
  const { state, setScene } = useGame();
  const [showVS, setShowVS] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<any>(null);
  const { battleState, playCard, attack, endTurn } = useBattle(
      state.profile.inventory.deck,
      ["ziprail", "neon-striker", "voltlynx", "overdrive-fox", "quick-transfer", "ziprail"]
  );

  useEffect(() => {
    const timer = setTimeout(() => setShowVS(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const isPlayerTurn = battleState.isPlayerTurn;

  const activeField = battleState.field;
  const fieldStyle = useMemo(() => {
    switch(activeField) {
        case 'neon-grid': return { border: '4px solid var(--accent-cyan)', boxShadow: 'inset 0 0 100px rgba(0, 242, 255, 0.2)' };
        case 'garden-haze': return { border: '4px solid #00ff66', boxShadow: 'inset 0 0 100px rgba(0, 255, 102, 0.2)' };
        case 'void-rift': return { border: '4px solid #7a00ff', boxShadow: 'inset 0 0 100px rgba(122, 0, 255, 0.2)' };
        default: return {};
    }
  }, [activeField]);

  if (showVS) {
      return <VSDisplay playerAvatar="/avatar_player.png" opponentAvatar="/avatar_kaizen.png" opponentName="KAIZEN" />;
  }

  return (
    <div className={`battle-container fade-in ${activeField ? 'field-active' : ''}`} style={{
      height: '100vh',
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
      background: '#050510',
      backgroundImage: activeField === 'garden-haze' 
        ? 'linear-gradient(rgba(0,10,5,0.8), rgba(0,0,0,0.9)), url("/garden_haze_field.png")' 
        : 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url("/battle_base_bg.png")',
      backgroundSize: 'cover',
      padding: '40px',
      color: 'white',
      overflow: 'hidden',
      transition: '1s',
      position: 'relative',
      ...fieldStyle
    }}>
      <div className="scanlines" />

      {/* Top Bar: Opponent Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <img src="/avatar_kaizen.png" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid var(--accent-magenta)', padding: '5px', boxShadow: '0 0 20px var(--accent-magenta)' }} />
              <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--accent-magenta)', textShadow: '0 0 10px var(--accent-magenta)' }}>KAIZEN</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6, letterSpacing: '2px' }}>RANK B // NEON_MISSION_SEED</div>
              </div>
          </div>
          <LifePointTracker value={battleState.opponent.prizes} max={3} color="var(--accent-magenta)" name="OPPONENT_STOCKS" />
      </div>

      {/* Main Field */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gridTemplateRows: '1fr 1fr', gap: '60px', padding: '40px 0', zIndex: 5 }}>
          {/* Opponent Field */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '30px' }}>
                {battleState.opponent.bench.map((b, i) => <BattleSlot key={i} entity={b} side="opponent" onHover={id => setHoveredCard(getCardById(id))} onLeave={() => setHoveredCard(null)} />)}
              </div>
              <BattleSlot entity={battleState.opponent.active} isActive side="opponent" onHover={id => setHoveredCard(getCardById(id))} onLeave={() => setHoveredCard(null)} />
          </div>

          {/* Player Field */}
          <div style={{ display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '30px' }}>
                {battleState.player.bench.map((b, i) => <BattleSlot key={i} entity={b} side="player" onHover={id => setHoveredCard(getCardById(id))} onLeave={() => setHoveredCard(null)} />)}
              </div>
              <BattleSlot entity={battleState.player.active} isActive side="player" onClick={attack} onHover={id => setHoveredCard(getCardById(id))} onLeave={() => setHoveredCard(null)} />
          </div>
      </div>

      {/* Bottom Bar: Player Hand & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 10 }}>
          <div style={{ display: 'flex', gap: '15px' }}>
             {battleState.player.hand.map((id, i) => (
                <div key={i} className="holo-card" style={{ borderRadius: '6px' }}>
                   <BattleCard cardId={id} onClick={() => playCard(id)} onHover={() => setHoveredCard(getCardById(id))} onLeave={() => setHoveredCard(null)} disabled={!isPlayerTurn || !!battleState.winner} />
                </div>
              ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-end' }}>
              <LifePointTracker value={battleState.player.prizes} max={3} color="var(--accent-cyan)" name="PLAYER_STOCKS" />
              <div style={{ display: 'flex', gap: '10px' }}>
                  <div className="mana-pill" style={{ boxShadow: '0 0 15px var(--accent-cyan)' }}>SYNC_ENERGY: {battleState.player.mana}⚡</div>
                  <button className="neo-button primary" onClick={endTurn} disabled={!isPlayerTurn || !!battleState.winner} style={{ height: '50px', padding: '0 40px', fontWeight: 900 }}>
                      {isPlayerTurn ? "CLOSE PHASE" : "SYNCING..."}
                  </button>
              </div>
          </div>
      </div>

      {battleState.winner === 'player' && <EndMatchModal title="VICTORY" color="var(--accent-cyan)" onExit={() => setScene('DISTRICT_EXPLORE')} />}
      {battleState.winner === 'opponent' && <EndMatchModal title="DEFEAT" color="var(--accent-magenta)" onExit={() => setScene('MAIN_MENU')} />}

      {/* Persistent Card Inspector */}
      {hoveredCard && (
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 500, pointerEvents: 'none' }}>
              <div className="glass-panel slide-up" style={{ 
                  background: 'rgba(5,5,15,0.95)', 
                  border: '3px solid var(--accent-cyan)', 
                  padding: '40px', 
                  width: '350px',
                  boxShadow: '0 0 100px rgba(0,242,255,0.3)'
              }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', letterSpacing: '2px' }}>DATA_INSPECTOR_v4</div>
                  <h3 style={{ fontSize: '2rem', margin: '10px 0' }}>{hoveredCard.name.toUpperCase()}</h3>
                  <div style={{ color: 'var(--accent-yellow)', fontWeight: 'bold', marginBottom: '20px' }}>COST: {hoveredCard.cost}</div>
                  
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '4px', fontSize: '1rem', lineHeight: '1.4' }}>
                      {hoveredCard.rulesText.map((t, i) => <p key={i} style={{ margin: 0 }}>{t}</p>)}
                  </div>

                  <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {hoveredCard.keywords?.map(k => (
                          <div key={k} style={{ background: 'var(--accent-cyan)', color: 'black', padding: '4px 10px', fontSize: '0.6rem', fontWeight: 'bold', borderRadius: '2px' }}>{k.toUpperCase()}</div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      <style>{`
          .mana-pill {
              background: rgba(0,0,0,0.8);
              border: 1px solid var(--accent-cyan);
              padding: 10px 20px;
              border-radius: 4px;
              color: var(--accent-cyan);
              font-weight: bold;
              display: flex;
              align-items: center;
          }
      `}</style>
    </div>
  );
};

const LifePointTracker: React.FC<{ value: number, max: number, color: string, name: string }> = ({ value, max, color, name }) => (
    <div className="glass-morphism" style={{ padding: '20px 40px', borderLeft: `8px solid ${color}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '4px' }}>{name}</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color }}>{value} <span style={{ fontSize: '1rem', opacity: 0.3 }}>/ {max}</span></div>
    </div>
);

const VSDisplay: React.FC<{ playerAvatar: string, opponentAvatar: string, opponentName: string }> = ({ playerAvatar, opponentAvatar, opponentName }) => (
    <div className="vs-screen fade-in" style={{ height: '100vh', background: 'black', display: 'flex', overflow: 'hidden', position: 'relative' }}>
        <div style={{ flex: 1, position: 'relative' }}>
            <img src={playerAvatar} style={{ height: '100%', width: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
            <div style={{ position: 'absolute', bottom: '40px', left: '40px', fontSize: '4rem', fontWeight: '900', color: 'var(--accent-cyan)' }}>PLAYER 1</div>
        </div>
        <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%) rotate(-10deg)', 
            fontSize: '12rem', 
            fontWeight: '900', 
            fontStyle: 'italic',
            zIndex: 10,
            textShadow: '0 0 50px rgba(255,255,255,0.5)'
        }}>VS</div>
        <div style={{ flex: 1, position: 'relative' }}>
            <img src={opponentAvatar} style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: '40px', right: '40px', fontSize: '4rem', fontWeight: '900', color: 'var(--accent-magenta)' }}>{opponentName}</div>
        </div>
    </div>
);

const BattleSlot: React.FC<{ entity: any, isActive?: boolean, side: 'player' | 'opponent', onClick?: () => void, onHover?: (id: string) => void, onLeave?: () => void }> = ({ entity, isActive, side, onClick, onHover, onLeave }) => {
    const isDamaged = entity && entity.currentHealth < getCardById(entity.cardId)!.health;
    return (
        <div 
            onClick={entity && side === 'player' && !entity.hasAttacked ? onClick : undefined} 
            onMouseEnter={() => entity && onHover?.(entity.cardId)}
            onMouseLeave={onLeave}
            style={{
                width: isActive ? '200px' : '140px',
                height: isActive ? '260px' : '180px',
                border: `2px solid ${side === 'player' ? 'var(--accent-cyan)' : 'var(--accent-magenta)'}`,
                borderRadius: '4px',
                background: entity ? 'rgba(5,5,15,0.4)' : 'rgba(255,255,255,0.02)',
                cursor: onClick && entity && !entity.hasAttacked ? 'pointer' : (entity ? 'help' : 'default'),
                transition: '0.3s',
                position: 'relative'
            }}
        >
            {entity && (
                <div className={`holo-projector ${isDamaged ? 'glitch-anim' : ''}`} style={{ height: '100%', padding: '15px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <div className="scanlines" style={{ opacity: 0.3 }} />
                    <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', letterSpacing: '2px', zIndex: 10 }}>{getCardById(entity.cardId)?.creatureType?.toUpperCase()}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 'bold', zIndex: 10 }}>{getCardById(entity.cardId)?.name.toUpperCase()}</div>
                    <div style={{ flex: 1 }}></div>
                    <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--accent-yellow)', zIndex: 10 }}>
                        {entity.attack} <span style={{ opacity: 0.2 }}>/</span> {entity.currentHealth}
                    </div>
                </div>
            )}
            {!entity && <div style={{ opacity: 0.1, fontSize: '0.6rem', textAlign: 'center', width: '100%', marginTop: '45%' }}>GRID_SLOT</div>}
        </div>
    );
};

const BattleCard: React.FC<{ cardId: string, onClick: () => void, onHover: () => void, onLeave: () => void, disabled: boolean }> = ({ cardId, onClick, onHover, onLeave, disabled }) => {
    const card = getCardById(cardId);
    if (!card) return null;
    
    const typeColor = card.creatureType === 'Pulse' ? 'var(--accent-cyan)' : 
                      card.creatureType === 'Bloom' ? '#44ff88' : 
                      card.creatureType === 'Alloy' ? '#aaaaaa' : 'var(--accent-magenta)';

    return (
        <div 
            onClick={disabled ? undefined : onClick}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            style={{
                width: '140px',
                height: '200px',
                background: 'rgba(10,10,25,0.98)',
                border: `1px solid ${typeColor}`,
                boxShadow: card.attack > 2000 ? `0 0 15px ${typeColor}` : 'none',
                cursor: disabled ? 'default' : 'pointer',
                opacity: disabled ? 0.4 : 1,
                transition: '0.2s',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
           {/* Top Header: Name & Cost */}
           <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ fontSize: '0.65rem', fontWeight: '900', letterSpacing: '1px' }}>{card.name.toUpperCase()}</div>
               <div style={{ color: 'var(--accent-yellow)', fontWeight: 'bold', fontSize: '0.8rem' }}>{card.cost}⚡</div>
           </div>

           {/* Illustration Window (Top 60%) */}
           <div style={{ 
               flex: 1, 
               background: `linear-gradient(to bottom, ${typeColor}22, transparent)`,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               position: 'relative'
           }}>
              <div className="scanlines" style={{ opacity: 0.2 }} />
              {/* Symbolic Placeholder for Monster Art */}
              <div style={{ 
                  width: '60%', height: '60%', 
                  background: typeColor, 
                  opacity: 0.2, 
                  filter: 'blur(20px)',
                  borderRadius: '50%'
              }} />
              <div style={{ position: 'absolute', fontSize: '0.5rem', color: typeColor, letterSpacing: '2px', fontWeight: 'bold' }}>DATA_ID: {card.id.toUpperCase()}</div>
           </div>

           {/* Stats & Type Bottom Bar */}
           <div style={{ padding: '8px', background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
               <div style={{ fontSize: '0.5rem', color: typeColor, letterSpacing: '2px', marginBottom: '4px' }}>{card.creatureType?.toUpperCase() || 'SUPPORT'}</div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                   <div style={{ fontSize: '0.9rem', fontWeight: '900', color: 'var(--accent-yellow)' }}>{card.attack}</div>
                   <div style={{ fontSize: '0.9rem', fontWeight: '900', color: 'var(--text-primary)' }}>{card.health}</div>
               </div>
           </div>
        </div>
     );
};

const EndMatchModal: React.FC<{ title: string, color: string, onExit: () => void }> = ({ title, color, onExit }) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
        <h1 style={{ fontSize: '10rem', color, fontStyle: 'italic', fontWeight: '900', letterSpacing: '20px' }}>{title}</h1>
        <button className="neo-button primary" style={{ marginTop: '60px', background: color, minWidth: '300px' }} onClick={onExit}>EXIT ARENA</button>
    </div>
);
