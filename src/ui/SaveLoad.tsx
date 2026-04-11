import React, { useEffect, useState } from 'react';
import { useGame } from '../core/GameContext';
import { audioManager } from '../core/AudioManager';
import '../styles/SonsotyoScenes.css';

interface SaveSlot {
  id: number;
  timestamp: string;
  playerName: string;
  chapter: number;
  location: string;
}

export const SaveLoad: React.FC = () => {
  const { state, setScene, loadGame } = useGame();
  const [slots, setSlots] = useState<SaveSlot[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    refreshSlots();
  }, []);

  const refreshSlots = () => {
    const metadataRaw = localStorage.getItem('neo_sf_slots');
    setSlots(metadataRaw ? (JSON.parse(metadataRaw) as SaveSlot[]) : []);
  };

  const handleSave = (id: number) => {
    const newSlot: SaveSlot = {
      id,
      timestamp: new Date().toLocaleString(),
      playerName: state.profile.name,
      chapter: state.profile.progress.chapter ?? 1,
      location: state.location
    };

    const updatedSlots = [...slots.filter((slot) => slot.id !== id), newSlot].sort((a, b) => a.id - b.id);
    localStorage.setItem(`neo_sf_save_${id}`, JSON.stringify(state));
    localStorage.setItem('neo_sf_slots', JSON.stringify(updatedSlots));
    setSlots(updatedSlots);
    audioManager.playSFX('select');
    setStatus(`SYNCCONFIRM: Data serialized to Node ${id}`);
    window.setTimeout(() => setStatus(null), 3000);
  };

  const handleLoad = (id: number) => {
    const saved = localStorage.getItem(`neo_sf_save_${id}`);
    if (!saved) return;

    localStorage.setItem('neo_sf_save', saved);
    if (loadGame()) {
      audioManager.playSFX('menu_open');
      setStatus(`LINKRESTORED: Connecting to Instance ${id}`);
      window.setTimeout(() => setScene('MAIN_MENU'), 1200);
    }
  };

  return (
    <div
      className="save-load-scene sonsotyo-scene fade-in"
      style={{
        minHeight: '100vh',
        padding: '40px',
        background:
          'linear-gradient(180deg, rgba(8,10,18,0.84), rgba(4,6,10,0.94)), radial-gradient(circle at 18% 18%, rgba(126,242,255,0.14), transparent 22%), url(/sunset_terminal_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="sonsotyo-overlay" />
      <div className="sonsotyo-content" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <div className="sonsotyo-hero">
          <div className="glass-panel sonsotyo-hero-card">
            <div className="sonsotyo-kicker">System Utility / Data Serialization</div>
            <h1 className="sonsotyo-title" style={{ fontSize: 'clamp(2.8rem, 6vw, 4.8rem)', marginTop: '10px' }}>Snapshot Recovery</h1>
            <p className="sonsotyo-copy" style={{ maxWidth: '46ch', marginTop: '14px' }}>
              Archive your duel route into clean local nodes, then wake those timelines back up whenever you need them.
            </p>
            {status && <div style={{ marginTop: '14px', color: 'var(--accent-yellow)', fontWeight: 800 }}>{status}</div>}
          </div>

          <div className="glass-panel sonsotyo-panel">
            <div className="sonsotyo-kicker">Archive Status</div>
            <div style={{ marginTop: '14px', display: 'grid', gap: '12px' }}>
              <div className="sonsotyo-diagnostic">
                <span>Active User</span>
                <span className="sonsotyo-value">{state.profile.name}</span>
              </div>
              <div className="sonsotyo-diagnostic">
                <span>Slots Used</span>
                <span className="sonsotyo-value">{slots.length}/3</span>
              </div>
              <div className="sonsotyo-diagnostic">
                <span>Current Zone</span>
                <span className="sonsotyo-value">{state.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sonsotyo-grid cards">
          {[0, 1, 2].map((id) => {
            const slot = slots.find((entry) => entry.id === id);
            return (
              <div key={id} className="glass-panel sonsotyo-panel">
                <div className="sonsotyo-kicker">Instance Node 0{id + 1}</div>
                <div style={{ marginTop: '14px', minHeight: '150px' }}>
                  {slot ? (
                    <>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>{slot.playerName.toUpperCase()}</div>
                      <div className="sonsotyo-copy" style={{ marginTop: '8px' }}>
                        Chapter 0{slot.chapter} / {slot.location}
                      </div>
                      <div className="sonsotyo-caption" style={{ marginTop: '18px' }}>Last Sync {slot.timestamp}</div>
                    </>
                  ) : (
                    <div style={{ minHeight: '150px', display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,0.26)', fontStyle: 'italic' }}>
                      No data found
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button className="neo-button" onClick={() => handleSave(id)}>Overwrite</button>
                  <button className="neo-button primary" onClick={() => handleLoad(id)} disabled={!slot}>Restore</button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '8px' }}>
          <button className="neo-button" onClick={() => setScene('MAIN_MENU')}>Return to title</button>
        </div>
      </div>
    </div>
  );
};
