import React, { useEffect, useMemo, useState } from 'react';
import { useGame } from '../core/GameContext';
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

  const selectedStarter = useMemo(() => STARTER_OPTIONS.find((option) => option.id === starter)!, [starter]);

  useEffect(() => {
    setHasSaveData(Boolean(localStorage.getItem('neo_sf_save')));
    audioManager.playSFX('phone_boot');
  }, []);

  const handleContinue = () => {
    if (loadGame()) {
      setStatusMessage('LINK_SUCCESS: SESSION_RESTORED.');
      setHasSaveData(true);
      return;
    }
    setStatusMessage('SYNC_ERROR: NO_DOCK_FOUND.');
  };

  const handleCreateCareer = () => {
    audioManager.playSFX('career_start');
    resetGame({
      name: playerName.trim() || 'Neo Rookie',
      starter
    });
  };

  return (
    <div
      className="main-menu-scene sonsotyo-scene fade-in"
      style={{
        height: '100%',
        padding: '24px',
        background:
          'linear-gradient(180deg, rgba(8,10,18,0.78), rgba(4,6,10,0.92)), radial-gradient(circle at 14% 18%, rgba(126,242,255,0.14), transparent 22%), url(/sunset_terminal_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="sonsotyo-overlay" />
      <div className="sonsotyo-content" style={{ display: 'flex', flexDirection: 'column', gap: '22px', height: '100%' }}>
        <div className="sonsotyo-hero">
          <SonsotyoHeroCard>
            <SonsotyoKicker>Sonsotyo Main Concourse</SonsotyoKicker>
            <SonsotyoTitle style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', marginTop: '10px' }}>
              Sleep Future
              <br />
              Duel Signal
            </SonsotyoTitle>
            <p className="sonsotyo-copy" style={{ maxWidth: '48ch', marginTop: '14px' }}>
              Drift into a city of glowing rails, after-hours arenas, and partner bonds that feel half memory, half machine dream.
            </p>
            <div className="sonsotyo-meta-strip">
              <SonsotyoPill>Live Network Active</SonsotyoPill>
              <SonsotyoPill>Terminal 104-SFX</SonsotyoPill>
              <SonsotyoPill>{hasSaveData ? 'Registered Link' : 'Guest Link'}</SonsotyoPill>
            </div>
          </SonsotyoHeroCard>

          <SonsotyoPanel>
            <SonsotyoKicker>Signal Readout</SonsotyoKicker>
            <div style={{ marginTop: '12px', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
              {statusMessage ?? 'Await init: system standby.'}
            </div>
            <div className="sonsotyo-copy" style={{ marginTop: '12px' }}>
              Your local device is tuned for one more long neon night.
            </div>
            <div style={{ marginTop: '22px' }}>
              <SonsotyoDiagnosticRow label="Sync Strength" value="94%" />
              <SonsotyoDiagnosticRow label="Area" value="Sunset Hub" />
              <SonsotyoDiagnosticRow label="Resonance" value="Stable" />
              <div className="sonsotyo-progress">
                <span style={{ width: '94%' }} />
              </div>
            </div>
          </SonsotyoPanel>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '22px', flex: 1, minHeight: 0 }}>
          <div className="sonsotyo-grid menu">
            <MenuNode label="New Start" sub="Init Recruit" primary onClick={() => setShowOnboarding(true)} icon="S-01" />
            <MenuNode label="Continue" sub="Restore Link" disabled={!hasSaveData} onClick={handleContinue} icon="S-02" />
            <MenuNode label="Archive" sub="Data Gallery" onClick={() => updateGameState({ profileReturn: 'MAIN_MENU', currentScene: 'PROFILE' })} icon="S-03" />
            <MenuNode label="Loadout" sub="Sync Cards" onClick={() => updateGameState({ deckEditorReturn: 'MAIN_MENU', currentScene: 'DECK_EDITOR' })} icon="S-04" />
            <MenuNode label="System" sub="Gear Sync" onClick={() => setShowSettings(true)} icon="S-05" />
            <MenuNode label="Recovery" sub="Backup Mng" onClick={() => setScene('SAVE_LOAD')} icon="S-06" />
          </div>

          <div className="sonsotyo-side-stack">
            <SonsotyoPanel>
              <SonsotyoKicker>Dream Profile</SonsotyoKicker>
              <div style={{ marginTop: '12px', fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>Starter Vector</div>
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
              <SonsotyoKicker>Scene Promise</SonsotyoKicker>
              <div style={{ marginTop: '12px', fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>Tokyo-after-bedtime energy.</div>
              <p className="sonsotyo-copy" style={{ marginTop: '12px' }}>
                Clean geometry, glass haze, and rivalry heat. The whole UI now reads like a handheld anime future instead of a debug terminal.
              </p>
            </SonsotyoPanel>
          </div>
        </div>
      </div>

      {showOnboarding && (
        <div className="system-overlay fade-in" style={{ padding: '24px' }} onClick={() => setShowOnboarding(false)}>
          <div className="glass-panel sonsotyo-modal" onClick={(event) => event.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'flex-start', marginBottom: '30px' }}>
              <div>
                <SonsotyoKicker>Registration Protocol</SonsotyoKicker>
                <h2 className="sonsotyo-title" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', marginTop: '8px' }}>Create Duelist ID</h2>
              </div>
              <button onClick={() => setShowOnboarding(false)} className="neo-button">Close</button>
            </div>

            <div className="sonsotyo-starter-grid">
              <div>
                <SonsotyoKicker style={{ marginBottom: '10px' }}>Callsign Assignment</SonsotyoKicker>
                <input
                  className="glass-panel"
                  value={playerName}
                  onChange={(event) => setPlayerName(event.target.value)}
                  style={{ width: '100%', padding: '16px 18px', color: 'var(--text-bright)', background: 'rgba(8,10,20,0.48)', borderRadius: '18px', fontSize: '1rem' }}
                />
                <SonsotyoKicker style={{ marginTop: '26px', marginBottom: '12px' }}>Partner Loadout Sync</SonsotyoKicker>
                <div className="sonsotyo-option-list">
                  {STARTER_OPTIONS.map((option) => (
                    <button key={option.id} className={`neo-button ${starter === option.id ? 'primary' : ''}`} onClick={() => setStarter(option.id)} style={{ justifyContent: 'space-between' }}>
                      <span>{option.title}</span>
                      <span style={{ opacity: 0.72 }}>{option.id.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>

              <SonsotyoPanel style={{ background: 'rgba(8,10,20,0.45)' }}>
                <SonsotyoKicker>Selected Partner</SonsotyoKicker>
                <div style={{ marginTop: '10px', fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--accent-primary)' }}>
                  {selectedStarter.partner}
                </div>
                <p className="sonsotyo-copy" style={{ marginTop: '14px' }}>{selectedStarter.summary}</p>
                <div style={{ marginTop: '20px', display: 'grid', gap: '10px' }}>
                  {selectedStarter.bullets.map((bullet) => (
                    <SonsotyoDiagnosticRow key={bullet} label={bullet} value="Ready" />
                  ))}
                </div>
                <button className="neo-button primary" onClick={handleCreateCareer} style={{ marginTop: '28px', width: '100%' }}>
                  Initialize Sync Cycle
                </button>
              </SonsotyoPanel>
            </div>
          </div>
        </div>
      )}

      {showSettings && <SystemMenu onClose={() => setShowSettings(false)} />}
    </div>
  );
};

const MenuNode: React.FC<{ label: string; sub: string; icon: string; primary?: boolean; disabled?: boolean; onClick: () => void }> = ({ label, sub, icon, primary, disabled, onClick }) => (
  <button
    disabled={disabled}
    onClick={() => {
      audioManager.playSFX('select');
      onClick();
    }}
    className={`neo-button sonsotyo-menu-node ${primary ? 'primary' : ''}`}
    style={{ opacity: disabled ? 0.3 : 1 }}
  >
    <div className="sonsotyo-menu-icon">{icon}</div>
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>{label}</div>
      <SonsotyoKicker style={{ marginTop: '8px' }}>{sub}</SonsotyoKicker>
    </div>
  </button>
);
