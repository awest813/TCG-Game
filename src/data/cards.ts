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
    set: "METRO_PULSE",
    image: "/technomancer_card_art_1775865583853.png",
    weakness: "Tide",
    retreatCost: 1,
    attacks: [
      { name: "Rail Rush", damage: 20, cost: 1, effect: "Swift: Can attack the turn it is played." }
    ]
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
    set: "METRO_PULSE",
    weakness: "Tide",
    retreatCost: 1,
    attacks: [
      { name: "Voltage Bite", damage: 30, cost: 1 },
      { name: "Arc Surge", damage: 50, cost: 2, effect: "On Play: Deal 1 damage to the enemy active.", effectDef: { type: "damage", value: 1, target: "active" } }
    ]
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
    set: "METRO_PULSE",
    weakness: "Tide",
    retreatCost: 1,
    attacks: [
      { name: "Neon Jab", damage: 30, cost: 1 },
      { name: "Circuit Slam", damage: 40, cost: 2, effect: "Boost: Deals +10 damage if you played another Pulse card this turn." }
    ]
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
    rulesText: ["Evolves from Ziprail.", "Guard: Opponent must attack this creature first."],
    weakness: "Tide",
    retreatCost: 2,
    attacks: [
      { name: "Maglev Crash", damage: 60, cost: 2 },
      { name: "Rail Cannon", damage: 90, cost: 4, effect: "Guard: Opponent must attack this creature first." }
    ],
    abilities: [
      { name: "Guard Protocol", effect: "Opponent must attack this creature before targeting any other unit you control." }
    ]
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
    onPlayEffects: [{ type: "buff", target: "active", trigger: "onPlay" }],
    weakness: "Tide",
    retreatCost: 1,
    attacks: [
      { name: "Overdrive Dash", damage: 40, cost: 1 },
      { name: "Fox Blitz", damage: 70, cost: 3, effect: "Your Active creature gains Swift this turn.", effectDef: { type: "buff", target: "active", trigger: "onPlay" } }
    ]
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
    evolutionTo: ["lush-golem"],
    image: "/biotech_nature_card_art_1775865596083.png",
    weakness: "Pulse",
    retreatCost: 1,
    attacks: [
      { name: "Spore Toss", damage: 10, cost: 1 }
    ],
    abilities: [
      { name: "Regen", effect: "Heals 1 HP at the start of your turn.", effectDef: { type: "heal", value: 1, target: "self", trigger: "passive" } }
    ]
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
    onPlayEffects: [{ type: "heal", value: 2, target: "bench" }],
    weakness: "Pulse",
    retreatCost: 1,
    attacks: [
      { name: "Vine Lash", damage: 20, cost: 1 },
      { name: "Canopy Strike", damage: 40, cost: 2, effect: "Heal 2 HP to a benched creature.", effectDef: { type: "heal", value: 2, target: "bench" } }
    ]
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
    rulesText: ["On Play: Draw a Bloom creature from your deck."],
    weakness: "Pulse",
    retreatCost: 1,
    attacks: [
      { name: "Spore Cloud", damage: 20, cost: 1, effect: "Draw a Bloom creature from your deck.", effectDef: { type: "draw", value: 1 } }
    ]
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
    rulesText: ["Evolves from Mosshop.", "Regen 2: Heals 2 HP at start of turn."],
    weakness: "Pulse",
    retreatCost: 3,
    attacks: [
      { name: "Root Slam", damage: 50, cost: 2 },
      { name: "Overgrowth", damage: 80, cost: 4, effect: "Heal 20 HP from this creature." }
    ],
    abilities: [
      { name: "Regen 2", effect: "Heals 2 HP at the start of your turn.", effectDef: { type: "heal", value: 2, target: "self", trigger: "passive" } }
    ]
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
    passiveEffects: [{ type: "discount", value: 1, trigger: "passive" }],
    weakness: "Pulse",
    retreatCost: 2,
    attacks: [
      { name: "Petal Blade", damage: 30, cost: 2 }
    ],
    abilities: [
      { name: "Evolution Bloom", effect: "Your Bloom evolutions cost 1 less Sync-Energy.", effectDef: { type: "discount", value: 1, trigger: "passive" } }
    ]
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
    evolutionTo: ["tidal-whale"],
    image: "/tide_card_art_main_1775865821451.png",
    weakness: "Alloy",
    retreatCost: 1,
    attacks: [
      { name: "Wharf Splash", damage: 10, cost: 1, effect: "Draw 1 card.", effectDef: { type: "draw", value: 1 } }
    ]
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
    rulesText: ["Guard: Opponent must attack this creature first."],
    weakness: "Alloy",
    retreatCost: 2,
    attacks: [
      { name: "Coral Crush", damage: 20, cost: 1 },
      { name: "Tidal Wall", damage: 30, cost: 2, effect: "Guard: Opponent must attack this creature first." }
    ],
    abilities: [
      { name: "Guard Current", effect: "Opponent must attack this creature before targeting any other unit you control." }
    ]
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
    rulesText: ["Evasive: 50% chance to dodge attacks."],
    weakness: "Alloy",
    retreatCost: 1,
    attacks: [
      { name: "Mist Slash", damage: 20, cost: 1 },
      { name: "Fog Dive", damage: 40, cost: 2, effect: "Evasive: 50% chance to dodge the next incoming attack." }
    ]
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
    rulesText: ["Evolves from Wharfin.", "On Play: Return an enemy benched creature to their hand."],
    weakness: "Alloy",
    retreatCost: 4,
    attacks: [
      { name: "Tidal Surge", damage: 60, cost: 3 },
      { name: "Leviathan Crash", damage: 100, cost: 5, effect: "Return 1 enemy benched creature to the opponent's hand." }
    ]
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
    evolutionTo: ["alloy-titan"],
    image: "/alloy_card_art_main_1775865833709.png",
    weakness: "Veil",
    retreatCost: 1,
    attacks: [
      { name: "Micro Drill", damage: 10, cost: 1 }
    ]
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
    rulesText: ["Armor 1: Reduces all incoming damage by 1."],
    weakness: "Veil",
    retreatCost: 2,
    attacks: [
      { name: "Shell Bash", damage: 20, cost: 1 },
      { name: "Buckler Strike", damage: 30, cost: 2, effect: "Armor 1: Reduces all incoming damage by 1 this turn." }
    ],
    abilities: [
      { name: "Armor Plating", effect: "Reduces all incoming damage by 1 (minimum 1)." }
    ]
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
    rulesText: ["Evolves from Iron Mite.", "Counter: Deals 2 damage back when attacked."],
    weakness: "Veil",
    retreatCost: 3,
    attacks: [
      { name: "Iron Fist", damage: 50, cost: 2 },
      { name: "Titan Slam", damage: 80, cost: 4, effect: "Counter: Deals 2 damage back to the attacker the next time this creature is hit." }
    ],
    abilities: [
      { name: "Counter Alloy", effect: "When this creature is attacked, deal 2 damage back to the attacker.", effectDef: { type: "damage", value: 2, target: "active" } }
    ]
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
    rulesText: ["On Play: Look at top 3 cards of your deck, put one on top."],
    weakness: "Current",
    retreatCost: 1,
    attacks: [
      { name: "Shadow Claw", damage: 20, cost: 1 }
    ],
    abilities: [
      { name: "Veil Peek", effect: "On Play: Look at the top 3 cards of your deck and place one on top." }
    ]
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
    rulesText: ["On Play: Enemy active creature is Confused (50% to hit self)."],
    weakness: "Current",
    retreatCost: 1,
    attacks: [
      { name: "Phantom Tap", damage: 10, cost: 1 },
      { name: "Confusion Pulse", damage: 20, cost: 2, effect: "The defending creature is now Confused." }
    ]
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
    rulesText: ["On Play: Discard a random card from enemy hand."],
    weakness: "Current",
    retreatCost: 2,
    attacks: [
      { name: "Reap Shadow", damage: 60, cost: 2 },
      { name: "Soul Drain", damage: 90, cost: 4, effect: "Discard a random card from the opponent's hand." }
    ]
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
    rulesText: ["On Play: Gain 1 temporary Mana this turn."],
    image: "/current_card_art_main_1775865847401.png",
    weakness: "Veil",
    retreatCost: 1,
    attacks: [
      { name: "Signal Zap", damage: 10, cost: 1 }
    ],
    abilities: [
      { name: "Mana Surge", effect: "On Play: Gain 1 Sync-Energy this turn." }
    ]
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
    rulesText: ["Passive: You start each turn with +1 Mana."],
    weakness: "Veil",
    retreatCost: 1,
    attacks: [
      { name: "Static Scratch", damage: 20, cost: 1 },
      { name: "Power Purr", damage: 30, cost: 2 }
    ],
    abilities: [
      { name: "Charge Loop", effect: "Passive: You start each turn with +1 Sync-Energy.", effectDef: { type: "buff", value: 1, trigger: "passive" } }
    ]
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
    set: "NEON_ECHO",
    image: "/void_monolith_card_art_1775865612429.png"
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

export const getCardPalette = (card?: Card) => {
  const typePalettes = {
    Pulse: { accent: '#79f7ff', glow: 'rgba(121,247,255,0.45)', panel: 'linear-gradient(180deg, rgba(8,29,44,0.96), rgba(5,10,18,0.96))' },
    Bloom: { accent: '#8effa7', glow: 'rgba(142,255,167,0.4)', panel: 'linear-gradient(180deg, rgba(14,42,25,0.96), rgba(7,17,12,0.96))' },
    Tide: { accent: '#76b7ff', glow: 'rgba(118,183,255,0.42)', panel: 'linear-gradient(180deg, rgba(10,24,46,0.96), rgba(5,10,20,0.96))' },
    Alloy: { accent: '#d5dae2', glow: 'rgba(213,218,226,0.28)', panel: 'linear-gradient(180deg, rgba(33,37,45,0.96), rgba(12,14,18,0.96))' },
    Veil: { accent: '#ff7ae6', glow: 'rgba(255,122,230,0.4)', panel: 'linear-gradient(180deg, rgba(42,14,37,0.96), rgba(18,7,17,0.96))' },
    Current: { accent: '#ffd166', glow: 'rgba(255,209,102,0.4)', panel: 'linear-gradient(180deg, rgba(44,30,8,0.96), rgba(18,12,4,0.96))' },
    default: { accent: '#ff5fcf', glow: 'rgba(255,95,207,0.35)', panel: 'linear-gradient(180deg, rgba(27,14,33,0.96), rgba(12,8,16,0.96))' }
  } as const;

  const rarityFinish = {
    common: 'rgba(255,255,255,0.08)',
    uncommon: 'rgba(121,247,255,0.12)',
    rare: 'rgba(255,209,102,0.16)'
  } as const;

  const palette = (card?.creatureType && typePalettes[card.creatureType]) || typePalettes.default;
  return {
    ...palette,
    rarityFinish: rarityFinish[card?.rarity ?? 'common']
  };
};
