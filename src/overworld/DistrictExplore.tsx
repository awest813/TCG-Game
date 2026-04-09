import React, { useState, useEffect } from 'react';
import { useGame } from '../core/GameStateContext';
import { DISTRICT_LOCATIONS } from '../data/locations';
import { NPCS, NPC } from '../npc/npcs';
import { SystemMenu } from '../ui/SystemMenu';
import '../styles/SceneVisuals.css';

export const DistrictExplore: React.FC = () => {
    const { state, setScene } = useGame();
    const [currentLocId, setCurrentLocId] = useState<string | null>(null);
    const [activeDialogue, setActiveDialogue] = useState<{npc: NPC, text: string} | null>(null);
    const [typedText, setTypedText] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const districtScenes = DISTRICT_LOCATIONS[state.location as keyof typeof DISTRICT_LOCATIONS] || [];
    
    useEffect(() => {
        if (!currentLocId && districtScenes.length > 0) {
            setCurrentLocId(districtScenes[0].id);
        }
    }, [state.location, districtScenes, currentLocId]);

    const currentLoc = districtScenes.find(l => l.id === currentLocId) || districtScenes[0];

    // Typing effect for dialogue
    useEffect(() => {
        if (activeDialogue) {
            setTypedText("");
            let i = 0;
            const interval = setInterval(() => {
                setTypedText(activeDialogue.text.slice(0, i + 1));
                i++;
                if (i >= activeDialogue.text.length) clearInterval(interval);
            }, 30);
            return () => clearInterval(interval);
        }
    }, [activeDialogue]);

    const handleAction = (action: any) => {
        if (action.type === 'SCENE_JUMP') {
            setIsTransitioning(true);
            setTimeout(() => {
                const dest = districtScenes.find(d => d.id === action.targetId);
                if (dest) setCurrentLocId(action.targetId);
                else setScene(action.targetId.toUpperCase());
                setIsTransitioning(false);
            }, 400);
        } else if (action.type === 'TRAVEL') {
            setScene('TRANSIT');
        } else if (action.type === 'TALK') {
            const npc = NPCS.find(n => n.id === action.targetId);
            if (npc) {
                setActiveDialogue({
                    npc,
                    text: npc.dialogue[state.timeOfDay] || "Duel with me!"
                });
            }
        } else if (action.type === 'SHOP') {
            setScene('STORE');
        } else if (action.type === 'DUEL' || action.type === 'EVENT') {
            setScene(action.type === 'DUEL' ? 'BATTLE' : 'TOURNAMENT');
        }
    };

    if (!currentLoc) return <div style={{ background: 'black', height: '100vh' }}>INITIALIZING METRO RELAY...</div>;

    return (
        <div className="explore-container fade-in" style={{ height: '100vh', position: 'relative', overflow: 'hidden', background: '#000' }}>
            {/* Visual Polish: Ken Burns Background */}
            <div className={`scene-background-container ${isTransitioning ? 'location-exit' : 'location-enter'}`} style={{ transition: 'opacity 0.4s ease' }}>
                <div className="alive-background" style={{ backgroundImage: `url(${currentLoc.backgroundImage})` }} />
                <div className="data-overlay" />
                
                {/* Visual Polish: Data Particle Field */}
                <div className="particle-field">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="data-particle" style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 10}s`,
                            opacity: Math.random() * 0.5
                        }} />
                    ))}
                </div>
            </div>

            {/* Top Bar: Sector Status */}
            <div style={{ position: 'absolute', top: 40, left: 40, zIndex: 10, display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div className="glass-panel" style={{ padding: '15px 30px', borderLeft: '5px solid var(--accent-cyan)', background: 'rgba(5,5,15,0.8)' }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '4px' }}>SECTOR_ACTIVE</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{currentLoc.name.toUpperCase()}</div>
                </div>
                <div className="glass-panel" style={{ padding: '15px 30px', background: 'rgba(5,5,15,0.8)' }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>TIME_CYCLE</div>
                    <div style={{ fontWeight: 'bold', color: 'var(--accent-yellow)' }}>{state.timeOfDay}</div>
                </div>
            </div>

            {/* Action Menu: High-End Retro Style */}
            {!activeDialogue && (
              <div style={{ position: 'absolute', right: 60, bottom: 60, zIndex: 10, display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-end' }}>
                {currentLoc.actions.map((action, i) => (
                    <button key={i} className="champion-button" 
                        style={{ minWidth: '300px', height: '60px', background: 'rgba(5,5,15,0.9)' }}
                        onClick={() => handleAction(action)}>
                        <span className="btn-number">0{i+1}</span>
                        <span className="btn-text">{action.label.toUpperCase()}</span>
                    </button>
                ))}
                <div style={{ height: '20px' }}></div>
                <button className="neo-button ghost" onClick={() => setShowSettings(true)}>SYSTEM CONFIG</button>
                <button className="neo-button ghost" onClick={() => setScene('TRANSIT')}>TRANSIT HUB</button>
              </div>
            )}

            {/* Location Flavor: Description Box */}
            {!activeDialogue && (
              <div className="glass-panel fade-in" style={{ position: 'absolute', left: 60, bottom: 60, width: '450px', padding: '30px', zIndex: 10, background: 'rgba(5,5,15,0.7)', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: '0.6rem', color: 'var(--accent-cyan)', marginBottom: '10px', letterSpacing: '2px' }}>ENVIRONMENT_LOG //</div>
                  <p style={{ margin: 0, fontSize: '1rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, fontStyle: 'italic' }}>"{currentLoc.description}"</p>
              </div>
            )}

            {/* Polish: Dialogue System Overlay */}
            {activeDialogue && (
                <div className="dialogue-overlay fade-in" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
                     <div style={{ position: 'relative', width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        <div className="dialogue-box" style={{ width: '100%', minHeight: '220px' }} onClick={() => setActiveDialogue(null)}>
                            <div className="dialogue-name-tag" style={{ background: activeDialogue.npc.avatarColor }}>{activeDialogue.npc.name.toUpperCase()} // {activeDialogue.npc.role.toUpperCase()}</div>
                            <div className="typing-text" style={{ fontSize: '1.8rem' }}>{typedText}</div>
                            <div style={{ position: 'absolute', right: 30, bottom: 20, fontSize: '0.7rem', color: 'var(--accent-cyan)', animation: 'pulse 1s infinite' }}>[ CLICK TO ADVANCE ]</div>
                        </div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            {activeDialogue.npc.deck && (
                                <button className="neo-button primary" style={{ width: '250px' }} onClick={() => setScene('BATTLE')}>CHALLENGE TO DUEL</button>
                            )}
                            <button className="neo-button" style={{ width: '150px' }} onClick={() => setActiveDialogue(null)}>END CONVERSATION</button>
                        </div>
                     </div>
                </div>
            )}

            {showSettings && <SystemMenu onClose={() => setShowSettings(false)} />}

            <style>{`
                .location-exit { opacity: 0; }
                .location-enter { opacity: 1; }
                @keyframes pulse { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }
            `}</style>
        </div>
    );
};
