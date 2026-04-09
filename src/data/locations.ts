export interface SceneLocation {
    id: string;
    name: string;
    districtId: string;
    backgroundImage: string;
    description: string;
    actions: LocationAction[];
}

export interface LocationAction {
    label: string;
    type: 'TALK' | 'DUEL' | 'SHOP' | 'TRAVEL' | 'EVENT' | 'SCENE_JUMP';
    targetId?: string; // npcId, sceneId, etc.
}

export const DISTRICT_LOCATIONS: Record<string, SceneLocation[]> = {
    "SUNSET_TERMINAL": [
        {
            id: "sunset-plaza",
            name: "Station Plaza",
            districtId: "SUNSET_TERMINAL",
            backgroundImage: "/sunset_terminal_bg.png",
            description: "The neighborhood's main transit hub. Always warm and bustling.",
            actions: [
                { label: "Talk to Kaizen", type: "TALK", targetId: "kaizen" },
                { label: "Check Event Board", type: "EVENT" },
                { label: "Head to Cafe", type: "SCENE_JUMP", targetId: "sunset-cafe" },
                { label: "Return to Apartments", type: "SCENE_JUMP", targetId: "sunset-apartments" }
            ]
        },
        {
            id: "sunset-apartments",
            name: "Sunset Apartments",
            districtId: "SUNSET_TERMINAL",
            backgroundImage: "/sunset_apartments_bg.png",
            description: "The brick-faced courtyard of your home block.",
            actions: [
                { label: "Enter Apartment", type: "SCENE_JUMP", targetId: "home" }, // Special jump
                { label: "Head to Plaza", type: "SCENE_JUMP", targetId: "sunset-plaza" }
            ]
        },
        {
            id: "sunset-cafe",
            name: "Cafe Patio",
            districtId: "SUNSET_TERMINAL",
            backgroundImage: "/sunset_cafe_bg.png",
            description: "A cozy spot overlooking the tracks. Good for deck discussion.",
            actions: [
                { label: "Hang out with Kaizen", type: "TALK", targetId: "kaizen" },
                { label: "Head to Plaza", type: "SCENE_JUMP", targetId: "sunset-plaza" }
            ]
        }
    ],
    "BAYLINE_WHARF": [
        {
            id: "wharf-boardwalk",
            name: "Harbor Boardwalk",
            districtId: "BAYLINE_WHARF",
            backgroundImage: "/bayline_wharf_bg.png",
            description: "Misty wooden planks and the scent of salt water.",
            actions: [
                { label: "Go to Pier Market", type: "SCENE_JUMP", targetId: "wharf-market" },
                { label: "Visit Ferry Terminal", type: "SCENE_JUMP", targetId: "wharf-ferry" },
                { label: "Approach Maya", type: "TALK", targetId: "maya" }
            ]
        },
        {
            id: "wharf-market",
            name: "Pier Market",
            districtId: "BAYLINE_WHARF",
            backgroundImage: "/bayline_market_bg.png",
            description: "Open-air stalls selling coastal card packs and tide gear.",
            actions: [
                { label: "Shop Tide Cards", type: "SHOP" },
                { label: "Enter Side Alley", type: "SCENE_JUMP", targetId: "wharf-alley" },
                { label: "Back to Boardwalk", type: "SCENE_JUMP", targetId: "wharf-boardwalk" }
            ]
        },
        {
            id: "wharf-alley",
            name: "Wharf Side-Alley",
            districtId: "BAYLINE_WHARF",
            backgroundImage: "/bayline_alley_bg.png",
            description: "A quiet, atmospheric passage filled with card-culture murals.",
            actions: [
                { label: "Look at Murals", type: "EVENT" },
                { label: "Back to Market", type: "SCENE_JUMP", targetId: "wharf-market" }
            ]
        },
        {
            id: "wharf-ferry",
            name: "Ferry Terminal",
            districtId: "BAYLINE_WHARF",
            backgroundImage: "/bayline_ferry_bg.png",
            description: "The departure point for cross-bay ferry lines.",
            actions: [
                { label: "Check Schedule", type: "EVENT" },
                { label: "Back to Boardwalk", type: "SCENE_JUMP", targetId: "wharf-boardwalk" }
            ]
        }
    ],
    "MARKET_CENTRAL": [
        {
            id: "market-interchange",
            name: "Grand Interchange",
            districtId: "MARKET_CENTRAL",
            backgroundImage: "/market_interchange_bg.png",
            description: "The beating heart of Neo SF's commerce and card league logistics.",
            actions: [
                { label: "Talk to Vex", type: "TALK", targetId: "vex" },
                { label: "Check League Rankings", type: "EVENT" },
                { label: "Head to Arcade", type: "SCENE_JUMP", targetId: "market-arcade" },
                { label: "Go Outside to Plaza", type: "SCENE_JUMP", targetId: "market-plaza" }
            ]
        },
        {
            id: "market-arcade",
            name: "Premium Arcade",
            districtId: "MARKET_CENTRAL",
            backgroundImage: "/market_alley_bg.png",
            description: "A hallway of high-end card boutiques and 'High Meta' flagship stores.",
            actions: [
                { label: "Enter Top Deck Shop", type: "SHOP" },
                { label: "Talk to Collectors", type: "EVENT" },
                { label: "Return to Interchange", type: "SCENE_JUMP", targetId: "market-interchange" }
            ]
        },
        {
            id: "market-plaza",
            name: "Central Plaza",
            districtId: "MARKET_CENTRAL",
            backgroundImage: "/market_plaza_bg.png",
            description: "A massive outdoor square with a fountain and towering neon card ads.",
            actions: [
                { label: "Watch Ads", type: "EVENT" },
                { label: "Return to Interchange", type: "SCENE_JUMP", targetId: "market-interchange" }
            ]
        },
        {
            id: "market-transit",
            name: "Metro Gate 6",
            districtId: "MARKET_CENTRAL",
            backgroundImage: "/market_transit_bg.png",
            description: "The high-traffic entrance to Market Central. Check the boards for the latest league seeds.",
            actions: [
                { label: "Board NEORail", type: "TRAVEL" },
                { label: "Check Seeds", type: "EVENT" },
                { label: "Enter Interchange", type: "SCENE_JUMP", targetId: "market-interchange" }
            ]
        }
    ],
    "NEON_MISSION": [
        {
            id: "neon-plaza",
            name: "Neon Plaza",
            districtId: "NEON_MISSION",
            backgroundImage: "/neon_mission_bg.png",
            description: "The electric heart of Neo SF's nightlife. Bills and beats are equally loud here.",
            actions: [
                { label: "Enter Zone X", type: "SCENE_JUMP", targetId: "neon-arcade" },
                { label: "Go to Club Spectrum", type: "SCENE_JUMP", targetId: "neon-club" },
                { label: "Check Showcase board", type: "EVENT" }
            ]
        },
        {
            id: "neon-arcade",
            name: "Zone X Arcade",
            districtId: "NEON_MISSION",
            backgroundImage: "/market_alley_bg.png",
            description: "A high-octane gaming arena where fast-paced duels are the main attraction.",
            actions: [
                { label: "Play Card-Arcade", type: "EVENT" },
                { label: "Talk to Pro-Gamer", type: "TALK", targetId: "rin" },
                { label: "Back to Plaza", type: "SCENE_JUMP", targetId: "neon-plaza" }
            ]
        },
        {
            id: "neon-club",
            name: "Club Spectrum",
            districtId: "NEON_MISSION",
            backgroundImage: "/spectrum_lounge_bg.png",
            description: "A trendy lounge where elite duelists gather to show off their rarest foils.",
            actions: [
                { label: "Visit Duel Bar", type: "TALK", targetId: "kaizen" },
                { label: "Back to Plaza", type: "SCENE_JUMP", targetId: "neon-plaza" }
            ]
        },
        {
            id: "neon-stage",
            name: "Azure Event Stage",
            districtId: "NEON_MISSION",
            backgroundImage: "/neon_mission_stage_bg.png",
            description: "A massive open-air stage dedicated to Card-Sport Idol performances and league finals.",
            actions: [
                { label: "Watch Azure Performance", type: "EVENT" },
                { label: "Talk to Azure", type: "TALK", targetId: "azure" },
                { label: "Back to Plaza", type: "SCENE_JUMP", targetId: "neon-plaza" }
            ]
        }
    ],
    "REDWOOD_HEIGHTS": [
        {
            id: "redwood-garden",
            name: "Rooftop Garden",
            districtId: "REDWOOD_HEIGHTS",
            backgroundImage: "/redwood_park_bg.png",
            description: "Exclusive serenity above the city clouds. The air smells like premium card stock and jasmine.",
            actions: [
                { label: "Talk to Valerious", type: "TALK", targetId: "valerious" },
                { label: "Enter Bloom Boutique", type: "SCENE_JUMP", targetId: "redwood-boutique" },
                { label: "Head to Skywalk", type: "SCENE_JUMP", targetId: "redwood-skywalk" }
            ]
        },
        {
            id: "redwood-boutique",
            name: "Collectable Boutique BLOOM",
            districtId: "REDWOOD_HEIGHTS",
            backgroundImage: "/redwood_boutique_bg.png",
            description: "A high-end gallery showcasing the most exquisite Bloom-type foils in Neo SF.",
            actions: [
                { label: "Browse Premium Collection", type: "SHOP" },
                { label: "Exhibition Duel", type: "EVENT" },
                { label: "Return to Garden", type: "SCENE_JUMP", targetId: "redwood-garden" }
            ]
        },
        {
            id: "redwood-skywalk",
            name: "Bloom Skywalk",
            districtId: "REDWOOD_HEIGHTS",
            backgroundImage: "/redwood_rooftop_bg.png",
            description: "A glass path overlooking the urban canopy of Neo SF. Perfect for twilight reflection.",
            actions: [
                { label: "Admire Horizon", type: "EVENT" },
                { label: "Back to Garden", type: "SCENE_JUMP", targetId: "redwood-garden" }
            ]
        }
    ],
    "CIVIC_CROWN": [
        {
            id: "crown-arena",
            name: "League Grand Arena",
            districtId: "CIVIC_CROWN",
            backgroundImage: "/civic_crown_stage_bg.png",
            description: "The ultimate proving ground where legends of the Neo SF Circuit are crowned in the Grand Finals.",
            actions: [
                { label: "Meet Champion Zeno", type: "TALK", targetId: "zeno" },
                { label: "Initialize Grand Finals", type: "EVENT" }
            ]
        }
    ]
};
