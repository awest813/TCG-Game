import React, { useState } from 'react';
import { useGame } from '../core/GameStateContext';

export const SystemMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { state, saveGame, updateGameState, setScene } = useGame();
  
  const [volume, setVolume] = useState(80);
  const [animSpeed, setAnimSpeed] = useState('NORMAL');
  const [screenShake, setScreenShake] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const handleFullscreen = () => {
      if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(e => {
              alert(`Error attempting to enable fullscreen mode: ${e.message}`);
          });
      } else {
          if (document.exitFullscreen) {
              document.exitFullscreen();
          }
      }
  };

  const handleSave = () => {
      saveGame();
      alert("Circuit Data Synced to Local Storage.");
  };

  const handleQuit = () => {
      if (confirm("Disconnecting will lose unsaved progress. Confirm?")) {
          setScene('MAIN_MENU');
          onClose();
      }
  };

  return (
    <div className="system-overlay fade-in" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 5, 15, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(20px)'
    }}>
      <div className="glass-panel" style={{
        width: '650px',
        padding: '60px',
        borderLeft: '10px solid var(--accent-magenta)',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '0.8rem', opacity: 0.3 }}>v2.0.1 SYSTEM_CONFIG</div>
        
        <h2 className="glow-text" style={{ fontSize: '3rem', margin: '0 0 40px 0', letterSpacing: '4px' }}>OPTIONS</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div className="setting-row">
                    <div className="setting-label">MASTER VOLUME <span style={{ color: 'var(--accent-magenta)' }}>{volume}%</span></div>
                    <input 
                        type="range" 
                        min="0" max="100" 
                        value={volume} 
                        onChange={(e) => setVolume(parseInt(e.target.value))}
                        className="neo-slider"
                    />
                </div>

                <div className="setting-row">
                    <div className="setting-label">COMBAT FLOW</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['NORMAL', 'TURBO'].map(speed => (
                            <button key={speed} onClick={() => setAnimSpeed(speed)} className={`opt-btn ${animSpeed === speed ? 'active' : ''}`}>{speed}</button>
                        ))}
                    </div>
                </div>

                <div className="setting-row">
                    <div className="setting-label">DISPLAY MODE</div>
                    <button className="neo-button" onClick={handleFullscreen} style={{ width: '100%', fontSize: '0.8rem' }}>TOGGLE FULLSCREEN</button>
                </div>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div className="setting-row">
                    <div className="setting-label">SCREEN SHAKE (IMPACT)</div>
                    <button onClick={() => setScreenShake(!screenShake)} className={`opt-btn ${screenShake ? 'active' : ''}`}>{screenShake ? 'ENABLED' : 'DISABLED'}</button>
                </div>

                <div className="setting-row">
                    <div className="setting-label">CLOUD AUTO-SYNC</div>
                    <button onClick={() => setAutoSave(!autoSave)} className={`opt-btn ${autoSave ? 'active' : ''}`}>{autoSave ? 'ENABLED' : 'DISABLED'}</button>
                </div>

                <div className="setting-row">
                    <div className="setting-label">CARD BACK STYLE</div>
                    <div style={{ fontSize: '1rem', opacity: 0.5 }}>DEFAULT_HEX // [MODS_LOCKED]</div>
                </div>
            </div>
        </div>

        {/* Global Actions */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '60px' }}>
            <button className="champion-button" style={{ flex: 1, background: 'var(--accent-cyan)', color: 'black' }} onClick={handleSave}>SYNC_DATA</button>
            <button className="champion-button secondary" style={{ flex: 1 }} onClick={handleQuit}>DISCONNECT</button>
        </div>

        <button 
            onClick={onClose}
            style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--accent-magenta)',
                color: 'black',
                border: 'none',
                fontWeight: '900',
                fontSize: '1.5rem',
                cursor: 'pointer'
            }}
        >
            X
        </button>
      </div>

      <style>{`
          .setting-label { font-size: 0.7rem; letter-spacing: 2px; color: var(--text-secondary); margin-bottom: 10px; font-weight: bold; }
          .neo-slider {
              width: 100%;
              -webkit-appearance: none;
              background: rgba(255,255,255,0.1);
              height: 4px;
              outline: none;
          }
          .neo-slider::-webkit-slider-thumb {
              -webkit-appearance: none;
              width: 15px;
              height: 15px;
              background: var(--accent-magenta);
              cursor: pointer;
          }
          .opt-btn {
              width: 100%;
              padding: 10px;
              background: rgba(255,255,255,0.05);
              color: white;
              border: 1px solid rgba(255,255,255,0.1);
              cursor: pointer;
              font-weight: bold;
              font-size: 0.8rem;
              transition: 0.2s;
          }
          .opt-btn.active { background: var(--accent-magenta); color: black; border-color: var(--accent-magenta); }
      `}</style>
    </div>
  );
};
};
