import React from 'react';
import { audioManager } from '../core/AudioManager';
import '../styles/VNPresentation.css';
import type { VNTextScale, VNTextSpeed } from './vnPreferences';
import { VN_AUTO_MS_PRESETS, VN_TEXT_CPS, VN_TEXT_SCALE } from './vnPreferences';

type QuickTab = 'reader' | 'audio' | 'display';

type VNQuickMenuProps = {
  open: boolean;
  onClose: () => void;
  textSpeed: VNTextSpeed;
  onTextSpeed: (s: VNTextSpeed) => void;
  autoDelayMs: number;
  onAutoDelayMs: (ms: number) => void;
  windowAlpha: number;
  onWindowAlpha: (a: number) => void;
  textScale: VNTextScale;
  onTextScale: (s: VNTextScale) => void;
  rollbackAvailable: boolean;
  onRollback: () => void;
  onFullscreen: () => void;
  onAudioChanged?: () => void;
};

export const VNQuickMenu: React.FC<VNQuickMenuProps> = ({
  open,
  onClose,
  textSpeed,
  onTextSpeed,
  autoDelayMs,
  onAutoDelayMs,
  windowAlpha,
  onWindowAlpha,
  textScale,
  onTextScale,
  rollbackAvailable,
  onRollback,
  onFullscreen,
  onAudioChanged
}) => {
  const [tab, setTab] = React.useState<QuickTab>('reader');
  const [master, setMaster] = React.useState(80);
  const [music, setMusic] = React.useState(60);
  const [sfx, setSfx] = React.useState(70);
  const [muted, setMuted] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const s = audioManager.getSnapshot();
    setMaster(Math.round(s.masterVolume * 100));
    setMusic(Math.round(s.musicVolume * 100));
    setSfx(Math.round(s.sfxVolume * 100));
    setMuted(s.isMuted);
  }, [open]);

  const applyMaster = (n: number) => {
    setMaster(n);
    audioManager.setVolume('master', n / 100);
    onAudioChanged?.();
  };
  const applyMusic = (n: number) => {
    setMusic(n);
    audioManager.setVolume('music', n / 100);
    onAudioChanged?.();
  };
  const applySfx = (n: number) => {
    setSfx(n);
    audioManager.setVolume('sfx', n / 100);
    onAudioChanged?.();
  };
  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    audioManager.setMute(next);
    onAudioChanged?.();
  };

  if (!open) return null;

  return (
    <div className="vn-quick-overlay fade-in" role="presentation" onClick={onClose}>
      <div
        className="glass-panel vn-quick-panel vn-quick-panel--tabs"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vn-quick-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="vn-quick-head">
          <h2 id="vn-quick-title" className="vn-quick-title">
            Preferences
          </h2>
          <button type="button" className="vn-quick-close neo-button" onClick={onClose} aria-label="Close menu">
            Close
          </button>
        </div>

        <div className="vn-quick-tabs" role="tablist" aria-label="Preference sections">
          {(
            [
              ['reader', 'Reader'],
              ['audio', 'Audio'],
              ['display', 'Display']
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={`vn-quick-tab${tab === id ? ' vn-quick-tab--active' : ''}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'reader' && (
          <div className="vn-quick-tab-panel" role="tabpanel">
            <section className="vn-quick-section" aria-labelledby="vn-quick-text-label">
              <div id="vn-quick-text-label" className="vn-quick-label">
                Text speed
              </div>
              <div className="vn-quick-segment" role="group">
                {(Object.keys(VN_TEXT_CPS) as VNTextSpeed[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={`vn-quick-pill${textSpeed === key ? ' vn-quick-pill--on' : ''}`}
                    onClick={() => onTextSpeed(key)}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </section>

            <section className="vn-quick-section" aria-labelledby="vn-quick-auto-label">
              <div id="vn-quick-auto-label" className="vn-quick-label">
                Auto-forward delay
              </div>
              <div className="vn-quick-segment" role="group">
                {VN_AUTO_MS_PRESETS.map((ms) => (
                  <button
                    key={ms}
                    type="button"
                    className={`vn-quick-pill${autoDelayMs === ms ? ' vn-quick-pill--on' : ''}`}
                    onClick={() => onAutoDelayMs(ms)}
                  >
                    {(ms / 1000).toFixed(1)}s
                  </button>
                ))}
              </div>
            </section>

            <section className="vn-quick-section" aria-labelledby="vn-quick-alpha-label">
              <div id="vn-quick-alpha-label" className="vn-quick-label">
                Textbox opacity
              </div>
              <input
                type="range"
                min={0.45}
                max={1}
                step={0.05}
                value={windowAlpha}
                onChange={(e) => onWindowAlpha(parseFloat(e.target.value))}
                className="vn-quick-range"
                aria-valuetext={`${Math.round(windowAlpha * 100)} percent`}
              />
            </section>
          </div>
        )}

        {tab === 'audio' && (
          <div className="vn-quick-tab-panel" role="tabpanel">
            <section className="vn-quick-section">
              <div className="vn-quick-label">Master</div>
              <input
                type="range"
                min={0}
                max={100}
                value={master}
                onChange={(e) => applyMaster(parseInt(e.target.value, 10))}
                className="vn-quick-range"
                aria-valuetext={`${master}%`}
                disabled={muted}
              />
            </section>
            <section className="vn-quick-section">
              <div className="vn-quick-label">Music</div>
              <input
                type="range"
                min={0}
                max={100}
                value={music}
                onChange={(e) => applyMusic(parseInt(e.target.value, 10))}
                className="vn-quick-range"
                aria-valuetext={`${music}%`}
                disabled={muted}
              />
            </section>
            <section className="vn-quick-section">
              <div className="vn-quick-label">Sound effects</div>
              <input
                type="range"
                min={0}
                max={100}
                value={sfx}
                onChange={(e) => applySfx(parseInt(e.target.value, 10))}
                className="vn-quick-range"
                aria-valuetext={`${sfx}%`}
                disabled={muted}
              />
            </section>
            <div className="vn-quick-actions vn-quick-actions--inline">
              <button type="button" className={`neo-button${muted ? ' primary' : ''}`} onClick={toggleMute}>
                {muted ? 'Unmute' : 'Mute all'}
              </button>
            </div>
          </div>
        )}

        {tab === 'display' && (
          <div className="vn-quick-tab-panel" role="tabpanel">
            <section className="vn-quick-section" aria-labelledby="vn-quick-scale-label">
              <div id="vn-quick-scale-label" className="vn-quick-label">
                Text size
              </div>
              <div className="vn-quick-segment" role="group">
                {(Object.keys(VN_TEXT_SCALE) as VNTextScale[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={`vn-quick-pill${textScale === key ? ' vn-quick-pill--on' : ''}`}
                    onClick={() => onTextScale(key)}
                  >
                    {key === 'compact' ? 'Compact' : key === 'comfortable' ? 'Comfortable' : 'Large'}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        <div className="vn-quick-actions vn-quick-actions--split">
          <button type="button" className="neo-button" disabled={!rollbackAvailable} onClick={onRollback}>
            Rollback line
          </button>
          <button type="button" className="neo-button" onClick={onFullscreen}>
            Fullscreen
          </button>
        </div>

        <ul className="vn-quick-hint-list" aria-label="Shortcuts">
          <li>Esc opens or closes this menu; Alt+R rolls back one line when available.</li>
          <li>F1 help · F5/F9 quick save &amp; load · M mute · Tab hides UI (dialogue).</li>
          <li>Skip + Ctrl advances only lines you have read before (per route).</li>
          <li>Right-click or long-press on the story view opens this menu.</li>
        </ul>
      </div>
    </div>
  );
};
