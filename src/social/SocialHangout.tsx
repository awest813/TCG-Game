import React, { useState } from 'react';
import { useGame } from '../core/GameContext';
import '../styles/SonsotyoScenes.css';

export const SocialHangout: React.FC = () => {
  const { state, setScene, updateProfile } = useGame();
  const [step, setStep] = useState(0);

  const dialogue = [
    { speaker: 'KAIZEN', text: 'Hey! Glad you could make it to the terminal overlook. The view is insane during the pink sunset.', avatar: '/avatar_kaizen.png' },
    { speaker: 'PLAYER', text: "Yeah, it's pretty impressive. Most people are too busy dueling to notice.", avatar: '/avatar_player.png' },
    { speaker: 'KAIZEN', text: "That's why I like it here. It reminds me why we do this. It's not just about the win, it's about the culture of the city.", avatar: '/avatar_kaizen.png' },
    { speaker: 'KAIZEN', text: "Anyway, I wanted to give you this. It's a prototype card I've been working on. Think of it as a sign of our rivalry.", avatar: '/avatar_kaizen.png' }
  ];

  const handleNext = () => {
    if (step < dialogue.length - 1) {
      setStep(step + 1);
      return;
    }

    updateProfile({
      inventory: {
        ...state.profile.inventory,
        cards: [...state.profile.inventory.cards, 'overclock']
      }
    });
    setScene('DISTRICT_EXPLORE');
  };

  const current = dialogue[step];
  const isPlayer = current.speaker === 'PLAYER';

  return (
    <div
      className="social-scene sonsotyo-scene fade-in"
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '42px',
        overflow: 'hidden',
        position: 'relative',
        background: 'url("/sunset_terminal_bg.png") center/cover'
      }}
    >
      <div className="sonsotyo-overlay" />

      <img
        key={current.speaker}
        src={current.avatar}
        alt={current.speaker}
        style={{
          position: 'absolute',
          bottom: '0',
          [isPlayer ? 'right' : 'left']: '70px',
          height: '108%',
          zIndex: 1,
          opacity: 0.92,
          animation: isPlayer ? 'slideInRight 0.5s ease-out' : 'slideInLeft 0.5s ease-out',
          transform: isPlayer ? 'scaleX(-1)' : 'none'
        }}
      />

      <div className="sonsotyo-content" style={{ zIndex: 2 }}>
        <div className="glass-panel" style={{ padding: '34px', borderRadius: '28px', borderLeft: `6px solid ${isPlayer ? 'var(--accent-primary)' : 'var(--accent-secondary)'}`, background: 'rgba(5,7,14,0.9)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap' }}>
            <div>
              <div className="sonsotyo-kicker">Social Link Relay</div>
              <div style={{ marginTop: '8px', fontFamily: 'var(--font-display)', fontSize: '2.1rem', color: isPlayer ? 'var(--accent-primary)' : 'var(--accent-secondary)' }}>
                {current.speaker}
              </div>
            </div>
            <div className="sonsotyo-pill">Step 0{step + 1}</div>
          </div>

          <p style={{ fontSize: 'clamp(1.1rem, 2.3vw, 1.8rem)', lineHeight: 1.6, minHeight: '120px', color: 'white', fontStyle: 'italic', maxWidth: '44ch' }}>
            "{current.text}"
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '26px' }}>
            <button className={`neo-button ${step === dialogue.length - 1 ? 'primary' : ''}`} onClick={handleNext}>
              {step === dialogue.length - 1 ? 'Finalize Hangout' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-200px); opacity: 0; }
          to { transform: translateX(0); opacity: 0.92; }
        }
        @keyframes slideInRight {
          from { transform: translateX(200px) scaleX(-1); opacity: 0; }
          to { transform: translateX(0) scaleX(-1); opacity: 0.92; }
        }
      `}</style>
    </div>
  );
};
