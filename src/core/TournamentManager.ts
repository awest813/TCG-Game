import { BattleModifier } from "./types";

export interface TournamentMatch {
    id: string;
    opponentId: string;
    round: number;
    isCompleted: boolean;
    wasWon: boolean;
}

export interface Tournament {
    id: string;
    name: string;
    district: string;
    matches: TournamentMatch[];
    modifiers: BattleModifier[];
    rewardCredits: number;
    rewardPacks: string[];
}

export const TOURNAMENT_TEMPLATES: Tournament[] = [
    {
        id: "sunset-open",
        name: "Sunset Terminal Open",
        district: "SUNSET_TERMINAL",
        matches: [
            { id: "s1", opponentId: "maya", round: 1, isCompleted: false, wasWon: false },
            { id: "s2", opponentId: "kaizen", round: 2, isCompleted: false, wasWon: false }
        ],
        modifiers: [],
        rewardCredits: 500,
        rewardPacks: ["Metro Pulse"]
    },
    {
        id: "market-clash",
        name: "Market Central Trade Clash",
        district: "MARKET_CENTRAL",
        matches: [
            { id: "m1", opponentId: "vex", round: 1, isCompleted: false, wasWon: false }
        ],
        modifiers: [{ type: "MANA_START", value: 1 }],
        rewardCredits: 1000,
        rewardPacks: ["Neural Veil"]
    }
];
