import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useGame } from '../core/GameStateContext';
import { CARD_POOL, getCardById, getCardPalette } from '../data/cards';
export const PackOpening = () => {
    const { state, updateProfile, setScene } = useGame();
    const [revealedCards, setRevealedCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [packStatus, setPackStatus] = useState('IDLE');
    const startSequence = () => {
        if (state.profile.inventory.packs.length === 0)
            return;
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
        const newCards = [];
        for (let i = 0; i < 5; i += 1) {
            const rollout = Math.random();
            let pool = CARD_POOL.filter((card) => card.rarity === 'common');
            if (rollout > 0.95)
                pool = CARD_POOL.filter((card) => card.rarity === 'rare');
            else if (rollout > 0.8)
                pool = CARD_POOL.filter((card) => card.rarity === 'uncommon');
            const nextCard = pool[Math.floor(Math.random() * pool.length)];
            newCards.push(nextCard.id);
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
            setCurrentIndex((value) => value + 1);
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
            background: 'radial-gradient(circle at 50% 30%, rgba(121,247,255,0.16), transparent 22%), linear-gradient(180deg, #020611 0%, #09040f 100%)',
            position: 'relative',
            overflow: 'hidden'
        }, children: [_jsx("div", { className: "scanlines" }), packStatus === 'BURST' && _jsx("div", { className: "energy-beam" }), packStatus !== 'REVEAL' ? (_jsxs("div", { className: "glass-panel", style: { textAlign: 'center', padding: '54px', borderRadius: '36px', zIndex: 10, background: 'rgba(8,12,24,0.84)', minWidth: '440px' }, children: [_jsx("div", { style: { fontSize: '0.72rem', letterSpacing: '0.34rem', opacity: 0.6 }, children: "DATA DECRYPTION MODE" }), _jsxs("div", { className: packStatus === 'IDLE' ? 'pack-shell-float' : packStatus === 'BURST' ? 'pack-burst' : 'shred-anim', style: {
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
                        }, onClick: startSequence, children: [_jsx("div", { className: "scanlines", style: { opacity: 0.14 } }), _jsx("div", { style: { position: 'absolute', inset: '14px', borderRadius: '18px', border: '1px solid rgba(121,247,255,0.14)' } }), _jsx("div", { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '54px', background: 'linear-gradient(90deg, var(--accent-cyan), #d9ffff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, color: 'black', letterSpacing: '0.16rem' }, children: "METRO PULSE SET" }), _jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("div", { style: { fontSize: '8rem', opacity: 0.08, fontWeight: 900 }, children: "P" }), _jsx("div", { style: { fontSize: '0.72rem', color: 'var(--accent-cyan)', letterSpacing: '0.28rem' }, children: "ACCESS GRANTED" })] })] }), _jsxs("div", { style: { fontSize: '2rem', fontWeight: 900 }, children: [state.profile.inventory.packs.length, " PACKS"] }), _jsx("div", { style: { marginTop: '12px', color: 'var(--text-secondary)' }, children: "Tap the sealed pack to rupture the sync layer." }), _jsx("div", { style: { marginTop: '26px' }, children: state.profile.inventory.packs.length > 0 ? (_jsx("span", { style: { color: 'var(--accent-cyan)', fontSize: '0.74rem', letterSpacing: '0.2rem', animation: 'packPulse 2s infinite' }, children: "INITIALIZE SYNC PROTOCOL" })) : (_jsx("button", { className: "neo-button", onClick: () => setScene('APARTMENT'), children: "RETURN TO HUB" })) })] })) : (_jsxs("div", { style: { textAlign: 'center', width: '100%', maxWidth: '980px', zIndex: 10 }, children: [currentIndex >= 0 && _jsx(RevealCard, { cardId: revealedCards[currentIndex], onNext: nextCard, index: currentIndex + 1, total: revealedCards.length }), _jsx("div", { style: { marginTop: '42px', display: 'flex', justifyContent: 'center', gap: '10px' }, children: revealedCards.map((_, index) => (_jsx("div", { style: { width: '74px', height: '5px', background: index === currentIndex ? 'var(--accent-cyan)' : index < currentIndex ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.05)', boxShadow: index === currentIndex ? '0 0 16px var(--accent-cyan)' : 'none', transition: '0.4s ease' } }, index))) })] })), _jsx("style", { children: `
        .pack-shell-float { animation: packFloat 4s ease-in-out infinite; }
        @keyframes packFloat {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-18px) rotate(1deg); }
        }
        @keyframes packPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      ` })] }));
};
const RevealCard = ({ cardId, onNext, index, total }) => {
    var _a, _b, _c, _d, _e;
    const card = getCardById(cardId);
    const [isRevealed, setIsRevealed] = useState(false);
    useEffect(() => {
        setIsRevealed(false);
        const timer = window.setTimeout(() => setIsRevealed(true), 120);
        return () => window.clearTimeout(timer);
    }, [cardId]);
    if (!card)
        return null;
    const palette = getCardPalette(card);
    return (_jsxs("div", { style: { display: 'grid', gridTemplateColumns: '340px 1fr', gap: '26px', alignItems: 'center' }, children: [_jsxs("div", { onClick: onNext, style: {
                    width: '320px',
                    height: '460px',
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
                            border: `2px solid ${palette.accent}`,
                            borderRadius: '28px',
                            padding: '22px',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: `0 0 50px ${palette.glow}`,
                            background: `${palette.panel}, linear-gradient(180deg, ${palette.rarityFinish}, transparent 72%)`
                        }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'start' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.58rem', color: palette.accent, letterSpacing: '0.18rem' }, children: card.cardType.toUpperCase() }), _jsx("div", { style: { marginTop: '8px', fontWeight: 800, fontSize: '1.35rem' }, children: card.name })] }), _jsx("div", { style: { color: 'var(--accent-yellow)', fontWeight: 800 }, children: card.cost })] }), _jsxs("div", { style: { flex: 1, marginTop: '18px', marginBottom: '18px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }, children: [_jsx("div", { style: { width: '120px', height: '120px', background: palette.glow, borderRadius: '999px', filter: 'blur(18px)' } }), _jsx("div", { style: { position: 'absolute', bottom: '14px', fontSize: '0.62rem', letterSpacing: '0.18rem', color: palette.accent }, children: (_a = card.set) !== null && _a !== void 0 ? _a : 'CORE SET' })] }), _jsx("div", { style: { fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--text-secondary)', minHeight: '88px' }, children: ((_b = card.rulesText) !== null && _b !== void 0 ? _b : ['No effect text loaded.']).join(' ') }), _jsxs("div", { style: { marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }, children: [_jsx("div", { style: { color: palette.accent, fontWeight: 700, letterSpacing: '0.16rem', fontSize: '0.66rem' }, children: card.rarity.toUpperCase() }), _jsx("div", { style: { fontSize: '1.4rem', fontWeight: 800 }, children: card.cardType === 'creature' ? `${(_c = card.attack) !== null && _c !== void 0 ? _c : '-'} / ${(_d = card.health) !== null && _d !== void 0 ? _d : '-'}` : 'TACTIC' })] })] }), _jsx("div", { style: {
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
                        }, children: _jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("div", { style: { fontSize: '4rem', opacity: 0.18 }, children: "?" }), _jsx("div", { style: { fontSize: '0.62rem', letterSpacing: '0.24rem', opacity: 0.34, marginTop: '10px' }, children: "ENCRYPTED" })] }) })] }), _jsxs("div", { className: "glass-panel", style: { padding: '24px', background: 'rgba(8,12,24,0.8)', textAlign: 'left' }, children: [_jsxs("div", { style: { fontSize: '0.68rem', color: 'var(--text-secondary)', letterSpacing: '0.22rem' }, children: ["REVEAL ", index, " / ", total] }), _jsx("div", { style: { marginTop: '10px', fontSize: '2.1rem', fontWeight: 800 }, children: card.name.toUpperCase() }), _jsxs("div", { style: { marginTop: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap' }, children: [_jsx(Tag, { label: card.cardType.toUpperCase(), accent: palette.accent }), card.creatureType && _jsx(Tag, { label: card.creatureType.toUpperCase(), accent: "var(--accent-yellow)" }), _jsx(Tag, { label: card.rarity.toUpperCase(), accent: "var(--text-primary)" })] }), _jsx("div", { style: { marginTop: '18px', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }, children: ((_e = card.rulesText) !== null && _e !== void 0 ? _e : ['No effect text loaded.']).join(' ') }), _jsx("button", { className: "neo-button primary", onClick: onNext, style: { marginTop: '22px' }, children: index < total ? 'REVEAL NEXT CARD' : 'RETURN TO HUB' })] })] }));
};
const Tag = ({ label, accent }) => (_jsx("div", { style: { padding: '4px 10px', borderRadius: '999px', border: `1px solid ${accent}`, color: accent, fontSize: '0.62rem', letterSpacing: '0.14rem' }, children: label }));
