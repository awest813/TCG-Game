import React, { useEffect, useMemo, useState } from 'react';
import { useGame } from '../core/GameStateContext';
import { NewGameConfig } from '../core/types';
import { SystemMenu } from './SystemMenu';

const STARTER_OPTIONS: Array<{
  id: NewGameConfig['starter'];
  title: string;
  partner: string;
  summary: string;
  bullets: string[];
}> = [
  {
    id: 'Pulse',
    title: 'Pulse Rush',
    partner: 'Ziprail',
    summary: 'Fast starts, direct pressure, and easy-to-read aggressive turns.',
    bullets: ['Best for players who want clean early attacks', 'Learns tempo through direct damage and buffs', 'Starts with Metro Pulse packs']
  },
  {
    id: 'Bloom',
    title: 'Bloom Sustain',
    partner: 'Mosshop',
    summary: 'Healing, survivability, and forgiving board states for learning.',
    bullets: ['Best for slower, steadier play', 'Makes mistakes less punishing with healing', 'Starts with Garden Shift support']
  },
  {
    id: 'Tide',
    title: 'Tide Control',
    partner: 'Wharfin',
    summary: 'Draw tools, flexible responses, and more tactical pacing.',
    bullets: ['Best for players who like setup and decisions', 'Teaches resource flow and board control', 'Starts with Bayline-flavored utility']
  }
];

export const MainMenu: React.FC = () => {
  const { loadGame, resetGame } = useGame();
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [hasSaveData, setHasSaveData] = useState(false);
  const [playerName, setPlayerName] = useState('Neo Rookie');
  const [starter, setStarter] = useState<NewGameConfig['starter']>('Pulse');

  const buildLabel = useMemo(() => 'BUILD v2.2.0 ALPHA', []);
  const selectedStarter = STARTER_OPTIONS.find((option) => option.id === starter)!;

  useEffect(() => {
    setHasSaveData(Boolean(localStorage.getItem('neo_sf_save')));
  }, []);

  useEffect(() => {
    if (!statusMessage) return undefined;
    const timeout = window.setTimeout(() => setStatusMessage(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [statusMessage]);

  const handleContinue = () => {
    if (loadGame()) {
      setStatusMessage('Link restored. Resuming your last session.');
      setHasSaveData(true);
      return;
    }

    setStatusMessage('No synced save found yet. Start a new career to create one.');
    setHasSaveData(false);
  };

  const handleCreateCareer = () => {
    resetGame({
      name: playerName.trim() || 'Neo Rookie',
      starter
    });
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
            <button className="champion-button champion-button-primary" onClick={() => setShowOnboarding(true)}>
              <span className="btn-number">01</span>
              <span className="btn-copy">
                <span className="btn-text">NEW CAREER</span>
                <span className="btn-caption">Choose your codename, starter partner, and your first route into the league.</span>
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
                <span className="btn-caption">Preview the game pitch and what a first session looks like.</span>
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
            <span>First Session</span>
            <strong>Deck Setup / Apartment Intro</strong>
          </div>
          <div className="menu-panel-metric">
            <span>Debug Console</span>
            <strong>Press `</strong>
          </div>

          {showAbout && (
            <div className="menu-about-card">
              <h2>New Player Flow</h2>
              <p>New careers now begin with a guided setup instead of dropping straight into the apartment with no context.</p>
              <p>You pick a codename, choose a starter style, and get a clear expectation for the first few minutes of play.</p>
            </div>
          )}

          <div className="main-menu-footer">
            <div className="glass-morphism build-chip">{buildLabel}</div>
            <div className="menu-footer-note">New Career opens a guided setup with starter recommendations and a cleaner first landing.</div>
          </div>
        </aside>
      </div>

      {showOnboarding && (
        <div className="system-overlay fade-in" onClick={() => setShowOnboarding(false)}>
          <div className="glass-panel onboarding-panel" onClick={(event) => event.stopPropagation()}>
            <div className="onboarding-header">
              <div>
                <div className="system-menu-kicker">New Career Setup</div>
                <h2 className="glow-text system-menu-title">START CLEAN</h2>
              </div>
              <button onClick={() => setShowOnboarding(false)} className="system-menu-close" aria-label="Close new game setup">
                X
              </button>
            </div>

            <div className="onboarding-grid">
              <section className="onboarding-primary">
                <div className="system-setting-card">
                  <div className="setting-label">CALLSIGN</div>
                  <input
                    value={playerName}
                    onChange={(event) => setPlayerName(event.target.value)}
                    placeholder="Enter your player name"
                    className="onboarding-input"
                  />
                  <div className="system-setting-note">This is how rivals and menus will refer to you at the start of the career.</div>
                </div>

                <div className="system-setting-card">
                  <div className="setting-label">STARTER SYNC STYLE</div>
                  <div className="starter-grid">
                    {STARTER_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        className={`starter-card ${starter === option.id ? 'active' : ''}`}
                        onClick={() => setStarter(option.id)}
                      >
                        <div className="starter-card-header">
                          <div>
                            <div className="starter-card-eyebrow">{option.partner}</div>
                            <div className="starter-card-title">{option.title}</div>
                          </div>
                          <div className="starter-card-badge">{option.id}</div>
                        </div>
                        <div className="starter-card-summary">{option.summary}</div>
                        <div className="starter-card-bullets">
                          {option.bullets.map((bullet) => (
                            <div key={bullet}>{bullet}</div>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <aside className="onboarding-side">
                <div className="system-setting-card onboarding-brief">
                  <div className="setting-label">FIRST SESSION PREVIEW</div>
                  <h3>{selectedStarter.title}</h3>
                  <p>You will begin in your apartment with {selectedStarter.partner} as your lead partner, a starter deck tuned for {selectedStarter.id.toLowerCase()} play, and a tutorial quest that points you toward your first useful action.</p>
                  <div className="onboarding-steps">
                    <div>1. Review your deck and starter plan.</div>
                    <div>2. Move from the apartment into your first district route.</div>
                    <div>3. Learn the battle rhythm with a deck that matches your chosen style.</div>
                  </div>
                </div>

                <button className="champion-button champion-button-primary compact" onClick={handleCreateCareer} style={{ color: 'black' }}>
                  CREATE CAREER
                </button>
              </aside>
            </div>
          </div>
        </div>
      )}

      {showSettings && <SystemMenu onClose={() => setShowSettings(false)} />}
    </div>
  );
};
