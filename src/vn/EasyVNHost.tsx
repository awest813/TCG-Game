import React from 'react';
import { startEasyVNSampleScene } from './registerEasyVNSample';
import './EasyVNHost.css';

/**
 * Renders the DOM nodes the `easyvn` package expects (`#background`, `#character`,
 * `#textbox`, `#speaker`, `#dialogue`, `#choices`) and runs a sample scene.
 *
 * @see https://github.com/Eshan276/easyvn — paths resolve to `/assets/backgrounds/*` and `/assets/characters/*`.
 */
export const EasyVNHost: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const startedRef = React.useRef(false);

  React.useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void startEasyVNSampleScene().catch((err: unknown) => {
      console.error('[EasyVNHost]', err);
    });
  }, []);

  return (
    <div className="easyvn-host-overlay fade-in" role="dialog" aria-modal="true" aria-labelledby="easyvn-host-title">
      <h2 id="easyvn-host-title" className="sr-only">
        EasyVN engine demo
      </h2>
      <div className="easyvn-host-frame">
        <div className="easyvn-stage">
          {/* easyvn resolves `./assets/backgrounds/${file}` from site root (Vite public/). */}
          <img id="background" alt="" />
          <img id="character" alt="" />
        </div>
        <div id="textbox" className="easyvn-textbox">
          <div id="speaker" className="easyvn-speaker" />
          <p id="dialogue" className="easyvn-dialogue" />
        </div>
        <div id="choices" className="easyvn-choices" />
      </div>
      <div className="easyvn-host-toolbar">
        <button type="button" className="neo-button" onClick={onClose}>
          Close demo
        </button>
      </div>
      <style>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </div>
  );
};
