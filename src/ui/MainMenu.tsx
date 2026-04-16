import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GAME_TAGLINE, GAME_TITLE } from '../core/gameBranding';
import { useGame } from '../core/GameContext';
import { hasAutosave } from '../core/gameStatePersistence';
import { NewGameConfig } from '../core/types';
import { SystemMenu } from './SystemMenu';
import { audioManager } from '../core/AudioManager';
import { SonsotyoDiagnosticRow, SonsotyoKicker, SonsotyoPanel } from './SonsotyoUI';
import '../styles/SonsotyoScenes.css';

const CLIENT_BUILD = '0.0.0';

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
    summary: 'Ziprail and friends love a fast start—great if you want to cheer loud and strike first!',
    bullets: ['Friendly for learning big hits early', 'Ziprail is quick on its feet—just like you', 'Opens with Metro Pulse–style energy']
  },
  {
    id: 'Bloom',
    title: 'Bloom Sustain',
    partner: 'Mosshop',
    summary: 'Mosshop keeps spirits high—healing and cozy boards when you want room to breathe.',
    bullets: ['Perfect when you like a steady adventure', 'Forgives little mistakes with a warm heal loop', 'Garden Shift pals tag along']
  },
  {
    id: 'Tide',
    title: 'Tide Control',
    partner: 'Wharfin',
    summary: 'Wharfin flows with the tide—draw a little, think a little, then make the perfect splash.',
    bullets: ['For trainers who love a clever setup', 'Teaches rhythm without the rush', 'Bayline buddies back you up']
  }
];

export const MainMenu: React.FC = () => {
  const { loadGame, resetGame, setScene, updateGameState } = useGame();
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [hasSaveData, setHasSaveData] = useState(false);
  const [playerName, setPlayerName] = useState('New Trainer');
  const [starter, setStarter] = useState<NewGameConfig['starter']>('Pulse');
  const nameInputRef = useRef<HTMLInputElement>(null);

  const selectedStarter = useMemo(() => STARTER_OPTIONS.find((option) => option.id === starter)!, [starter]);
  const normalizedName = useMemo(() => playerName.trim().replace(/\s+/g, ' '), [playerName]);
  const canSubmitCareer = normalizedName.length > 0 && normalizedName.length <= 24;

  useEffect(() => {
    setHasSaveData(hasAutosave());
    audioManager.playSFX('phone_boot');
  }, []);

  useEffect(() => {
    if (!showOnboarding) return undefined;
    nameInputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowOnboarding(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showOnboarding]);

  const handleContinue = () => {
    if (loadGame()) {
      setStatusMessage('Welcome back! Sending you right to where you left off.');
      setHasSaveData(hasAutosave());
      return;
    }
    setStatusMessage('No save yet—tap New Trainer for a fresh start, or Recovery if you brought a backup file.');
  };

  const handleCreateCareer = () => {
    if (!canSubmitCareer) return;
    audioManager.playSFX('career_start');
    resetGame({
      name: normalizedName,
      starter
    });
  };

  return (
    <div
      className="main-menu-scene launcher-scene sonsotyo-scene sonsotyo-scene--bounded fade-in"
      style={{
        height: '100%',
        padding: '14px',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom, 0px))'
      }}
    >
      <div className="sonsotyo-overlay launcher-overlay" />
      <div className="sonsotyo-content launcher-shell">
        <header className="launcher-header">
          <div className="launcher-brand">
            <span className="launcher-brand-eyebrow">Official league client</span>
            <h1 className="launcher-title launcher-title--official">{GAME_TITLE}</h1>
            <p className="launcher-subtitle">{GAME_TAGLINE}</p>
          </div>
          <div className="launcher-header-meta">
            <div className="launcher-realm-pill" title="Your adventure saves on this device">
              <span className="launcher-realm-dot" aria-hidden="true" />
              Your league link
            </div>
            <span className="launcher-build">{CLIENT_BUILD}</span>
          </div>
        </header>

        <div className={`launcher-body${hasSaveData ? ' launcher-body--solo' : ''}`}>
          <section className="launcher-column launcher-column--primary" aria-labelledby="launcher-lede-heading">
            <h2 id="launcher-lede-heading" className="launcher-lede">
              Pick up your story anytime—your deck and Trainer profile are always a tap away, just like your favorite handheld
              classics.
            </h2>

            <div className="launcher-session-bar" role="status">
              <p className="launcher-session-msg">
                {statusMessage ??
                  (hasSaveData
                    ? 'We found your save—Enter world hops you back into the action!'
                    : 'No save yet—New Trainer kicks off with Lucy in your apartment, then the city opens up!')}
              </p>
            </div>

            <div className="launcher-primary-actions">
              <button
                type="button"
                className="launcher-cta launcher-cta--world"
                disabled={!hasSaveData}
                onClick={() => {
                  audioManager.playSFX('select');
                  handleContinue();
                }}
              >
                <span className="launcher-cta-title">Continue adventure</span>
                <span className="launcher-cta-hint">Jump back in</span>
              </button>
              <button
                type="button"
                className="launcher-cta launcher-cta--new"
                onClick={() => {
                  audioManager.playSFX('select');
                  setShowOnboarding(true);
                }}
              >
                <span className="launcher-cta-title">New Trainer</span>
                <span className="launcher-cta-hint">Name & partner deck</span>
              </button>
            </div>

            <nav className="launcher-nav" aria-label="Title services">
              <LauncherNavRow label="Trainer profile" detail="Your story & stats" onClick={() => updateGameState({ profileReturn: 'MAIN_MENU', currentScene: 'PROFILE' })} />
              <LauncherNavRow label="Deck box" detail="Tune your partners" onClick={() => updateGameState({ deckEditorReturn: 'MAIN_MENU', currentScene: 'DECK_EDITOR' })} />
              <LauncherNavRow label="Save corner" detail="Backups & import" onClick={() => setScene('SAVE_LOAD')} />
              <LauncherNavRow label="Options" detail="Sound & screen" onClick={() => setShowSettings(true)} />
            </nav>
          </section>

          {!hasSaveData && (
            <aside className="launcher-column launcher-column--side">
              <div className="launcher-panel launcher-panel--notice">
                <div className="launcher-panel-head">
                  <span className="launcher-panel-tag">Starter</span>
                  <h3 className="launcher-panel-title">Your first league day</h3>
                </div>
                <ol className="launcher-quest-list">
                  <li>Pick a Trainer name and a starter deck vibe you love.</li>
                  <li>Meet Lucy at home—she&apos;ll show you the card terminal.</li>
                  <li>Ride transit to Sunset Terminal, then explore the district.</li>
                  <li>Visit the Card Annex for a warm-up bracket on the way to your license.</li>
                </ol>
              </div>

            <div className="launcher-panel">
              <div className="launcher-panel-head">
                <span className="launcher-panel-tag">Partners</span>
                <h3 className="launcher-panel-title">Starter decks</h3>
              </div>
              <p className="launcher-panel-copy">You&apos;ll choose one in a moment—each path has a signature partner waiting for you.</p>
              <div className="launcher-starter-rows">
                {STARTER_OPTIONS.map((option) => (
                  <SonsotyoDiagnosticRow
                    key={option.id}
                    label={option.title}
                    value={option.partner}
                    valueStyle={{ color: starter === option.id ? 'var(--accent-secondary)' : 'rgba(200, 210, 230, 0.85)' }}
                  />
                ))}
              </div>
            </div>

            <div className="launcher-panel launcher-panel--muted">
              <div className="launcher-panel-head">
                <span className="launcher-panel-tag">Hint</span>
                <h3 className="launcher-panel-title">Around town</h3>
              </div>
              <p className="launcher-panel-copy">Keep an eye on the little quest line at the top—it cheers you toward the next big moment. Big stadium events open once you clear the annex.</p>
            </div>
            </aside>
          )}
        </div>

        <footer className="launcher-footer">
          <span className="launcher-footer-hint">` — debug</span>
        </footer>
      </div>

      {showOnboarding && (
        <div className="system-overlay fade-in launcher-system-overlay" onClick={() => setShowOnboarding(false)} role="presentation">
          <form
            className="glass-panel sonsotyo-modal main-menu-onboarding-modal launcher-dialog"
            onClick={(event) => event.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault();
              handleCreateCareer();
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="main-menu-onboarding-title"
            aria-describedby="main-menu-onboarding-desc"
          >
            <div className="launcher-dialog-head">
              <div>
                <span className="launcher-dialog-eyebrow">Let&apos;s meet you</span>
                <h2 id="main-menu-onboarding-title" className="launcher-dialog-title">
                  Create your Trainer
                </h2>
                <p id="main-menu-onboarding-desc" className="launcher-dialog-desc">
                  Press Escape or tap outside to close. We&apos;ll drop you in a sunny morning at your apartment—Lucy can&apos;t wait to say hi—then it&apos;s off to the city!
                </p>
              </div>
              <button type="button" onClick={() => setShowOnboarding(false)} className="launcher-dialog-dismiss">
                Close
              </button>
            </div>

            <div className="sonsotyo-starter-grid">
              <div>
                <div className="main-menu-step-badge">1</div>
                <SonsotyoKicker style={{ marginBottom: '10px' }}>Trainer name</SonsotyoKicker>
                <input
                  ref={nameInputRef}
                  className="glass-panel main-menu-name-input launcher-name-input"
                  value={playerName}
                  maxLength={24}
                  autoComplete="username"
                  aria-label="Trainer display name"
                  aria-invalid={!canSubmitCareer}
                  onChange={(event) => setPlayerName(event.target.value.slice(0, 24))}
                  onBlur={() => setPlayerName((v) => v.trim().replace(/\s+/g, ' '))}
                  placeholder="Your Trainer name"
                  style={{ width: '100%', padding: '14px 16px', color: 'var(--text-bright)', fontSize: '1rem' }}
                />
                <div className="sonsotyo-caption launcher-input-meta" style={{ marginTop: '8px', textTransform: 'none' }}>
                  {normalizedName.length}/24 letters · we&apos;ll tidy extra spaces for you
                </div>
                {!canSubmitCareer && (
                  <div className="sonsotyo-caption main-menu-name-hint" style={{ marginTop: '6px', textTransform: 'none' }}>
                    Type at least one letter or number so friends can shout your name!
                  </div>
                )}

                <div className="main-menu-step-badge" style={{ marginTop: '22px' }}>
                  2
                </div>
                <SonsotyoKicker style={{ marginTop: '8px', marginBottom: '12px' }}>Pick your first partner vibe</SonsotyoKicker>
                <div className="sonsotyo-option-list" role="group" aria-label="Starter style">
                  {STARTER_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`launcher-style-pick ${starter === option.id ? 'is-selected' : ''}`}
                      onClick={() => setStarter(option.id)}
                      style={{ justifyContent: 'space-between' }}
                      aria-pressed={starter === option.id}
                    >
                      <span>{option.title}</span>
                      <span className="launcher-style-pick-partner">{option.partner}</span>
                    </button>
                  ))}
                </div>
              </div>

              <SonsotyoPanel className="launcher-review-panel">
                <div className="main-menu-step-badge">3</div>
                <SonsotyoKicker style={{ marginTop: '8px' }}>All set?</SonsotyoKicker>
                <div style={{ marginTop: '12px', fontFamily: 'var(--font-main)', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
                  Trainer <span style={{ color: 'var(--accent-secondary)' }}>{normalizedName || '—'}</span>
                </div>
                <div
                  style={{
                    marginTop: '10px',
                    fontFamily: 'var(--font-launcher)',
                    fontSize: '1.5rem',
                    color: 'rgba(220, 200, 150, 0.95)'
                  }}
                >
                  {selectedStarter.title} · {selectedStarter.partner}
                </div>
                <p className="sonsotyo-copy" style={{ marginTop: '14px', lineHeight: 1.55 }}>
                  {selectedStarter.summary}
                </p>
                <ul className="main-menu-starter-bullets">
                  {selectedStarter.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <button type="submit" className="launcher-cta launcher-cta--confirm" disabled={!canSubmitCareer}>
                  <span className="launcher-cta-title">Start my adventure!</span>
                  <span className="launcher-cta-hint">Apartment · Lucy · sunny morning</span>
                </button>
              </SonsotyoPanel>
            </div>
          </form>
        </div>
      )}

      {showSettings && <SystemMenu onClose={() => setShowSettings(false)} />}
    </div>
  );
};

const LauncherNavRow: React.FC<{
  label: string;
  detail: string;
  onClick: () => void;
}> = ({ label, detail, onClick }) => (
  <button
    type="button"
    className="launcher-nav-row"
    onClick={() => {
      audioManager.playSFX('select');
      onClick();
    }}
  >
    <span className="launcher-nav-text">
      <span className="launcher-nav-label">{label}</span>
      <span className="launcher-nav-detail">{detail}</span>
    </span>
    <span className="launcher-nav-chevron" aria-hidden="true">
      ›
    </span>
  </button>
);
