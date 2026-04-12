export type CardType = 'creature' | 'support' | 'item' | 'field';
export type CreatureType = 'Current' | 'Bloom' | 'Tide' | 'Pulse' | 'Alloy' | 'Veil';
export type Rarity = 'common' | 'uncommon' | 'rare';
export type CardSet = 'METRO_PULSE' | 'NEON_ECHO' | 'GARDEN_SHIFT' | 'PROMO' | 'BAYLINE_CURRENT' | 'CROWN_CIRCUIT';
export type TimeOfDay = 'MORNING' | 'AFTERNOON' | 'EVENING';
export type EffectType = 'damage' | 'heal' | 'draw' | 'discount' | 'buff';
export type EffectTarget = 'active' | 'bench' | 'all' | 'self';
export type EffectTrigger = 'onPlay' | 'onKO' | 'passive' | 'onEvolve';
export type ProgressFlagValue = string | number | boolean | null;
export type FactionId = 'CIRCUIT' | 'PULSE' | 'TIDE' | 'BLOOM' | 'NEON' | 'CROWN';
export type PresentationTier = 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA';

export interface BattleModifier {
  type: 'STAT_BOOST' | 'COST_REDUCTION' | 'MANA_START';
  creatureType?: CreatureType;
  value: number;
}

export interface EffectDef {
  type: EffectType;
  value?: number;
  target?: EffectTarget;
  trigger?: EffectTrigger;
}

/** A named attack a creature can perform, inspired by the Pokémon TCG Pocket card schema. */
export interface AttackDef {
  /** Display name of the attack. */
  name: string;
  /** Base damage dealt by this attack. */
  damage: number;
  /** Sync-energy (mana) required to use this attack. */
  cost: number;
  /** Optional flavour/rules text describing an additional effect. */
  effect?: string;
  /** Optional structured effect applied when this attack is resolved. */
  effectDef?: EffectDef;
}

/** A passive or triggered ability separate from attacks, inspired by the Pokémon TCG Pocket card schema. */
export interface AbilityDef {
  /** Display name of the ability. */
  name: string;
  /** Rules text describing the ability. */
  effect: string;
  /** Optional structured effect for engine resolution. */
  effectDef?: EffectDef;
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
  /** Legacy flat attack value. Prefer `attacks[0].damage` when `attacks` is defined. */
  attack?: number;
  health?: number;
  evolutionFrom?: string;
  evolutionTo?: string[];
  keywords?: string[];
  passiveEffects?: EffectDef[];
  onPlayEffects?: EffectDef[];
  onKOEffects?: EffectDef[];
  effect?: EffectDef[];
  /** Named attacks this creature can perform. The first entry is used as the default attack in battle. */
  attacks?: AttackDef[];
  /** Passive or triggered abilities separate from attacks. */
  abilities?: AbilityDef[];
  /** The type this creature is weak against (takes +10 bonus damage from that type). */
  weakness?: CreatureType;
  /** Sync-energy cost to retreat this creature to the bench. */
  retreatCost?: number;
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

export interface TrainerRelationship {
  affinity: number;
  rivalry: number;
  respect: number;
  lastResult?: 'WIN' | 'LOSS' | 'DRAW' | null;
}

export interface FactionReputation {
  score: number;
  rank: 'UNKNOWN' | 'KNOWN' | 'TRUSTED' | 'HONORED' | 'LEGEND';
}

export interface SocialState {
  trainers: Record<string, TrainerRelationship>;
  factions: Record<FactionId, FactionReputation>;
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
    playTime: number; // in minutes
    winStreak: number;
    archetypeUsage: Record<CreatureType, number>;
  };
  social: SocialState;
  progress: {
    unlockedDistricts: string[];
    flags: Record<string, ProgressFlagValue>;
    storyProgress: number;
    chapter?: number;
  };
}

export interface ActiveTournament {
  tierId: string;
  wins: number;
  currentOpponentId: string;
  status: 'ACTIVE' | 'WON' | 'LOST';
}

export interface VNSession {
  scriptUrl: string;
  title: string;
  subtitle: string;
  returnScene?: SceneType;
  nextSceneOnComplete?: SceneType;
  canvasId?: string;
  sourceId?: string;
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
  activeTournament: ActiveTournament | null;
  pendingTournamentId: string | null;
  /** Where the tournament lobby "back" action returns (e.g. Card Annex vs streets). */
  tournamentLobbyReturn?: 'STORE' | 'DISTRICT_EXPLORE' | null;
  /** Where the deck terminal exits to (set when opening the editor from hub, streets, or title). */
  deckEditorReturn?: SceneType | null;
  /** Where the transit grid "back" exits to before boarding a train. */
  transitReturn?: SceneType | null;
  /** Where Profile exits when opened from the title screen. */
  profileReturn?: SceneType | null;
  /** Shown once in the tournament lobby after clearing a finite bracket (not persisted across loads). */
  bracketVictoryToast?: { tierId: string; credits: number } | null;
  vnSession: VNSession | null;
  visuals: {
    presentationTier: PresentationTier;
  };
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
  | 'PROFILE'
  | 'VN_SCENE';
