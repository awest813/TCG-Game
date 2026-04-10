import React, { useEffect, useMemo, useState } from 'react';
import { useGame } from '../core/GameContext';
import { NewGameConfig } from '../core/types';
import { SystemMenu } from './SystemMenu';
import { audioManager } from '../core/AudioManager';

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
    audioManager.playSFX('career_start');
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
          <div className="main-menu-kicker">Metro Chronicle // Visual Novel Edition</div>
          <h1 className="glow-text main-menu-title">NEO SF</h1>
          <div className="main-menu-subtitle-row">
            <div className="main-menu-rule" />
            <div className="main-menu-subtitle">Champion Circuit Chronicle</div>
          </div>
          <p className="main-menu-description">
            A city of clubs, trains, rivals, and late-night card battles. Step into the frame as a new duelist and let every menu, route, and conversation play like a chapter scene.
          </p>
          <div className="glass-morphism" style={{ marginTop: '1.4rem', padding: '1rem 1.2rem', maxWidth: '34rem' }}>
            <div style={{ fontSize: '0.68rem', letterSpacing: '0.18rem', color: 'var(--accent-yellow)', textTransform: 'uppercase' }}>Opening Voiceover</div>
            <div style={{ marginTop: '0.55rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
              The apartment lights hum. The terminal waits. Somewhere beyond Sunset Terminal, the rest of the city is already moving.
            </div>
          </div>

          <div className="main-menu-actions">
            <button 
              className="champion-button champion-button-primary" 
              onMouseEnter={() => audioManager.playSFX('hover')}
              onClick={() => { audioManager.playSFX('select'); setShowOnboarding(true); }}
            >
              <span className="btn-number">01</span>
              <span className="btn-copy">
                <span className="btn-text">Begin Chapter One</span>
                <span className="btn-caption">Choose your codename, starter partner, and the tone of your first route through the league.</span>
              </span>
            </button>

            <button 
              className="champion-button" 
              onMouseEnter={() => audioManager.playSFX('hover')}
              onClick={() => { audioManager.playSFX('select'); handleContinue(); }} 
              disabled={!hasSaveData}
            >
              <span className="btn-number">02</span>
              <span className="btn-copy">
                <span className="btn-text">Resume Chronicle</span>
                <span className="btn-caption">{hasSaveData ? 'Re-enter your last scene exactly where the thread was left.' : 'No local save detected yet.'}</span>
              </span>
            </button>

            <button 
              className="champion-button champion-button-ghost" 
              onMouseEnter={() => audioManager.playSFX('hover')}
              onClick={() => { audioManager.playSFX('menu_open'); setShowSettings(true); }}
            >
              <span className="btn-number">03</span>
              <span className="btn-copy">
                <span className="btn-text">Presentation</span>
                <span className="btn-caption">Adjust framing, sync preferences, and system behavior before the scene begins.</span>
              </span>
            </button>

            <button 
              className="champion-button champion-button-ghost" 
              onMouseEnter={() => audioManager.playSFX('hover')}
              onClick={() => { audioManager.playSFX('panel_toggle'); setShowAbout((value) => !value); }}
            >
              <span className="btn-number">04</span>
              <span className="btn-copy">
                <span className="btn-text">{showAbout ? 'Hide Dossier' : 'Open Dossier'}</span>
                <span className="btn-caption">Preview the premise, the opening pace, and the shape of the career arc.</span>
              </span>
            </button>
          </div>

          <div className={`main-menu-status ${statusMessage ? 'visible' : ''}`} aria-live="polite">
            {statusMessage ?? ' '}
          </div>
        </section>

        <aside className="main-menu-panel glass-panel">
          <div className="menu-panel-eyebrow">Scene Companion</div>
          <div className="menu-panel-metric">
            <span>Story State</span>
            <strong>{hasSaveData ? 'SYNC READY' : 'FRESH START'}</strong>
          </div>
          <div className="menu-panel-metric">
            <span>Opening Chapter</span>
            <strong>Apartment / Terminal / First Route</strong>
          </div>
          <div className="menu-panel-metric">
            <span>Shortcut Console</span>
            <strong>Press `</strong>
          </div>
          <div className="menu-panel-metric">
            <span>Presentation Layer</span>
            <strong>VN FRAME ACTIVE</strong>
          </div>

          {showAbout && (
            <div className="menu-about-card">
              <h2>What Changed</h2>
              <p>The project now enters through a more theatrical visual-novel presentation instead of a flat utility menu.</p>
              <p>New careers begin with a chapter setup, guided onboarding, and a stronger sense of scene framing before combat and systems open up.</p>
            </div>
          )}

          <div className="main-menu-footer">
            <div className="glass-morphism build-chip">{buildLabel}</div>
            <div className="menu-footer-note">This build leans into framing, scene presence, and dialogue-forward presentation while keeping the card game core intact.</div>
          </div>
        </aside>
      </div>

      {showOnboarding && (
        <div className="system-overlay fade-in" onClick={() => setShowOnboarding(false)}>
          <div className="glass-panel onboarding-panel" onClick={(event) => event.stopPropagation()}>
            <div className="onboarding-header">
              <div>
                <div className="system-menu-kicker">New Career Setup</div>
                <h2 className="glow-text system-menu-title">Cast The Lead</h2>
              </div>
              <button onClick={() => { audioManager.playSFX('menu_close'); setShowOnboarding(false); }} className="system-menu-close" aria-label="Close new game setup">
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
                  <div className="system-setting-note">Rivals, route banners, and chapter overlays will use this name from the first scene onward.</div>
                </div>

                <div className="system-setting-card">
                  <div className="setting-label">Starter Sync Style</div>
                  <div className="starter-grid">
                    {STARTER_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        className={`starter-card ${starter === option.id ? 'active' : ''}`}
                        onMouseEnter={() => audioManager.playSFX('hover_soft')}
                        onClick={() => { audioManager.playSFX('starter_select'); setStarter(option.id); }}
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
                  <p>You will begin in your apartment with {selectedStarter.partner} as your lead partner, a starter deck tuned for {selectedStarter.id.toLowerCase()} play, and a tutorial sequence that now reads like the opening act of a visual novel route.</p>
                  <div className="onboarding-steps">
                    <div>1. Review your deck and your scene objective.</div>
                    <div>2. Move from the apartment into your first district route.</div>
                    <div>3. Learn the battle rhythm with a starter that matches your preferred pacing.</div>
                  </div>
                </div>

                <button className="champion-button champion-button-primary compact" onClick={handleCreateCareer} style={{ color: 'black' }}>
                  ENTER THE CITY
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
