export type CardType = "creature" | "support" | "item" | "field";
export type CreatureType = "Current" | "Bloom" | "Tide" | "Pulse" | "Alloy" | "Veil";
export type Rarity = "common" | "uncommon" | "rare";

export interface BattleModifier {
  type: "STAT_BOOST" | "COST_REDUCTION" | "MANA_START";
  creatureType?: CreatureType;
  value: number;
}

export interface EffectDef {
  type: string;
  value?: number;
  target?: "active" | "bench" | "all" | "self";
  trigger?: "onPlay" | "onKO" | "passive" | "onEvolve";
}

export type CardSet = "METRO_PULSE" | "NEON_ECHO" | "GARDEN_SHIFT" | "PROMO";

export interface BaseCard {
  id: string;
  name: string;
  cardType: CardType;
  cost: number;
  rarity: Rarity;
  rulesText: string[];
  set: CardSet;
  subType?: string;
  tags?: string[];
  image?: string;
}

export interface CreatureCard extends BaseCard {
  cardType: "creature";
  creatureType: CreatureType;
  attack: number;
  health: number;
  evolutionFrom?: string;
  evolutionTo?: string[];
  keywords?: string[];
  passiveEffects?: EffectDef[];
  onPlayEffects?: EffectDef[];
  onKOEffects?: EffectDef[];
}

export interface SupportCard extends BaseCard {
  cardType: "support";
  effect: EffectDef[];
}

export interface ItemCard extends BaseCard {
  cardType: "item";
  effect: EffectDef[];
}

export interface FieldCard extends BaseCard {
  cardType: "field";
  effect: EffectDef[];
}

export type Card = CreatureCard | SupportCard | ItemCard | FieldCard;

export interface PlayerProfile {
  name: string;
  credits: number;
  inventory: {
    cards: string[]; // IDs of cards owned
    packs: string[]; // Names of packs owned
    deck: string[]; // IDs of cards in current deck
  };
  progress: {
    unlockedDistricts: string[];
    flags: Record<string, any>;
    storyProgress: number;
  };
}

export type TimeOfDay = "MORNING" | "AFTERNOON" | "EVENING";

export interface GameState {
  profile: PlayerProfile;
  currentScene: SceneType;
  location: string;
  timeOfDay: TimeOfDay;
  currentQuest: string;
  activeTournament: any | null;
}

export type SceneType = 
  | "MAIN_MENU" 
  | "APARTMENT" 
  | "DISTRICT_EXPLORE" 
  | "DECK_EDITOR" 
  | "PACK_OPENING" 
  | "STORE" 
  | "BATTLE" 
  | "REWARD" 
  | "SOCIAL"
  | "TOURNAMENT"
  | "TRANSIT"
  | "SAVE_LOAD";
