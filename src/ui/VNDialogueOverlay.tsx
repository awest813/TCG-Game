import React from 'react';
import { VNActionId, VNDialogueBeat } from '../visual-novel/types';

export const VNDialogueOverlay: React.FC<{
  beat: VNDialogueBeat;
  typedText: string;
  onAction: (actionId: VNActionId) => void;
  onDismiss: () => void;
}> = ({ beat, typedText, onAction, onDismiss }) => {
  return (
    <div
      className="dialogue-overlay fade-in"
      style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', backdropFilter: 'blur(10px)' }}
    >
      <div style={{ position: 'relative', width: '100%', maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '26px' }}>
        <div className="vn-dialogue-shell">
          <div className="vn-dialogue-portrait">
            <div className="vn-dialogue-portrait-label">Active Speaker</div>
            <div className="vn-dialogue-portrait-name">{beat.speaker}</div>
            <div style={{ marginTop: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{beat.role}</div>
            <div style={{ marginTop: '1rem', fontSize: '0.72rem', letterSpacing: '0.16rem', textTransform: 'uppercase', color: 'var(--accent-yellow)' }}>
              {beat.timeOfDay} // {beat.mood}
            </div>
          </div>

          <div className="vn-dialogue-box" onClick={onDismiss}>
            <div className="vn-dialogue-name-tag" style={{ background: beat.accentColor }}>
              {beat.speaker.toUpperCase()} // {beat.role.toUpperCase()}
            </div>
            <div className="vn-dialogue-text" style={{ color: 'var(--text-bright)' }}>{typedText}</div>
            <div style={{ position: 'absolute', right: 30, bottom: 20, fontSize: '0.72rem', color: 'var(--accent-yellow)', letterSpacing: '0.16rem', animation: 'pulse 1s infinite' }}>
              CLICK TO ADVANCE
            </div>
          </div>
        </div>

        <div className="vn-dialogue-actions">
          {beat.choices.map((choice) => (
            <button
              key={choice.id}
              className={choice.variant === 'secondary' ? 'neo-button' : 'neo-button primary'}
              style={{ width: choice.id === 'DUEL' ? '250px' : '180px' }}
              onClick={() => onAction(choice.id)}
            >
              {choice.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
