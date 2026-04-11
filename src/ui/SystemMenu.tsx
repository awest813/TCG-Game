import React, { useState } from 'react';
import { useGame } from '../core/GameContext';

export const SystemMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { saveGame, setScene, state, updateGameState } = useGame();

  const [volume, setVolume] = useState(80);
  const [animSpeed, setAnimSpeed] = useState('NORMAL');
  const [screenShake, setScreenShake] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message;
    return 'Unknown error';
  };

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen().catch((error: unknown) => {
        setFeedback(`Fullscreen failed: ${getErrorMessage(error)}`);
      });
      return;
    }

    if (document.exitFullscreen) {
      void document.exitFullscreen();
    }
  };

  const handleSave = () => {
    saveGame();
    setFeedback('Circuit data synced to local storage.');
  };

  const handleQuit = () => {
    setScene('MAIN_MENU');
    onClose();
  };

  return (
    <div className="system-overlay fade-in" onClick={onClose}>
      <div className="glass-panel system-menu-panel" onClick={(event) => event.stopPropagation()}>
        <div className="system-menu-version">v2.1.0 SYSTEM_CONFIG</div>

        <div className="system-menu-header">
          <div>
            <div className="system-menu-kicker">Operations</div>
            <h2 className="glow-text system-menu-title">OPTIONS</h2>
          </div>
          <button onClick={onClose} className="system-menu-close" aria-label="Close settings">
            X
          </button>
        </div>

        <div className="system-menu-grid">
          <div className="system-setting-card">
            <div className="setting-label">MASTER VOLUME <span className="setting-value">{volume}%</span></div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value, 10))}
              className="neo-slider"
            />
          </div>

          <div className="system-setting-card">
            <div className="setting-label">COMBAT FLOW</div>
            <div className="setting-toggle-row">
              {['NORMAL', 'TURBO'].map((speed) => (
                <button key={speed} onClick={() => setAnimSpeed(speed)} className={`opt-btn ${animSpeed === speed ? 'active' : ''}`}>
                  {speed}
                </button>
              ))}
            </div>
          </div>

          <div className="system-setting-card">
            <div className="setting-label">DISPLAY MODE</div>
            <button className="neo-button" onClick={handleFullscreen} style={{ width: '100%', fontSize: '0.8rem' }}>
              TOGGLE FULLSCREEN
            </button>
          </div>

          <div className="system-setting-card">
            <div className="setting-label">SCREEN SHAKE</div>
            <button onClick={() => setScreenShake(!screenShake)} className={`opt-btn ${screenShake ? 'active' : ''}`}>
              {screenShake ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          <div className="system-setting-card" style={{ gridColumn: 'span 2' }}>
            <div className="setting-label">PRESENTATION SYNC</div>
            <div className="setting-toggle-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {(['LOW', 'MEDIUM', 'HIGH', 'ULTRA'] as const).map((t) => (
                <button 
                  key={t} 
                  onClick={() => updateGameState({ visuals: { presentationTier: t } })} 
                  className={`opt-btn ${state.visuals.presentationTier === t ? 'active' : ''}`}
                  style={{ fontSize: '0.65rem' }}
                >
                  {t}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', marginTop: '10px', letterSpacing: '0.05rem' }}>
              {state.visuals.presentationTier === 'LOW' && 'CORE_STABLE // MINIMAL_POST_PROCESSING'}
              {state.visuals.presentationTier === 'MEDIUM' && 'BALANCED_SYNC // GLOW_ACTIVE'}
              {state.visuals.presentationTier === 'HIGH' && 'HIGH_FIDELITY // BLOOM_PARTICLES_SYNC'}
              {state.visuals.presentationTier === 'ULTRA' && 'PEAK_ATMOSPHERE // MAXIMUM_SERIALIZATION'}
            </div>
          </div>

          <div className="system-setting-card">
            <div className="setting-label">AUTO-SYNC</div>
            <button onClick={() => setAutoSave(!autoSave)} className={`opt-btn ${autoSave ? 'active' : ''}`}>
              {autoSave ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          <div className="system-setting-card">
            <div className="setting-label">CARD BACK STYLE</div>
            <div className="system-setting-note">DEFAULT_HEX // MODS_LOCKED</div>
          </div>
        </div>

        <div className="system-menu-feedback" aria-live="polite" style={{ marginTop: '20px', color: 'var(--accent-yellow)', fontSize: '0.75rem', fontWeight: 700 }}>
          {feedback ?? 'STATUS_READY // READY_FOR_SYNC'}
        </div>

        <div className="system-menu-actions">
          <button className="champion-button champion-button-primary compact" onClick={handleSave}>
            SYNC DATA
          </button>
          <button className="champion-button compact" onClick={handleQuit}>
            RETURN TO MENU
          </button>
        </div>
      </div>
    </div>
  );
};
