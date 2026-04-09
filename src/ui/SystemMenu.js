import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useGame } from '../core/GameStateContext';
export const SystemMenu = ({ onClose }) => {
    const { saveGame, setScene } = useGame();
    const [volume, setVolume] = useState(80);
    const [animSpeed, setAnimSpeed] = useState('NORMAL');
    const [screenShake, setScreenShake] = useState(true);
    const [autoSave, setAutoSave] = useState(true);
    const [feedback, setFeedback] = useState(null);
    React.useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);
    const handleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((error) => {
                setFeedback(`Fullscreen failed: ${error.message}`);
            });
            return;
        }
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };
    const handleSave = () => {
        saveGame();
        setFeedback('Circuit data synced to local storage.');
    };
    const handleQuit = () => {
        setScene('MAIN_MENU');
        onClose();
    };
    return (_jsx("div", { className: "system-overlay fade-in", onClick: onClose, children: _jsxs("div", { className: "glass-panel system-menu-panel", onClick: (event) => event.stopPropagation(), children: [_jsx("div", { className: "system-menu-version", children: "v2.1.0 SYSTEM_CONFIG" }), _jsxs("div", { className: "system-menu-header", children: [_jsxs("div", { children: [_jsx("div", { className: "system-menu-kicker", children: "Operations" }), _jsx("h2", { className: "glow-text system-menu-title", children: "OPTIONS" })] }), _jsx("button", { onClick: onClose, className: "system-menu-close", "aria-label": "Close settings", children: "X" })] }), _jsxs("div", { className: "system-menu-grid", children: [_jsxs("div", { className: "system-setting-card", children: [_jsxs("div", { className: "setting-label", children: ["MASTER VOLUME ", _jsxs("span", { className: "setting-value", children: [volume, "%"] })] }), _jsx("input", { type: "range", min: "0", max: "100", value: volume, onChange: (e) => setVolume(parseInt(e.target.value, 10)), className: "neo-slider" })] }), _jsxs("div", { className: "system-setting-card", children: [_jsx("div", { className: "setting-label", children: "COMBAT FLOW" }), _jsx("div", { className: "setting-toggle-row", children: ['NORMAL', 'TURBO'].map((speed) => (_jsx("button", { onClick: () => setAnimSpeed(speed), className: `opt-btn ${animSpeed === speed ? 'active' : ''}`, children: speed }, speed))) })] }), _jsxs("div", { className: "system-setting-card", children: [_jsx("div", { className: "setting-label", children: "DISPLAY MODE" }), _jsx("button", { className: "neo-button", onClick: handleFullscreen, style: { width: '100%', fontSize: '0.8rem' }, children: "TOGGLE FULLSCREEN" })] }), _jsxs("div", { className: "system-setting-card", children: [_jsx("div", { className: "setting-label", children: "SCREEN SHAKE" }), _jsx("button", { onClick: () => setScreenShake(!screenShake), className: `opt-btn ${screenShake ? 'active' : ''}`, children: screenShake ? 'ENABLED' : 'DISABLED' })] }), _jsxs("div", { className: "system-setting-card", children: [_jsx("div", { className: "setting-label", children: "AUTO-SYNC" }), _jsx("button", { onClick: () => setAutoSave(!autoSave), className: `opt-btn ${autoSave ? 'active' : ''}`, children: autoSave ? 'ENABLED' : 'DISABLED' })] }), _jsxs("div", { className: "system-setting-card", children: [_jsx("div", { className: "setting-label", children: "CARD BACK STYLE" }), _jsx("div", { className: "system-setting-note", children: "DEFAULT_HEX // MODS_LOCKED" })] })] }), _jsx("div", { className: "system-menu-feedback", "aria-live": "polite", children: feedback !== null && feedback !== void 0 ? feedback : 'Press ESC or click outside the panel to close.' }), _jsxs("div", { className: "system-menu-actions", children: [_jsx("button", { className: "champion-button champion-button-primary compact", onClick: handleSave, children: "SYNC DATA" }), _jsx("button", { className: "champion-button compact", onClick: handleQuit, children: "RETURN TO MENU" })] })] }) }));
};
