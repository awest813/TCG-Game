import React, { useState } from 'react';
import { useGame } from '../core/GameStateContext';
import { SystemMenu } from './SystemMenu';

export const MainMenu: React.FC = () => {
  const { setScene, loadGame, resetGame } = useGame();
  const [showSettings, setShowSettings] = useState(false);

  const handleNewGame = () => {
    resetGame();
  };

  const handleContinue = () => {
    if (loadGame()) {
      // Game loaded
    } else {
      alert("No sync state found!");
    }
  };

  return (
    <div className="main-menu-scene fade-in" style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'black',
      backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(68,0,255,0.4), transparent 50%), radial-gradient(circle at 30% 70%, rgba(255,0,234,0.4), transparent 50%)',
      overflow: 'hidden'
    }}>
      {/* Background Anime Character Silhouette / Portrait */}
      <img src="/avatar_player.png" alt="Protagonist" style={{
          position: 'absolute',
          right: '-50px',
          bottom: '0',
          height: '110%',
          opacity: 0.8,
          maskImage: 'linear-gradient(to left, black 60%, transparent)',
          zIndex: 1
      }} />

      <div style={{ padding: '80px', flex: 1, zIndex: 10, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '80px' }}>
              <h1 className="glow-text" style={{ fontSize: '6rem', margin: 0, letterSpacing: '8px', lineHeight: 1 }}>NEO SF</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
                  <div style={{ width: '40px', height: '4px', background: 'var(--accent-cyan)' }}></div>
                  <div style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', letterSpacing: '5px' }}>CHAMPION CIRCUIT</div>
              </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
              <button className="champion-button" onClick={handleNewGame}>
                  <span className="btn-number">01</span>
                  <span className="btn-text">NEW CAREER</span>
              </button>
              <button className="champion-button secondary" onClick={handleContinue}>
                  <span className="btn-number">02</span>
                  <span className="btn-text">CONTINUE LINK</span>
              </button>
              <button className="champion-button ghost" onClick={() => setShowSettings(true)}>
                  <span className="btn-number">03</span>
                  <span className="btn-text">SETTINGS</span>
              </button>
              <button className="champion-button ghost">
                  <span className="btn-number">04</span>
                  <span className="btn-text">ABOUT</span>
              </button>
          </div>

          {showSettings && <SystemMenu onClose={() => setShowSettings(false)} />}

          <div style={{ marginTop: 'auto', display: 'flex', gap: '40px' }}>
              <div className="glass-morphism" style={{ padding: '10px 20px', fontSize: '0.8rem', letterSpacing: '2px' }}>
                  BUILD v2.0.1 ALPHA
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
                  PRESS [START] TO INITIALIZE
              </div>
          </div>
      </div>

      <style>{`
          .champion-button {
              background: rgba(255,255,255,0.05);
              border: 1px solid rgba(255,255,255,0.1);
              padding: 20px 40px;
              display: flex;
              align-items: center;
              gap: 30px;
              color: white;
              cursor: pointer;
              transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
              border-radius: 4px; /* Yu-Gi-Oh! sharp corners or slight rounding */
          }
          .champion-button:hover {
              background: white;
              color: black;
              transform: translateX(20px);
              box-shadow: -10px 0 0 var(--accent-cyan);
          }
          .btn-number {
              color: var(--accent-cyan);
              font-weight: bold;
              font-size: 1.2rem;
          }
          .btn-text {
              font-weight: 800;
              font-size: 1.5rem;
              letter-spacing: 2px;
          }
          .champion-button.ghost {
              background: transparent;
              border: none;
              opacity: 0.6;
          }
          .champion-button.ghost:hover {
              opacity: 1;
              background: rgba(255,255,255,0.1);
              color: white;
          }
      `}</style>
    </div>
  );
};
