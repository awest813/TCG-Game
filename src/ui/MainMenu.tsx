import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  const { loadGame, resetGame, setScene, updateGameState } = useGame();
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [hasSaveData, setHasSaveData] = useState(false);
  const [playerName, setPlayerName] = useState('Neo Rookie');
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
      setStatusMessage('Session restored — returning to your last scene.');
      setHasSaveData(hasAutosave());
      return;
    }
    setStatusMessage('No autosave on file. Create a new duelist or use Recovery for manual slots.');
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
        padding: '20px',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom, 0px))'
      }}
    >
      <div className="sonsotyo-overlay launcher-overlay" />
      <div className="sonsotyo-content launcher-shell">
        <header className="launcher-header">
          <div className="launcher-brand">
            <span className="launcher-brand-eyebrow">Sonsotyo circuit · client</span>
            <h1 className="launcher-title">Sleep Future</h1>
            <p className="launcher-subtitle">Duel Signal</p>
          </div>
          <div className="launcher-header-meta">
            <div className="launcher-realm-pill" title="Persistent progression on this device">
              <span className="launcher-realm-dot" aria-hidden="true" />
              Realm: Neo Terminal
            </div>
            <span className="launcher-build">Build {CLIENT_BUILD}</span>
          </div>
        </header>

        <div className="launcher-body">
          <section className="launcher-column launcher-column--primary" aria-labelledby="launcher-lede-heading">
            <h2 id="launcher-lede-heading" className="launcher-lede">
              Neon card duels and a handheld circuit ladder. Resume your run or register a new duelist—deck edits and profile
              stay available from this screen without starting over.
            </h2>

            <div className="launcher-session-bar" role="status">
              <div className="launcher-session-label">World status</div>
              <p className="launcher-session-msg">
                {statusMessage ??
                  (hasSaveData
                    ? 'Autosave ready — Enter world to load your last scene and objectives.'
                    : 'No autosave yet — New duelist runs the apartment tutorial, then transit and the district.')}
              </p>
              <dl className="launcher-session-facts">
                <div>
                  <dt>Character</dt>
                  <dd>{hasSaveData ? 'Returning pilot' : 'None registered'}</dd>
                </div>
                <div>
                  <dt>Save data</dt>
                  <dd>{hasSaveData ? 'Local autosave' : '—'}</dd>
                </div>
              </dl>
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
                <span className="launcher-cta-title">Enter world</span>
                <span className="launcher-cta-hint">Load autosave · resume last scene</span>
              </button>
              <button
                type="button"
                className="launcher-cta launcher-cta--new"
                onClick={() => {
                  audioManager.playSFX('select');
                  setShowOnboarding(true);
                }}
              >
                <span className="launcher-cta-title">New duelist</span>
                <span className="launcher-cta-hint">Name · starter · apartment opener</span>
              </button>
            </div>

            <nav className="launcher-nav" aria-label="Title services">
              <LauncherNavRow
                icon="I"
                label="Profile"
                detail="Stats, collection, circuit history"
                onClick={() => updateGameState({ profileReturn: 'MAIN_MENU', currentScene: 'PROFILE' })}
              />
              <LauncherNavRow
                icon="II"
                label="Deck"
                detail="Edit loadout before you ship out"
                onClick={() => updateGameState({ deckEditorReturn: 'MAIN_MENU', currentScene: 'DECK_EDITOR' })}
              />
              <LauncherNavRow
                icon="III"
                label="Recovery"
                detail="Three manual slots + import / export"
                onClick={() => setScene('SAVE_LOAD')}
              />
              <LauncherNavRow
                icon="IV"
                label="Settings"
                detail="Audio, display, fullscreen"
                onClick={() => setShowSettings(true)}
              />
            </nav>
          </section>

          <aside className="launcher-column launcher-column--side">
            {!hasSaveData && (
              <div className="launcher-panel launcher-panel--notice">
                <div className="launcher-panel-head">
                  <span className="launcher-panel-tag">Quest</span>
                  <h3 className="launcher-panel-title">First session</h3>
                </div>
                <ol className="launcher-quest-list">
                  <li>New duelist — callsign and starter style.</li>
                  <li>Apartment — Lucy&apos;s briefing; use the terminal to review cards.</li>
                  <li>Transit — Sunset Terminal, then the district.</li>
                  <li>Card Annex — beginner bracket, then ladders toward your license.</li>
                </ol>
              </div>
            )}

            <div className="launcher-panel">
              <div className="launcher-panel-head">
                <span className="launcher-panel-tag">Classes</span>
                <h3 className="launcher-panel-title">Starter styles</h3>
              </div>
              <p className="launcher-panel-copy">Picked during registration. Same three paths in the character dialog.</p>
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
                <span className="launcher-panel-tag">Tip</span>
                <h3 className="launcher-panel-title">In the city</h3>
              </div>
              <p className="launcher-panel-copy">
                The objective rail in most scenes tracks your current task. After the annex, major tournaments open from district
                gates.
              </p>
            </div>
          </aside>
        </div>

        <footer className="launcher-footer">
          <span>Dev console · grave accent (`) key</span>
          <span className="launcher-footer-sep" aria-hidden="true">
            ·
          </span>
          <span>Sound buses active</span>
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
                <span className="launcher-dialog-eyebrow">Character creation</span>
                <h2 id="main-menu-onboarding-title" className="launcher-dialog-title">
                  Register duelist
                </h2>
                <p id="main-menu-onboarding-desc" className="launcher-dialog-desc">
                  Escape or backdrop closes this panel. You begin in the apartment (morning), then transit and the district.
                </p>
              </div>
              <button type="button" onClick={() => setShowOnboarding(false)} className="launcher-dialog-dismiss">
                Close
              </button>
            </div>

            <div className="sonsotyo-starter-grid">
              <div>
                <div className="main-menu-step-badge">1</div>
                <SonsotyoKicker style={{ marginBottom: '10px' }}>Display name</SonsotyoKicker>
                <input
                  ref={nameInputRef}
                  className="glass-panel main-menu-name-input launcher-name-input"
                  value={playerName}
                  maxLength={24}
                  autoComplete="username"
                  aria-label="Duelist display name"
                  aria-invalid={!canSubmitCareer}
                  onChange={(event) => setPlayerName(event.target.value.slice(0, 24))}
                  onBlur={() => setPlayerName((v) => v.trim().replace(/\s+/g, ' '))}
                  placeholder="Callsign"
                  style={{ width: '100%', padding: '14px 16px', color: 'var(--text-bright)', fontSize: '1rem' }}
                />
                <div className="sonsotyo-caption launcher-input-meta" style={{ marginTop: '8px', textTransform: 'none' }}>
                  {normalizedName.length}/24 · letters, numbers, spaces (trimmed for save)
                </div>
                {!canSubmitCareer && (
                  <div className="sonsotyo-caption main-menu-name-hint" style={{ marginTop: '6px', textTransform: 'none' }}>
                    Add at least one character for your callsign.
                  </div>
                )}

                <div className="main-menu-step-badge" style={{ marginTop: '22px' }}>
                  2
                </div>
                <SonsotyoKicker style={{ marginTop: '8px', marginBottom: '12px' }}>Starter deck style</SonsotyoKicker>
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
                <SonsotyoKicker style={{ marginTop: '8px' }}>Review</SonsotyoKicker>
                <div style={{ marginTop: '12px', fontFamily: 'var(--font-main)', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
                  Pilot <span style={{ color: 'var(--accent-secondary)' }}>{normalizedName || '—'}</span>
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
                  <span className="launcher-cta-title">Begin at apartment</span>
                  <span className="launcher-cta-hint">Tutorial · Lucy · morning</span>
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
  icon: string;
  label: string;
  detail: string;
  onClick: () => void;
}> = ({ icon, label, detail, onClick }) => (
  <button
    type="button"
    className="launcher-nav-row"
    onClick={() => {
      audioManager.playSFX('select');
      onClick();
    }}
  >
    <span className="launcher-nav-idx" aria-hidden="true">
      {icon}
    </span>
    <span className="launcher-nav-text">
      <span className="launcher-nav-label">{label}</span>
      <span className="launcher-nav-detail">{detail}</span>
    </span>
    <span className="launcher-nav-chevron" aria-hidden="true">
      ›
    </span>
  </button>
);
