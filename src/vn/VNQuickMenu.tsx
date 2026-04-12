import React from 'react';
import '../styles/VNPresentation.css';
import type { VNTextSpeed } from './vnPreferences';
import { VN_AUTO_MS_PRESETS, VN_TEXT_CPS } from './vnPreferences';

type VNQuickMenuProps = {
  open: boolean;
  onClose: () => void;
  textSpeed: VNTextSpeed;
  onTextSpeed: (s: VNTextSpeed) => void;
  autoDelayMs: number;
  onAutoDelayMs: (ms: number) => void;
  windowAlpha: number;
  onWindowAlpha: (a: number) => void;
  rollbackAvailable: boolean;
  onRollback: () => void;
  onFullscreen: () => void;
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
  rollbackAvailable,
  onRollback,
  onFullscreen
}) => {
  if (!open) return null;

  return (
    <div className="vn-quick-overlay fade-in" role="presentation" onClick={onClose}>
      <div
        className="glass-panel vn-quick-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vn-quick-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="vn-quick-head">
          <h2 id="vn-quick-title" className="vn-quick-title">
            Reader
          </h2>
          <button type="button" className="vn-quick-close neo-button" onClick={onClose} aria-label="Close menu">
            Close
          </button>
        </div>

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

        <div className="vn-quick-actions">
          <button type="button" className="neo-button" disabled={!rollbackAvailable} onClick={onRollback}>
            Rollback line
          </button>
          <button type="button" className="neo-button" onClick={onFullscreen}>
            Fullscreen
          </button>
        </div>

        <p className="vn-quick-hint">
          Esc / Menu · Alt+R rollback · Tab or backtick hides UI · Skip plus Ctrl skips only lines you have read before ·
          Right-click or long-press opens this menu
        </p>
      </div>
    </div>
  );
};
