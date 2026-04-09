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
      <div style={{ width: 'min(1180px, calc(100vw - 48px))', marginBottom: '22px', position: 'relative', pointerEvents: 'auto' }}>
        <div
          className="glass-panel"
          style={{
            minHeight: '270px',
            display: 'grid',
            gridTemplateColumns: '320px minmax(0, 1fr)',
            gap: '26px',
            padding: '22px 26px 22px 22px',
            background: 'linear-gradient(180deg, rgba(8,12,24,0.94), rgba(10,8,18,0.94))',
            border: '1px solid rgba(255,255,255,0.12)',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'end', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: '18px 24px 0', borderRadius: '24px', background: 'radial-gradient(circle at 50% 20%, rgba(121,247,255,0.22), transparent 36%), linear-gradient(180deg, rgba(255,255,255,0.06), transparent)' }} />
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

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', letterSpacing: '0.24rem' }}>{subtitle}</div>
              <h2 style={{ marginTop: '10px', fontSize: '2rem', fontWeight: 800 }}>{title}</h2>
              <div style={{ marginTop: '14px', fontSize: '1rem', lineHeight: 1.65, color: 'var(--text-secondary)', maxWidth: '780px' }}>{message}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--accent-yellow)', letterSpacing: '0.18rem', marginBottom: '10px' }}>CURRENT OBJECTIVE</div>
              <div style={{ fontSize: '1.02rem', fontWeight: 700 }}>{objective}</div>

              <div style={{ marginTop: '18px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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
