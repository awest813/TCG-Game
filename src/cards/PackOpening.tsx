import React, { useState, useEffect } from 'react';
import { useGame } from '../core/GameStateContext';
import { CARD_POOL, getCardById } from '../data/cards';

export const PackOpening: React.FC = () => {
  const { state, updateProfile, setScene } = useGame();
  const [revealedCards, setRevealedCards] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isOpening, setIsOpening] = useState(false);

  const openPack = () => {
    if (state.profile.inventory.packs.length === 0) {
        alert("No packs in inventory!");
        return;
    }

    setIsOpening(true);
    const newCards: string[] = [];
    
    // Weighted selection
    for (let i = 0; i < 5; i++) {
        const rollout = Math.random();
        let pool = CARD_POOL.filter(c => c.rarity === 'common');
        if (rollout > 0.95) pool = CARD_POOL.filter(c => c.rarity === 'rare');
        else if (rollout > 0.8) pool = CARD_POOL.filter(c => c.rarity === 'uncommon');
        
        const rand = Math.floor(Math.random() * pool.length);
        newCards.push(pool[rand].id);
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
          setCurrentIndex(prev => prev + 1);
      } else {
          setScene('APARTMENT');
      }
  };

  return (
    <div className="pack-opening-container fade-in" style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      {!isOpening ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px', borderRadius: '40px' }}>
            <h1 className="glow-text" style={{ marginBottom: '40px', fontSize: '2.5rem' }}>DATA DECRYPTION</h1>
            
            <div className="pack-visual floating" style={{ 
                width: '240px', 
                height: '340px', 
                margin: '0 auto 40px', 
                background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-magenta) 100%)',
                borderRadius: '25px',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 0 50px rgba(0, 242, 255, 0.3)',
                border: '4px solid white',
                cursor: 'pointer',
                position: 'relative'
            }} onClick={openPack}>
                <div style={{ textAlign: 'center' }}>
                    <h2 className="glow-text" style={{ fontSize: '1.8rem', letterSpacing: '2px' }}>{state.profile.inventory.packs[0] || "NULL"}</h2>
                    <div style={{ fontSize: '0.7rem', marginTop: '15px', color: 'rgba(255,255,255,0.7)', letterSpacing: '3px' }}>5 DATA FRAGMENTS</div>
                </div>
                <div style={{ position: 'absolute', inset: '10px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '15px' }}></div>
            </div>
            
            <div style={{ marginBottom: '40px' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Inventory Surplus</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{state.profile.inventory.packs.length} PACKS</div>
            </div>

            {state.profile.inventory.packs.length > 0 ? (
                <p style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', animation: 'pulse 2s infinite' }}>CLICK TO INITIALIZE SEQUENCE</p>
            ) : (
                <button className="neo-button" onClick={() => setScene('APARTMENT')}>RETURN TO HUB</button>
            )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
            {currentIndex >= 0 && (
                <div className="card-reveal-area" style={{ perspective: '1200px' }}>
                    <RevealCard cardId={revealedCards[currentIndex]} onNext={nextCard} />
                </div>
            )}
            
            <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                {revealedCards.map((_, i) => (
                    <div key={i} style={{ 
                        width: '50px', 
                        height: '6px', 
                        borderRadius: '3px',
                        background: i === currentIndex ? 'var(--accent-cyan)' : (i < currentIndex ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)'),
                        boxShadow: i === currentIndex ? '0 0 10px var(--accent-cyan)' : 'none',
                        transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                ))}
            </div>
            <div style={{ marginTop: '30px', color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '2px' }}>
                {currentIndex === revealedCards.length - 1 ? 'SEQUENCE COMPLETE' : 'TAP FRAGMENT TO REVEAL'}
            </div>
        </div>
      )}

      <style>{`
          .floating { animation: float 4s ease-in-out infinite; }
          @keyframes float {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              50% { transform: translateY(-30px) rotate(2deg); }
          }
          @keyframes pulse {
              0%, 100% { opacity: 0.5; }
              50% { opacity: 1; }
          }
      `}</style>
    </div>
  );
};

const RevealCard: React.FC<{ cardId: string, onNext: () => void }> = ({ cardId, onNext }) => {
    const card = getCardById(cardId);
    const [isRevealed, setIsRevealed] = useState(false);

    useEffect(() => {
        setIsRevealed(false);
        const timer = setTimeout(() => setIsRevealed(true), 150);
        return () => clearTimeout(timer);
    }, [cardId]);

    if (!card) return null;

    const rarityColor = {
        common: '#fff',
        uncommon: 'var(--accent-cyan)',
        rare: 'var(--accent-yellow)'
    }[card.rarity];

    return (
        <div onClick={onNext} className={`card-inner ${isRevealed ? 'revealed' : ''}`} style={{
            width: '280px',
            height: '420px',
            margin: '0 auto',
            position: 'relative',
            cursor: 'pointer',
            transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transformStyle: 'preserve-3d',
            transform: isRevealed ? 'rotateY(0deg)' : 'rotateY(180deg)'
        }}>
            {/* Front */}
            <div className="glass-panel" style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                border: `3px solid ${rarityColor}`,
                borderRadius: '20px',
                padding: '25px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: card.rarity === 'rare' ? `0 0 50px ${rarityColor}44` : 'none',
                background: 'rgba(5,5,15,0.95)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: rarityColor }}>{card.name}</span>
                    <span style={{ color: 'var(--accent-yellow)', fontWeight: 'bold' }}>{card.cost}⚡</span>
                </div>
                
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <div style={{ width: '100%', height: '180px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}></div>
                    <div style={{ position: 'absolute', fontSize: '3rem', opacity: 0.1 }}>{card.cardType[0].toUpperCase()}</div>
                </div>

                <div className="glass-morphism" style={{ fontSize: '0.8rem', padding: '15px', borderRadius: '10px', margin: '20px 0', minHeight: '80px', lineHeight: '1.4' }}>
                    {card.rulesText[0]}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <span style={{ color: rarityColor, fontWeight: 'bold', fontSize: '0.7rem', letterSpacing: '2px' }}>{card.rarity.toUpperCase()}</span>
                    {card.cardType === 'creature' && (
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{card.attack}<span style={{ opacity: 0.3 }}>/</span>{card.health}</div>
                    )}
                </div>
            </div>

            {/* Back */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                background: 'linear-gradient(135deg, #111 0%, #222 100%)',
                border: '4px solid rgba(255,255,255,0.15)',
                transform: 'rotateY(180deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '20px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.5)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', opacity: 0.2 }}>?</div>
                    <div style={{ fontSize: '0.6rem', letterSpacing: '5px', opacity: 0.3, marginTop: '10px' }}>ENCRYPTED</div>
                </div>
            </div>
        </div>
    );
};
