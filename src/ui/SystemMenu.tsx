import React, { useState } from 'react';
import { audioManager } from '../core/AudioManager';
import { useGame } from '../core/GameContext';
import '../styles/SonsotyoScenes.css';

export const SystemMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { saveGame, setScene, state, updateGameState } = useGame();
  const [volume, setVolume] = useState(() => audioManager.getMasterVolumePercent());
  const [musicVol, setMusicVol] = useState(() => audioManager.getBusVolumePercent('music'));
  const [sfxVol, setSfxVol] = useState(() => audioManager.getBusVolumePercent('sfx'));
  const [voiceVol, setVoiceVol] = useState(() => audioManager.getBusVolumePercent('voice'));
  const [audioMuted, setAudioMuted] = useState(() => audioManager.getSnapshot().isMuted);
  const [animSpeed, setAnimSpeed] = useState('NORMAL');
  const [screenShake, setScreenShake] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : 'Unknown error');

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
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
    if (document.exitFullscreen) void document.exitFullscreen();
  };

  const handleSave = () => {
    saveGame();
    setFeedback('Circuit data synced to local storage.');
  };

  const handleQuit = () => {
    updateGameState({
      tournamentLobbyReturn: null,
      deckEditorReturn: null,
      transitReturn: null,
      profileReturn: null,
      pendingTournamentId: null,
      activeTournament: null
    });
    setScene('MAIN_MENU');
    onClose();
  };

  return (
    <div className="system-overlay fade-in" onClick={onClose} role="presentation">
      <div
        className="glass-panel sonsotyo-modal"
        onClick={(event) => event.stopPropagation()}
        style={{ maxWidth: '960px' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="system-menu-title"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div className="sonsotyo-kicker">Sleep Future · System</div>
            <h2 id="system-menu-title" className="sonsotyo-title" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', marginTop: '8px' }}>
              Audio & options
            </h2>
          </div>
          <button type="button" onClick={onClose} className="neo-button" aria-label="Close settings">Close</button>
        </div>

        <div className="sonsotyo-grid cards" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          <SettingCard label="Sound mix" wide>
            <div style={{ display: 'grid', gap: '14px' }}>
              <label className="sonsotyo-copy" style={{ display: 'grid', gap: '6px', fontSize: '0.78rem' }}>
                <span>Master — {volume}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  aria-label={`Master volume, ${volume} percent`}
                  onChange={(event) => {
                    const next = parseInt(event.target.value, 10);
                    setVolume(next);
                    audioManager.setVolume('master', next / 100);
                  }}
                  style={{ width: '100%' }}
                />
              </label>
              <label className="sonsotyo-copy" style={{ display: 'grid', gap: '6px', fontSize: '0.78rem' }}>
                <span>Music — {musicVol}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicVol}
                  aria-label={`Music volume, ${musicVol} percent`}
                  onChange={(event) => {
                    const next = parseInt(event.target.value, 10);
                    setMusicVol(next);
                    audioManager.setVolume('music', next / 100);
                  }}
                  style={{ width: '100%' }}
                />
              </label>
              <label className="sonsotyo-copy" style={{ display: 'grid', gap: '6px', fontSize: '0.78rem' }}>
                <span>SFX — {sfxVol}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sfxVol}
                  aria-label={`Sound effects volume, ${sfxVol} percent`}
                  onChange={(event) => {
                    const next = parseInt(event.target.value, 10);
                    setSfxVol(next);
                    audioManager.setVolume('sfx', next / 100);
                  }}
                  style={{ width: '100%' }}
                />
              </label>
              <label className="sonsotyo-copy" style={{ display: 'grid', gap: '6px', fontSize: '0.78rem' }}>
                <span>Voice — {voiceVol}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={voiceVol}
                  aria-label={`Voice volume, ${voiceVol} percent`}
                  onChange={(event) => {
                    const next = parseInt(event.target.value, 10);
                    setVoiceVol(next);
                    audioManager.setVolume('voice', next / 100);
                  }}
                  style={{ width: '100%' }}
                />
              </label>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="sonsotyo-copy" style={{ fontSize: '0.72rem', flex: '1 1 200px' }}>
                Master scales every bus. Settings persist in this browser.
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = !audioMuted;
                  setAudioMuted(next);
                  audioManager.setMute(next);
                }}
                className={`neo-button ${audioMuted ? '' : 'primary'}`}
                aria-pressed={audioMuted}
              >
                {audioMuted ? 'Muted' : 'Sound on'}
              </button>
            </div>
          </SettingCard>

          <SettingCard label="Combat Flow">
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }} role="group" aria-label="Combat animation speed">
              {['NORMAL', 'TURBO'].map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => setAnimSpeed(speed)}
                  className={`neo-button ${animSpeed === speed ? 'primary' : ''}`}
                  aria-pressed={animSpeed === speed}
                >
                  {speed}
                </button>
              ))}
            </div>
          </SettingCard>

          <SettingCard label="Display Mode">
            <button type="button" className="neo-button" onClick={handleFullscreen} style={{ width: '100%' }}>Toggle Fullscreen</button>
          </SettingCard>

          <SettingCard label="Screen Shake">
            <button
              type="button"
              onClick={() => setScreenShake(!screenShake)}
              className={`neo-button ${screenShake ? 'primary' : ''}`}
              aria-pressed={screenShake}
            >
              {screenShake ? 'Enabled' : 'Disabled'}
            </button>
          </SettingCard>

          <SettingCard label="Presentation Sync" wide>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '8px' }} role="group" aria-label="Presentation quality">
              {(['LOW', 'MEDIUM', 'HIGH', 'ULTRA'] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => updateGameState({ visuals: { presentationTier: tier } })} className={`neo-button ${state.visuals.presentationTier === tier ? 'primary' : ''}`} style={{ fontSize: '0.65rem' }}
                  aria-pressed={state.visuals.presentationTier === tier}
                >
                  {tier}
                </button>
              ))}
            </div>
            <div className="sonsotyo-copy" style={{ marginTop: '10px', fontSize: '0.78rem' }}>
              {state.visuals.presentationTier === 'LOW' && 'CORE_STABLE // MINIMAL_POST_PROCESSING'}
              {state.visuals.presentationTier === 'MEDIUM' && 'BALANCED_SYNC // GLOW_ACTIVE'}
              {state.visuals.presentationTier === 'HIGH' && 'HIGH_FIDELITY // BLOOM_PARTICLES_SYNC'}
              {state.visuals.presentationTier === 'ULTRA' && 'PEAK_ATMOSPHERE // MAXIMUM_SERIALIZATION'}
            </div>
          </SettingCard>

          <SettingCard label="Auto-Sync">
            <button
              type="button"
              onClick={() => setAutoSave(!autoSave)}
              className={`neo-button ${autoSave ? 'primary' : ''}`}
              aria-pressed={autoSave}
            >
              {autoSave ? 'Enabled' : 'Disabled'}
            </button>
          </SettingCard>

          <SettingCard label="Card Back Style">
            <div className="sonsotyo-copy">DEFAULT_HEX // MODS_LOCKED</div>
          </SettingCard>
        </div>

        <div style={{ marginTop: '18px', color: 'var(--accent-yellow)', fontSize: '0.82rem', fontWeight: 700 }}>
          {feedback ?? 'STATUS_READY // READY_FOR_SYNC'}
        </div>

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button type="button" className="neo-button primary" onClick={handleSave}>Sync Data</button>
          <button type="button" className="neo-button" onClick={handleQuit}>Return To Menu</button>
        </div>
      </div>
    </div>
  );
};

const SettingCard: React.FC<{ label: string; children: React.ReactNode; wide?: boolean }> = ({ label, children, wide }) => (
  <div className="glass-panel sonsotyo-panel" style={wide ? { gridColumn: '1 / -1' } : undefined}>
    <div className="sonsotyo-kicker" style={{ marginBottom: '12px' }}>{label}</div>
    {children}
  </div>
);
