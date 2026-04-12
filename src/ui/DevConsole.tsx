import React, { useEffect } from 'react';
import { useGame } from '../core/GameContext';
import { SceneType } from '../core/types';
import { EasyVNHost } from '../vn/EasyVNHost';
import '../styles/SonsotyoScenes.css';

export const DevConsole: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { setScene, updateProfile, updateGameState } = useGame();
  const [showEasyVN, setShowEasyVN] = React.useState(false);

  const scenes: SceneType[] = [
    'MAIN_MENU',
    'APARTMENT',
    'DISTRICT_EXPLORE',
    'DECK_EDITOR',
    'STORE',
    'TOURNAMENT',
    'TRANSIT',
    'PROFILE',
    'BATTLE',
    'VN_SCENE',
    'PACK_OPENING',
    'SOCIAL',
    'SAVE_LOAD'
  ];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (showEasyVN) {
    return <EasyVNHost onClose={() => setShowEasyVN(false)} />;
  }

  return (
    <div
      className="dev-console-overlay fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dev-console-title"
    >
      <div className="glass-panel dev-console-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', gap: '16px', flexWrap: 'wrap' }}>
          <h3 id="dev-console-title" style={{ color: 'var(--accent-yellow)', margin: 0, letterSpacing: '0.18rem', fontSize: '0.85rem' }}>
            DEBUG_OVERRIDE_CONSOLE_v1
          </h3>
          <button type="button" onClick={onClose} className="neo-button" aria-label="Close debug console">
            Close
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
          {scenes.map((s) => (
            <button
              key={s}
              type="button"
              className="neo-button"
              style={{ fontSize: '0.62rem' }}
              onClick={() => {
                updateGameState({
                  pendingTournamentId: null,
                  activeTournament: null,
                  tournamentLobbyReturn: null,
                  deckEditorReturn: null,
                  transitReturn: null,
                  profileReturn: null
                });
                setScene(s);
                onClose();
              }}
            >
              Jump: {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button type="button" className="neo-button primary" onClick={() => updateProfile({ currency: 99999 })}>
            +99999 CR
          </button>
          <button type="button" className="neo-button primary" onClick={() => updateProfile({ xp: 5000 })}>
            Max sync XP
          </button>
          <button type="button" className="neo-button" onClick={() => setShowEasyVN(true)}>
            EasyVN demo (npm easyvn)
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.68rem', marginTop: '18px', lineHeight: 1.45 }}>
          Use with caution. Scene jumps clear transient return routes.
        </p>
      </div>
      <style>{`
        .dev-console-overlay {
          position: fixed;
          inset: 0;
          z-index: 10001;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 20px 16px;
          overflow: auto;
          background: rgba(2, 4, 12, 0.55);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .dev-console-panel {
          width: min(720px, 100%);
          padding: 24px 26px 26px;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
};
