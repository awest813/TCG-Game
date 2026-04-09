import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useGame } from '../core/GameStateContext';
import { SystemMenu } from './SystemMenu';
export const MainMenu = () => {
    const { loadGame, resetGame } = useGame();
    const [showSettings, setShowSettings] = useState(false);
    const [showAbout, setShowAbout] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    const [hasSaveData, setHasSaveData] = useState(false);
    const buildLabel = useMemo(() => 'BUILD v2.1.0 ALPHA', []);
    useEffect(() => {
        setHasSaveData(Boolean(localStorage.getItem('neo_sf_save')));
    }, []);
    useEffect(() => {
        if (!statusMessage) {
            return undefined;
        }
        const timeout = window.setTimeout(() => setStatusMessage(null), 3200);
        return () => window.clearTimeout(timeout);
    }, [statusMessage]);
    const handleNewGame = () => {
        resetGame();
    };
    const handleContinue = () => {
        if (loadGame()) {
            setStatusMessage('Link restored. Resuming your last session.');
            setHasSaveData(true);
            return;
        }
        setStatusMessage('No synced save found yet. Start a new career to create one.');
        setHasSaveData(false);
    };
    return (_jsxs("div", { className: "main-menu-scene fade-in", children: [_jsx("div", { className: "main-menu-backdrop" }), _jsx("img", { className: "main-menu-avatar", src: "/avatar_player.png", alt: "Protagonist" }), _jsxs("div", { className: "main-menu-layout", children: [_jsxs("section", { className: "main-menu-copy", children: [_jsx("div", { className: "main-menu-kicker", children: "Neo Street League Protocol" }), _jsx("h1", { className: "glow-text main-menu-title", children: "NEO SF" }), _jsxs("div", { className: "main-menu-subtitle-row", children: [_jsx("div", { className: "main-menu-rule" }), _jsx("div", { className: "main-menu-subtitle", children: "Champion Circuit" })] }), _jsx("p", { className: "main-menu-description", children: "Build your deck, push through district brackets, and climb from apartment scrims to citywide title matches." }), _jsxs("div", { className: "main-menu-actions", children: [_jsxs("button", { className: "champion-button champion-button-primary", onClick: handleNewGame, children: [_jsx("span", { className: "btn-number", children: "01" }), _jsxs("span", { className: "btn-copy", children: [_jsx("span", { className: "btn-text", children: "NEW CAREER" }), _jsx("span", { className: "btn-caption", children: "Restart from your apartment with a fresh starter list." })] })] }), _jsxs("button", { className: "champion-button", onClick: handleContinue, disabled: !hasSaveData, children: [_jsx("span", { className: "btn-number", children: "02" }), _jsxs("span", { className: "btn-copy", children: [_jsx("span", { className: "btn-text", children: "CONTINUE LINK" }), _jsx("span", { className: "btn-caption", children: hasSaveData ? 'Resume your last synced run.' : 'No local save detected yet.' })] })] }), _jsxs("button", { className: "champion-button champion-button-ghost", onClick: () => setShowSettings(true), children: [_jsx("span", { className: "btn-number", children: "03" }), _jsxs("span", { className: "btn-copy", children: [_jsx("span", { className: "btn-text", children: "SETTINGS" }), _jsx("span", { className: "btn-caption", children: "Adjust presentation, controls, and sync preferences." })] })] }), _jsxs("button", { className: "champion-button champion-button-ghost", onClick: () => setShowAbout((value) => !value), children: [_jsx("span", { className: "btn-number", children: "04" }), _jsxs("span", { className: "btn-copy", children: [_jsx("span", { className: "btn-text", children: showAbout ? 'HIDE DOSSIER' : 'ABOUT' }), _jsx("span", { className: "btn-caption", children: "View the project pitch and current control hints." })] })] })] }), _jsx("div", { className: `main-menu-status ${statusMessage ? 'visible' : ''}`, "aria-live": "polite", children: statusMessage !== null && statusMessage !== void 0 ? statusMessage : ' ' })] }), _jsxs("aside", { className: "main-menu-panel glass-panel", children: [_jsx("div", { className: "menu-panel-eyebrow", children: "Operator Feed" }), _jsxs("div", { className: "menu-panel-metric", children: [_jsx("span", { children: "Career State" }), _jsx("strong", { children: hasSaveData ? 'SYNC READY' : 'FRESH START' })] }), _jsxs("div", { className: "menu-panel-metric", children: [_jsx("span", { children: "Debug Console" }), _jsx("strong", { children: "Press `" })] }), _jsxs("div", { className: "menu-panel-metric", children: [_jsx("span", { children: "Primary Route" }), _jsx("strong", { children: "Apartment Hub" })] }), showAbout && (_jsxs("div", { className: "menu-about-card", children: [_jsx("h2", { children: "Champion Circuit" }), _jsx("p", { children: "A stylish single-player TCG RPG where city districts act like hubs, locals become rivals, and each bracket unlocks stronger card pools." }), _jsx("p", { children: "Current focus: smoother menu flow, stronger visual hierarchy, and cleaner transition into the playable scenes." })] })), _jsxs("div", { className: "main-menu-footer", children: [_jsx("div", { className: "glass-morphism build-chip", children: buildLabel }), _jsx("div", { className: "menu-footer-note", children: "Press settings for full-screen, audio, and data actions." })] })] })] }), showSettings && _jsx(SystemMenu, { onClose: () => setShowSettings(false) })] }));
};
