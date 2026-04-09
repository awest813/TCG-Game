import { Card } from "../core/types";

export const BASE_CARDS: Card[] = [
  // PULSE (Aggro/Speed) - SET: METRO_PULSE
  {
    id: "ziprail",
    name: "Ziprail",
    cardType: "creature",
    creatureType: "Pulse",
    rarity: "common",
    cost: 1,
    attack: 2,
    health: 2,
    rulesText: ["Swift: Can attack the turn it is played."],
    keywords: ["Swift"],
    evolutionTo: ["rail-bastion"],
    set: "METRO_PULSE"
  },
  {
    id: "voltlynx",
    name: "Voltlynx",
    cardType: "creature",
    creatureType: "Pulse",
    rarity: "uncommon",
    cost: 2,
    attack: 3,
    health: 4,
    rulesText: ["On Play: Deal 1 damage to the enemy active."],
    onPlayEffects: [{ type: "damage", value: 1, target: "active" }],
    set: "METRO_PULSE"
  },
  {
    id: "neon-striker",
    name: "Neon Striker",
    cardType: "creature",
    creatureType: "Pulse",
    rarity: "common",
    cost: 2,
    attack: 3,
    health: 3,
    rulesText: ["Boost: Deals +1 damage if you played another Pulse card this turn."],
    tags: ["Boost"],
    set: "METRO_PULSE"
  },
  {
    id: "rail-bastion",
    name: "Rail Bastion",
    cardType: "creature",
    creatureType: "Pulse",
    rarity: "rare",
    cost: 4,
    attack: 5,
    health: 7,
    evolutionFrom: "ziprail",
    rulesText: ["Evolves from Ziprail.", "Guard: Opponent must attack this creature first."]
  },
  {
    id: "overdrive-fox",
    name: "Overdrive Fox",
    cardType: "creature",
    creatureType: "Pulse",
    rarity: "uncommon",
    cost: 3,
    attack: 4,
    health: 4,
    rulesText: ["On Play: Your Active creature gains Swift this turn."],
    onPlayEffects: [{ type: "buff", target: "active", trigger: "onPlay" }]
  },

  // BLOOM (Sustain/Growth)
  {
    id: "mosshop",
    name: "Mosshop",
    cardType: "creature",
    creatureType: "Bloom",
    rarity: "common",
    cost: 1,
    attack: 1,
    health: 4,
    rulesText: ["Regen: Heals 1 HP at the start of your turn."],
    keywords: ["Regen"],
    evolutionTo: ["lush-golem"]
  },
  {
    id: "verdajack",
    name: "Verdajack",
    cardType: "creature",
    creatureType: "Bloom",
    rarity: "uncommon",
    cost: 2,
    attack: 2,
    health: 5,
    rulesText: ["On Play: Heal 2 HP to a benched creature."],
    onPlayEffects: [{ type: "heal", value: 2, target: "bench" }]
  },
  {
    id: "spore-scout",
    name: "Spore Scout",
    cardType: "creature",
    creatureType: "Bloom",
    rarity: "common",
    cost: 2,
    attack: 2,
    health: 3,
    rulesText: ["On Play: Draw a Bloom creature from your deck."]
  },
  {
    id: "lush-golem",
    name: "Lush Golem",
    cardType: "creature",
    creatureType: "Bloom",
    rarity: "rare",
    cost: 5,
    attack: 4,
    health: 12,
    evolutionFrom: "mosshop",
    rulesText: ["Evolves from Mosshop.", "Regen 2: Heals 2 HP at start of turn."]
  },
  {
    id: "bloom-whisper",
    name: "Bloom Whisper",
    cardType: "creature",
    creatureType: "Bloom",
    rarity: "uncommon",
    cost: 3,
    attack: 3,
    health: 6,
    rulesText: ["Passive: Your Bloom evolutions cost 1 less mana."],
    passiveEffects: [{ type: "discount", value: 1, trigger: "passive" }]
  },

  // TIDE (Control/Draw)
  {
    id: "wharfin",
    name: "Wharfin",
    cardType: "creature",
    creatureType: "Tide",
    rarity: "common",
    cost: 1,
    attack: 1,
    health: 3,
    rulesText: ["On Play: Draw 1 card."],
    onPlayEffects: [{ type: "draw", value: 1 }],
    evolutionTo: ["tidal-whale"]
  },
  {
    id: "coral-guard",
    name: "Coral Guard",
    cardType: "creature",
    creatureType: "Tide",
    rarity: "uncommon",
    cost: 3,
    attack: 2,
    health: 7,
    rulesText: ["Guard: Opponent must attack this creature first."]
  },
  {
    id: "mist-glider",
    name: "Mist Glider",
    cardType: "creature",
    creatureType: "Tide",
    rarity: "common",
    cost: 2,
    attack: 2,
    health: 4,
    rulesText: ["Evasive: 50% chance to dodge attacks."]
  },
  {
    id: "tidal-whale",
    name: "Tidal Whale",
    cardType: "creature",
    creatureType: "Tide",
    rarity: "rare",
    cost: 6,
    attack: 5,
    health: 15,
    evolutionFrom: "wharfin",
    rulesText: ["Evolves from Wharfin.", "On Play: Return an enemy benched creature to their hand."]
  },

  // ALLOY (Defense/Tank)
  {
    id: "iron-mite",
    name: "Iron Mite",
    cardType: "creature",
    creatureType: "Alloy",
    rarity: "common",
    cost: 1,
    attack: 1,
    health: 5,
    evolutionTo: ["alloy-titan"]
  },
  {
    id: "shield-beetle",
    name: "Shield Beetle",
    cardType: "creature",
    creatureType: "Alloy",
    rarity: "uncommon",
    cost: 3,
    attack: 2,
    health: 8,
    rulesText: ["Armor 1: Reduces all incoming damage by 1."]
  },
  {
    id: "alloy-titan",
    name: "Alloy Titan",
    cardType: "creature",
    creatureType: "Alloy",
    rarity: "rare",
    cost: 5,
    attack: 4,
    health: 14,
    evolutionFrom: "iron-mite",
    rulesText: ["Evolves from Iron Mite.", "Counter: Deals 2 damage back when attacked."]
  },

  // VEIL (Disruption/Status)
  {
    id: "shadow-prowler",
    name: "Shadow Prowler",
    cardType: "creature",
    creatureType: "Veil",
    rarity: "common",
    cost: 1,
    attack: 2,
    health: 2,
    rulesText: ["On Play: Look at top 3 cards of your deck, put one on top."]
  },
  {
    id: "void-wisp",
    name: "Void Wisp",
    cardType: "creature",
    creatureType: "Veil",
    rarity: "uncommon",
    cost: 2,
    attack: 1,
    health: 4,
    rulesText: ["On Play: Enemy active creature is Confused (50% to hit self)."]
  },
  {
    id: "veil-reaper",
    name: "Veil Reaper",
    cardType: "creature",
    creatureType: "Veil",
    rarity: "rare",
    cost: 4,
    attack: 6,
    health: 6,
    rulesText: ["On Play: Discard a random card from enemy hand."]
  },

  // CURRENT (Mana/Support)
  {
    id: "signalmite",
    name: "Signalmite",
    cardType: "creature",
    creatureType: "Current",
    rarity: "common",
    cost: 1,
    attack: 1,
    health: 2,
    rulesText: ["On Play: Gain 1 temporary Mana this turn."]
  },
  {
    id: "battery-cat",
    name: "Battery Cat",
    cardType: "creature",
    creatureType: "Current",
    rarity: "uncommon",
    cost: 2,
    attack: 2,
    health: 3,
    rulesText: ["Passive: You start each turn with +1 Mana."]
  },

  // SUPPORT CARDS
  {
    id: "quick-transfer",
    name: "Quick Transfer",
    cardType: "support",
    rarity: "common",
    cost: 1,
    effect: [{ type: "draw", value: 1 }],
    rulesText: ["Draw 1 card."]
  },
  {
    id: "system-refresh",
    name: "System Refresh",
    cardType: "support",
    rarity: "uncommon",
    cost: 2,
    effect: [{ type: "draw", value: 2 }],
    rulesText: ["Draw 2 cards."]
  },
  {
    id: "signal-boost",
    name: "Signal Boost",
    cardType: "support",
    rarity: "uncommon",
    cost: 2,
    effect: [{ type: "buff", value: 2, target: "active" }],
    rulesText: ["Give your active creature +2 Attack this turn."]
  },
  {
    id: "overclock",
    name: "Overclock",
    cardType: "support",
    rarity: "rare",
    cost: 3,
    rulesText: ["Your active creature can attack twice this turn."]
  },
  {
    id: "emergency-reboot",
    name: "Emergency Reboot",
    cardType: "support",
    rarity: "rare",
    cost: 4,
    rulesText: ["Return a KO'd creature from your discard pile to your bench."]
  },

  // ITEMS
  {
    id: "rooftop-remedy",
    name: "Rooftop Remedy",
    cardType: "item",
    rarity: "common",
    cost: 1,
    effect: [{ type: "heal", value: 3, target: "active" }],
    rulesText: ["Heal 3 HP to your active creature."]
  },
  {
    id: "stim-patch",
    name: "Stim Patch",
    cardType: "item",
    rarity: "uncommon",
    cost: 1,
    rulesText: ["Remove all status effects from your active creature."]
  },
  {
    id: "power-cell",
    name: "Power Cell",
    cardType: "item",
    rarity: "common",
    cost: 0,
    rulesText: ["Gain 1 Mana. Discard this after use."],
    set: "METRO_PULSE"
  },

// BLOOM (Sustain/Growth) - SET: GARDEN_SHIFT
  {
    id: "seedling-bot",
    name: "Seedling Bot",
    cardType: "creature",
    creatureType: "Bloom",
    rarity: "common",
    cost: 1,
    attack: 1,
    health: 4,
    rulesText: ["End of Turn: Heal 1 to your active."],
    set: "GARDEN_SHIFT"
  },
  {
    id: "solar-rose",
    name: "Solar Rose",
    cardType: "creature",
    creatureType: "Bloom",
    rarity: "uncommon",
    cost: 3,
    attack: 2,
    health: 6,
    rulesText: ["On Play: Heal 3 to all your creatures."],
    set: "GARDEN_SHIFT"
  },
  {
    id: "bloom-monarch",
    name: "Bloom Monarch",
    cardType: "creature",
    creatureType: "Bloom",
    rarity: "rare",
    cost: 5,
    attack: 4,
    health: 10,
    rulesText: ["Passive: All your Bloom creatures have +2 Health."],
    set: "GARDEN_SHIFT",
    evolutionFrom: "solar-rose"
  },

  // TIDE (Control/Delay) - SET: NEON_ECHO
  {
    id: "wave-rider",
    name: "Wave Rider",
    cardType: "creature",
    creatureType: "Tide",
    rarity: "common",
    cost: 2,
    attack: 2,
    health: 3,
    rulesText: ["On Play: Move an enemy bench creature to active."],
    set: "NEON_ECHO"
  },
  {
    id: "tsunami-core",
    name: "Tsunami Core",
    cardType: "creature",
    creatureType: "Tide",
    rarity: "rare",
    cost: 4,
    attack: 3,
    health: 7,
    rulesText: ["On Play: Return 1 enemy bench creature to opponent's hand."],
    set: "NEON_ECHO"
  },

  // ALLOY (Defense/Armor) - SET: METRO_PULSE
  {
    id: "shield-drone",
    name: "Shield Drone",
    cardType: "creature",
    creatureType: "Alloy",
    rarity: "common",
    cost: 2,
    attack: 1,
    health: 5,
    rulesText: ["Armor: Takes 1 less damage from attacks."],
    subType: "Armor",
    set: "METRO_PULSE"
  },
  {
    id: "fortress-walker",
    name: "Fortress Walker",
    cardType: "creature",
    creatureType: "Alloy",
    rarity: "rare",
    cost: 5,
    attack: 4,
    health: 9,
    rulesText: ["Guard: Opponent must attack this unit if it is active."],
    subType: "Guard",
    set: "METRO_PULSE"
  },

  // VEIL (Disruption/Illusion) - SET: NEON_ECHO
  {
    id: "hollow-glitch",
    name: "Hollow Glitch",
    cardType: "creature",
    creatureType: "Veil",
    rarity: "common",
    cost: 1,
    attack: 2,
    health: 2,
    rulesText: ["On KO: Opponent discards a random card from hand."],
    set: "NEON_ECHO"
  },
  {
    id: "mirror-phantom",
    name: "Mirror Phantom",
    cardType: "creature",
    creatureType: "Veil",
    rarity: "rare",
    cost: 3,
    attack: 3,
    health: 4,
    rulesText: ["Passive: This creature cannot be damaged by non-active enemies."],
    set: "NEON_ECHO"
  },

  // CURRENT (Tempo/Draw) - SET: BAYLINE_CURRENT
  {
    id: "data-diver",
    name: "Data Diver",
    cardType: "creature",
    creatureType: "Current",
    rarity: "common",
    cost: 2,
    attack: 2,
    health: 4,
    rulesText: ["On Play: Draw 1 card."],
    set: "BAYLINE_CURRENT"
  },
  {
    id: "stream-ace",
    name: "Stream Ace",
    cardType: "creature",
    creatureType: "Current",
    rarity: "rare",
    cost: 4,
    attack: 4,
    health: 6,
    rulesText: ["On Play: You may retreat your active unit for free this turn."],
    set: "BAYLINE_CURRENT"
  },

  // SUPPORT CARDS
  {
    id: "overclock",
    name: "Overclock",
    cardType: "support",
    rarity: "uncommon",
    cost: 2,
    rulesText: ["Your active creature gains +2 Attack this turn."],
    set: "METRO_PULSE"
  },
  {
    id: "system-refresh",
    name: "System Refresh",
    cardType: "support",
    rarity: "common",
    cost: 1,
    rulesText: ["Heal 3 damage from one of your creatures."],
    set: "METRO_PULSE"
  },

  // FIELD CARDS
  {
    id: "neon-grid",
    name: "Neon Grid",
    cardType: "field",
    rarity: "uncommon",
    cost: 2,
    rulesText: ["All Pulse creatures gain +1 Attack."],
    set: "NEON_ECHO"
  },
  {
    id: "garden-haze",
    name: "Garden Haze",
    cardType: "field",
    rarity: "uncommon",
    cost: 2,
    rulesText: ["All Bloom creatures gain +2 Health."],
    set: "GARDEN_SHIFT"
  },

  // CROWN CIRCUIT (Elite Tier) - SET: CROWN_CIRCUIT
  {
    id: "omega-link",
    name: "Omega Link",
    cardType: "creature",
    creatureType: "Pulse",
    rarity: "rare",
    cost: 6,
    attack: 7,
    health: 12,
    rulesText: ["On Play: Deal 3 damage to all enemy units."],
    set: "CROWN_CIRCUIT"
  },
  {
    id: "royal-bloom",
    name: "Royal Bloom",
    cardType: "creature",
    creatureType: "Bloom",
    rarity: "rare",
    cost: 6,
    attack: 5,
    health: 15,
    rulesText: ["Passive: Your other Bloom creatures gain Armor 1."],
    set: "CROWN_CIRCUIT"
  },
  {
    id: "tidal-nexus",
    name: "Tidal Nexus",
    cardType: "field",
    rarity: "rare",
    cost: 3,
    rulesText: ["At the start of your turn, if you have a Tide unit active, draw 1 card."],
    set: "BAYLINE_CURRENT"
  },
  {
    id: "alloy-foundry",
    name: "Alloy Foundry",
    cardType: "field",
    rarity: "uncommon",
    cost: 2,
    rulesText: ["All Alloy creatures gain +2 Health and Armor 1."],
    set: "CROWN_CIRCUIT"
  },
  {
    id: "void-rift",
    name: "Void Rift",
    cardType: "field",
    rarity: "rare",
    cost: 4,
    rulesText: ["At the end of each turn, both players discard 1 card."],
    set: "NEON_ECHO"
  },
  {
    id: "emergency-patch",
    name: "Emergency Patch",
    cardType: "support",
    rarity: "common",
    cost: 1,
    rulesText: ["Remove all status effects from your active unit."],
    set: "METRO_PULSE"
  },
  {
    id: "recursion-loop",
    name: "Recursion Loop",
    cardType: "support",
    rarity: "rare",
    cost: 3,
    rulesText: ["Return 2 support cards from your discard pile to your hand."],
    set: "BAYLINE_CURRENT"
  },
  {
    id: "master-rank-medal",
    name: "Master Medal",
    cardType: "item",
    rarity: "rare",
    cost: 2,
    rulesText: ["Attached unit gains +2/+2 and Guard."],
    set: "CROWN_CIRCUIT"
  }
];

export const CARD_POOL = [...BASE_CARDS];

export const getCardById = (id: string): Card | undefined => {
  return CARD_POOL.find(c => c.id === id);
};
