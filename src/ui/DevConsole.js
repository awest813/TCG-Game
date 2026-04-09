import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useGame } from '../core/GameStateContext';
export const DevConsole = ({ onClose }) => {
    const { setScene, updateProfile } = useGame();
    const scenes = [
        'MAIN_MENU', 'APARTMENT', 'DISTRICT_EXPLORE',
        'DECK_EDITOR', 'STORE', 'TOURNAMENT',
        'TRANSIT', 'PROFILE', 'BATTLE'
    ];
    return (_jsxs("div", { style: {
            position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(5, 5, 20, 0.95)', border: '2px solid var(--accent-yellow)',
            borderRadius: '10px', padding: '30px', zIndex: 9999, boxShadow: '0 0 50px rgba(255, 234, 0, 0.2)',
            minWidth: '600px'
        }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }, children: [_jsx("h3", { style: { color: 'var(--accent-yellow)', margin: 0, letterSpacing: '4px' }, children: "DEBUG_OVERRIDE_CONSOLE_v1" }), _jsx("button", { onClick: onClose, style: { background: 'none', border: 'none', color: 'white', cursor: 'pointer' }, children: "[X]" })] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }, children: scenes.map(s => (_jsxs("button", { className: "neo-button", style: { fontSize: '0.7rem' }, onClick: () => { setScene(s); onClose(); }, children: ["JUMP_TO: ", s] }, s))) }), _jsxs("div", { style: { marginTop: '30px', display: 'flex', gap: '20px' }, children: [_jsx("button", { className: "neo-button primary", onClick: () => updateProfile({ currency: 99999 }), children: "+99999 DP" }), _jsx("button", { className: "neo-button primary", onClick: () => updateProfile({ xp: 5000 }), children: "MAX SYNC" })] }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: '0.6rem', marginTop: '20px' }, children: "* USE WITH CAUTION. OVERWRITES CURRENT LOGIC FLOW." })] }));
};
