import React, { useState, useEffect } from 'react';
import { useGame } from '../core/GameContext';
import { GameState } from '../core/types';
import { audioManager } from '../core/AudioManager';

interface SaveSlot {
    id: number;
    timestamp: string;
    playerName: string;
    chapter: number;
    location: string;
}

export const SaveLoad: React.FC = () => {
    const { state, setScene, updateGameState, loadGame } = useGame();
    const [slots, setSlots] = useState<SaveSlot[]>([]);
    const [status, setStatus] = useState<string | null>(null);

    useEffect(() => {
        refreshSlots();
    }, []);

    const refreshSlots = () => {
        const metadataRaw = localStorage.getItem('neo_sf_slots');
        if (metadataRaw) {
            setSlots(JSON.parse(metadataRaw));
        } else {
            setSlots([]);
        }
    };

    const handleSave = (id: number) => {
        const newSlot: SaveSlot = {
            id,
            timestamp: new Date().toLocaleString(),
            playerName: state.profile.name,
            chapter: state.profile.progress.chapter ?? 1,
            location: state.location
        };

        const updatedSlots = [...slots.filter(s => s.id !== id), newSlot].sort((a,b) => a.id - b.id);
        
        localStorage.setItem(`neo_sf_save_${id}`, JSON.stringify(state));
        localStorage.setItem('neo_sf_slots', JSON.stringify(updatedSlots));
        
        setSlots(updatedSlots);
        audioManager.playSFX('select');
        setStatus(`SYNCCONFIRM: Data serialized to Node ${id}`);
        setTimeout(() => setStatus(null), 3000);
    };

    const handleLoad = (id: number) => {
        const saved = localStorage.getItem(`neo_sf_save_${id}`);
        if (saved) {
            const parsed = JSON.parse(saved);
            // In a real app we'd validate here, but loadGame handles state sync
            localStorage.setItem('neo_sf_save', saved); // Set as primary for the context to pick up
            if (loadGame()) {
                audioManager.playSFX('menu_open');
                setStatus(`LINKRESTORED: Connecting to Instance ${id}`);
                setTimeout(() => setScene('MAIN_MENU'), 1200);
            }
        }
    };

    return (
        <div className="save-load-scene fade-in" style={{ height: '100vh', padding: '60px', background: '#03050a', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <header style={{ marginBottom: '40px' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', letterSpacing: '0.24rem' }}>SYSTEM_UTILITY / DATA_SERIALIZATION</div>
                <h1 className="glow-text" style={{ fontSize: '3.2rem', fontWeight: 900, marginTop: '10px' }}>SNAPSHOT_RECOVERY</h1>
                {status && <div className="fade-in" style={{ marginTop: '12px', color: 'var(--accent-yellow)', fontWeight: 800 }}>{status}</div>}
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', flex: 1 }}>
                {[0, 1, 2].map(id => {
                    const slot = slots.find(s => s.id === id);
                    return (
                        <div key={id} className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(121,247,255,0.1)' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>INSTANCE_NODE_0{id + 1}</div>
                            
                            <div style={{ flex: 1 }}>
                                {slot ? (
                                    <>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{slot.playerName.toUpperCase()}</div>
                                        <div style={{ marginTop: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                            CHAPTER_0{slot.chapter} // {slot.location}
                                        </div>
                                        <div style={{ marginTop: '20px', fontSize: '0.7rem', opacity: 0.4 }}>
                                            LAST SYNC: {slot.timestamp}
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.1)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                        NO DATA FOUND
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <button className="neo-button" onClick={() => handleSave(id)} style={{ padding: '12px', fontSize: '0.8rem', justifyContent: 'center' }}>
                                    OVERWRITE
                                </button>
                                <button className="neo-button primary" onClick={() => handleLoad(id)} disabled={!slot} style={{ padding: '12px', fontSize: '0.8rem', justifyContent: 'center' }}>
                                    RESTORE
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button 
                className="champion-button champion-button-ghost" 
                onClick={() => setScene('MAIN_MENU')}
                style={{ alignSelf: 'center', marginTop: '40px' }}
            >
                RETURN_TO_CORE
            </button>
        </div>
    );
};
