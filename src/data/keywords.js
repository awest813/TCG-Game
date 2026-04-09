export const KEYWORD_DEFINITIONS = {
    "Swift": "Active immediately. This creature can attack or use abilities on the same turn it is deployed.",
    "Guard": "Tactical Shield. Opponent must target and KO this creature before they can attack any other unit in your active slot.",
    "Armor": "Damage Reduction. Subtract X from all incoming attack damage (Minimum 1 damage taken).",
    "Regen": "Cellular Repair. Heals X HP at the start of your turn while this creature is on the field.",
    "Boost": "Synergy Spike. Gains bonus stats or effects if you have played another card of the same Type this turn.",
    "Evasive": "Signal Glitch. Has a 50% chance to completely dodge any incoming attack.",
    "On Play": "Deployment Sequence. Triggers a one-time effect immediately when this card is played from hand.",
    "Passive": "Continuous Sync. Provides a persistent benefit to your board as long as this card remains in play.",
    "Field": "Global Atmosphere. Affects all creatures of a specific type on both sides of the board."
};
export const getEffectDescription = (effect) => {
    switch (effect.type) {
        case 'damage': return `Deals ${effect.value} DMG to ${effect.target}.`;
        case 'heal': return `Heals ${effect.value} HP to ${effect.target}.`;
        case 'draw': return `Draw ${effect.value} cards from deck.`;
        case 'discount': return `Reduces cost of targets by ${effect.value}.`;
        default: return "Unknown protocol.";
    }
};
