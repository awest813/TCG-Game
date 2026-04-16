import { TOURNAMENT_TIERS } from '../core/TournamentManager';

/** Backgrounds must exist under `/public` (served from site root). Reuse shared art when a bespoke plate is not shipped. */
const tierDisplayName = (id: string) => TOURNAMENT_TIERS.find((t) => t.id === id)?.name ?? id;

/** Shop annex brackets (Card Annex). */
export const SHOP_BRACKET_ROUTE_HINT = ['shop-beginner-circuit', 'storefront-mini', 'shop-veteran-gauntlet'].map(tierDisplayName).join(' · ');

/** District majors + Crown (tournament lobby). */
export const CITY_MAJOR_ROUTE_HINT = ['rookie-scrim', 'market-pro-am', 'neon-night-league', 'crown-unlimited'].map(tierDisplayName).join(' · ');

export interface LocationAction {
    label: string;
    type: 'TALK' | 'DUEL' | 'SHOP' | 'TRAVEL' | 'EVENT' | 'SCENE_JUMP';
    targetId?: string; // npcId, sceneId, etc.
    /** Shown under the label in district explore (e.g. tournament tier names). */
    routeHint?: string;
}

export interface SceneLocation {
    id: string;
    name: string;
    districtId: string;
    backgroundImage: string;
    description: string;
    actions: LocationAction[];
}

export const DISTRICT_LOCATIONS: Record<string, SceneLocation[]> = {
    "SUNSET_TERMINAL": [
        {
            id: "home-bedroom",
            name: "Rookie Sync-Den",
            districtId: "SUNSET_TERMINAL",
            backgroundImage: "/assets/bg/onboarding-route.svg",
            description: "Your training room. Posters of Legendary Sync-Masters line the walls. Here, you and your partners prepare to conquer the Neo-Circuit!",
            actions: [
                { label: "Rest with Partners", type: "EVENT" },
                { label: "Sync Terminal", type: "SCENE_JUMP", targetId: "deck-editor" },
                { label: "Exit to Club Gates", type: "SCENE_JUMP", targetId: "sunset-station" }
            ]
        },
        {
            id: "sunset-station",
            name: "Sunset Club Gates",
            districtId: "SUNSET_TERMINAL",
            backgroundImage: "/assets/bg/deck-terminal.svg",
            description: "The gateway to your legend! Board the NEORail to find the 8 Grand Medals and reach the Civic Crown!",
            actions: [
                { label: "Card Annex", type: "SCENE_JUMP", targetId: "store", routeHint: SHOP_BRACKET_ROUTE_HINT },
                { label: "Bracket lobby", type: "SCENE_JUMP", targetId: "tournament", routeHint: CITY_MAJOR_ROUTE_HINT },
                { label: "Check Medal Count", type: "EVENT" },
                { label: "Board NEORail", type: "TRAVEL" },
                { label: "Return Home", type: "SCENE_JUMP", targetId: "home-bedroom" }
            ]
        }
    ],
    "BAYLINE_WHARF": [
        {
            id: "wharf-boardwalk",
            name: "The Tide Club",
            districtId: "BAYLINE_WHARF",
            backgroundImage: "/assets/fields/garden-haze.svg",
            description: "The official home of Tide-type duelists. Can you face the Club Master and earn the Aqua Medal?",
            actions: [
                { label: "Challenge Club Master", type: "TALK", targetId: "maya" },
                { label: "Visit Tide Shop", type: "SCENE_JUMP", targetId: "wharf-market" }
            ]
        },
        // ... (other Bayline items)
    ],
    "MARKET_CENTRAL": [
        {
            id: "market-street",
            name: "The Pulse Club",
            districtId: "MARKET_CENTRAL",
            backgroundImage: "/assets/bg/card-annex.svg",
            description: "The pulsing heart of the league! Masters of the Pulse-type gather here to test their speed in high-velocity duels.",
            actions: [
                { label: "Challenge Club Master", type: "TALK", targetId: "vex" },
                { label: "Buy Pro Booster", type: "SHOP" },
                { label: "Go to Stadium", type: "SCENE_JUMP", targetId: "market-plaza" }
            ]
        },
        {
            id: "market-plaza",
            name: "Championship Square",
            districtId: "MARKET_CENTRAL",
            backgroundImage: "/assets/bg/sweep-protocol.svg",
            description: "Where aspiring duelists dream of greatness. The huge screen tracks the world's most powerful Sync-Bonds!",
            actions: [
                { label: "Watch Master Duel", type: "EVENT" },
                { label: "Return to Pulse Club", type: "SCENE_JUMP", targetId: "market-street" }
            ]
        }
    ],
    "NEON_MISSION": [
        {
            id: "neon-plaza",
            name: "The Neon Club",
            districtId: "NEON_MISSION",
            backgroundImage: "/assets/bg/card-annex.svg",
            description: "A neon-lit arena where the flashy Veil-type masters rule the night. Are you brave enough to take their Medal?",
            actions: [
                { label: "Battle Street Master", type: "DUEL" },
                { label: "Enter Ultra Arcade", type: "SCENE_JUMP", targetId: "neon-arcade" }
            ]
        }
    ],
    "REDWOOD_HEIGHTS": [
        {
            id: "redwood-garden",
            name: "The Bloom Club",
            districtId: "REDWOOD_HEIGHTS",
            backgroundImage: "/assets/fields/battle-base.svg",
            description: "An elegant rooftop sanctuary for those who master the Bloom-types. Only the most graceful duelists survive here.",
            actions: [
                { label: "Challenge Master Valerious", type: "TALK", targetId: "valerious" },
                { label: "Visit Bloom Boutique", type: "SCENE_JUMP", targetId: "redwood-boutique" }
            ]
        }
    ],
    "CIVIC_CROWN": [
        {
            id: "crown-street",
            name: "Champion Road",
            districtId: "CIVIC_CROWN",
            backgroundImage: "/assets/bg/sweep-protocol.svg",
            description: "The final road to glory! Only those with 8 Medals may pass these gates into the Hall of Champions!",
            actions: [
                { label: "Show Medals to Guard", type: "EVENT" },
                { label: "Proceed to Stadium", type: "SCENE_JUMP", targetId: "crown-plaza" }
            ]
        },
        {
            id: "crown-plaza",
            name: "Hall of Champions",
            districtId: "CIVIC_CROWN",
            backgroundImage: "/assets/bg/sweep-protocol.svg",
            description: "The threshold of destiny. The greatest Sync-Masters in history are waiting for you inside.",
            actions: [
                { label: "Challenge Elite Four", type: "EVENT" },
                { label: "Enter Grand Arena", type: "SCENE_JUMP", targetId: "crown-arena" }
            ]
        },
        {
            id: "crown-arena",
            name: "The Grand Stadium",
            districtId: "CIVIC_CROWN",
            backgroundImage: "/assets/bg/sweep-protocol.svg",
            description: "The ultimate arena! Thousands of fans chant your name—step into the lights and become a Sonsotyo League legend!",
            actions: [
                { label: "FINAL DUEL: ZENO", type: "TALK", targetId: "zeno" }
            ]
        }
    ]
};
