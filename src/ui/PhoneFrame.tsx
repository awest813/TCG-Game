import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div className="phone-ui-container">
      <div className="phone-shell crt-flicker">
        {/* Hardware Status Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', padding: '0 20px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div className="screw" />
            <div className="screw" />
          </div>
          
          <div className="glass-panel" style={{ padding: '6px 20px', borderRadius: '99px', display: 'flex', gap: '30px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
               {[1,2,3,4,5].map(i => <div key={i} style={{ width: '4px', height: `${6 + i*2}px`, background: i < 4 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', borderRadius: '1px' }} />)}
            </div>
            <div className="tech-label" style={{ color: 'var(--accent-secondary)', fontWeight: 800 }}>CORE_STABLE // 98%_PWR</div>
            <div className="tech-label" style={{ opacity: 0.6 }}>NEO_OS_v9.0.2</div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <div className="screw" />
            <div className="screw" />
          </div>
        </div>

        {/* The Main Screen */}
        <div className="phone-screen">
          <div className="scanlines" />
          <div className="bg-mesh" />
          <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 10 }}>
            {children}
          </div>
        </div>

        {/* Hardware Footer */}
        <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'center', gap: '50px', alignItems: 'center' }}>
            <div className="glass-panel" style={{ width: '140px', height: '10px', borderRadius: '5px' }} />
            <div style={{ width: '14px', height: '14px', background: 'var(--accent-primary)', borderRadius: '99px', boxShadow: '0 0 15px var(--accent-primary)', border: '2px solid rgba(255,255,255,0.4)' }} />
            <div className="glass-panel" style={{ width: '140px', height: '10px', borderRadius: '5px' }} />
        </div>

        {/* Physical Button Overlays (Visual Only) */}
        <div style={{ position: 'absolute', right: '-14px', top: '120px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
           <div style={{ width: '14px', height: '60px', background: '#3a3a45', borderRadius: '0 4px 4px 0', border: '1px solid rgba(255,255,255,0.1)' }} />
           <div style={{ width: '14px', height: '80px', background: '#3a3a45', borderRadius: '0 4px 4px 0', border: '1px solid rgba(255,255,255,0.1)' }} />
        </div>
      </div>
    </div>
  );
};
