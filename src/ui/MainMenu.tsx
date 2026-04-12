import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useGame } from '../core/GameContext';
import { hasAutosave } from '../core/gameStatePersistence';
import { NewGameConfig } from '../core/types';
import { SystemMenu } from './SystemMenu';
import { audioManager } from '../core/AudioManager';
import { SonsotyoDiagnosticRow, SonsotyoHeroCard, SonsotyoKicker, SonsotyoPanel, SonsotyoPill, SonsotyoTitle } from './SonsotyoUI';
import '../styles/SonsotyoScenes.css';

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
      setStatusMessage('Career loaded — you are back in your last scene.');
      setHasSaveData(hasAutosave());
      return;
    }
    setStatusMessage('No autosave found. Try New game, or Recovery if you use numbered slots.');
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
      className="main-menu-scene sonsotyo-scene fade-in"
      style={{
        height: '100%',
        padding: '24px',
        paddingBottom: 'max(28px, env(safe-area-inset-bottom, 0px))',
        background:
          'linear-gradient(180deg, rgba(8,10,18,0.78), rgba(4,6,10,0.92)), radial-gradient(circle at 14% 18%, rgba(126,242,255,0.14), transparent 22%), url(/sunset_terminal_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="sonsotyo-overlay" />
      <div className="sonsotyo-content main-menu-content" style={{ display: 'flex', flexDirection: 'column', gap: '22px', minHeight: '100%' }}>
        <div className="sonsotyo-hero">
          <SonsotyoHeroCard>
            <SonsotyoKicker>Main menu · Sonsotyo</SonsotyoKicker>
            <SonsotyoTitle style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', marginTop: '10px' }}>
              Sleep Future
              <br />
              Duel Signal
            </SonsotyoTitle>
            <p className="sonsotyo-copy" style={{ maxWidth: '50ch', marginTop: '14px' }}>
              Neon card duels, a handheld circuit ladder, and a city that wakes after midnight. Start a guided apartment run,
              jump back into your autosave, or tune the presentation before you head into the district.
            </p>
            <div className="sonsotyo-meta-strip">
              <SonsotyoPill>{hasSaveData ? 'Autosave found' : 'No autosave yet'}</SonsotyoPill>
              <SonsotyoPill>Sound + voice on</SonsotyoPill>
              <SonsotyoPill>Dev console: ` key</SonsotyoPill>
            </div>
          </SonsotyoHeroCard>

          <SonsotyoPanel className="main-menu-status-panel">
            <SonsotyoKicker>Circuit status</SonsotyoKicker>
            <div className="main-menu-status-title" style={{ marginTop: '12px', fontFamily: 'var(--font-display)', fontSize: '1.45rem', lineHeight: 1.35 }}>
              {statusMessage ?? (hasSaveData ? 'Ready to continue your last session.' : 'Pick New game to register, or Continue if a save exists.')}
            </div>
            <div className="sonsotyo-copy" style={{ marginTop: '12px', lineHeight: 1.55 }}>
              Recovery opens numbered save slots. Deck edits your loadout from title without starting a new career.
            </div>
            <div className="main-menu-status-grid">
              <div className="main-menu-status-chip">
                <span className="main-menu-status-label">Route</span>
                <strong>{hasSaveData ? 'Resume live run' : 'Fresh registration'}</strong>
              </div>
              <div className="main-menu-status-chip">
                <span className="main-menu-status-label">Focus</span>
                <strong>{hasSaveData ? 'Continue and calibrate' : 'Choose starter and learn'}</strong>
              </div>
            </div>
          </SonsotyoPanel>
        </div>

        <div className="main-menu-body">
          <div className="sonsotyo-grid menu">
            <MenuNode
              label="New game"
              sub="Name + starter · tutorial"
              detail="Guided apartment opener with Lucy, transit onboarding, and your first district route."
              primary
              onClick={() => setShowOnboarding(true)}
              icon="S-01"
            />
            <MenuNode
              label="Continue"
              sub="Autosave slot"
              detail={hasSaveData ? 'Resume from your last live scene and keep current objectives intact.' : 'Unlocks once the game has written an autosave.'}
              disabled={!hasSaveData}
              onClick={handleContinue}
              icon="S-02"
            />
            <MenuNode
              label="Profile"
              sub="Stats & collection"
              detail="Review duelist progress, inventory, and broader circuit history."
              onClick={() => updateGameState({ profileReturn: 'MAIN_MENU', currentScene: 'PROFILE' })}
              icon="S-03"
            />
            <MenuNode
              label="Deck"
              sub="Edit from title"
              detail="Tune your build before loading into the city or stepping into a tournament."
              onClick={() => updateGameState({ deckEditorReturn: 'MAIN_MENU', currentScene: 'DECK_EDITOR' })}
              icon="S-04"
            />
            <MenuNode
              label="Settings"
              sub="Audio · display"
              detail="Adjust mix, presentation tier, fullscreen, and quick system actions."
              onClick={() => setShowSettings(true)}
              icon="S-05"
            />
            <MenuNode
              label="Recovery"
              sub="3 save slots"
              detail="Browse manual slots if you need to recover outside the active autosave."
              onClick={() => setScene('SAVE_LOAD')}
              icon="S-06"
            />
          </div>

          <div className="sonsotyo-side-stack">
            {!hasSaveData && (
              <SonsotyoPanel className="main-menu-path-panel">
                <SonsotyoKicker>First session path</SonsotyoKicker>
                <ol className="main-menu-path-list">
                  <li>New game — choose callsign and partner deck style.</li>
                  <li>Apartment — Lucy&apos;s briefing (VN). Click the glowing terminal to peek at cards.</li>
                  <li>Transit — pick Sunset Terminal, then explore the district.</li>
                  <li>Card Annex — free beginner bracket, then shop ladders for your club license.</li>
                </ol>
              </SonsotyoPanel>
            )}

            <SonsotyoPanel>
              <SonsotyoKicker>Starters at a glance</SonsotyoKicker>
              <div style={{ marginTop: '12px', fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--text-secondary)' }}>
                Chosen when you open New game — same three on the next panel.
              </div>
              <div style={{ marginTop: '14px', display: 'grid', gap: '10px' }}>
                {STARTER_OPTIONS.map((option) => (
                  <SonsotyoDiagnosticRow
                    key={option.id}
                    label={option.title}
                    value={option.partner}
                    valueStyle={{ color: starter === option.id ? 'var(--accent-secondary)' : 'var(--accent-primary)' }}
                  />
                ))}
              </div>
            </SonsotyoPanel>

            <SonsotyoPanel style={{ marginTop: 'auto' }}>
              <SonsotyoKicker>Tip</SonsotyoKicker>
              <p className="sonsotyo-copy" style={{ marginTop: '12px', lineHeight: 1.55 }}>
                The left rail in most scenes shows your current objective. After the annex, major tournaments unlock from district gates.
              </p>
            </SonsotyoPanel>
          </div>
        </div>
      </div>

      {showOnboarding && (
        <div className="system-overlay fade-in" onClick={() => setShowOnboarding(false)} role="presentation">
          <form
            className="glass-panel sonsotyo-modal main-menu-onboarding-modal"
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
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'flex-start', marginBottom: '22px', flexWrap: 'wrap' }}>
              <div>
                <SonsotyoKicker>New game · 3 steps</SonsotyoKicker>
                <h2 id="main-menu-onboarding-title" className="sonsotyo-title" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', marginTop: '8px' }}>
                  Register your duelist
                </h2>
                <p
                  id="main-menu-onboarding-desc"
                  className="sonsotyo-caption"
                  style={{ marginTop: '10px', textTransform: 'none', letterSpacing: '0.04em' }}
                >
                  Escape or backdrop closes this window. You begin in the apartment (morning) with Lucy&apos;s briefing, then Transit and the district.
                </p>
              </div>
              <button type="button" onClick={() => setShowOnboarding(false)} className="neo-button">
                Cancel
              </button>
            </div>

            <div className="sonsotyo-starter-grid">
              <div>
                <div className="main-menu-step-badge">1</div>
                <SonsotyoKicker style={{ marginBottom: '10px' }}>Display name</SonsotyoKicker>
                <input
                  ref={nameInputRef}
                  className="glass-panel main-menu-name-input"
                  value={playerName}
                  maxLength={24}
                  autoComplete="username"
                  aria-label="Duelist display name"
                  aria-invalid={!canSubmitCareer}
                  onChange={(event) => setPlayerName(event.target.value.slice(0, 24))}
                  onBlur={() => setPlayerName((v) => v.trim().replace(/\s+/g, ' '))}
                  placeholder="e.g. Neo Rookie"
                  style={{ width: '100%', padding: '16px 18px', color: 'var(--text-bright)', background: 'rgba(8,10,20,0.48)', borderRadius: '18px', fontSize: '1rem' }}
                />
                <div className="sonsotyo-caption" style={{ marginTop: '8px', textTransform: 'none' }}>
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
                      className={`neo-button ${starter === option.id ? 'primary' : ''}`}
                      onClick={() => setStarter(option.id)}
                      style={{ justifyContent: 'space-between' }}
                      aria-pressed={starter === option.id}
                    >
                      <span>{option.title}</span>
                      <span style={{ opacity: 0.72 }}>{option.partner}</span>
                    </button>
                  ))}
                </div>
              </div>

              <SonsotyoPanel style={{ background: 'rgba(8,10,20,0.45)' }}>
                <div className="main-menu-step-badge">3</div>
                <SonsotyoKicker style={{ marginTop: '8px' }}>Review & begin</SonsotyoKicker>
                <div style={{ marginTop: '12px', fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--text-secondary)' }}>
                  Pilot <span style={{ color: 'var(--accent-secondary)' }}>{normalizedName || '—'}</span>
                </div>
                <div style={{ marginTop: '10px', fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--accent-primary)' }}>
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
                <button
                  type="submit"
                  className="neo-button primary"
                  disabled={!canSubmitCareer}
                  style={{ marginTop: '22px', width: '100%' }}
                >
                  Begin at apartment
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

const MenuNode: React.FC<{
  label: string;
  sub: string;
  detail: string;
  icon: string;
  primary?: boolean;
  disabled?: boolean;
  onClick: () => void;
}> = ({ label, sub, detail, icon, primary, disabled, onClick }) => (
  <button
    disabled={disabled}
    onClick={() => {
      audioManager.playSFX('select');
      onClick();
    }}
    className={`neo-button sonsotyo-menu-node ${primary ? 'primary' : ''}`}
    style={{ opacity: disabled ? 0.3 : 1 }}
  >
    <div className="sonsotyo-menu-node-topline">
      <div className="sonsotyo-menu-icon">{icon}</div>
      <div className="sonsotyo-menu-arrow" aria-hidden="true">
        {disabled ? 'LOCK' : 'OPEN'}
      </div>
    </div>
    <div className="sonsotyo-menu-copy">
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>{label}</div>
      <SonsotyoKicker style={{ marginTop: '8px' }}>{sub}</SonsotyoKicker>
      <div className="sonsotyo-copy sonsotyo-menu-detail">{detail}</div>
    </div>
  </button>
);
