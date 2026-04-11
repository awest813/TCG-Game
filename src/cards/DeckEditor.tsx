import React, { useMemo, useState } from 'react';
import { useGame } from '../core/GameContext';
import { Card, CreatureType } from '../core/types';
import { getCardById, getCardPalette, CARD_POOL, resolveCardImage } from '../data/cards';
import { audioManager } from '../core/AudioManager';
import '../styles/SonsotyoScenes.css';

type CardTypeFilter = 'ALL' | CreatureType | 'SUPPORT';

export const DeckEditor: React.FC = () => {
  const { state, updateProfile, updateGameState } = useGame();
  const [filter, setFilter] = useState<CardTypeFilter>('ALL');
  const [search, setSearch] = useState('');

  const deck = state.profile.inventory.deck;

  const filteredCards = useMemo(() => {
    return CARD_POOL.filter((card) => {
      const matchesFilter = filter === 'ALL' || (filter === 'SUPPORT' ? card.cardType !== 'creature' : card.creatureType === filter);
      const matchesSearch = card.name.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const addToDeck = (cardId: string) => {
    if (deck.length >= 60) return;
    audioManager.playSFX('card_play');
    updateProfile({ inventory: { ...state.profile.inventory, deck: [...deck, cardId] } });
  };

  const removeFromDeck = (index: number) => {
    audioManager.playSFX('hover_soft');
    const newDeck = [...deck];
    newDeck.splice(index, 1);
    updateProfile({ inventory: { ...state.profile.inventory, deck: newDeck } });
  };

  const averageCost = (deck.reduce((acc, id) => acc + (getCardById(id)?.cost || 0), 0) / (deck.length || 1)).toFixed(1);
  const creatureCount = deck.filter((id) => getCardById(id)?.cardType === 'creature').length;
  const supportCount = deck.length - creatureCount;

  const exitDeckTerminal = () => {
    audioManager.playSFX('menu_close');
    const back = state.deckEditorReturn ?? 'APARTMENT';
    updateGameState({ deckEditorReturn: null, currentScene: back });
  };

  const exitLabel =
    state.deckEditorReturn === 'MAIN_MENU'
      ? 'Save & return to title'
      : state.deckEditorReturn === 'DISTRICT_EXPLORE'
        ? 'Save & return to streets'
        : 'Save & return to apartment';

  return (
    <div className="deck-builder-container fade-in" style={{ height: '100vh', display: 'grid', gridTemplateColumns: '1fr 380px', background: 'linear-gradient(180deg, rgba(8,10,18,0.86), rgba(4,6,10,0.94)), radial-gradient(circle at 16% 18%, rgba(126,242,255,0.12), transparent 22%), url(/assets/bg/deck-terminal.svg)', backgroundSize: 'cover', color: 'white', overflow: 'hidden' }}>
      <main className="collection-monitor" style={{ padding: '40px', overflowY: 'auto', borderRight: '1px solid rgba(121,247,255,0.08)' }}>
        <header style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
            <div>
              <div className="sonsotyo-kicker" style={{ color: 'var(--accent-primary)' }}>Tech Bay / Archive Access</div>
              <h1 className="sonsotyo-title" style={{ fontSize: '3.2rem', marginTop: '10px' }}>Lineup Sync</h1>
            </div>
            <div className="glass-panel" style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.03)', display: 'flex', gap: '20px', borderRadius: '22px' }}>
              <Metric label="AVG COST" value={`${averageCost} EN`} accent="var(--accent-yellow)" />
              <Metric label="CREATURES" value={`${creatureCount}`} accent="var(--accent-cyan)" />
              <Metric label="SUPPORT" value={`${supportCount}`} accent="var(--accent-magenta)" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="glass-panel" style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '999px', flexWrap: 'wrap' }}>
              {['ALL', 'Pulse', 'Bloom', 'Tide', 'Alloy', 'Veil', 'Current', 'SUPPORT'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => { audioManager.playSFX('hover_soft'); setFilter(cat as CardTypeFilter); }}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '999px',
                    background: filter === cat ? 'var(--accent-cyan)' : 'transparent',
                    color: filter === cat ? 'black' : 'white',
                    border: 'none',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: '0.24s cubic-bezier(0.19, 1, 0.22, 1)',
                    letterSpacing: '0.05rem'
                  }}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            <input
              className="glass-panel"
              placeholder="FILTER BY DESIGNATION..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              style={{ width: '280px', height: '48px', padding: '0 16px', borderRadius: '18px', color: 'white', background: 'rgba(8,12,24,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '30px' }}>
          {filteredCards.map((card) => (
            <EnhancedCollectionCard key={card.id} card={card} count={deck.filter((id) => id === card.id).length} onAdd={() => addToDeck(card.id)} />
          ))}
        </div>
      </main>

      <aside style={{ background: 'rgba(7,10,24,0.4)', padding: '32px', display: 'flex', flexDirection: 'column', backdropFilter: 'blur(20px)' }}>
        <div className="sonsotyo-kicker" style={{ color: 'var(--accent-secondary)' }}>Active Loadout</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', margin: '10px 0 0' }}>MAIN DECK</h2>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: deck.length === 60 ? 'var(--accent-cyan)' : 'white' }}>{deck.length}/60</div>
        </div>

        <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '12px' }}>
          {deck.map((id, index) => {
            const card = getCardById(id);
            if (!card) return null;
            const palette = getCardPalette(card);
            return (
              <div
                key={`${id}-${index}`}
                className="deck-list-item"
                onClick={() => removeFromDeck(index)}
                style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderLeft: `3px solid ${palette.accent}`, transition: '0.2s' }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{card.name.toUpperCase()}</div>
                  <div style={{ color: palette.accent, fontSize: '0.62rem', letterSpacing: '0.1rem', marginTop: '2px' }}>{card.creatureType?.toUpperCase() ?? card.cardType.toUpperCase()}</div>
                </div>
                <div style={{ fontWeight: 900, color: 'var(--accent-yellow)', fontSize: '1.1rem' }}>{card.cost}</div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '24px', display: 'grid', gap: '12px' }}>
          <button className="neo-button primary" onClick={exitDeckTerminal} style={{ width: '100%', justifyContent: 'center' }}>
            {exitLabel}
          </button>
          <div style={{ textAlign: 'center' }} className="sonsotyo-caption">All changes auto-saved to biolink</div>
        </div>
      </aside>

      <style>{`
        .deck-list-item:hover {
          background: rgba(255,255,255,0.08) !important;
          transform: translateX(-6px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .enhanced-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
          z-index: 10;
        }
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(121,247,255,0.1); border-radius: 99px; }
      `}</style>
    </div>
  );
};

const EnhancedCollectionCard: React.FC<{ card: Card; count: number; onAdd: () => void }> = ({ card, count, onAdd }) => {
  const palette = getCardPalette(card);
  return (
    <div
      className="glass-panel enhanced-card"
      onClick={onAdd}
      style={{ padding: '16px', border: `1px solid ${palette.accent}`, background: palette.panel, cursor: 'pointer', transition: '0.4s cubic-bezier(0.19, 1, 0.22, 1)', position: 'relative', borderRadius: '24px', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 5 }}>
        <div style={{ padding: '4px 8px', borderRadius: '999px', background: 'rgba(0,0,0,0.6)', fontWeight: 900, color: 'var(--accent-yellow)', fontSize: '0.9rem' }}>{card.cost}</div>
      </div>

      <div style={{ height: '180px', borderRadius: '16px', background: 'rgba(0,0,0,0.4)', overflow: 'hidden', marginBottom: '14px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
        <img src={resolveCardImage(card)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.88 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px', background: 'linear-gradient(0deg, rgba(0,0,0,0.8), transparent)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1rem' }}>
          {card.rarity.toUpperCase()} / {card.set?.replace(/_/g, ' ') ?? 'CORE SET'}
        </div>
      </div>

      <div style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '4px' }}>{card.name.toUpperCase()}</div>
      <div className="sonsotyo-kicker" style={{ color: palette.accent, marginBottom: '12px' }}>
        {card.creatureType?.toUpperCase() ?? card.cardType.toUpperCase()}
      </div>

      <div className="sonsotyo-copy" style={{ fontSize: '0.8rem', lineHeight: 1.4, minHeight: '44px' }}>
        {card.rulesText?.[0] ?? 'No rules data available.'}
      </div>

      {count > 0 && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', fontSize: '8rem', fontWeight: 900, color: palette.accent, opacity: 0.1 }}>{count}</div>}
      {count > 0 && <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'var(--accent-yellow)', color: 'black', padding: '4px 12px', borderRadius: '99px', fontSize: '0.74rem', fontWeight: 900, boxShadow: '0 4px 12px rgba(255,209,102,0.4)' }}>SYNCED: {count}</div>}
    </div>
  );
};

const Metric: React.FC<{ label: string; value: string; accent: string }> = ({ label, value, accent }) => (
  <div style={{ textAlign: 'center' }}>
    <div className="sonsotyo-kicker">{label}</div>
    <div style={{ marginTop: '4px', fontSize: '1.2rem', fontWeight: 900, color: accent }}>{value}</div>
  </div>
);
