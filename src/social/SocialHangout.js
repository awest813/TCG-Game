import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useGame } from '../core/GameStateContext';
export const SocialHangout = () => {
    const { state, setScene, updateProfile } = useGame();
    const [step, setStep] = useState(0);
    const dialogue = [
        { speaker: "KAIZEN", text: "Hey! Glad you could make it to the terminal overlook. The view is insane during the pink sunset.", avatar: "/avatar_kaizen.png" },
        { speaker: "PLAYER", text: "Yeah, it's pretty impressive. Most people are too busy dueling to notice.", avatar: "/avatar_player.png" },
        { speaker: "KAIZEN", text: "That's why I like it here. It reminds me why we do this. It's not just about the win, it's about the culture of the city.", avatar: "/avatar_kaizen.png" },
        { speaker: "KAIZEN", text: "Anyway, I wanted to give you this. It's a prototype card I've been working on. Think of it as a sign of our rivalry.", avatar: "/avatar_kaizen.png" }
    ];
    const handleNext = () => {
        if (step < dialogue.length - 1) {
            setStep(step + 1);
        }
        else {
            updateProfile({
                inventory: Object.assign(Object.assign({}, state.profile.inventory), { cards: [...state.profile.inventory.cards, "overclock"] })
            });
            setScene('DISTRICT_EXPLORE');
        }
    };
    const current = dialogue[step];
    const isPlayer = current.speaker === "PLAYER";
    return (_jsxs("div", { className: "social-scene fade-in", style: {
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'url("/sunset_terminal_bg.png") center/cover',
            justifyContent: 'flex-end',
            padding: '80px',
            overflow: 'hidden',
            position: 'relative'
        }, children: [_jsx("div", { style: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 0 } }), _jsx("img", { src: current.avatar, alt: current.speaker, style: {
                    position: 'absolute',
                    bottom: '0',
                    [isPlayer ? 'right' : 'left']: '100px',
                    height: '110%',
                    zIndex: 1,
                    opacity: 0.9,
                    animation: isPlayer ? 'slideInRight 0.5s ease-out' : 'slideInLeft 0.5s ease-out',
                    transform: isPlayer ? 'scaleX(-1)' : 'none'
                } }, current.speaker), _jsxs("div", { className: "glass-panel", style: {
                    padding: '60px',
                    borderRadius: '4px',
                    borderLeft: `15px solid ${isPlayer ? 'var(--accent-cyan)' : 'var(--accent-magenta)'}`,
                    background: 'rgba(5,5,15,0.95)',
                    boxShadow: '0 0 50px rgba(0,0,0,0.8)',
                    zIndex: 10,
                    position: 'relative'
                }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }, children: [_jsx("h3", { className: "glow-text", style: { color: isPlayer ? 'var(--accent-cyan)' : 'var(--accent-magenta)', fontSize: '2.5rem', margin: 0, fontWeight: 900, letterSpacing: '4px' }, children: current.speaker }), _jsx("div", { className: "glass-morphism", style: { padding: '5px 20px', color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '3px' }, children: "SOCIAL LINK RELAY" })] }), _jsxs("p", { style: { fontSize: '2rem', lineHeight: '1.5', minHeight: '120px', color: 'white', fontStyle: 'italic', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }, children: ["\"", current.text, "\""] }), _jsx("div", { style: { display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }, children: _jsx("button", { className: "champion-button", style: {
                                borderColor: isPlayer ? 'var(--accent-cyan)' : 'var(--accent-magenta)',
                                padding: '15px 60px'
                            }, onClick: handleNext, children: step === dialogue.length - 1 ? "FINALIZE HANGOUT" : "NEXT" }) })] }), _jsx("style", { children: `
          @keyframes slideInLeft {
              from { transform: translateX(-200px); opacity: 0; }
              to { transform: translateX(0); opacity: 0.9; }
          }
          @keyframes slideInRight {
              from { transform: translateX(200px) scaleX(-1); opacity: 0; }
              to { transform: translateX(0) scaleX(-1); opacity: 0.9; }
          }
      ` })] }));
};
