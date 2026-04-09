import React from 'react';
import { useGame } from '../core/GameStateContext';
import { TOURNAMENT_TEMPLATES, Tournament as TournamentDef } from '../core/TournamentManager';
import { NPCS } from '../npc/npcs';

export const Tournament: React.FC = () => {
  const { state, updateGameState, setScene } = useGame();
  
  const activeTourney: TournamentDef | null = state.activeTournament;

  const startTournament = (template: TournamentDef) => {
      updateGameState({ activeTournament: { ...template } });
  };

  const abandonTournament = () => {
      if (confirm("Are you sure you want to withdraw? Progress will be lost.")) {
          updateGameState({ activeTournament: null });
          setScene('DISTRICT_EXPLORE');
      }
  };

  if (!activeTourney) {
      // Selection Screen
      const available = TOURNAMENT_TEMPLATES.filter(t => t.district === state.location);
      
      return (
          <div className="tournament-scene fade-in" style={{ height: '100vh', padding: '60px' }}>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '30px', marginBottom: '60px' }}>
                  <h1 className="glow-text" style={{ fontSize: '3rem', margin: 0 }}>LOCAL EVENTS</h1>
                  <div style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', letterSpacing: '3px' }}>AVAILABLE CIRCUIT BRACKETS // {state.location}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px' }}>
                  {available.length > 0 ? available.map(t => (
                      <div key={t.id} className="glass-panel" style={{ padding: '40px', borderLeft: '10px solid var(--accent-cyan)' }}>
                          <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>{t.name}</h2>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '30px' }}>
                              STAGES: {t.matches.length} // REWARD: {t.rewardCredits}₡
                          </div>
                          <button className="neo-button primary" onClick={() => startTournament(t)}>ENTER BRACKET</button>
                      </div>
                  )) : (
                      <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', gridColumn: '1 / -1' }}>
                          <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>NO ACTIVE EVENTS IN THIS DISTRICT AT THIS TIME.</div>
                      </div>
                  )}
              </div>

              <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                  <button className="neo-button" onClick={() => setScene('DISTRICT_EXPLORE')}>RETURN TO STREETS</button>
              </div>
          </div>
      );
  }

  // Active Tournament Screen
  const currentMatch = activeTourney.matches.find(m => !m.isCompleted);

  return (
    <div className="tournament-scene fade-in" style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '30px', marginBottom: '60px' }}>
          <div>
            <h1 className="glow-text" style={{ fontSize: '3rem', margin: 0 }}>{activeTourney.name.toUpperCase()}</h1>
            <div style={{ color: 'var(--accent-magenta)', fontSize: '0.8rem', letterSpacing: '3px', marginTop: '5px' }}>CURRENT BRACKET AUTO-SYNCED</div>
          </div>
          <div className="glass-morphism" style={{ padding: '15px 30px', borderLeft: '5px solid var(--accent-magenta)' }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>STATUS</div>
              <div style={{ fontWeight: 'bold' }}>{currentMatch ? `ROUND ${currentMatch.round} ACTIVE` : 'TOURNAMENT COMPLETE'}</div>
          </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '60px', justifyContent: 'center', alignItems: 'center' }}>
          {activeTourney.matches.map((m, i) => {
              const opp = NPCS.find(n => n.id === m.opponentId);
              return (
                  <div key={i} className="glass-panel" style={{ 
                      padding: '40px', 
                      minWidth: '280px', 
                      opacity: m.isCompleted ? 0.3 : (currentMatch?.id === m.id ? 1 : 0.5),
                      border: currentMatch?.id === m.id ? '2px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.1)'
                  }}>
                      <h3 style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '2px', textAlign: 'center', marginBottom: '30px' }}>ROUND {m.round}</h3>
                      <div className="neo-button" style={{ 
                          fontSize: '1rem', 
                          textAlign: 'center', 
                          borderColor: m.isCompleted ? (m.wasWon ? 'var(--accent-cyan)' : 'var(--accent-magenta)') : 'white'
                      }}>
                          {opp?.name || "TBD"}
                      </div>
                      {m.isCompleted && (
                          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.7rem', color: m.wasWon ? 'var(--accent-cyan)' : 'var(--accent-magenta)' }}>
                              {m.wasWon ? "WIN" : "LOSS"}
                          </div>
                      )}
                  </div>
              );
          })}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', gap: '30px' }}>
          {currentMatch ? (
              <button className="neo-button primary" style={{ minWidth: '300px', height: '60px', fontSize: '1.1rem' }} onClick={() => setScene('BATTLE')}>
                  START ROUND {currentMatch.round}
              </button>
          ) : (
              <button className="neo-button primary" style={{ minWidth: '300px', height: '60px', fontSize: '1.1rem' }} onClick={() => {
                  // Reward Logic would go here
                  alert("Tournament Champion! Rewards distributed.");
                  updateGameState({ activeTournament: null });
                  setScene('DISTRICT_EXPLORE');
              }}>
                  CLAIM CHAMPION REWARDS
              </button>
          )}
          <button className="neo-button" style={{ minWidth: '150px' }} onClick={abandonTournament}>
              WITHDRAW
          </button>
      </div>
    </div>
  );
};
