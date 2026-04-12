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

  const isFullscreen = Boolean(document.fullscreenElement);

  return (
    <div className="system-overlay fade-in" onClick={onClose} role="presentation">
      <div
        className="glass-panel sonsotyo-modal system-menu-modal"
        onClick={(event) => event.stopPropagation()}
        style={{ maxWidth: '960px', width: 'min(960px, 100%)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="system-menu-title"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'flex-start', marginBottom: '18px' }}>
          <div>
            <div className="sonsotyo-kicker">Sleep Future · System</div>
            <h2 id="system-menu-title" className="sonsotyo-title" style={{ fontSize: 'clamp(1.75rem, 4.2vw, 3rem)', marginTop: '6px', lineHeight: 1.05 }}>
              Audio & options
            </h2>
            <p className="sonsotyo-copy system-menu-intro">
              Tune presentation, sync your run, and step back to menu without breaking the handheld mood.
            </p>
          </div>
          <button type="button" onClick={onClose} className="neo-button" aria-label="Close settings">Close</button>
        </div>

        <div className="system-menu-summary-strip" aria-hidden="true">
          <div className="system-menu-summary-pill">
            <span className="system-menu-summary-label">Mix</span>
            <strong>{audioMuted ? 'Muted' : `${volume}% live`}</strong>
          </div>
          <div className="system-menu-summary-pill">
            <span className="system-menu-summary-label">Visual tier</span>
            <strong>{state.visuals.presentationTier}</strong>
          </div>
          <div className="system-menu-summary-pill">
            <span className="system-menu-summary-label">Display</span>
            <strong>{isFullscreen ? 'Fullscreen' : 'Windowed'}</strong>
          </div>
        </div>

        <div className="sonsotyo-grid cards system-menu-settings-grid">
          <SettingCard label="Sound mix" hint="Master applies to every bus. Music, SFX, and voice stay independently adjustable." wide>
            <div style={{ display: 'grid', gap: '14px' }}>
              <label className="system-menu-slider-row">
                <span>Master</span>
                <strong>{volume}%</strong>
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
              <label className="system-menu-slider-row">
                <span>Music</span>
                <strong>{musicVol}%</strong>
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
              <label className="system-menu-slider-row">
                <span>SFX</span>
                <strong>{sfxVol}%</strong>
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
              <label className="system-menu-slider-row">
                <span>Voice</span>
                <strong>{voiceVol}%</strong>
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
            <div className="system-menu-inline-actions">
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
              <div className="sonsotyo-copy system-menu-inline-copy">
                Settings persist in this browser.
              </div>
            </div>
          </SettingCard>

          <SettingCard label="Combat flow" hint="Presentation helpers used during battles and high-action transitions.">
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
            <div className="sonsotyo-copy system-menu-setting-footnote">
              {animSpeed === 'TURBO' ? 'Fast queue playback for repeat matches and testing.' : 'Balanced pacing for first-time encounters and reading effects.'}
            </div>
          </SettingCard>

          <SettingCard label="Display mode" hint="Change screen presentation without leaving the current session.">
            <button type="button" className="neo-button" onClick={handleFullscreen} style={{ width: '100%' }}>
              {isFullscreen ? 'Leave fullscreen' : 'Enter fullscreen'}
            </button>
            <div className="sonsotyo-copy system-menu-setting-footnote">
              {isFullscreen ? 'Fullscreen is active on this device.' : 'Best for a cabinet-style title screen and cleaner battle framing.'}
            </div>
          </SettingCard>

          <SettingCard label="Screen shake" hint="Controls impact feedback on combat hits and heavier scene events.">
            <button
              type="button"
              onClick={() => setScreenShake(!screenShake)}
              className={`neo-button ${screenShake ? 'primary' : ''}`}
              aria-pressed={screenShake}
            >
              {screenShake ? 'Enabled' : 'Disabled'}
            </button>
            <div className="sonsotyo-copy system-menu-setting-footnote">
              {screenShake ? 'Impact accents stay on for heavier attacks.' : 'Reduced motion presentation for calmer readability.'}
            </div>
          </SettingCard>

          <SettingCard label="Presentation sync" hint="Controls atmosphere density, bloom, and scene fidelity presets." wide>
            <div className="system-menu-presentation-grid" role="group" aria-label="Presentation quality">
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

          <SettingCard label="Auto-sync" hint="Background save behavior for routine scene progression and menu exits.">
            <button
              type="button"
              onClick={() => setAutoSave(!autoSave)}
              className={`neo-button ${autoSave ? 'primary' : ''}`}
              aria-pressed={autoSave}
            >
              {autoSave ? 'Enabled' : 'Disabled'}
            </button>
            <div className="sonsotyo-copy system-menu-setting-footnote">
              {autoSave ? 'Recommended for circuit progression and apartment-to-district hops.' : 'Manual sync only. Remember to save before leaving the run.'}
            </div>
          </SettingCard>

          <SettingCard label="Card back style" hint="Reserved for cosmetic variants and future unlocks.">
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

const SettingCard: React.FC<{ label: string; hint?: string; children: React.ReactNode; wide?: boolean }> = ({ label, hint, children, wide }) => (
  <div className="glass-panel sonsotyo-panel" style={wide ? { gridColumn: '1 / -1' } : undefined}>
    <div className="sonsotyo-kicker" style={{ marginBottom: '10px' }}>{label}</div>
    {hint && <div className="sonsotyo-copy" style={{ marginBottom: '16px', fontSize: '0.82rem' }}>{hint}</div>}
    {children}
  </div>
);
