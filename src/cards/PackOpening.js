import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useGame } from '../core/GameStateContext';
import { CARD_POOL, getCardById } from '../data/cards';
export const PackOpening = () => {
    const { state, updateProfile, setScene } = useGame();
    const [revealedCards, setRevealedCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isOpening, setIsOpening] = useState(false);
    const [packStatus, setPackStatus] = useState('IDLE');
    const startSequence = () => {
        if (state.profile.inventory.packs.length === 0)
            return;
        setPackStatus('BURST');
        setTimeout(() => {
            setPackStatus('SHRED');
            setTimeout(() => {
                openPack();
                setPackStatus('REVEAL');
                setIsOpening(true);
            }, 300);
        }, 500);
    };
    const openPack = () => {
        const newCards = [];
        for (let i = 0; i < 5; i++) {
            const rollout = Math.random();
            let pool = CARD_POOL.filter(c => c.rarity === 'common');
            if (rollout > 0.95)
                pool = CARD_POOL.filter(c => c.rarity === 'rare');
            else if (rollout > 0.8)
                pool = CARD_POOL.filter(c => c.rarity === 'uncommon');
            const rand = Math.floor(Math.random() * pool.length);
            newCards.push(pool[rand].id);
        }
        const remainingPacks = [...state.profile.inventory.packs];
        remainingPacks.shift();
        updateProfile({
            inventory: Object.assign(Object.assign({}, state.profile.inventory), { cards: [...state.profile.inventory.cards, ...newCards], packs: remainingPacks })
        });
        setRevealedCards(newCards);
        setCurrentIndex(0);
    };
    const nextCard = () => {
        if (currentIndex < revealedCards.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
        else {
            setScene('APARTMENT');
        }
    };
    return (_jsxs("div", { className: "pack-opening-container fade-in", style: {
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#050510',
            position: 'relative',
            overflow: 'hidden'
        }, children: [_jsx("div", { className: "scanlines" }), packStatus === 'BURST' && _jsx("div", { className: "energy-beam" }), packStatus !== 'REVEAL' ? (_jsxs("div", { className: "glass-panel", style: { textAlign: 'center', padding: '60px', borderRadius: '40px', zIndex: 10 }, children: [_jsx("h1", { className: "glow-text", style: { marginBottom: '60px', fontSize: '1rem', letterSpacing: '10px', opacity: 0.5 }, children: "DATA_DECRYPTION_MODE" }), _jsxs("div", { className: `pack-visual ${packStatus === 'IDLE' ? 'floating' : (packStatus === 'BURST' ? 'pack-burst' : 'shred-anim')}`, style: {
                            width: '260px',
                            height: '360px',
                            margin: '0 auto 60px',
                            background: 'linear-gradient(215deg, #222 0%, #000 100%)',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            cursor: 'pointer',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px'
                        }, onClick: startSequence, children: [_jsx("div", { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '40px', background: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 900, color: 'black' }, children: "METRO_PULSE_SET" }), _jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("div", { style: { fontSize: '10rem', opacity: 0.05, fontWeight: 900 }, children: "P" }), _jsx("div", { style: { fontSize: '0.7rem', color: 'var(--accent-cyan)', letterSpacing: '4px' }, children: "ACCESS_GRANTED" })] }), _jsx("div", { className: "scanlines", style: { opacity: 0.1 } })] }), _jsx("div", { style: { marginBottom: '40px' }, children: _jsxs("div", { style: { fontSize: '2rem', fontWeight: 900, color: 'white' }, children: [state.profile.inventory.packs.length, " PACKS"] }) }), state.profile.inventory.packs.length > 0 ? (_jsx("p", { style: { color: 'var(--accent-cyan)', fontSize: '0.7rem', letterSpacing: '2px', animation: 'pulse 2s infinite' }, children: "INITIALIZE SYNC PROTOCOL" })) : (_jsx("button", { className: "neo-button", onClick: () => setScene('APARTMENT'), children: "RETURN TO HUB" }))] })) : (_jsxs("div", { style: { textAlign: 'center', width: '100%', maxWidth: '500px', zIndex: 10 }, children: [currentIndex >= 0 && (_jsx("div", { className: "card-reveal-area", style: { perspective: '2000px' }, children: _jsx(RevealCard, { cardId: revealedCards[currentIndex], onNext: nextCard }) })), _jsx("div", { style: { marginTop: '80px', display: 'flex', justifyContent: 'center', gap: '8px' }, children: revealedCards.map((_, i) => (_jsx("div", { style: {
                                width: '60px',
                                height: '4px',
                                background: i === currentIndex ? 'var(--accent-cyan)' : (i < currentIndex ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'),
                                boxShadow: i === currentIndex ? '0 0 15px var(--accent-cyan)' : 'none',
                                transition: '0.6s'
                            } }, i))) })] })), _jsx("style", { children: `
          .floating { animation: float 4s ease-in-out infinite; }
          @keyframes float {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              50% { transform: translateY(-30px) rotate(2deg); }
          }
          @keyframes pulse {
              0%, 100% { opacity: 0.5; }
              50% { opacity: 1; }
          }
      ` })] }));
};
const RevealCard = ({ cardId, onNext }) => {
    const card = getCardById(cardId);
    const [isRevealed, setIsRevealed] = useState(false);
    useEffect(() => {
        setIsRevealed(false);
        const timer = setTimeout(() => setIsRevealed(true), 150);
        return () => clearTimeout(timer);
    }, [cardId]);
    if (!card)
        return null;
    const rarityColor = {
        common: '#fff',
        uncommon: 'var(--accent-cyan)',
        rare: 'var(--accent-yellow)'
    }[card.rarity];
    return (_jsxs("div", { onClick: onNext, className: `card-inner ${isRevealed ? 'revealed' : ''}`, style: {
            width: '280px',
            height: '420px',
            margin: '0 auto',
            position: 'relative',
            cursor: 'pointer',
            transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transformStyle: 'preserve-3d',
            transform: isRevealed ? 'rotateY(0deg)' : 'rotateY(180deg)'
        }, children: [_jsxs("div", { className: "glass-panel", style: {
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
                }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }, children: [_jsx("span", { style: { fontWeight: 'bold', fontSize: '1.2rem', color: rarityColor }, children: card.name }), _jsxs("span", { style: { color: 'var(--accent-yellow)', fontWeight: 'bold' }, children: [card.cost, "\u26A1"] })] }), _jsxs("div", { style: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }, children: [_jsx("div", { style: { width: '100%', height: '180px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' } }), _jsx("div", { style: { position: 'absolute', fontSize: '3rem', opacity: 0.1 }, children: card.cardType[0].toUpperCase() })] }), _jsx("div", { className: "glass-morphism", style: { fontSize: '0.8rem', padding: '15px', borderRadius: '10px', margin: '20px 0', minHeight: '80px', lineHeight: '1.4' }, children: card.rulesText[0] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }, children: [_jsx("span", { style: { color: rarityColor, fontWeight: 'bold', fontSize: '0.7rem', letterSpacing: '2px' }, children: card.rarity.toUpperCase() }), card.cardType === 'creature' && (_jsxs("div", { style: { fontSize: '1.5rem', fontWeight: 'bold' }, children: [card.attack, _jsx("span", { style: { opacity: 0.3 }, children: "/" }), card.health] }))] })] }), _jsx("div", { style: {
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
                }, children: _jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("div", { style: { fontSize: '4rem', opacity: 0.2 }, children: "?" }), _jsx("div", { style: { fontSize: '0.6rem', letterSpacing: '5px', opacity: 0.3, marginTop: '10px' }, children: "ENCRYPTED" })] }) })] }));
};
