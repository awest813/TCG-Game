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
        role: "Rival Duelist",
        dialogue: {
            MORNING: "Hey! Don't tell me you're still sleeping? My deck and I have been training since dawn!",
            AFTERNOON: "You won't believe the new combo I pulled. Ready to feel the heat of a real battle?",
            EVENING: "We're going to the top of the Neo SF Circuit, you and me. Don't you dare lose before then!"
        },
        deck: ["ziprail", "neon-striker", "voltlynx", "overdrive-fox", "quick-transfer"],
        location: "SUNSET_TERMINAL",
        activeTimes: ["MORNING", "AFTERNOON", "EVENING"],
        avatarColor: "#ff00aa"
    },
    {
        id: "maya",
        name: "Maya",
        role: "Tide Club Master",
        dialogue: {
            MORNING: "The currents of destiny are shifting. Do you think your deck can handle the pressure?",
            AFTERNOON: "Like a crashing wave, my Tide-monsters will overwhelm your defenses! Prove your worth!",
            EVENING: "You possess a rare spark... keep that fire burning, and the Aqua Medal will be yours one day."
        },
        deck: ["wave-rider", "tsunami-core", "wharfin", "mist-glider", "system-refresh"],
        location: "BAYLINE_WHARF",
        activeTimes: ["AFTERNOON", "EVENING"],
        avatarColor: "#00aaff"
    },
    {
        id: "vex",
        name: "Vex",
        role: "Pulse Club Master",
        dialogue: {
            MORNING: "Speed is life, kid. If your sync isn't instant, you're already obsolete.",
            AFTERNOON: "My Pulse Deck moves faster than the maglev! Try to keep up if you want the Speed Medal!",
            EVENING: "Not bad... but to be a Champion, you need more than just fast cards. You need a soul that never stops."
        },
        deck: ["shield-drone", "fortress-walker", "ziprail", "neon-striker", "voltlynx"],
        location: "MARKET_CENTRAL",
        activeTimes: ["MORNING", "AFTERNOON"],
        avatarColor: "#ffea00"
    },
    {
        id: "luna",
        name: "LUNA",
        role: "Neon Club Master",
        dialogue: {
            MORNING: "The lights are rising! Today is the day we put on the greatest show in Neo SF history!",
            AFTERNOON: "Dueling is performance art! Let the neon glow reflect the brilliant bonds of your partners!",
            EVENING: "Even when the sun goes down, our spirits shine bright. Never let your light fade, duelist!"
        },
        deck: ["seedling-bot", "solar-rose", "bloom-monarch", "voltlynx", "neon-striker"],
        location: "NEON_MISSION",
        activeTimes: ["AFTERNOON", "EVENING"],
        avatarColor: "#7a00ff"
    },
    {
        id: "valerious",
        name: "Valerious",
        role: "Bloom Elite Master",
        dialogue: {
            MORNING: "Nature is the ultimate architect. Your deck... it lacks the elegance of a growing forest.",
            AFTERNOON: "To master the Bloom-type is to master life itself. Can you survive the thorns of my garden?",
            EVENING: "The night air brings out the strongest scents. One final duel before the moon peaks?"
        },
        deck: ["seedling-bot", "solar-rose", "bloom-monarch", "shield-drone", "fortress-walker"],
        location: "REDWOOD_HEIGHTS",
        activeTimes: ["AFTERNOON", "EVENING"],
        avatarColor: "#ff0000"
    },
    {
        id: "zeno",
        name: "ZENO",
        role: "Grand League Champion",
        dialogue: {
            MORNING: "I have stood atop the Civic Crown for five years. Why do you think today will be different?",
            AFTERNOON: "The Heart of the Circuit beats within me! Show me your passion, or fail here and now!",
            EVENING: "This is the final sync. Two souls, one arena, and the title of World Champion on the line!"
        },
        deck: ["omega-link", "royal-bloom", "tsunami-core", "stream-ace", "mirror-phantom"],
        location: "CIVIC_CROWN",
        activeTimes: ["MORNING", "AFTERNOON", "EVENING"],
        avatarColor: "#ffffff"
    }
];
