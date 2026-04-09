export const TOURNAMENT_TIERS = [
    {
        id: "rookie-scrim",
        name: "Casual Under-Circuit",
        description: "Zero fees. Low stakes. Perfect for testing new deck engines.",
        locationId: "sunset-station",
        entryFee: 0,
        baseReward: 200,
        rarityMultiplier: 1.0,
        enemyLevelRange: [1, 3],
        isEndless: false
    },
    {
        id: "market-pro-am",
        name: "Grand Interchange Pro-Am",
        description: "Official circuit entry. Entry fee required. Serious rewards for serious duelists.",
        locationId: "market-street",
        entryFee: 500,
        baseReward: 1500,
        rarityMultiplier: 1.5,
        enemyLevelRange: [3, 7],
        isEndless: false
    },
    {
        id: "neon-night-league",
        name: "Neon Night Elite",
        description: "Exclusive club circuit. High stakes for high rolls.",
        locationId: "neon-club",
        entryFee: 2000,
        baseReward: 6000,
        rarityMultiplier: 2.2,
        enemyLevelRange: [7, 12],
        isEndless: false
    },
    {
        id: "crown-unlimited",
        name: "UNLIMITED CROWN GAUNTLET",
        description: "The Endless Circuit. Entry fee is massive. Rewards grow exponentially with every win. How long can your data stay stable?",
        locationId: "crown-hall",
        entryFee: 10000,
        baseReward: 25000,
        rarityMultiplier: 5.0,
        enemyLevelRange: [15, 99],
        isEndless: true
    }
];
