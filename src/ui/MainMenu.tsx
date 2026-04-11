import React, { useEffect, useMemo, useState } from 'react';
import { useGame } from '../core/GameContext';
import { NewGameConfig } from '../core/types';
import { SystemMenu } from './SystemMenu';
import { audioManager } from '../core/AudioManager';

const STARTER_OPTIONS: Array<{
  id: NewGameConfig['starter'];
  title: string;
  partner: string;
  summary: string;
  bullets: string[];
}> = [
  {
    id: 'Pulse',
    title: 'Pulse Rush',
    partner: 'Ziprail',
    summary: 'Fast starts, direct pressure, and easy-to-read aggressive turns.',
    bullets: ['Best for players who want clean early attacks', 'Learns tempo through direct damage and buffs', 'Starts with Metro Pulse packs']
  },
  {
    id: 'Bloom',
    title: 'Bloom Sustain',
    partner: 'Mosshop',
    summary: 'Healing, survivability, and forgiving board states for learning.',
    bullets: ['Best for slower, steadier play', 'Makes mistakes less punishing with healing', 'Starts with Garden Shift support']
  },
  {
    id: 'Tide',
    title: 'Tide Control',
    partner: 'Wharfin',
    summary: 'Draw tools, flexible responses, and more tactical pacing.',
    bullets: ['Best for players who like setup and decisions', 'Teaches resource flow and board control', 'Starts with Bayline-flavored utility']
  }
];

export const MainMenu: React.FC = () => {
  const { loadGame, resetGame, setScene } = useGame();
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [hasSaveData, setHasSaveData] = useState(false);
  const [playerName, setPlayerName] = useState('Neo Rookie');
  const [starter, setStarter] = useState<NewGameConfig['starter']>('Pulse');

  const selectedStarter = useMemo(() => STARTER_OPTIONS.find((option) => option.id === starter)!, [starter]);

  useEffect(() => {
    setHasSaveData(Boolean(localStorage.getItem('neo_sf_save')));
    audioManager.playSFX('phone_boot');
  }, []);

  const handleContinue = () => {
    if (loadGame()) {
      setStatusMessage('LINK_SUCCESS: SESSION_RESTORED.');
      setHasSaveData(true);
      return;
    }
    setStatusMessage('SYNC_ERROR: NO_DOCK_FOUND.');
  };

  const handleCreateCareer = () => {
    audioManager.playSFX('career_start');
    resetGame({
      name: playerName.trim() || 'Neo Rookie',
      starter
    });
  };

  return (
    <div className="main-menu-scene fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '24px' }}>
      
      {/* Header Panel */}
      <div className="glass-panel" style={{ padding: '24px 34px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
           <div className="tech-label">LOCAL_SYNC_AUTH</div>
           <h2 className="glow-text" style={{ fontSize: '2.4rem', fontWeight: 900, margin: '4px 0 0' }}>MAIN_CONCOURSE</h2>
        </div>
        <div style={{ textAlign: 'right' }}>
           <div className="tech-label" style={{ color: 'var(--accent-secondary)' }}>LIVE_NETWORK_ACTIVE</div>
           <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '4px' }}>TERMINAL_ID: 104-SFX</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
        
        {/* Navigation Grid using Glass-Bevel Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '18px' }}>
          <MenuNode 
            label="NEW_START" sub="INIT_RECRUIT" 
            primary onClick={() => setShowOnboarding(true)} 
            icon="+" 
          />
          <MenuNode 
            label="CONTINUE" sub="RESTORE_LINK" 
            disabled={!hasSaveData} onClick={handleContinue} 
            icon=">>" 
          />
          <MenuNode 
            label="ARCHIVE" sub="DATA_GALLERY" 
            onClick={() => setScene('PROFILE')} 
            icon="[V]" 
          />
          <MenuNode 
            label="LOADOUT" sub="SYNC_CARDS" 
            onClick={() => setScene('DECK_EDITOR')} 
            icon="[D]" 
          />
          <MenuNode 
            label="SYS_PREF" sub="GEAR_SYNC" 
            onClick={() => setShowSettings(true)} 
            icon="[C]" 
          />
          <MenuNode 
            label="RECOVERY" sub="BACKUP_MNG" 
            onClick={() => setScene('SAVE_LOAD')} 
            icon="[S]" 
          />
        </div>

        {/* Side Info Panel */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
            <h3 className="tech-label" style={{ marginBottom: '20px', borderBottom: '1px solid var(--accent-primary)', paddingBottom: '10px' }}>OS_DIAGNOSTICS</h3>
            
            <div style={{ display: 'grid', gap: '16px' }}>
                <DiagRow label="USER_ID" value={hasSaveData ? "REGISTERED" : "GUEST_LINK"} />
                <DiagRow label="AREA" value="SUNSET_HUB" />
                <DiagRow label="RESONANCE" value="STABLE" />
            </div>

            <div className="glass-panel" style={{ marginTop: '30px', padding: '18px', fontSize: '0.85rem', color: 'var(--accent-primary)', background: 'rgba(0,0,0,0.5)', borderRadius: '12px' }}>
                <span style={{ opacity: 0.5 }}>SIGNAL_READOUT:</span><br/>
                {statusMessage ?? "AWAIT_INIT: SYSTEM STANDBY."}
            </div>

            <div style={{ marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginBottom: '10px', opacity: 0.5 }}>
                    <span>SYNC_STRENGTH</span>
                    <span>94%</span>
                </div>
                <div className="glass-panel" style={{ height: '6px', background: 'rgba(0,0,0,0.4)', borderRadius: '3px', border: 'none' }}>
                    <div style={{ width: '94%', height: '100%', background: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-primary)' }} />
                </div>
            </div>
        </div>
      </div>

      {showOnboarding && (
        <div className="system-overlay fade-in" style={{ padding: '60px' }} onClick={() => setShowOnboarding(false)}>
          <div className="glass-panel" style={{ width: '880px', padding: '40px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px' }}>
              <div>
                <div className="tech-label">REGISTRATION_PROTOCOL</div>
                <h2 className="glow-text" style={{ fontSize: '3rem', fontWeight: 900 }}>CREATE_DUELIST_ID</h2>
              </div>
              <button onClick={() => setShowOnboarding(false)} className="neo-button" style={{ borderRadius: '12px' }}>CLOSE</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              <div>
                 <div style={{ marginBottom: '30px' }}>
                    <div className="tech-label" style={{ color: 'var(--text-main)', marginBottom: '10px', opacity: 0.6 }}>CALLSIGN_ASSIGNMENT</div>
                    <input 
                        className="glass-panel"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        style={{ width: '100%', padding: '16px', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', background: 'rgba(0,0,0,0.3)', fontSize: '1.1rem', borderRadius: '12px' }}
                    />
                 </div>
                 <div className="tech-label" style={{ color: 'var(--text-main)', marginBottom: '14px', opacity: 0.6 }}>PARTNER_LOADOUT_SYNC</div>
                 <div style={{ display: 'grid', gap: '12px' }}>
                    {STARTER_OPTIONS.map(opt => (
                        <button 
                            key={opt.id}
                            className={`neo-button ${starter === opt.id ? 'primary' : ''}`}
                            onClick={() => setStarter(opt.id)}
                            style={{ justifyContent: 'space-between', borderRadius: '12px' }}
                        >
                            <span>{opt.title}</span>
                            <span style={{ opacity: 0.6 }}>{opt.id.toUpperCase()}</span>
                        </button>
                    ))}
                 </div>
              </div>
              
              <div className="glass-panel" style={{ padding: '30px', background: 'rgba(0,0,0,0.4)', borderRadius: '20px' }}>
                 <h4 style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', marginBottom: '16px' }}>{selectedStarter.partner} LINK READY</h4>
                 <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.8)' }}>{selectedStarter.summary}</p>
                 <ul style={{ marginTop: '20px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', listStyle: 'none' }}>
                    {selectedStarter.bullets.map(b => <li key={b} style={{ marginBottom: '8px' }}>- {b}</li>)}
                 </ul>
                 <button 
                    className="neo-button primary" 
                    onClick={handleCreateCareer}
                    style={{ marginTop: '40px', width: '100%', justifyContent: 'center', height: '60px', fontSize: '0.9rem', borderRadius: '15px' }}
                >
                    INITIALIZE_SYNC_CYCLE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSettings && <SystemMenu onClose={() => setShowSettings(false)} />}
    </div>
  );
};

const MenuNode: React.FC<{ label: string; sub: string; icon: string; primary?: boolean; disabled?: boolean; onClick: () => void }> = ({ label, sub, icon, primary, disabled, onClick }) => (
    <button 
        disabled={disabled}
        onClick={() => { audioManager.playSFX('select'); onClick(); }}
        className={`neo-button ${primary ? 'primary' : ''}`}
        style={{ height: '100%', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', padding: '24px', opacity: disabled ? 0.3 : 1, borderRadius: '20px' }}
    >
        <div style={{ fontSize: '1.5rem', fontWeight: 900, opacity: 0.8 }}>{icon}</div>
        <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{label}</div>
            <div className="tech-label" style={{ opacity: 0.5, marginTop: '6px' }}>{sub}</div>
        </div>
    </button>
);

const DiagRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>{label}</span>
        <span style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{value}</span>
    </div>
);
