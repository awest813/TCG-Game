export type CardType = 'creature' | 'support' | 'item' | 'field';
export type CreatureType = 'Current' | 'Bloom' | 'Tide' | 'Pulse' | 'Alloy' | 'Veil';
export type Rarity = 'common' | 'uncommon' | 'rare';
export type CardSet = 'METRO_PULSE' | 'NEON_ECHO' | 'GARDEN_SHIFT' | 'PROMO' | 'BAYLINE_CURRENT' | 'CROWN_CIRCUIT';
export type TimeOfDay = 'MORNING' | 'AFTERNOON' | 'EVENING';

export interface BattleModifier {
  type: 'STAT_BOOST' | 'COST_REDUCTION' | 'MANA_START';
  creatureType?: CreatureType;
  value: number;
}

export interface EffectDef {
  type: string;
  value?: number;
  target?: 'active' | 'bench' | 'all' | 'self';
  trigger?: 'onPlay' | 'onKO' | 'passive' | 'onEvolve';
}

export interface BaseCard {
  id: string;
  name: string;
  cardType: CardType;
  cost: number;
  rarity: Rarity;
  rulesText?: string[];
  set?: CardSet;
  subType?: string;
  tags?: string[];
  image?: string;
  creatureType?: CreatureType;
  attack?: number;
  health?: number;
  evolutionFrom?: string;
  evolutionTo?: string[];
  keywords?: string[];
  passiveEffects?: EffectDef[];
  onPlayEffects?: EffectDef[];
  onKOEffects?: EffectDef[];
  effect?: EffectDef[];
}

export interface CreatureCard extends BaseCard {
  cardType: 'creature';
  creatureType: CreatureType;
}

export interface SupportCard extends BaseCard {
  cardType: 'support';
}

export interface ItemCard extends BaseCard {
  cardType: 'item';
}

export interface FieldCard extends BaseCard {
  cardType: 'field';
}

export type Card = BaseCard;

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  dateUnlocked?: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
}

export interface BioSyncStats {
  id: string;
  species: string;
  happiness: number;
  hunger: number;
  bondLevel: number;
  lastFed?: string;
}

export interface PlayerProfile {
  name: string;
  currency: number;
  level: number;
  xp: number;
  inventory: {
    cards: string[];
    packs: string[];
    deck: string[];
    items: string[];
  };
  mainBioSync?: BioSyncStats;
  primaryPartner?: BioSyncStats;
  badges: Badge[];
  stats: {
    wins: number;
    losses: number;
    tournamentsWon: number;
    cardsCollected: number;
  };
  progress: {
    unlockedDistricts: string[];
    flags: Record<string, any>;
    storyProgress: number;
    chapter?: number;
  };
}

export interface NewGameConfig {
  name: string;
  starter: 'Pulse' | 'Bloom' | 'Tide';
}

export interface GameState {
  profile: PlayerProfile;
  currentScene: SceneType;
  location: string;
  timeOfDay: TimeOfDay;
  currentQuest: string;
  activeTournament: any;
}

export interface ShopItem {
  id: string;
  targetId: string;
  name: string;
  description: string;
  cost: number;
  type: 'PACK' | 'SINGLE' | 'COSMETIC';
  image: string;
}

export type SceneType =
  | 'MAIN_MENU'
  | 'APARTMENT'
  | 'DISTRICT_EXPLORE'
  | 'DECK_EDITOR'
  | 'PACK_OPENING'
  | 'STORE'
  | 'BATTLE'
  | 'REWARD'
  | 'SOCIAL'
  | 'TOURNAMENT'
  | 'TRANSIT'
  | 'SAVE_LOAD'
  | 'PROFILE';
