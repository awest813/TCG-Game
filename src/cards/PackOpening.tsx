import React, { useEffect, useState } from 'react';
import { useGame } from '../core/GameContext';
import { CARD_POOL, getCardById, getCardPalette } from '../data/cards';

export const PackOpening: React.FC = () => {
  const { state, updateProfile, setScene } = useGame();
  const [revealedCards, setRevealedCards] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [packStatus, setPackStatus] = useState<'IDLE' | 'BURST' | 'SHRED' | 'REVEAL'>('IDLE');

  const startSequence = () => {
    if (state.profile.inventory.packs.length === 0) return;
    setPackStatus('BURST');
    window.setTimeout(() => {
      setPackStatus('SHRED');
      window.setTimeout(() => {
        openPack();
        setPackStatus('REVEAL');
      }, 260);
    }, 420);
  };

  const openPack = () => {
    const newCards: string[] = [];
    for (let i = 0; i < 5; i += 1) {
      const rollout = Math.random();
      let pool = CARD_POOL.filter((card) => card.rarity === 'common');
      if (rollout > 0.95) pool = CARD_POOL.filter((card) => card.rarity === 'rare');
      else if (rollout > 0.8) pool = CARD_POOL.filter((card) => card.rarity === 'uncommon');
      const nextCard = pool[Math.floor(Math.random() * pool.length)];
      newCards.push(nextCard.id);
    }

    const remainingPacks = [...state.profile.inventory.packs];
    remainingPacks.shift();

    updateProfile({
      inventory: {
        ...state.profile.inventory,
        cards: [...state.profile.inventory.cards, ...newCards],
        packs: remainingPacks
      }
    });

    setRevealedCards(newCards);
    setCurrentIndex(0);
  };

  const nextCard = () => {
    if (currentIndex < revealedCards.length - 1) {
      setCurrentIndex((value) => value + 1);
    } else {
      setScene('APARTMENT');
    }
  };

  return (
    <div
      className="pack-opening-container fade-in"
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 30%, rgba(121,247,255,0.16), transparent 22%), linear-gradient(180deg, #020611 0%, #09040f 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="scanlines" />
      {packStatus === 'BURST' && <div className="energy-beam" />}

      {packStatus !== 'REVEAL' ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '54px', borderRadius: '36px', zIndex: 10, background: 'rgba(8,12,24,0.84)', minWidth: '440px' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.34rem', opacity: 0.6 }}>DATA DECRYPTION MODE</div>
          <div
            className={packStatus === 'IDLE' ? 'pack-shell-float' : packStatus === 'BURST' ? 'pack-burst' : 'shred-anim'}
            style={{
              width: '280px',
              height: '380px',
              margin: '36px auto',
              background: 'linear-gradient(180deg, rgba(13,27,43,0.98), rgba(11,8,17,0.98))',
              boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '26px',
              overflow: 'hidden'
            }}
            onClick={startSequence}
          >
            <div className="scanlines" style={{ opacity: 0.14 }} />
            <div style={{ position: 'absolute', inset: '14px', borderRadius: '18px', border: '1px solid rgba(121,247,255,0.14)' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '54px', background: 'linear-gradient(90deg, var(--accent-cyan), #d9ffff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, color: 'black', letterSpacing: '0.16rem' }}>
              METRO PULSE SET
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '8rem', opacity: 0.08, fontWeight: 900 }}>P</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', letterSpacing: '0.28rem' }}>ACCESS GRANTED</div>
            </div>
          </div>

          <div style={{ fontSize: '2rem', fontWeight: 900 }}>{state.profile.inventory.packs.length} PACKS</div>
          <div style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>Tap the sealed pack to rupture the sync layer.</div>

          <div style={{ marginTop: '26px' }}>
            {state.profile.inventory.packs.length > 0 ? (
              <span style={{ color: 'var(--accent-cyan)', fontSize: '0.74rem', letterSpacing: '0.2rem', animation: 'packPulse 2s infinite' }}>INITIALIZE SYNC PROTOCOL</span>
            ) : (
              <button className="neo-button" onClick={() => setScene('APARTMENT')}>RETURN TO HUB</button>
            )}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '980px', zIndex: 10 }}>
          {currentIndex >= 0 && <RevealCard cardId={revealedCards[currentIndex]} onNext={nextCard} index={currentIndex + 1} total={revealedCards.length} />}
          <div style={{ marginTop: '42px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {revealedCards.map((_, index) => (
              <div key={index} style={{ width: '74px', height: '5px', background: index === currentIndex ? 'var(--accent-cyan)' : index < currentIndex ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.05)', boxShadow: index === currentIndex ? '0 0 16px var(--accent-cyan)' : 'none', transition: '0.4s ease' }} />
            ))}
          </div>
        </div>
      )}

      <style>{`
        .pack-shell-float { animation: packFloat 4s ease-in-out infinite; }
        @keyframes packFloat {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-18px) rotate(1deg); }
        }
        @keyframes packPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const RevealCard: React.FC<{ cardId: string; onNext: () => void; index: number; total: number }> = ({ cardId, onNext, index, total }) => {
  const card = getCardById(cardId);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    setIsRevealed(false);
    const timer = window.setTimeout(() => setIsRevealed(true), 120);
    return () => window.clearTimeout(timer);
  }, [cardId]);

  if (!card) return null;
  const palette = getCardPalette(card);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '26px', alignItems: 'center' }}>
      <div
        onClick={onNext}
        style={{
          width: '320px',
          height: '460px',
          margin: '0 auto',
          position: 'relative',
          cursor: 'pointer',
          transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transformStyle: 'preserve-3d',
          transform: isRevealed ? 'rotateY(0deg)' : 'rotateY(180deg)'
        }}
      >
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            border: `2px solid ${palette.accent}`,
            borderRadius: '28px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: `0 0 50px ${palette.glow}`,
            background: `${palette.panel}, linear-gradient(180deg, ${palette.rarityFinish}, transparent 72%)`
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: '0.58rem', color: palette.accent, letterSpacing: '0.18rem' }}>{card.cardType.toUpperCase()}</div>
              <div style={{ marginTop: '8px', fontWeight: 800, fontSize: '1.35rem' }}>{card.name}</div>
            </div>
            <div style={{ color: 'var(--accent-yellow)', fontWeight: 800 }}>{card.cost}</div>
          </div>

          <div style={{ flex: 1, marginTop: '18px', marginBottom: '18px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ width: '120px', height: '120px', background: palette.glow, borderRadius: '999px', filter: 'blur(18px)' }} />
            <div style={{ position: 'absolute', bottom: '14px', fontSize: '0.62rem', letterSpacing: '0.18rem', color: palette.accent }}>{card.set ?? 'CORE SET'}</div>
          </div>

          <div style={{ fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--text-secondary)', minHeight: '88px' }}>
            {(card.rulesText ?? ['No effect text loaded.']).join(' ')}
          </div>

          <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
            <div style={{ color: palette.accent, fontWeight: 700, letterSpacing: '0.16rem', fontSize: '0.66rem' }}>{card.rarity.toUpperCase()}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{card.cardType === 'creature' ? `${card.attack ?? '-'} / ${card.health ?? '-'}` : 'TACTIC'}</div>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(180deg, rgba(10,17,31,0.98), rgba(11,8,17,0.98))',
            border: '2px solid rgba(255,255,255,0.15)',
            transform: 'rotateY(180deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '28px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', opacity: 0.18 }}>?</div>
            <div style={{ fontSize: '0.62rem', letterSpacing: '0.24rem', opacity: 0.34, marginTop: '10px' }}>ENCRYPTED</div>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px', background: 'rgba(8,12,24,0.8)', textAlign: 'left' }}>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', letterSpacing: '0.22rem' }}>REVEAL {index} / {total}</div>
        <div style={{ marginTop: '10px', fontSize: '2.1rem', fontWeight: 800 }}>{card.name.toUpperCase()}</div>
        <div style={{ marginTop: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Tag label={card.cardType.toUpperCase()} accent={palette.accent} />
          {card.creatureType && <Tag label={card.creatureType.toUpperCase()} accent="var(--accent-yellow)" />}
          <Tag label={card.rarity.toUpperCase()} accent="var(--text-primary)" />
        </div>
        <div style={{ marginTop: '18px', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
          {(card.rulesText ?? ['No effect text loaded.']).join(' ')}
        </div>
        <button className="neo-button primary" onClick={onNext} style={{ marginTop: '22px' }}>
          {index < total ? 'REVEAL NEXT CARD' : 'RETURN TO HUB'}
        </button>
      </div>
    </div>
  );
};

const Tag: React.FC<{ label: string; accent: string }> = ({ label, accent }) => (
  <div style={{ padding: '4px 10px', borderRadius: '999px', border: `1px solid ${accent}`, color: accent, fontSize: '0.62rem', letterSpacing: '0.14rem' }}>
    {label}
  </div>
);
