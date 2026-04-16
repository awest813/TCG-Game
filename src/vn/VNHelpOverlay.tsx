import React from 'react';
import '../styles/VNPresentation.css';

type VNHelpOverlayProps = {
  open: boolean;
  onClose: () => void;
};

const ROWS: [string, string][] = [
  ['Enter / Space', 'Reveal line or advance (dialogue)'],
  ['Esc', 'Open reader menu, or close panels'],
  ['F1', 'This help'],
  ['F5 / F9', 'Quick save / Quick load'],
  ['H', 'Toggle history'],
  ['M', 'Mute / unmute game audio'],
  ['Tab or `', 'Hide UI (dialogue)'],
  ['Alt + R', 'Rollback one line'],
  ['Ctrl + Skip', 'Only skip lines you have read before'],
  ['Right-click / long-press', 'Open reader menu']
];

export const VNHelpOverlay: React.FC<VNHelpOverlayProps> = ({ open, onClose }) => {
  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="vn-help-overlay fade-in" role="presentation" onClick={onClose}>
      <div
        className="glass-panel vn-help-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vn-help-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="vn-help-head">
          <h2 id="vn-help-title" className="vn-help-title">
            Keyboard and gestures
          </h2>
          <button type="button" className="vn-help-close neo-button" onClick={onClose}>
            Close
          </button>
        </div>
        <dl className="vn-help-table">
          {ROWS.map(([k, v]) => (
            <React.Fragment key={k}>
              <dt className="vn-help-key">{k}</dt>
              <dd className="vn-help-desc">{v}</dd>
            </React.Fragment>
          ))}
        </dl>
        <p className="vn-help-foot">Progress saves as you read. Quick save is a separate bookmark slot.</p>
      </div>
    </div>
  );
};
