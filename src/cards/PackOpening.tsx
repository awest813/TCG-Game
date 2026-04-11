import React, { useEffect, useState } from 'react';
import { useGame } from '../core/GameContext';
import { CARD_POOL, getCardById, getCardPalette } from '../data/cards';
import { audioManager } from '../core/AudioManager';
import '../styles/SonsotyoScenes.css';

export const PackOpening: React.FC = () => {
  const { state, updateProfile, setScene } = useGame();
  const [revealedCards, setRevealedCards] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [packStatus, setPackStatus] = useState<'IDLE' | 'BURST' | 'SHRED' | 'REVEAL'>('IDLE');

  const startSequence = () => {
    if (state.profile.inventory.packs.length === 0) return;
    audioManager.playSFX('pack_burst');
    audioManager.speak('INITIALIZING DATA DECRYPTION SEQUENCE.', 'announcer');
    setPackStatus('BURST');
    window.setTimeout(() => {
      setPackStatus('SHRED');
      audioManager.playSFX('pack_shred');
      window.setTimeout(() => {
        openPack();
        setPackStatus('REVEAL');
      }, 260);
    }, 420);
  };

  const openPack = () => {
    const newCards: string[] = [];
    let containsRare = false;
    for (let i = 0; i < 5; i += 1) {
      const rollout = Math.random();
      let pool = CARD_POOL.filter((card) => card.rarity === 'common');
      if (rollout > 0.95) {
          pool = CARD_POOL.filter((card) => card.rarity === 'rare');
          containsRare = true;
      }
      else if (rollout > 0.8) pool = CARD_POOL.filter((card) => card.rarity === 'uncommon');
      const nextCard = pool[Math.floor(Math.random() * pool.length)];
      newCards.push(nextCard.id);
    }

    if (containsRare) {
        audioManager.speak('HIGH VALUE THERMAL SIGNATURE DETECTED. PREPARE FOR SYNC.', 'announcer');
    } else {
        audioManager.speak('DATA TRANSFER COMPLETE. STANDBY FOR REVEAL.', 'announcer');
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
          <div className="sonsotyo-kicker" style={{ color: 'var(--accent-primary)' }}>Decryption Protocol Active</div>
          <div
            className={packStatus === 'IDLE' ? 'pack-shell-float' : packStatus === 'BURST' ? 'pack-burst' : 'shred-anim'}
            style={{
              width: '280px',
              height: '380px',
              margin: '36px auto',
              background: 'linear-gradient(180deg, rgba(13,27,43,0.98), rgba(11,8,17,0.98))',
              boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
              border: '1px solid rgba(121,247,255,0.2)',
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
              <div style={{ fontSize: '8rem', opacity: 0.08, fontWeight: 900, color: 'var(--accent-cyan)' }}>P</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', letterSpacing: '0.28rem' }}>SYNC_LOCKED</div>
            </div>
          </div>

          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', textShadow: '0 0 20px rgba(121,247,255,0.3)' }}>{state.profile.inventory.packs.length} PACKS</div>
          <div className="sonsotyo-copy" style={{ marginTop: '12px', fontSize: '0.85rem' }}>Rupture the energy shell to reveal synced data cards.</div>

          <div style={{ marginTop: '26px' }}>
            {state.profile.inventory.packs.length > 0 ? (
              <button 
                className="neo-button primary" 
                onClick={startSequence}
                style={{ padding: '14px 42px', fontSize: '0.72rem', letterSpacing: '0.2rem' }}
              >
                  INITIALIZE_SYNC
              </button>
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
        @keyframes energy-flash {
            0% { opacity: 0; transform: scale(0.8); }
            50% { opacity: 0.8; transform: scale(1.1); }
            100% { opacity: 0; transform: scale(1.4); }
        }
        .rare-flash {
            position: fixed;
            inset: 0;
            background: white;
            z-index: 1000;
            animation: energy-flash 0.6s forwards;
            pointer-events: none;
        }
      `}</style>
    </div>
  );
};

const RevealCard: React.FC<{ cardId: string; onNext: () => void; index: number; total: number }> = ({ cardId, onNext, index, total }) => {
  const card = getCardById(cardId);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    setIsRevealed(false);
    const timer = window.setTimeout(() => {
        setIsRevealed(true);
        audioManager.playSFX('card_reveal');
        if (card?.rarity === 'rare') {
            setShowFlash(true);
            audioManager.playSFX('rare_reveal');
            audioManager.speak(`ULTRA_RARE_ENTITY_SYNCED: ${card.name.toUpperCase()}`, 'announcer');
            setTimeout(() => setShowFlash(false), 600);
        }
    }, 120);
    return () => window.clearTimeout(timer);
  }, [cardId, card]);

  if (!card) return null;
  const palette = getCardPalette(card);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '42px', alignItems: 'center' }}>
      {showFlash && <div className="rare-flash" />}
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
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: `0 0 60px ${palette.glow}`,
            background: `${palette.panel}, linear-gradient(135deg, ${palette.rarityFinish}, transparent 60%)`,
            overflow: 'hidden'
          }}
        >
          {card.rarity === 'rare' && <div className="holographic-shine" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)', backgroundSize: '200% 200%', animation: 'shine 2s infinite linear' }} />}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', zIndex: 2 }}>
            <div>
              <div style={{ fontSize: '0.6rem', color: palette.accent, letterSpacing: '0.2rem' }}>{card.cardType.toUpperCase()}</div>
              <div style={{ marginTop: '8px', fontWeight: 800, fontSize: '1.4rem', textShadow: `0 0 10px ${palette.glow}` }}>{card.name}</div>
            </div>
            <div style={{ color: 'var(--accent-yellow)', fontWeight: 800, fontSize: '1.2rem' }}>{card.cost}</div>
          </div>

          <div style={{ flex: 1, marginTop: '20px', marginBottom: '20px', borderRadius: '18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ width: '130px', height: '130px', background: palette.glow, borderRadius: '999px', filter: 'blur(20px)', opacity: 0.6 }} />
            {card.image && <img src={card.image} alt="" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', borderRadius: '18px', opacity: 0.8 }} />}
            <div style={{ position: 'absolute', bottom: '14px', fontSize: '0.62rem', letterSpacing: '0.22rem', color: palette.accent, fontWeight: 700 }}>{card.set?.replace(/_/g, ' ') ?? 'CORE SET'}</div>
          </div>

          <div style={{ fontSize: '0.88rem', lineHeight: 1.5, color: 'var(--text-secondary)', minHeight: '80px', zIndex: 2 }}>
            {(card.rulesText ?? ['No effect text loaded.']).join(' ')}
          </div>

          <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'end', zIndex: 2 }}>
            <div style={{ color: palette.accent, fontWeight: 900, letterSpacing: '0.18rem', fontSize: '0.7rem' }}>{card.rarity.toUpperCase()}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900 }}>{card.cardType === 'creature' ? `${card.attack ?? '-'} / ${card.health ?? '-'}` : 'TACTIC'}</div>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(180deg, rgba(8,18,32,0.98), rgba(12,8,22,0.98))',
            border: '2px solid rgba(121,247,255,0.3)',
            transform: 'rotateY(180deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--accent-cyan)', opacity: 0.1 }}>?</div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.3rem', color: 'var(--accent-cyan)', opacity: 0.4, marginTop: '10px' }}>ENCRYPTED_SYNC</div>
          </div>
        </div>
      </div>

        <div className="glass-panel" style={{ padding: '32px', background: 'rgba(8,12,24,0.85)', textAlign: 'left', border: `1px solid ${palette.accent}` }}>
        <div className="sonsotyo-kicker" style={{ color: palette.accent }}>REVEAL_SEQUENCE {index} / {total}</div>
        <div style={{ marginTop: '12px', fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'white' }}>{card.name.toUpperCase()}</div>
        <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Tag label={card.cardType.toUpperCase()} accent={palette.accent} />
          {card.creatureType && <Tag label={card.creatureType.toUpperCase()} accent="var(--accent-yellow)" />}
          <Tag label={card.rarity.toUpperCase()} accent="var(--text-primary)" />
        </div>
        <div className="sonsotyo-copy" style={{ marginTop: '22px', lineHeight: 1.7, fontSize: '1rem', borderLeft: `3px solid ${palette.accent}`, paddingLeft: '20px' }}>
          {(card.rulesText ?? ['No effect text loaded.']).join(' ')}
        </div>
        <div style={{ display: 'flex', gap: '14px', marginTop: '32px' }}>
            <button className="neo-button primary" onClick={onNext} style={{ flex: 1, padding: '16px' }}>
                {index < total ? 'NEXT_DECRYPTION' : 'FINALIZE_SYNC'}
            </button>
        </div>
      </div>

      <style>{`
        @keyframes shine {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

const Tag: React.FC<{ label: string; accent: string }> = ({ label, accent }) => (
  <div style={{ padding: '6px 14px', borderRadius: '999px', border: `1px solid ${accent}`, color: accent, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14rem', background: 'rgba(0,0,0,0.2)' }}>
    {label}
  </div>
);
