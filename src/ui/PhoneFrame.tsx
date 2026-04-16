import React from 'react';
import { GAME_TITLE, GAME_TITLE_SHORT } from '../core/gameBranding';

interface PhoneFrameProps {
  children: React.ReactNode;
}

/** Outer handheld bezel: minimal chrome, no fake OS telemetry. */
export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div className="phone-ui-container">
      <div className="phone-shell" role="presentation">
        <div className="phone-bezel-top" aria-hidden="true">
          <span className="phone-bezel-title" title={GAME_TITLE}>
            {GAME_TITLE_SHORT}
          </span>
        </div>

        <div className="phone-screen">
          <div className="scanlines" aria-hidden="true" />
          <div className="bg-mesh" aria-hidden="true" />
          <div className="phone-screen-content">{children}</div>
        </div>

        <div className="phone-bezel-bottom" aria-hidden="true" />
      </div>
    </div>
  );
};
