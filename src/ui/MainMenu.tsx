import React, { useEffect, useMemo, useState } from 'react';
import { useGame } from '../core/GameStateContext';
import { SystemMenu } from './SystemMenu';

export const MainMenu: React.FC = () => {
  const { loadGame, resetGame } = useGame();
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [hasSaveData, setHasSaveData] = useState(false);

  const buildLabel = useMemo(() => 'BUILD v2.1.0 ALPHA', []);

  useEffect(() => {
    setHasSaveData(Boolean(localStorage.getItem('neo_sf_save')));
  }, []);

  useEffect(() => {
    if (!statusMessage) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setStatusMessage(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [statusMessage]);

  const handleNewGame = () => {
    resetGame();
  };

  const handleContinue = () => {
    if (loadGame()) {
      setStatusMessage('Link restored. Resuming your last session.');
      setHasSaveData(true);
      return;
    }

    setStatusMessage('No synced save found yet. Start a new career to create one.');
    setHasSaveData(false);
  };

  return (
    <div className="main-menu-scene fade-in">
      <div className="main-menu-backdrop" />
      <img className="main-menu-avatar" src="/avatar_player.png" alt="Protagonist" />

      <div className="main-menu-layout">
        <section className="main-menu-copy">
          <div className="main-menu-kicker">Neo Street League Protocol</div>
          <h1 className="glow-text main-menu-title">NEO SF</h1>
          <div className="main-menu-subtitle-row">
            <div className="main-menu-rule" />
            <div className="main-menu-subtitle">Champion Circuit</div>
          </div>
          <p className="main-menu-description">
            Build your deck, push through district brackets, and climb from apartment scrims to citywide title matches.
          </p>

          <div className="main-menu-actions">
            <button className="champion-button champion-button-primary" onClick={handleNewGame}>
              <span className="btn-number">01</span>
              <span className="btn-copy">
                <span className="btn-text">NEW CAREER</span>
                <span className="btn-caption">Restart from your apartment with a fresh starter list.</span>
              </span>
            </button>

            <button className="champion-button" onClick={handleContinue} disabled={!hasSaveData}>
              <span className="btn-number">02</span>
              <span className="btn-copy">
                <span className="btn-text">CONTINUE LINK</span>
                <span className="btn-caption">{hasSaveData ? 'Resume your last synced run.' : 'No local save detected yet.'}</span>
              </span>
            </button>

            <button className="champion-button champion-button-ghost" onClick={() => setShowSettings(true)}>
              <span className="btn-number">03</span>
              <span className="btn-copy">
                <span className="btn-text">SETTINGS</span>
                <span className="btn-caption">Adjust presentation, controls, and sync preferences.</span>
              </span>
            </button>

            <button className="champion-button champion-button-ghost" onClick={() => setShowAbout((value) => !value)}>
              <span className="btn-number">04</span>
              <span className="btn-copy">
                <span className="btn-text">{showAbout ? 'HIDE DOSSIER' : 'ABOUT'}</span>
                <span className="btn-caption">View the project pitch and current control hints.</span>
              </span>
            </button>
          </div>

          <div className={`main-menu-status ${statusMessage ? 'visible' : ''}`} aria-live="polite">
            {statusMessage ?? ' '}
          </div>
        </section>

        <aside className="main-menu-panel glass-panel">
          <div className="menu-panel-eyebrow">Operator Feed</div>
          <div className="menu-panel-metric">
            <span>Career State</span>
            <strong>{hasSaveData ? 'SYNC READY' : 'FRESH START'}</strong>
          </div>
          <div className="menu-panel-metric">
            <span>Debug Console</span>
            <strong>Press `</strong>
          </div>
          <div className="menu-panel-metric">
            <span>Primary Route</span>
            <strong>Apartment Hub</strong>
          </div>

          {showAbout && (
            <div className="menu-about-card">
              <h2>Champion Circuit</h2>
              <p>
                A stylish single-player TCG RPG where city districts act like hubs, locals become rivals, and each bracket unlocks stronger card pools.
              </p>
              <p>
                Current focus: smoother menu flow, stronger visual hierarchy, and cleaner transition into the playable scenes.
              </p>
            </div>
          )}

          <div className="main-menu-footer">
            <div className="glass-morphism build-chip">{buildLabel}</div>
            <div className="menu-footer-note">Press settings for full-screen, audio, and data actions.</div>
          </div>
        </aside>
      </div>

      {showSettings && <SystemMenu onClose={() => setShowSettings(false)} />}
    </div>
  );
};
