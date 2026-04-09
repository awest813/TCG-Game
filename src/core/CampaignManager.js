export const CHAPTERS = [
    {
        id: 1,
        title: "Sunset Terminal Local Rise",
        district: "SUNSET_TERMINAL",
        quests: ["explore-terminal", "defeat-kaizen", "buy-first-pack"]
    },
    {
        id: 2,
        title: "Market Central Pressure",
        district: "MARKET_CENTRAL",
        quests: ["visit-trade-hub", "defeat-vex", "enter-open-tourney"]
    },
    {
        id: 3,
        title: "Arc 2: Neon Mission Circuit",
        district: "NEON_MISSION",
        quests: ["win-arcade-clash", "defeat-luna", "circuit-entry"]
    },
    {
        id: 4,
        title: "Arc 2: Bayline Harbor Trials",
        district: "BAYLINE_WHARF",
        quests: ["visit-tide-deck", "defeat-maya-pro", "harbor-championship"]
    },
    {
        id: 5,
        title: "Arc 3: Redwood Prestige",
        district: "REDWOOD_HEIGHTS",
        quests: ["rooftop-invite", "collector-duel", "garden-social"]
    },
    {
        id: 6,
        title: "Arc 4: Civic Crown Finals",
        district: "CIVIC_CROWN",
        quests: ["league-registration", "semi-finals", "grand-finals"]
    }
];
export class CampaignManager {
    static getNextQuest(state) {
        const currentChapter = CHAPTERS.find(c => c.id === state.profile.progress.storyProgress + 1);
        if (!currentChapter)
            return "City Legend Status Achieved";
        return currentChapter.quests[0];
    }
    static advanceStory(state) {
        const nextProgress = state.profile.progress.storyProgress + 1;
        const nextChapter = CHAPTERS.find(c => c.id === nextProgress + 1);
        const unlocked = [...state.profile.progress.unlockedDistricts];
        if (nextChapter && !unlocked.includes(nextChapter.district)) {
            unlocked.push(nextChapter.district);
        }
        return {
            profile: Object.assign(Object.assign({}, state.profile), { progress: Object.assign(Object.assign({}, state.profile.progress), { storyProgress: nextProgress, unlockedDistricts: unlocked }) }),
            currentQuest: nextChapter ? nextChapter.quests[0] : "Explore the City"
        };
    }
}
