import React, { useState } from 'react';
import { useGame } from '../core/GameContext';

export const SystemMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { saveGame, setScene } = useGame();

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

        <div className="system-menu-feedback" aria-live="polite">
          {feedback ?? 'Press ESC or click outside the panel to close.'}
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
