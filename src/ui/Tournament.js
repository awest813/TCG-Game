import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useGame } from '../core/GameStateContext';
import { TOURNAMENT_TIERS } from '../core/TournamentManager';
import { NPCS } from '../npc/npcs';
export const Tournament = () => {
    var _a;
    const { state, updateGameState, updateProfile, setScene } = useGame();
    const activeTourney = state.activeTournament;
    const startTournament = (tier) => {
        if (state.profile.currency < tier.entryFee) {
            alert("Insufficient Credits for entry.");
            return;
        }
        updateProfile({ currency: state.profile.currency - tier.entryFee });
        const newActive = {
            tierId: tier.id,
            wins: 0,
            currentOpponentId: "kaizen",
            status: 'ACTIVE'
        };
        updateGameState({ activeTournament: newActive });
    };
    const cashOut = () => {
        if (!activeTourney)
            return;
        const tier = TOURNAMENT_TIERS.find(t => t.id === activeTourney.tierId);
        const finalReward = Math.floor(tier.baseReward * (1 + (activeTourney.wins * tier.rarityMultiplier)));
        alert(`Withdrawn from Circuit. Cashing out winning pot: ${finalReward}₡`);
        updateProfile({ currency: state.profile.currency + finalReward });
        updateGameState({ activeTournament: null });
        setScene('DISTRICT_EXPLORE');
    };
    if (!activeTourney) {
        const available = TOURNAMENT_TIERS.filter(() => {
            return true;
        });
        return (_jsxs("div", { className: "tournament-scene fade-in", style: {
                height: '100vh',
                padding: '60px',
                overflowY: 'auto',
                backgroundImage: 'url(/tournament_selection_bg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
            }, children: [_jsx("div", { className: "scanlines", style: { opacity: 0.1 } }), _jsxs("div", { style: { position: 'relative', zIndex: 2 }, children: [_jsxs("div", { style: { borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '30px', marginBottom: '60px', background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '10px' }, children: [_jsx("h1", { className: "glow-text", style: { fontSize: '3rem', margin: 0 }, children: "LOCAL EVENTS" }), _jsxs("div", { style: { color: 'var(--accent-cyan)', fontSize: '0.8rem', letterSpacing: '3px' }, children: ["AVAILABLE CIRCUIT BRACKETS // CURRENCY: ", state.profile.currency, "\u20A1"] })] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '30px' }, children: available.map(t => (_jsxs("div", { className: "glass-panel", style: {
                                    padding: '30px',
                                    borderLeft: `10px solid ${t.isEndless ? 'var(--accent-magenta)' : 'var(--accent-cyan)'}`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '15px',
                                    background: 'rgba(5,5,15,0.85)'
                                }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }, children: [_jsx("h2", { style: { fontSize: '1.5rem', fontWeight: 900 }, children: t.name.toUpperCase() }), t.isEndless && _jsx("div", { style: { background: 'var(--accent-magenta)', padding: '4px 8px', fontSize: '0.6rem', borderRadius: '4px' }, children: "ENDLESS" })] }), _jsx("p", { style: { fontSize: '0.8rem', opacity: 0.6, minHeight: '40px' }, children: t.description }), _jsxs("div", { className: "glass-morphism", style: { padding: '15px', display: 'flex', justifyContent: 'space-between' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.6rem', color: 'var(--text-secondary)' }, children: "ENTRY FEE" }), _jsxs("div", { style: { fontSize: '1.2rem', fontWeight: 'bold', color: t.entryFee > 0 ? 'var(--accent-yellow)' : 'var(--accent-cyan)' }, children: [t.entryFee, "\u20A1"] })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.6rem', color: 'var(--text-secondary)' }, children: "BASE REWARD" }), _jsxs("div", { style: { fontSize: '1.2rem', fontWeight: 'bold' }, children: [t.baseReward, "\u20A1"] })] })] }), _jsx("button", { className: `neo-button ${state.profile.currency >= t.entryFee ? 'primary' : ''}`, onClick: () => startTournament(t), disabled: state.profile.currency < t.entryFee, children: state.profile.currency >= t.entryFee ? 'ENTER BRACKET' : 'INSUFFICIENT FUNDS' })] }, t.id))) }), _jsx("div", { style: { marginTop: '60px', textAlign: 'center' }, children: _jsx("button", { className: "neo-button", onClick: () => setScene('DISTRICT_EXPLORE'), children: "RETURN TO STREETS" }) })] })] }));
    }
    const tier = TOURNAMENT_TIERS.find(t => t.id === activeTourney.tierId);
    const currentPot = Math.floor(tier.baseReward * (1 + (activeTourney.wins * tier.rarityMultiplier)));
    return (_jsxs("div", { className: "tournament-scene fade-in", style: {
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '60px',
            backgroundImage: 'url(/tournament_hall_bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
        }, children: [_jsx("div", { className: "scanlines", style: { opacity: 0.1 } }), _jsxs("div", { style: { position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '30px', background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '10px' }, children: [_jsxs("div", { children: [_jsx("h1", { className: "glow-text", style: { fontSize: '3rem', margin: 0 }, children: tier.name.toUpperCase() }), _jsxs("div", { style: { color: 'var(--accent-magenta)', fontSize: '0.8rem', letterSpacing: '3px', marginTop: '5px' }, children: ["WINS: ", activeTourney.wins, " // MULTIPLIER: x", tier.rarityMultiplier] })] }), _jsxs("div", { className: "glass-panel", style: { padding: '20px 40px', borderRight: '10px solid var(--accent-yellow)', background: 'rgba(5,5,15,0.9)' }, children: [_jsx("div", { style: { fontSize: '0.6rem', color: 'var(--text-secondary)' }, children: "ESTIMATED PAYOUT" }), _jsxs("div", { style: { fontSize: '2rem', fontWeight: 900 }, children: [currentPot, "\u20A1"] })] })] }), _jsxs("div", { style: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '40px' }, children: [_jsx("div", { style: { fontSize: '1rem', letterSpacing: '5px', opacity: 0.5 }, children: "UPCOMING_PROTOCOL" }), _jsxs("div", { className: "glass-panel", style: { padding: '60px', minWidth: '400px', textAlign: 'center', background: 'rgba(5,5,15,0.95)' }, children: [_jsx("div", { style: { fontSize: '0.7rem', color: 'var(--accent-cyan)', marginBottom: '10px' }, children: "OPPONENT_IDENTIFIED" }), _jsx("h2", { style: { fontSize: '2.5rem', fontWeight: 900, marginBottom: '40px' }, children: ((_a = NPCS.find(n => n.id === activeTourney.currentOpponentId)) === null || _a === void 0 ? void 0 : _a.name) || 'ELITE_BOT' }), _jsx("button", { className: "neo-button primary", style: { width: '100%', height: '60px' }, onClick: () => setScene('BATTLE'), children: "INITIATE SYNC BATTLE" })] })] }), _jsx("div", { style: { display: 'flex', justifyContent: 'center', gap: '20px', marginTop: 'auto' }, children: _jsx("button", { className: "neo-button", onClick: cashOut, children: "WITHDRAW & CASH OUT" }) })] })] }));
};
