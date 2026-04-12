import React from 'react';
import { VNActionId, VNDialogueBeat } from '../visual-novel/types';
import '../styles/SonsotyoScenes.css';
import '../styles/VNPresentation.css';

export const VNDialogueOverlay: React.FC<{
  beat: VNDialogueBeat;
  typedText: string;
  onAction: (actionId: VNActionId) => void;
  onDismiss: () => void;
}> = ({ beat, typedText, onAction, onDismiss }) => {
  return (
    <div
      className="vn-dialogue-overlay vn-dialogue-overlay--minimal fade-in"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '12px'
      }}
    >
      <div className="vn-dialogue-shell--minimal">
        <div
          className="vn-dialogue-box vn-dialogue-box--minimal"
          onClick={onDismiss}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onDismiss();
          }}
        >
          <span className="vn-ren-name">{beat.speaker}</span>
          <div className="vn-dialogue-text vn-dialogue-text--minimal vn-ren-body" style={{ color: 'var(--text-bright)' }}>
            {typedText}
          </div>
          <span className="vn-dialogue-advance vn-dialogue-advance--minimal vn-ren-cue vn-ren-cue--ready" aria-hidden>
            ▶
          </span>
        </div>

        {beat.choices.length > 0 && (
          <div className="vn-dialogue-actions vn-dialogue-actions--minimal">
            {beat.choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                className={choice.variant === 'secondary' ? 'neo-button' : 'neo-button primary'}
                onClick={() => onAction(choice.id)}
              >
                {choice.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
