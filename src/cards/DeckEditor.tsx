import React, { useMemo, useState } from 'react';
import { useGame } from '../core/GameStateContext';
import { Card } from '../core/types';
import { getCardById, getCardPalette } from '../data/cards';

type CardTypeFilter = 'ALL' | 'Pulse' | 'Bloom' | 'Tide' | 'Alloy' | 'Veil' | 'Current' | 'TACTIC';

export const DeckEditor: React.FC = () => {
  const { state, updateProfile, setScene } = useGame();
  const [filter, setFilter] = useState<CardTypeFilter>('ALL');
  const [search, setSearch] = useState('');
  const [focusedCardId, setFocusedCardId] = useState<string | null>(state.profile.inventory.deck[0] ?? state.profile.inventory.cards[0] ?? null);

  const deck = state.profile.inventory.deck;
  const collection = state.profile.inventory.cards;

  const filteredCollection = useMemo(
    () =>
      collection.filter((id) => {
        const card = getCardById(id);
        if (!card) return false;
        const matchesType =
          filter === 'ALL' ||
          (filter === 'TACTIC' ? card.cardType !== 'creature' : card.creatureType === filter);
        const matchesSearch = card.name.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesSearch;
      }),
    [collection, filter, search]
  );

  const addToDeck = (cardId: string) => {
    if (deck.length >= 24) return;
    updateProfile({
      inventory: {
        ...state.profile.inventory,
        deck: [...deck, cardId]
      }
    });
    setFocusedCardId(cardId);
  };

  const removeFromDeck = (index: number) => {
    const nextDeck = [...deck];
    nextDeck.splice(index, 1);
    updateProfile({
      inventory: {
        ...state.profile.inventory,
        deck: nextDeck
      }
    });
  };

  const manaCurve = [0, 0, 0, 0, 0, 0, 0];
  deck.forEach((id) => {
    const cost = getCardById(id)?.cost || 0;
    manaCurve[Math.min(cost, 6)] += 1;
  });
  const maxCurve = Math.max(...manaCurve, 1);

  const averageCost = (deck.reduce((acc, id) => acc + (getCardById(id)?.cost || 0), 0) / (deck.length || 1)).toFixed(1);
  const creatureCount = deck.filter((id) => getCardById(id)?.cardType === 'creature').length;
  const tacticCount = deck.length - creatureCount;
  const focusedCard = getCardById(focusedCardId ?? '');

  return (
    <div
      className="deck-editor-scene fade-in"
      style={{
        height: '100vh',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(360px, 460px)',
        background: 'radial-gradient(circle at top left, rgba(121,247,255,0.12), transparent 24%), linear-gradient(180deg, #030711 0%, #070b18 100%)',
        color: 'white',
        overflow: 'hidden'
      }}
    >
      <div style={{ padding: '34px', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(121,247,255,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '28px', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', letterSpacing: '0.24rem' }}>TECH BAY / DECK FORGE</div>
            <h1 className="glow-text" style={{ fontSize: '3.4rem', marginTop: '8px' }}>MAIN_SYNC</h1>
            <div style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>Build a 24-card list with a clean curve and a clear identity.</div>
          </div>
          <input
            type="text"
            placeholder="SEARCH CARD"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ minWidth: '240px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', padding: '12px 16px', borderRadius: '16px', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {['ALL', 'Pulse', 'Bloom', 'Tide', 'Alloy', 'Veil', 'Current', 'TACTIC'].map((entry) => (
            <button
              key={entry}
              onClick={() => setFilter(entry as CardTypeFilter)}
              style={{
                padding: '8px 16px',
                fontSize: '0.72rem',
                background: filter === entry ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.05)',
                color: filter === entry ? 'black' : 'white',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '999px',
                cursor: 'pointer',
                transition: '0.2s ease',
                fontWeight: 700,
                letterSpacing: '0.08rem'
              }}
            >
              {entry}
            </button>
          ))}
        </div>

        <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '18px', paddingRight: '18px' }}>
          {filteredCollection.map((id, index) => (
            <CollectionCard key={`${id}-${index}`} id={id} onAdd={() => addToDeck(id)} onFocus={() => setFocusedCardId(id)} />
          ))}
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div className="glass-panel" style={{ padding: '20px', background: 'rgba(7,12,22,0.76)' }}>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', letterSpacing: '0.22rem' }}>LOADOUT SUMMARY</div>
          <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <Metric label="CARD COUNT" value={`${deck.length} / 24`} accent={deck.length === 24 ? 'var(--accent-cyan)' : 'var(--text-primary)'} />
            <Metric label="AVG COST" value={`${averageCost} EN`} accent="var(--accent-yellow)" />
            <Metric label="CREATURES" value={`${creatureCount}`} accent="var(--accent-cyan)" />
            <Metric label="TACTICS" value={`${tacticCount}`} accent="var(--accent-magenta)" />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', background: 'rgba(7,12,22,0.76)' }}>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', letterSpacing: '0.22rem', marginBottom: '14px' }}>MANA CURVE</div>
          <div style={{ height: '110px', display: 'flex', alignItems: 'end', gap: '8px' }}>
            {manaCurve.map((count, index) => (
              <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '100%', height: `${(count / maxCurve) * 72}px`, background: 'linear-gradient(180deg, var(--accent-cyan), rgba(121,247,255,0.24))', borderRadius: '10px 10px 4px 4px', opacity: count > 0 ? 1 : 0.12 }} />
                <div style={{ fontSize: '0.58rem', opacity: 0.6 }}>{index}{index === 6 ? '+' : ''}</div>
              </div>
            ))}
          </div>
        </div>

        {focusedCard && <FocusedCardPanel card={focusedCard} />}

        <div className="glass-panel custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '18px', background: 'rgba(7,12,22,0.76)' }}>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', letterSpacing: '0.22rem', marginBottom: '14px' }}>ACTIVE DECK</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {deck.map((id, index) => {
              const card = getCardById(id);
              const palette = getCardPalette(card);
              return (
                <button
                  key={`${id}-${index}`}
                  onClick={() => {
                    setFocusedCardId(id);
                    removeFromDeck(index);
                  }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '34px 1fr auto',
                    gap: '12px',
                    alignItems: 'center',
                    padding: '12px 14px',
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${palette.accent}22`,
                    borderRadius: '14px',
                    color: 'white',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 800 }}>{index + 1}</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{card?.name.toUpperCase()}</div>
                    <div style={{ fontSize: '0.68rem', color: palette.accent, letterSpacing: '0.14rem' }}>{card?.cardType.toUpperCase()}</div>
                  </div>
                  <div style={{ color: 'var(--accent-yellow)', fontWeight: 800 }}>{card?.cost}</div>
                </button>
              );
            })}
          </div>
        </div>

        <button className="champion-button champion-button-primary compact" disabled={deck.length !== 24} onClick={() => setScene('APARTMENT')} style={{ color: 'black' }}>
          SYNC & DEPLOY
        </button>
      </div>
    </div>
  );
};

const Metric: React.FC<{ label: string; value: string; accent: string }> = ({ label, value, accent }) => (
  <div>
    <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '0.16rem' }}>{label}</div>
    <div style={{ marginTop: '6px', fontSize: '1.3rem', fontWeight: 800, color: accent }}>{value}</div>
  </div>
);

const CollectionCard: React.FC<{ id: string; onAdd: () => void; onFocus: () => void }> = ({ id, onAdd, onFocus }) => {
  const card = getCardById(id);
  if (!card) return null;
  const palette = getCardPalette(card);

  return (
    <button
      onClick={() => {
        onFocus();
        onAdd();
      }}
      style={{
        minHeight: '260px',
        borderRadius: '24px',
        border: `1px solid ${palette.accent}`,
        background: `${palette.panel}, linear-gradient(180deg, ${palette.rarityFinish}, transparent 72%)`,
        boxShadow: `0 16px 34px ${palette.glow}`,
        padding: '16px',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
        <div>
          <div style={{ fontSize: '0.54rem', color: palette.accent, letterSpacing: '0.16rem' }}>{card.cardType.toUpperCase()}</div>
          <div style={{ marginTop: '6px', fontSize: '1rem', fontWeight: 800 }}>{card.name}</div>
        </div>
        <div style={{ color: 'var(--accent-yellow)', fontWeight: 800 }}>{card.cost}</div>
      </div>
      <div style={{ flex: 1, marginTop: '14px', borderRadius: '18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '72px', height: '72px', background: palette.glow, borderRadius: '999px', filter: 'blur(12px)' }} />
      </div>
      <div style={{ marginTop: '14px', fontSize: '0.76rem', lineHeight: 1.45, color: 'var(--text-secondary)', minHeight: '42px' }}>
        {card.rulesText?.[0] ?? 'No effect text loaded.'}
      </div>
      <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div style={{ fontSize: '0.6rem', color: palette.accent, letterSpacing: '0.14rem' }}>{card.rarity.toUpperCase()}</div>
        <div style={{ fontWeight: 800 }}>{card.cardType === 'creature' ? `${card.attack ?? '-'} / ${card.health ?? '-'}` : 'TACTIC'}</div>
      </div>
    </button>
  );
};

const FocusedCardPanel: React.FC<{ card: Card }> = ({ card }) => {
  const palette = getCardPalette(card);
  return (
    <div className="glass-panel" style={{ padding: '20px', background: `${palette.panel}`, border: `1px solid ${palette.accent}` }}>
      <div style={{ fontSize: '0.66rem', color: palette.accent, letterSpacing: '0.22rem' }}>CARD DETAIL</div>
      <div style={{ marginTop: '10px', fontSize: '1.6rem', fontWeight: 800 }}>{card.name.toUpperCase()}</div>
      <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Tag label={card.cardType.toUpperCase()} accent={palette.accent} />
        {card.creatureType && <Tag label={card.creatureType.toUpperCase()} accent="var(--accent-yellow)" />}
        <Tag label={`${card.cost} EN`} accent="var(--text-primary)" />
      </div>
      <div style={{ marginTop: '14px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
        {(card.rulesText ?? ['No effect text loaded.']).join(' ')}
      </div>
      {card.cardType === 'creature' && <div style={{ marginTop: '16px', fontSize: '1.2rem', fontWeight: 800 }}>{card.attack ?? '-'} / {card.health ?? '-'}</div>}
    </div>
  );
};

const Tag: React.FC<{ label: string; accent: string }> = ({ label, accent }) => (
  <div style={{ padding: '4px 10px', border: `1px solid ${accent}`, borderRadius: '999px', fontSize: '0.6rem', letterSpacing: '0.12rem', color: accent }}>{label}</div>
);
