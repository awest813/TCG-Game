import React, { useState } from 'react';
import { audioManager } from '../core/AudioManager';
import { useGame } from '../core/GameContext';
import type { PresentationTier } from '../core/types';
import '../styles/SonsotyoScenes.css';

function presentationTierCaption(tier: PresentationTier): string {
  switch (tier) {
    case 'LOW':
      return 'Lightest 3D load — good on low-end GPUs.';
    case 'MEDIUM':
      return 'Balanced quality and frame time.';
    case 'HIGH':
      return 'Default ship preset — richer lighting.';
    case 'ULTRA':
      return 'Highest fidelity — may cost FPS.';
    default:
      return '';
  }
}

export const SystemMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { saveGame, setScene, state, updateGameState } = useGame();
  const [volume, setVolume] = useState(() => audioManager.getMasterVolumePercent());
  const [musicVol, setMusicVol] = useState(() => audioManager.getBusVolumePercent('music'));
  const [sfxVol, setSfxVol] = useState(() => audioManager.getBusVolumePercent('sfx'));
  const [voiceVol, setVoiceVol] = useState(() => audioManager.getBusVolumePercent('voice'));
  const [audioMuted, setAudioMuted] = useState(() => audioManager.getSnapshot().isMuted);
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
    setFeedback('Saved to this browser.');
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
        style={{ maxWidth: '640px', width: 'min(640px, 100%)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="system-menu-title"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <div className="sonsotyo-kicker">Settings</div>
            <h2 id="system-menu-title" className="sonsotyo-title" style={{ fontSize: 'clamp(1.35rem, 3.5vw, 2rem)', marginTop: '4px', lineHeight: 1.1 }}>
              Audio & display
            </h2>
            <p className="sonsotyo-copy system-menu-intro">Volumes, fullscreen, and battle scene quality.</p>
          </div>
          <button type="button" onClick={onClose} className="neo-button" aria-label="Close settings">
            Close
          </button>
        </div>

        <div className="system-menu-summary-strip" aria-hidden="true">
          <div className="system-menu-summary-pill">
            <span className="system-menu-summary-label">Audio</span>
            <strong>{audioMuted ? 'Muted' : `${volume}%`}</strong>
          </div>
          <div className="system-menu-summary-pill">
            <span className="system-menu-summary-label">Arena</span>
            <strong>{state.visuals.presentationTier}</strong>
          </div>
          <div className="system-menu-summary-pill">
            <span className="system-menu-summary-label">Window</span>
            <strong>{isFullscreen ? 'Full' : 'Window'}</strong>
          </div>
        </div>

        <div className="sonsotyo-grid cards system-menu-settings-grid">
          <SettingCard label="Sound" hint="Master scales all buses; adjust each as you like." wide>
            <div style={{ display: 'grid', gap: '12px' }}>
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
                {audioMuted ? 'Unmute' : 'Mute'}
              </button>
              <div className="sonsotyo-copy system-menu-inline-copy">Stored in this browser.</div>
            </div>
          </SettingCard>

          <SettingCard label="Fullscreen">
            <button type="button" className="neo-button" onClick={handleFullscreen} style={{ width: '100%' }}>
              {isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            </button>
          </SettingCard>

          <SettingCard label="Battle scene quality">
            <div className="system-menu-presentation-grid" role="group" aria-label="3D presentation quality">
              {(['LOW', 'MEDIUM', 'HIGH', 'ULTRA'] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => updateGameState({ visuals: { presentationTier: tier } })}
                  className={`neo-button ${state.visuals.presentationTier === tier ? 'primary' : ''}`}
                  style={{ fontSize: '0.65rem' }}
                  aria-pressed={state.visuals.presentationTier === tier}
                >
                  {tier}
                </button>
              ))}
            </div>
            <p className="sonsotyo-copy system-menu-setting-footnote" style={{ marginTop: '10px', marginBottom: 0 }}>
              {presentationTierCaption(state.visuals.presentationTier)}
            </p>
          </SettingCard>
        </div>

        {feedback ? (
          <div className="system-menu-feedback" style={{ marginTop: '14px', color: 'var(--accent-secondary)', fontSize: '0.8rem' }}>
            {feedback}
          </div>
        ) : null}

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button type="button" className="neo-button primary" onClick={handleSave}>
            Save now
          </button>
          <button type="button" className="neo-button" onClick={handleQuit}>
            Main menu
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingCard: React.FC<{ label: string; hint?: string; children: React.ReactNode; wide?: boolean }> = ({ label, hint, children, wide }) => (
  <div className="glass-panel sonsotyo-panel" style={wide ? { gridColumn: '1 / -1' } : undefined}>
    <div className="sonsotyo-kicker" style={{ marginBottom: hint ? '8px' : '10px' }}>
      {label}
    </div>
    {hint ? (
      <div className="sonsotyo-copy" style={{ marginBottom: '12px', fontSize: '0.78rem', lineHeight: 1.45 }}>
        {hint}
      </div>
    ) : null}
    {children}
  </div>
);
