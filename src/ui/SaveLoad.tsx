import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useGame } from '../core/GameContext';
import { audioManager } from '../core/AudioManager';
import {
  AUTOSAVE_STORAGE_KEY,
  buildBackupDownloadFilename,
  parsePersistedGameState,
  readReconciledSlots,
  serializeGameStateForBackup,
  slotStorageKey,
  type SaveSlotMeta,
  writeSlotsMeta
} from '../core/gameStatePersistence';
import type { SceneType } from '../core/types';
import '../styles/SonsotyoScenes.css';

function sceneLabel(scene: SceneType): string {
  const labels: Partial<Record<SceneType, string>> = {
    MAIN_MENU: 'Title screen',
    APARTMENT: 'Apartment',
    DISTRICT_EXPLORE: 'District',
    DECK_EDITOR: 'Deck terminal',
    PACK_OPENING: 'Pack opening',
    STORE: 'Shop',
    BATTLE: 'Battle',
    REWARD: 'Rewards',
    SOCIAL: 'Social',
    TOURNAMENT: 'Tournament',
    TRANSIT: 'Transit',
    SAVE_LOAD: 'Recovery',
    PROFILE: 'Profile',
    VN_SCENE: 'Story'
  };
  return labels[scene] ?? scene.replace(/_/g, ' ');
}

export const SaveLoad: React.FC = () => {
  const { state, setScene, hydrateGameState } = useGame();
  const [slots, setSlots] = useState<SaveSlotMeta[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const refreshSlots = useCallback(() => {
    const reconciled = readReconciledSlots();
    setSlots(reconciled);
    writeSlotsMeta(reconciled);
  }, []);

  useEffect(() => {
    refreshSlots();
  }, [refreshSlots]);

  const flashStatus = (message: string, tone: 'ok' | 'warn' = 'ok') => {
    setStatus(message);
    window.setTimeout(() => setStatus(null), tone === 'warn' ? 5200 : 3600);
  };

  const handleSave = (id: number) => {
    const snapshot = JSON.stringify(state);
    localStorage.setItem(slotStorageKey(id), snapshot);

    const next: SaveSlotMeta = {
      id,
      timestamp: new Date().toLocaleString(),
      playerName: state.profile.name,
      chapter: state.profile.progress.chapter ?? 1,
      location: state.location,
      scene: state.currentScene
    };
    const others = readReconciledSlots().filter((s) => s.id !== id);
    const updated = [...others, next].sort((a, b) => a.id - b.id);
    writeSlotsMeta(updated);
    setSlots(updated);
    audioManager.playSFX('select');
    flashStatus(`Slot ${id + 1} updated — ${next.playerName} · ${sceneLabel(next.scene as SceneType)}`);
  };

  const handleLoad = (id: number) => {
    const raw = localStorage.getItem(slotStorageKey(id));
    const parsed = raw ? parsePersistedGameState(raw) : null;
    if (!parsed) {
      audioManager.playSFX('select');
      flashStatus(`Slot ${id + 1} is empty or unreadable. Try another node or start a new career.`, 'warn');
      return;
    }

    localStorage.setItem(AUTOSAVE_STORAGE_KEY, JSON.stringify(parsed));
    hydrateGameState(parsed);
    audioManager.playSFX('menu_open');
    flashStatus(`Restored slot ${id + 1} — ${parsed.profile.name} · ${sceneLabel(parsed.currentScene)}`);
  };

  const handleCopyAutosaveToSlot = (id: number) => {
    const raw = localStorage.getItem(AUTOSAVE_STORAGE_KEY);
    const parsed = raw ? parsePersistedGameState(raw) : null;
    if (!parsed) {
      flashStatus('No valid autosave to copy. Play a bit, save from the hub, or restore a slot first.', 'warn');
      return;
    }
    localStorage.setItem(slotStorageKey(id), JSON.stringify(parsed));
    const next: SaveSlotMeta = {
      id,
      timestamp: new Date().toLocaleString(),
      playerName: parsed.profile.name,
      chapter: parsed.profile.progress.chapter ?? 1,
      location: parsed.location,
      scene: parsed.currentScene
    };
    const others = readReconciledSlots().filter((s) => s.id !== id);
    const updated = [...others, next].sort((a, b) => a.id - b.id);
    writeSlotsMeta(updated);
    setSlots(updated);
    audioManager.playSFX('select');
    flashStatus(`Copied current autosave into slot ${id + 1}.`);
  };

  const handleClearSlot = (id: number) => {
    if (!window.confirm(`Erase slot ${id + 1}? This removes that snapshot from this device.`)) return;
    localStorage.removeItem(slotStorageKey(id));
    refreshSlots();
    audioManager.playSFX('select');
    flashStatus(`Slot ${id + 1} cleared.`);
  };

  const handleExportJsonBackup = () => {
    const body = serializeGameStateForBackup(state);
    const blob = new Blob([body], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = buildBackupDownloadFilename(state.profile.name);
    a.rel = 'noopener';
    a.click();
    URL.revokeObjectURL(url);
    audioManager.playSFX('select');
    flashStatus('Backup downloaded — same format as autosave; store it outside the browser if you care about it.');
  };

  const handleImportFileChosen = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = parsePersistedGameState(text);
      if (!parsed) {
        flashStatus('That file is not a valid Sleep Future save (wrong shape or corrupt JSON).', 'warn');
        return;
      }

      const pilot = parsed.profile.name;
      const scene = sceneLabel(parsed.currentScene);
      const ok = window.confirm(
        `Import backup?\n\nPilot: ${pilot}\nResume: ${scene}\nLocation: ${parsed.location.replace(/_/g, ' ')}\n\nThis replaces your autosave and the session you have open now.`
      );
      if (!ok) return;

      localStorage.setItem(AUTOSAVE_STORAGE_KEY, JSON.stringify(parsed));
      hydrateGameState(parsed);
      audioManager.playSFX('menu_open');
      flashStatus(`Imported "${pilot}" — ${scene}. Autosave updated.`);
    } catch {
      flashStatus('Could not read that file.', 'warn');
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
            <p className="sonsotyo-copy" style={{ maxWidth: '52ch', marginTop: '14px' }}>
              Three manual slots live next to your rolling autosave. Restore jumps you back to the scene stored in that snapshot. Use{' '}
              <strong style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>Export JSON</strong> for a portable file, or{' '}
              <strong style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>Import JSON</strong> to restore from one (replaces autosave).
            </p>
            {status && (
              <div
                className="save-load-status-banner"
                style={{
                  marginTop: '14px',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  fontWeight: 700,
                  background: 'rgba(126, 242, 255, 0.08)',
                  border: '1px solid rgba(126, 242, 255, 0.22)',
                  color: 'var(--accent-yellow)'
                }}
                role="status"
                aria-live="polite"
              >
                {status}
              </div>
            )}
          </div>

          <div className="glass-panel sonsotyo-panel">
            <div className="sonsotyo-kicker">Archive Status</div>
            <div style={{ marginTop: '14px', display: 'grid', gap: '12px' }}>
              <div className="sonsotyo-diagnostic">
                <span>Active pilot</span>
                <span className="sonsotyo-value">{state.profile.name}</span>
              </div>
              <div className="sonsotyo-diagnostic">
                <span>Slots in use</span>
                <span className="sonsotyo-value">{slots.length} / 3</span>
              </div>
              <div className="sonsotyo-diagnostic">
                <span>Current zone</span>
                <span className="sonsotyo-value">{state.location.replace(/_/g, ' ')}</span>
              </div>
              <div className="sonsotyo-diagnostic">
                <span>Scene</span>
                <span className="sonsotyo-value">{sceneLabel(state.currentScene)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel sonsotyo-panel save-load-backup-panel">
          <div className="sonsotyo-kicker">Portable backup · JSON</div>
          <p className="sonsotyo-copy" style={{ marginTop: '12px', maxWidth: '62ch', lineHeight: 1.55 }}>
            Exports your <strong style={{ fontWeight: 700 }}>current session</strong> (what autosave would write). Imports must be saves from this game version; invalid files are rejected without touching storage.
          </p>
          <div className="save-load-backup-actions">
            <button type="button" className="neo-button primary" onClick={handleExportJsonBackup}>
              Export JSON backup
            </button>
            <button type="button" className="neo-button" onClick={() => importInputRef.current?.click()}>
              Import JSON backup…
            </button>
            <input
              ref={importInputRef}
              type="file"
              accept="application/json,.json,text/json"
              className="save-load-file-input"
              aria-label="Choose JSON backup file to import"
              onChange={(event) => {
                void handleImportFileChosen(event);
              }}
            />
          </div>
        </div>

        <div className="sonsotyo-grid cards">
          {[0, 1, 2].map((id) => {
            const slot = slots.find((entry) => entry.id === id);
            return (
              <div key={id} className="glass-panel sonsotyo-panel save-load-slot-card">
                <div className="sonsotyo-kicker">Instance node {id + 1}</div>
                <div style={{ marginTop: '14px', minHeight: '168px' }}>
                  {slot ? (
                    <>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', lineHeight: 1.25 }}>{slot.playerName}</div>
                      <div className="sonsotyo-copy" style={{ marginTop: '10px', lineHeight: 1.45 }}>
                        Ch. {slot.chapter} · {slot.location.replace(/_/g, ' ')}
                      </div>
                      <div className="sonsotyo-caption" style={{ marginTop: '8px', textTransform: 'none', letterSpacing: '0.04em' }}>
                        Resume: {sceneLabel(slot.scene as SceneType)}
                      </div>
                      <div className="sonsotyo-caption" style={{ marginTop: '14px' }}>
                        Last sync {slot.timestamp}
                      </div>
                    </>
                  ) : (
                    <div className="save-load-slot-empty">Empty slot — write a snapshot from your current run, or copy autosave.</div>
                  )}
                </div>

                <div className="save-load-slot-actions">
                  <button type="button" className="neo-button" onClick={() => handleSave(id)}>
                    Save here
                  </button>
                  <button type="button" className="neo-button" onClick={() => handleCopyAutosaveToSlot(id)}>
                    Copy autosave
                  </button>
                  <button type="button" className="neo-button primary" onClick={() => handleLoad(id)} disabled={!slot}>
                    Restore
                  </button>
                  <button type="button" className="neo-button" onClick={() => handleClearSlot(id)} disabled={!slot}>
                    Erase
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', paddingBottom: '8px' }}>
          <button type="button" className="neo-button" onClick={() => setScene('MAIN_MENU')}>
            Return to title
          </button>
        </div>
      </div>
      <style>{`
        .save-load-slot-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 14px;
        }
        .save-load-slot-actions .neo-button:nth-child(3) {
          grid-column: 1 / -1;
        }
        .save-load-slot-empty {
          min-height: 168px;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 12px;
          color: rgba(255, 255, 255, 0.38);
          font-size: 0.92rem;
          line-height: 1.5;
        }
        @media (max-width: 720px) {
          .save-load-slot-actions {
            grid-template-columns: 1fr;
          }
          .save-load-slot-actions .neo-button:nth-child(3) {
            grid-column: auto;
          }
        }
        .save-load-backup-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 16px;
          align-items: center;
        }
        .save-load-file-input {
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
        .save-load-backup-panel {
          position: relative;
        }
      `}</style>
    </div>
  );
};
