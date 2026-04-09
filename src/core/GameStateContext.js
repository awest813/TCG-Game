import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const INITIAL_QUEST = "Tutorial: Talk to Maya in your Apartment";
const DEFAULT_PROFILE = {
    name: "Neo_Rookie",
    currency: 1250,
    level: 1,
    xp: 0,
    inventory: {
        cards: [
            "ziprail", "ziprail", "neon-striker", "neon-striker",
            "voltlynx", "voltlynx", "signalmite", "signalmite",
            "quick-transfer", "quick-transfer", "rooftop-remedy", "rooftop-remedy",
            "iron-mite", "iron-mite", "mosshop", "mosshop"
        ],
        packs: ["Metro Pulse", "Metro Pulse"],
        deck: [
            "ziprail", "ziprail", "neon-striker", "neon-striker",
            "voltlynx", "voltlynx", "signalmite", "signalmite",
            "quick-transfer", "quick-transfer", "rooftop-remedy", "rooftop-remedy"
        ],
        items: ["Basic Holo-Sleeve"]
    },
    mainBioSync: {
        id: "ziprail-p1",
        species: "Ziprail",
        happiness: 80,
        hunger: 20,
        bondLevel: 1
    },
    primaryPartner: {
        id: "ziprail-p1",
        species: "Ziprail",
        happiness: 80,
        hunger: 20,
        bondLevel: 1
    },
    badges: [],
    stats: {
        wins: 0,
        losses: 0,
        tournamentsWon: 0,
        cardsCollected: 16
    },
    progress: {
        unlockedDistricts: ["APARTMENT", "SUNSET_TERMINAL"],
        flags: {},
        storyProgress: 0,
        chapter: 1
    }
};
const GameContext = createContext(undefined);
export const GameProvider = ({ children }) => {
    const [state, setState] = useState({
        profile: DEFAULT_PROFILE,
        currentScene: "MAIN_MENU",
        location: "APARTMENT",
        timeOfDay: "MORNING",
        currentQuest: "Explore Sunset Terminal",
        activeTournament: null
    });
    const setScene = (scene) => {
        setState(prev => (Object.assign(Object.assign({}, prev), { currentScene: scene })));
    };
    const updateProfile = (update) => {
        setState(prev => (Object.assign(Object.assign({}, prev), { profile: Object.assign(Object.assign({}, prev.profile), update) })));
    };
    const updateGameState = (update) => {
        setState(prev => (Object.assign(Object.assign({}, prev), update)));
    };
    const advanceTime = () => {
        const times = ["MORNING", "AFTERNOON", "EVENING"];
        const currentIndex = times.indexOf(state.timeOfDay);
        const nextIndex = (currentIndex + 1) % times.length;
        setState(prev => (Object.assign(Object.assign({}, prev), { timeOfDay: times[nextIndex] })));
    };
    const saveGame = () => {
        localStorage.setItem('neo_sf_save', JSON.stringify(state));
        console.log("Game Saved");
    };
    const loadGame = () => {
        const saved = localStorage.getItem('neo_sf_save');
        if (saved) {
            setState(JSON.parse(saved));
            return true;
        }
        return false;
    };
    const resetGame = () => {
        setState({
            profile: DEFAULT_PROFILE,
            currentScene: "APARTMENT",
            location: "APARTMENT",
            timeOfDay: "MORNING",
            currentQuest: INITIAL_QUEST,
            activeTournament: null
        });
    };
    return (_jsx(GameContext.Provider, { value: { state, setScene, updateProfile, updateGameState, advanceTime, saveGame, loadGame, resetGame }, children: children }));
};
export const useGame = () => {
    const context = useContext(GameContext);
    if (!context)
        throw new Error("useGame must be used within GameProvider");
    return context;
};
