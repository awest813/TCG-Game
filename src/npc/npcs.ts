export type NPCArchetype = 'rival' | 'gym-master' | 'elite' | 'champion';

export interface NPC {
    id: string;
    name: string;
    role: string;
    archetype: NPCArchetype;
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
        archetype: "rival",
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
        archetype: "gym-master",
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
        archetype: "gym-master",
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
        archetype: "gym-master",
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
        archetype: "elite",
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
        archetype: "champion",
        dialogue: {
            MORNING: "I have stood atop the Civic Crown for five years. Why do you think today will be different?",
            AFTERNOON: "The Heart of the Circuit beats within me! Show me your passion, or fail here and now!",
            EVENING: "This is the final sync. Two souls, one arena, and the title of World Champion on the line!"
        },
        deck: ["omega-link", "royal-bloom", "tsunami-core", "stream-ace", "mirror-phantom"],
        location: "CIVIC_CROWN",
        activeTimes: ["MORNING", "AFTERNOON", "EVENING"],
        avatarColor: "#ffffff"
    },
    {
        id: "arborjun",
        name: "Arbor Jun",
        role: "Transit Scrubs Captain",
        archetype: "rival",
        dialogue: {
            MORNING: "Same platform, same bracket noise. If your opener is lazy, the log will embarrass you before I do.",
            AFTERNOON: "I have seen that line before — from three other duelists this week. Show me something the scouts have not logged yet.",
            EVENING: "Last train sync is soon. Win or lose, do not waste the night on excuses."
        },
        deck: ["signalmite", "mosshop", "spore-scout", "seedling-bot", "quick-transfer"],
        location: "SUNSET_TERMINAL",
        activeTimes: ["MORNING", "AFTERNOON", "EVENING"],
        avatarColor: "#9ccc7a"
    },
    {
        id: "brickhale",
        name: "Brick Hale",
        role: "Wharf Pickup Duelist",
        archetype: "rival",
        dialogue: {
            MORNING: "Cargo does not move itself — neither does a lazy board state. Wake up.",
            AFTERNOON: "You want Bayline respect? Trade clean, take prizes like an adult, and do not whine about tempo.",
            EVENING: "Fog is rolling in. Good. Makes the hits feel honest."
        },
        deck: ["wharfin", "coral-guard", "iron-mite", "shield-beetle", "wave-rider"],
        location: "BAYLINE_WHARF",
        activeTimes: ["MORNING", "AFTERNOON", "EVENING"],
        avatarColor: "#5aa4e8"
    },
    {
        id: "cursorwei",
        name: "Cursor Wei",
        role: "Grid Script Runner",
        archetype: "rival",
        dialogue: {
            MORNING: "Patch notes: your last bracket had unforced errors in turns two through four. Fix that today.",
            AFTERNOON: "I am running the same script until the city learns it. Try to break the loop — I dare you.",
            EVENING: "Neon bleed on the rails means nothing if your sequencing is still soft."
        },
        deck: ["ziprail", "neon-striker", "voltlynx", "signalmite", "quick-transfer"],
        location: "SUNSET_TERMINAL",
        activeTimes: ["AFTERNOON", "EVENING"],
        avatarColor: "#66d4d4"
    },
    {
        id: "dahlbloom",
        name: "Dahl Bloom",
        role: "Annex Floor Coach",
        archetype: "rival",
        dialogue: {
            MORNING: "Welcome to the annex floor. We grow patience here — and punish greed.",
            AFTERNOON: "Good trades look like gardening: prune the wrong line, feed the right one.",
            EVENING: "If you are still standing, you earned water and one honest critique."
        },
        deck: ["seedling-bot", "solar-rose", "bloom-whisper", "mosshop", "verdajack"],
        location: "MARKET_CENTRAL",
        activeTimes: ["MORNING", "AFTERNOON", "EVENING"],
        avatarColor: "#7fdc8f"
    },
    {
        id: "echorye",
        name: "Echo Rye",
        role: "Backroom Odds Grinder",
        archetype: "rival",
        dialogue: {
            MORNING: "Odds opened ugly for you. Prove the book wrong — or become a footnote.",
            AFTERNOON: "Crowd wants blood. I want clean lines. Guess which one pays my rent.",
            EVENING: "Night market rules: no refunds on bad reads."
        },
        deck: ["neon-striker", "mirror-phantom", "void-wisp", "hollow-glitch", "signal-boost"],
        location: "NEON_MISSION",
        activeTimes: ["AFTERNOON", "EVENING"],
        avatarColor: "#e07a5a"
    },
    {
        id: "fablekin",
        name: "Fable Kin",
        role: "Storyboard Skirmisher",
        archetype: "rival",
        dialogue: {
            MORNING: "Episode one: arrogant challenger enters. Try not to be a cliché.",
            AFTERNOON: "That was a good beat — now earn the twist.",
            EVENING: "Roll credits? Not yet. One more scene under the lights."
        },
        deck: ["mirror-phantom", "stream-ace", "neon-striker", "void-rift", "signal-boost"],
        location: "NEON_MISSION",
        activeTimes: ["MORNING", "AFTERNOON", "EVENING"],
        avatarColor: "#c45cff"
    },
    {
        id: "gatsbyvolt",
        name: "Gatsby Volt",
        role: "Interchange Speed Dealer",
        archetype: "rival",
        dialogue: {
            MORNING: "Cables, adapters, tempo — all inventory. What are you buying today?",
            AFTERNOON: "Speed is not vibes. It is volts and discipline. Pay up or get left behind.",
            EVENING: "Market closes soon. Last chance to make the highlight reel."
        },
        deck: ["ziprail", "overdrive-fox", "voltlynx", "battery-cat", "power-cell"],
        location: "MARKET_CENTRAL",
        activeTimes: ["MORNING", "AFTERNOON", "EVENING"],
        avatarColor: "#ffd447"
    },
    {
        id: "harborsue",
        name: "Harbor Sue",
        role: "Tide League Qualifier",
        archetype: "rival",
        dialogue: {
            MORNING: "Tide is low. Good day to grind fundamentals without excuses.",
            AFTERNOON: "You can hear the water if you stop talking over it. Listen — then play.",
            EVENING: "Moon on the wharf means heavy hits. Brace."
        },
        deck: ["tidal-whale", "wave-rider", "mist-glider", "coral-guard", "tsunami-core"],
        location: "BAYLINE_WHARF",
        activeTimes: ["MORNING", "AFTERNOON", "EVENING"],
        avatarColor: "#4b8bcd"
    },
    {
        id: "irisneon",
        name: "Iris Neon",
        role: "Pulse Satellite",
        archetype: "rival",
        dialogue: {
            MORNING: "Maglev sync is clean today. Do not be the glitch in the line.",
            AFTERNOON: "Fortress or rush — pick a lane and commit. Half-measures lose brackets.",
            EVENING: "Night shift duelists either sharpen or rust. Which are you?"
        },
        deck: ["rail-bastion", "shield-drone", "fortress-walker", "ziprail", "neon-striker"],
        location: "MARKET_CENTRAL",
        activeTimes: ["MORNING", "AFTERNOON", "EVENING"],
        avatarColor: "#5ef0f0"
    },
    {
        id: "jettline",
        name: "Jett Line",
        role: "Counter Run Analyst",
        archetype: "rival",
        dialogue: {
            MORNING: "I logged your last run. The variance was not luck — it was sequencing.",
            AFTERNOON: "Numbers do not care about your narrative. Show me clean EV.",
            EVENING: "If you are tired, go home. If you are here, duel like you mean it."
        },
        deck: ["signalmite", "data-diver", "system-refresh", "quick-transfer", "stream-ace"],
        location: "MARKET_CENTRAL",
        activeTimes: ["MORNING", "AFTERNOON", "EVENING"],
        avatarColor: "#f2d38a"
    },
    {
        id: "korimist",
        name: "Kori Mist",
        role: "Fogline Tactician",
        archetype: "rival",
        dialogue: {
            MORNING: "Fog hides mistakes — briefly. I still see them.",
            AFTERNOON: "Quiet board, loud intent. Try to keep up without shouting.",
            EVENING: "When the mist thickens, only fundamentals survive."
        },
        deck: ["mist-glider", "wharfin", "void-wisp", "shadow-prowler", "coral-guard"],
        location: "BAYLINE_WHARF",
        activeTimes: ["MORNING", "EVENING"],
        avatarColor: "#7ec8e8"
    },
    {
        id: "ledgermo",
        name: "Ledger Mo",
        role: "Regional Gatekeeper",
        archetype: "rival",
        dialogue: {
            MORNING: "Regional paperwork is boring. Your deck does not have to be.",
            AFTERNOON: "Every prize is taxed in tempo. Pay quietly.",
            EVENING: "Gate stays closed until someone proves they belong. Step up."
        },
        deck: ["iron-mite", "shield-beetle", "alloy-titan", "rail-bastion", "fortress-walker"],
        location: "SUNSET_TERMINAL",
        activeTimes: ["MORNING", "AFTERNOON", "EVENING"],
        avatarColor: "#b8a878"
    },
    {
        id: "mikastream",
        name: "Mika Stream",
        role: "Broadcast Rookie",
        archetype: "rival",
        dialogue: {
            MORNING: "Chat is awake. Do something clip-worthy or get scrolled past.",
            AFTERNOON: "Hot draws only matter if you convert — entertain me with discipline.",
            EVENING: "Raid lights are on. No coward lines after dark."
        },
        deck: ["stream-ace", "neon-striker", "mirror-phantom", "signal-boost", "data-diver"],
        location: "SUNSET_TERMINAL",
        activeTimes: ["AFTERNOON", "EVENING"],
        avatarColor: "#ff8a65"
    },
    {
        id: "novapulse",
        name: "Nova Pulse",
        role: "Pro-Am Wildcard",
        archetype: "rival",
        dialogue: {
            MORNING: "Seeding is a suggestion. Upsets are a lifestyle.",
            AFTERNOON: "You look expensive on paper. Let us see if you are expensive on board.",
            EVENING: "Pro-am lights hit different when you are the one nobody picked."
        },
        deck: ["voltlynx", "overdrive-fox", "ziprail", "neon-striker", "overclock"],
        location: "MARKET_CENTRAL",
        activeTimes: ["MORNING", "AFTERNOON", "EVENING"],
        avatarColor: "#ff6b9d"
    },
    {
        id: "onyxveil",
        name: "Onyx Veil",
        role: "Shadow Broker",
        archetype: "rival",
        dialogue: {
            MORNING: "Shadows keep receipts. So do I.",
            AFTERNOON: "You think you see win-con. Cute.",
            EVENING: "Neon dies. Void remains. Play like you understand that."
        },
        deck: ["shadow-prowler", "void-wisp", "veil-reaper", "mirror-phantom", "hollow-glitch"],
        location: "NEON_MISSION",
        activeTimes: ["AFTERNOON", "EVENING"],
        avatarColor: "#6b5b95"
    },
    {
        id: "paxbay",
        name: "Pax Bay",
        role: "Wharf Enforcer",
        archetype: "rival",
        dialogue: {
            MORNING: "Locals first. Tourists can watch — challengers can earn a seat.",
            AFTERNOON: "You want Tide respect? Trade like you mean it.",
            EVENING: "Water does not negotiate. Neither do I."
        },
        deck: ["tsunami-core", "wave-rider", "tidal-whale", "coral-guard", "wharfin"],
        location: "BAYLINE_WHARF",
        activeTimes: ["MORNING", "AFTERNOON", "EVENING"],
        avatarColor: "#3d7ea6"
    },
    {
        id: "riagarden",
        name: "Ria Garden",
        role: "Bloom Provisional",
        archetype: "elite",
        dialogue: {
            MORNING: "The garden opens early for those who tend their lines.",
            AFTERNOON: "Lovely deck. Shame if it wilts under pressure.",
            EVENING: "Moonlight makes every bloom sharper — and every mistake louder."
        },
        deck: ["bloom-monarch", "solar-rose", "lush-golem", "verdajack", "bloom-whisper"],
        location: "REDWOOD_HEIGHTS",
        activeTimes: ["MORNING", "AFTERNOON", "EVENING"],
        avatarColor: "#8effa7"
    },
    {
        id: "soragrid",
        name: "Sora Grid",
        role: "Lattice Control",
        archetype: "rival",
        dialogue: {
            MORNING: "I drew the lattice. Find the door — if you can.",
            AFTERNOON: "Control is not passive. It is a cage you walk opponents into.",
            EVENING: "Night grid hums. Your panic reads like static on my scope."
        },
        deck: ["rail-bastion", "shield-drone", "fortress-walker", "signalmite", "system-refresh"],
        location: "SUNSET_TERMINAL",
        activeTimes: ["MORNING", "AFTERNOON", "EVENING"],
        avatarColor: "#a8d8ff"
    },
    {
        id: "tavenalloy",
        name: "Taven Alloy",
        role: "Night Forge Duelist",
        archetype: "elite",
        dialogue: {
            MORNING: "Crown-side forgework starts before the crowd arrives. Heat first, applause later.",
            AFTERNOON: "Metal remembers every strike. So will you.",
            EVENING: "Temper your ego — or I will temper it for you."
        },
        deck: ["alloy-foundry", "alloy-titan", "rail-bastion", "shield-drone", "fortress-walker"],
        location: "CIVIC_CROWN",
        activeTimes: ["AFTERNOON", "EVENING"],
        avatarColor: "#d4af37"
    },
    {
        id: "yukirift",
        name: "Yuki Rift",
        role: "Voidline Prodigy",
        archetype: "rival",
        dialogue: {
            MORNING: "Static between turns is where I live. You are just visiting.",
            AFTERNOON: "Pretty plays. Now survive the quiet.",
            EVENING: "Rift opens. Step through — or fall in."
        },
        deck: ["void-rift", "void-wisp", "veil-reaper", "mirror-phantom", "hollow-glitch"],
        location: "NEON_MISSION",
        activeTimes: ["MORNING", "AFTERNOON", "EVENING"],
        avatarColor: "#9d7cff"
    }
];
