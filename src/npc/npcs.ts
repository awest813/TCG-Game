import { CreatureType } from "../core/types";

export interface NPC {
    id: string;
    name: string;
    role: string;
    dialogue: Record<string, string>; // timeOfDay -> text
    deck?: string[];
    location: string;
    activeTimes: ("MORNING" | "AFTERNOON" | "EVENING")[];
    avatarColor: string;
}

export const NPCS: NPC[] = [
    {
        id: "kaizen",
        name: "Kaizen",
        role: "Neighborhood Rival",
        dialogue: {
            MORNING: "You're up early. Training for the terminal open?",
            AFTERNOON: "Looking for a duel? My Pulse deck is ready.",
            EVENING: "Sunset Terminal is beautiful this time of day, isn't it?"
        },
        deck: ["ziprail", "neon-striker", "voltlynx", "overdrive-fox", "quick-transfer"],
        location: "SUNSET_TERMINAL",
        activeTimes: ["MORNING", "AFTERNOON", "EVENING"],
        avatarColor: "#ff00aa"
    },
    {
        id: "maya",
        name: "Maya",
        role: "Tide Specialist",
        dialogue: {
            MORNING: "The current is steady today.",
            AFTERNOON: "Slow and steady wins the match. Want to test your speed?",
            EVENING: "I'm heading to the cafe soon."
        },
        deck: ["wave-rider", "tsunami-core", "wharfin", "mist-glider", "system-refresh"],
        location: "BAYLINE_WHARF",
        activeTimes: ["AFTERNOON", "EVENING"],
        avatarColor: "#00aaff"
    },
    {
        id: "vex",
        name: "Vex",
        role: "Market Shark",
        dialogue: {
            MORNING: "Credit spreads look good. You look like a mark.",
            AFTERNOON: "Step into my office. And by office, I mean this dueling mat.",
            EVENING: "Business is booming. Go away unless you're buying."
        },
        deck: ["shield-drone", "fortress-walker", "ziprail", "neon-striker", "voltlynx"],
        location: "MARKET_CENTRAL",
        activeTimes: ["MORNING", "AFTERNOON"],
        avatarColor: "#ffea00"
    },
    {
        id: "luna",
        name: "LUNA",
        role: "Cyber Idol",
        dialogue: {
            MORNING: "Sound check is at noon. Don't be late!",
            AFTERNOON: "Everyone's watching. Make it a show!",
            EVENING: "The lights reflect everything in Neo SF."
        },
        deck: ["seedling-bot", "solar-rose", "bloom-monarch", "voltlynx", "neon-striker"],
        location: "NEON_MISSION",
        activeTimes: ["AFTERNOON", "EVENING"],
        avatarColor: "#7a00ff"
    },
    {
        id: "valerious",
        name: "Valerious",
        role: "Redwood Elite",
        dialogue: {
            MORNING: "The view from here is... acceptable.",
            AFTERNOON: "A deck is a work of art. Yours seems... incomplete.",
            EVENING: "Join me for a rooftop duel? The stakes are high."
        },
        deck: ["seedling-bot", "solar-rose", "bloom-monarch", "shield-drone", "fortress-walker"],
        location: "REDWOOD_HEIGHTS",
        activeTimes: ["AFTERNOON", "EVENING"],
        avatarColor: "#ff0000"
    },
    {
        id: "zeno",
        name: "ZENO",
        role: "Crown League Champion",
        dialogue: {
            MORNING: "Victory is the only result I accept.",
            AFTERNOON: "To standing atop the Civic Crown, you must be iron.",
            EVENING: "The circuit is closing soon. One last match?"
        },
        deck: ["omega-link", "royal-bloom", "tsunami-core", "stream-ace", "mirror-phantom"],
        location: "CIVIC_CROWN",
        activeTimes: ["MORNING", "AFTERNOON", "EVENING"],
        avatarColor: "#ffffff"
    },
    {
        id: "rin",
        name: "Rin Vale",
        role: "Rookie Pro",
        dialogue: {
            MORNING: "First to the shop gets the best pulls! That's my rule.",
            AFTERNOON: "My deck is hitting its peak resonance. Care for a test?",
            EVENING: "Long day of dueling. Sunset over the arcade is the best."
        },
        deck: ["ziprail", "neon-striker", "data-diver", "overclock", "system-refresh"],
        location: "MARKET_CENTRAL",
        activeTimes: ["MORNING", "AFTERNOON", "EVENING"],
        activeTimes: ["MORNING", "AFTERNOON", "EVENING"],
        avatarColor: "#ff4400"
    },
    {
        id: "azure",
        name: "Azure",
        role: "Card-Sport Idol",
        dialogue: {
            MORNING: "The sun is up, and so is the volume! Let's get tuned in.",
            AFTERNOON: "Rehearsals are going great. My deck is as sharp as my vocals!",
            EVENING: "Neon Mission looks beautiful from up here. Care for a spotlight duel?"
        },
        deck: ["neon-striker", "signal-boost", "overclock", "omega-link"],
        location: "NEON_MISSION",
        activeTimes: ["MORNING", "AFTERNOON", "EVENING"],
        avatarColor: "#00f2ff"
    },
    {
        id: "rin_summer",
        name: "Rin (Wharf)",
        role: "Beach Duelist",
        dialogue: {
            MORNING: "The tide is coming in... perfect for some water-type tech!",
            AFTERNOON: "Sand in my deck? Not a chance! My sleeves are waterproof.",
            EVENING: "Even at the beach, the circuit never stops. Ready?"
        },
        deck: ["wharfin", "tidal-whale", "tsunami-core", "wave-rider"],
        location: "BAYLINE_WHARF",
        activeTimes: ["MORNING", "AFTERNOON", "EVENING"],
        avatarColor: "#ffaa00"
    }
];
