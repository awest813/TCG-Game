import React, { useState, useMemo } from 'react';
import { useGame } from '../core/GameStateContext';
import { CARD_POOL, getCardById } from '../data/cards';

type CardTypeFilter = 'ALL' | 'Pulse' | 'Bloom' | 'Tide' | 'Alloy' | 'Veil' | 'Current';

export const DeckEditor: React.FC = () => {
  const { state, updateProfile, setScene } = useGame();
  const [filter, setFilter] = useState<CardTypeFilter>('ALL');
  const [search, setSearch] = useState('');
  
  const deck = state.profile.inventory.deck;
  const collection = state.profile.inventory.cards;

  const filteredCollection = useMemo(() => {
    return collection.filter(id => {
        const card = getCardById(id);
        if (!card) return false;
        const matchesType = filter === 'ALL' || card.creatureType === filter;
        const matchesSearch = card.name.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesSearch;
    });
  }, [collection, filter, search]);

  const addToDeck = (cardId: string) => {
    if (deck.length >= 24) return;
    updateProfile({
        inventory: {
            ...state.profile.inventory,
            deck: [...deck, cardId]
        }
    });
  };

  const removeFromDeck = (index: number) => {
    const newDeck = [...deck];
    newDeck.splice(index, 1);
    updateProfile({
        inventory: {
            ...state.profile.inventory,
            deck: newDeck
        }
    });
  };

  // Mana Curve Logic
  const manaCurve = [0,0,0,0,0,0,0]; // 0-6+
  deck.forEach(id => {
      const cost = getCardById(id)?.cost || 0;
      manaCurve[Math.min(cost, 6)]++;
  });
  const maxCurve = Math.max(...manaCurve, 1);

  return (
    <div className="deck-editor-scene fade-in" style={{
      height: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 450px',
      background: '#020208',
      color: 'white',
      overflow: 'hidden'
    }}>
      {/* Left: Collection View */}
      <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(0, 242, 255, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div>
                <h1 className="glow-text" style={{ fontSize: '3.5rem', margin: 0 }}>TECH_BAY</h1>
                <div style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', letterSpacing: '4px' }}>COLLECTION DATABASE // CLOUD_SYNC: OK</div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                    type="text" 
                    placeholder="SEARCH CARD..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        color: 'white', 
                        padding: '10px 20px', 
                        borderRadius: '4px',
                        outline: 'none'
                    }} 
                />
            </div>
        </div>

        {/* Filter Bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '30px', flexWrap: 'wrap' }}>
            {['ALL', 'Pulse', 'Bloom', 'Tide', 'Alloy', 'Veil', 'Current'].map(t => (
                <button 
                    key={t} 
                    onClick={() => setFilter(t as any)}
                    className={`filter-btn ${filter === t ? 'active' : ''}`}
                    style={{
                        padding: '6px 15px',
                        fontSize: '0.7rem',
                        background: filter === t ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.05)',
                        color: filter === t ? 'black' : 'white',
                        border: 'none',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        transition: '0.2s',
                        fontWeight: 'bold',
                        letterSpacing: '1px'
                    }}
                >
                    {t.toUpperCase()}
                </button>
            ))}
        </div>

        <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px', paddingRight: '20px' }}>
            {filteredCollection.map((id, i) => (
                <CollectionCard key={i} id={id} onAdd={() => addToDeck(id)} />
            ))}
        </div>
      </div>

      {/* Right: Active Deck Sidebar */}
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '40px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, var(--accent-cyan), var(--accent-magenta))' }}></div>
        
        <div style={{ marginBottom: '30px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '2px' }}>ACTIVE LOADOUT</div>
            <h2 style={{ fontSize: '2.2rem', marginTop: '10px', fontWeight: 900 }}>MAIN_SYNC</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', alignItems: 'flex-end' }}>
                <div>
                   <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: deck.length === 24 ? 'var(--accent-cyan)' : 'white' }}>{deck.length} / 24</div>
                   <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>CARD COUNT</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{(deck.reduce((acc, id) => acc + (getCardById(id)?.cost || 0), 0) / (deck.length || 1)).toFixed(1)}⚡</div>
                   <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>AVG_SYNC_COST</div>
                </div>
            </div>
        </div>

        {/* Vitality / Curve Graph */}
        <div style={{ height: '80px', display: 'flex', alignItems: 'flex-end', gap: '4px', marginBottom: '30px', padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            {manaCurve.map((count, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                    <div style={{ 
                        width: '100%', 
                        height: `${(count / maxCurve) * 50}px`, 
                        background: 'var(--accent-cyan)', 
                        borderRadius: '2px 2px 0 0',
                        opacity: count > 0 ? 0.8 : 0.1,
                        transition: '0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}></div>
                    <div style={{ fontSize: '0.5rem', opacity: 0.5 }}>{i}{i===6?'+':''}</div>
                </div>
            ))}
        </div>

        <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', marginBottom: '30px', paddingRight: '10px' }}>
            {deck.map((id, i) => {
                const card = getCardById(id);
                return (
                    <div key={i} className="deck-item-anim" onClick={() => removeFromDeck(i)} style={{
                        display: 'flex',
                        padding: '12px 20px',
                        background: 'rgba(255,255,255,0.03)',
                        marginBottom: '6px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        borderLeft: `3px solid ${card?.creatureType ? 'var(--accent-cyan)' : 'var(--accent-magenta)'}`,
                        animation: 'slideIn 0.3s ease-out'
                    }}>
                        <div style={{ width: '30px', color: 'rgba(255,255,255,0.2)', fontWeight: 'bold' }}>{i + 1}</div>
                        <div style={{ flex: 1, fontWeight: 'bold' }}>{card?.name.toUpperCase()}</div>
                        <div style={{ color: 'var(--accent-yellow)' }}>{card?.cost}</div>
                    </div>
                );
            })}
        </div>

        <button 
            className="champion-button" 
            disabled={deck.length !== 24}
            onClick={() => setScene('APARTMENT')}
            style={{ width: '100%', padding: '20px', borderRadius: '4px', background: deck.length === 24 ? 'white' : 'transparent' }}
        >
            SYNC & DEPLOY
        </button>
      </div>

      <style>{`
          .filter-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0, 242, 255, 0.2); }
          .deck-item-anim:hover { background: rgba(255,255,255,0.1); transform: translateX(5px); }
          @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
          .custom-scroll::-webkit-scrollbar { width: 4px; }
          .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>
    </div>
  );
};

const CollectionCard: React.FC<{ id: string, onAdd: () => void }> = ({ id, onAdd }) => {
    const card = getCardById(id);
    if (!card) return null;
    return (
        <div className="coll-card" onClick={onAdd} style={{
            aspectRatio: '5/7',
            background: 'rgba(5,5,15,0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '20px',
            cursor: 'pointer',
            transition: '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ fontSize: '0.6rem', color: 'var(--accent-cyan)', letterSpacing: '2px', marginBottom: '5px' }}>{card.creatureType?.toUpperCase() || 'SUPPORT'}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'white' }}>{card.name}</div>
            
            <div style={{ flex: 1 }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-yellow)' }}>{card.cost}<span style={{ fontSize: '0.7rem', opacity: 0.5 }}>⚡</span></div>
                {card.cardType === 'creature' && (
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '900' }}>{card.attack}/{card.health}</div>
                    </div>
                )}
            </div>

            <style>{`
                .coll-card:hover {
                    border-color: var(--accent-cyan);
                    background: rgba(0, 242, 255, 0.05);
                    transform: scale(1.05) translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0, 242, 255, 0.15);
                }
                .coll-card:active { transform: scale(0.95); }
            `}</style>
        </div>
    );
};
