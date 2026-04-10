import React from 'react';

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
}> = ({ title, subtitle, message, objective, actions }) => {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'end', justifyContent: 'center', pointerEvents: 'none', zIndex: 140 }}>
      <div className="tutorial-guide-shell">
        <div
          className="glass-panel tutorial-guide-panel"
        >
          <div className="tutorial-guide-portrait">
            <img
              src="/lucy_tutorial.png"
              alt="Lucy tutorial guide"
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
