import React from 'react';
import '../styles/SonsotyoScenes.css';

type TutorialAction = {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
};

export const TutorialGuide: React.FC<{
  title: string;
  subtitle: string;
  message: string;
  objective: string;
  actions: TutorialAction[];
  portraitSrc?: string;
  portraitAlt?: string;
  /** Dim the scene behind the panel; optional click-through to parent via onBackdropClick */
  dimBackdrop?: boolean;
  onBackdropClick?: () => void;
  /** Stack above dense HUD (e.g. tournament); keep below System menu (~600). */
  overlayZIndex?: number;
}> = ({
  title,
  subtitle,
  message,
  objective,
  actions,
  portraitSrc = '/bust_lucy.svg',
  portraitAlt = 'Lucy — circuit guide',
  dimBackdrop = false,
  onBackdropClick,
  overlayZIndex = 140
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'end',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: overlayZIndex
      }}
    >
      {dimBackdrop &&
        (onBackdropClick ? (
          <button
            type="button"
            aria-label="Dismiss overlay backdrop"
            onClick={onBackdropClick}
            style={{
              position: 'absolute',
              inset: 0,
              border: 'none',
              cursor: 'pointer',
              pointerEvents: 'auto',
              zIndex: 0,
              background: 'linear-gradient(180deg, rgba(2,4,12,0.55), rgba(4,6,14,0.72))'
            }}
          />
        ) : (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 0,
              background: 'linear-gradient(180deg, rgba(2,4,12,0.4), rgba(4,6,14,0.55))'
            }}
          />
        ))}
      <div className="tutorial-guide-shell" style={{ pointerEvents: 'auto', position: 'relative', zIndex: 1 }}>
        <div
          className="glass-panel tutorial-guide-panel"
        >
          <div className="tutorial-guide-portrait">
            <img
              src={portraitSrc}
              alt={portraitAlt}
              style={{
                position: 'relative',
                zIndex: 1,
                maxHeight: '340px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 24px 44px rgba(0,0,0,0.45))'
              }}
            />
          </div>

          <div className="tutorial-guide-content">
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', letterSpacing: '0.24rem' }}>{subtitle}</div>
              <h2 style={{ marginTop: '10px', fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{title}</h2>
              <div className="tutorial-guide-message">{message}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--accent-yellow)', letterSpacing: '0.18rem', marginBottom: '10px' }}>CURRENT OBJECTIVE</div>
              <div className="tutorial-guide-objective">{objective}</div>

              <div className="tutorial-guide-actions">
                {actions.map((action) => (
                  <button
                    key={action.label}
                    className={action.variant === 'secondary' ? 'neo-button' : 'neo-button primary'}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
