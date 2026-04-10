import React from 'react';
import { useGame } from '../core/GameContext';
import { TOURNAMENT_TIERS, TournamentTier } from '../core/TournamentManager';
import { NPCS } from '../npc/npcs';
import { ActiveTournament } from '../core/types';

export const Tournament: React.FC = () => {
  const { state, updateGameState, updateProfile, setScene } = useGame();
  
  const activeTourney: ActiveTournament | null = state.activeTournament;

  const startTournament = (tier: TournamentTier) => {
      if (state.profile.currency < tier.entryFee) {
          alert("Insufficient Credits for entry.");
          return;
      }

      updateProfile({ currency: state.profile.currency - tier.entryFee });
      
      const newActive: ActiveTournament = {
          tierId: tier.id,
          wins: 0,
          currentOpponentId: "kaizen", // Initial
          status: 'ACTIVE'
      };
      updateGameState({ activeTournament: newActive });
  };

  const cashOut = () => {
      if (!activeTourney) return;
      const tier = TOURNAMENT_TIERS.find(t => t.id === activeTourney.tierId)!;
      const finalReward = Math.floor(tier.baseReward * (1 + (activeTourney.wins * tier.rarityMultiplier)));
      
      alert(`Withdrawn from Circuit. Cashing out winning pot: ${finalReward}₡`);
      updateProfile({ currency: state.profile.currency + finalReward });
      updateGameState({ activeTournament: null });
      setScene('DISTRICT_EXPLORE');
  };

  if (!activeTourney) {
      // Selection Screen: Restricted by current district
      const available = TOURNAMENT_TIERS.filter(() => {
          // Find if this tier's scene is in current district (mock check)
          return true; // Simplification for demo
      });
      
      return (
          <div className="tournament-scene fade-in" style={{ 
            height: '100vh', 
            padding: '60px', 
            overflowY: 'auto',
            backgroundImage: 'url(/tournament_selection_bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}>
              <div className="scanlines" style={{ opacity: 0.1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '30px', marginBottom: '60px', background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '10px' }}>
                      <h1 className="glow-text" style={{ fontSize: '3rem', margin: 0 }}>LOCAL EVENTS</h1>
                      <div style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', letterSpacing: '3px' }}>AVAILABLE CIRCUIT BRACKETS // CURRENCY: {state.profile.currency}₡</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '30px' }}>
                      {available.map(t => (
                          <div key={t.id} className="glass-panel" style={{ 
                              padding: '30px', 
                              borderLeft: `10px solid ${t.isEndless ? 'var(--accent-magenta)' : 'var(--accent-cyan)'}`,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '15px',
                              background: 'rgba(5,5,15,0.85)'
                          }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{t.name.toUpperCase()}</h2>
                                {t.isEndless && <div style={{ background: 'var(--accent-magenta)', padding: '4px 8px', fontSize: '0.6rem', borderRadius: '4px' }}>ENDLESS</div>}
                              </div>
                              <p style={{ fontSize: '0.8rem', opacity: 0.6, minHeight: '40px' }}>{t.description}</p>
                              
                              <div className="glass-morphism" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between' }}>
                                 <div>
                                    <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>ENTRY FEE</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: t.entryFee > 0 ? 'var(--accent-yellow)' : 'var(--accent-cyan)' }}>{t.entryFee}₡</div>
                                 </div>
                                 <div>
                                    <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>BASE REWARD</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{t.baseReward}₡</div>
                                 </div>
                              </div>

                              <button 
                                className={`neo-button ${state.profile.currency >= t.entryFee ? 'primary' : ''}`} 
                                onClick={() => startTournament(t)}
                                disabled={state.profile.currency < t.entryFee}
                              >
                                 {state.profile.currency >= t.entryFee ? 'ENTER BRACKET' : 'INSUFFICIENT FUNDS'}
                              </button>
                          </div>
                      ))}
                  </div>

                  <div style={{ marginTop: '60px', textAlign: 'center' }}>
                      <button className="neo-button" onClick={() => setScene('DISTRICT_EXPLORE')}>RETURN TO STREETS</button>
                  </div>
              </div>
          </div>
      );
  }

  // Active Tournament Screen
  const tier = TOURNAMENT_TIERS.find(t => t.id === activeTourney.tierId)!;
  const currentPot = Math.floor(tier.baseReward * (1 + (activeTourney.wins * tier.rarityMultiplier)));

  return (
    <div className="tournament-scene fade-in" style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '60px',
        backgroundImage: 'url(/tournament_hall_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
    }}>
      <div className="scanlines" style={{ opacity: 0.1 }} />
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '30px', background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '10px' }}>
              <div>
                <h1 className="glow-text" style={{ fontSize: '3rem', margin: 0 }}>{tier.name.toUpperCase()}</h1>
                <div style={{ color: 'var(--accent-magenta)', fontSize: '0.8rem', letterSpacing: '3px', marginTop: '5px' }}>WINS: {activeTourney.wins} // MULTIPLIER: x{tier.rarityMultiplier}</div>
              </div>
              <div className="glass-panel" style={{ padding: '20px 40px', borderRight: '10px solid var(--accent-yellow)', background: 'rgba(5,5,15,0.9)' }}>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>ESTIMATED PAYOUT</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900 }}>{currentPot}₡</div>
              </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '40px' }}>
              <div style={{ fontSize: '1rem', letterSpacing: '5px', opacity: 0.5 }}>UPCOMING_PROTOCOL</div>
              <div className="glass-panel" style={{ padding: '60px', minWidth: '400px', textAlign: 'center', background: 'rgba(5,5,15,0.95)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', marginBottom: '10px' }}>OPPONENT_IDENTIFIED</div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '40px' }}>{NPCS.find(n => n.id === activeTourney.currentOpponentId)?.name || 'ELITE_BOT'}</h2>
                  <button className="neo-button primary" style={{ width: '100%', height: '60px' }} onClick={() => setScene('BATTLE')}>
                      INITIATE SYNC BATTLE
                  </button>
              </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: 'auto' }}>
              <button className="neo-button" onClick={cashOut}>
                   WITHDRAW & CASH OUT
              </button>
          </div>
      </div>
    </div>
);
};
