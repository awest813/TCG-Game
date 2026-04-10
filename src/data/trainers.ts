import { FactionId, PlayerProfile, SocialState } from '../core/types';

export interface TrainerRecord {
  id: string;
  name: string;
  title: string;
  factionId: FactionId;
  homeDistrict: string;
  deck: string[];
  avatarPath?: string;
  accentColor: string;
  signatureField?: string;
  summary: string;
}

export interface FactionRecord {
  id: FactionId;
  name: string;
  slogan: string;
  accentColor: string;
}

export const FACTIONS: FactionRecord[] = [
  { id: 'CIRCUIT', name: 'Circuit Union', slogan: 'The city watches every bracket.', accentColor: '#f0c67c' },
  { id: 'PULSE', name: 'Pulse Syndicate', slogan: 'Speed writes the first chapter.', accentColor: '#7dd7dd' },
  { id: 'TIDE', name: 'Tide Covenant', slogan: 'Tempo is pressure with patience.', accentColor: '#76b7ff' },
  { id: 'BLOOM', name: 'Bloom Accord', slogan: 'Growth is a weapon when guided.', accentColor: '#8effa7' },
  { id: 'NEON', name: 'Neon Stage', slogan: 'Performance makes memory real.', accentColor: '#cf6547' },
  { id: 'CROWN', name: 'Civic Crown', slogan: 'Prestige is earned under lights.', accentColor: '#ffffff' }
];

export const TRAINERS: TrainerRecord[] = [
  {
    id: 'lucy',
    name: 'Lucy',
    title: 'Circuit Guide',
    factionId: 'CIRCUIT',
    homeDistrict: 'SUNSET_TERMINAL',
    deck: ['signalmite', 'ziprail', 'mosshop', 'wharfin', 'quick-transfer', 'rooftop-remedy'],
    avatarPath: '/lucy_tutorial.png',
    accentColor: '#f0c67c',
    signatureField: 'neon-grid',
    summary: 'Your handler for the early circuit, equal parts mentor, producer, and pressure valve.'
  },
  {
    id: 'kaizen',
    name: 'Kaizen',
    title: 'Rival Duelist',
    factionId: 'PULSE',
    homeDistrict: 'SUNSET_TERMINAL',
    deck: ['ziprail', 'ziprail', 'neon-striker', 'voltlynx', 'overdrive-fox', 'signal-boost', 'quick-transfer', 'neon-grid'],
    avatarPath: '/avatar_kaizen.png',
    accentColor: '#cf6547',
    signatureField: 'neon-grid',
    summary: 'Your headline rival, all acceleration and nerve, obsessed with proving the city has room for only one rising ace.'
  },
  {
    id: 'maya',
    name: 'Maya',
    title: 'Tide Club Master',
    factionId: 'TIDE',
    homeDistrict: 'BAYLINE_WHARF',
    deck: ['wharfin', 'mist-glider', 'coral-guard', 'wave-rider', 'tsunami-core', 'system-refresh', 'rooftop-remedy', 'tidal-nexus'],
    accentColor: '#76b7ff',
    signatureField: 'tidal-nexus',
    summary: 'A control specialist who treats every duel like a tide chart and every mistake like drift.'
  },
  {
    id: 'vex',
    name: 'Vex',
    title: 'Pulse Club Master',
    factionId: 'PULSE',
    homeDistrict: 'MARKET_CENTRAL',
    deck: ['ziprail', 'neon-striker', 'voltlynx', 'overdrive-fox', 'shield-drone', 'quick-transfer', 'overclock', 'neon-grid'],
    accentColor: '#7dd7dd',
    signatureField: 'neon-grid',
    summary: 'A speed tyrant whose favorite tactic is making the match feel decided before the board catches up.'
  },
  {
    id: 'luna',
    name: 'Luna',
    title: 'Neon Club Master',
    factionId: 'NEON',
    homeDistrict: 'NEON_MISSION',
    deck: ['seedling-bot', 'solar-rose', 'bloom-monarch', 'mirror-phantom', 'neon-striker', 'system-refresh', 'signal-boost', 'void-rift'],
    accentColor: '#cf6547',
    signatureField: 'void-rift',
    summary: 'A showrunner duelist who frames every game like a live set and every opponent like a scene partner.'
  },
  {
    id: 'valerious',
    name: 'Valerious',
    title: 'Bloom Elite Master',
    factionId: 'BLOOM',
    homeDistrict: 'REDWOOD_HEIGHTS',
    deck: ['mosshop', 'verdajack', 'solar-rose', 'bloom-monarch', 'fortress-walker', 'rooftop-remedy', 'system-refresh', 'garden-haze'],
    accentColor: '#8effa7',
    signatureField: 'garden-haze',
    summary: 'An aristocratic grinder who turns sustain, board presence, and composure into a very personal kind of threat.'
  },
  {
    id: 'zeno',
    name: 'Zeno',
    title: 'Grand League Champion',
    factionId: 'CROWN',
    homeDistrict: 'CIVIC_CROWN',
    deck: ['omega-link', 'royal-bloom', 'tsunami-core', 'stream-ace', 'mirror-phantom', 'alloy-foundry', 'recursion-loop', 'master-rank-medal'],
    accentColor: '#f0c67c',
    signatureField: 'alloy-foundry',
    summary: 'The reigning apex champion, built from prestige, composure, and a deck that feels engineered to punish impatience.'
  }
];

export const TRAINER_LOOKUP = TRAINERS.reduce<Record<string, TrainerRecord>>((lookup, trainer) => {
  lookup[trainer.id] = trainer;
  return lookup;
}, {});

export const FACTION_LOOKUP = FACTIONS.reduce<Record<FactionId, FactionRecord>>((lookup, faction) => {
  lookup[faction.id] = faction;
  return lookup;
}, {} as Record<FactionId, FactionRecord>);

export const getTrainerById = (trainerId: string) => TRAINER_LOOKUP[trainerId];
export const getFactionById = (factionId: FactionId) => FACTION_LOOKUP[factionId];

export const getFactionRank = (score: number): SocialState['factions'][FactionId]['rank'] => {
  if (score >= 80) return 'LEGEND';
  if (score >= 50) return 'HONORED';
  if (score >= 25) return 'TRUSTED';
  if (score >= 10) return 'KNOWN';
  return 'UNKNOWN';
};

export const createDefaultSocialState = (): SocialState => ({
  trainers: TRAINERS.reduce<SocialState['trainers']>((lookup, trainer) => {
    lookup[trainer.id] = {
      affinity: trainer.id === 'lucy' ? 1 : 0,
      rivalry: trainer.id === 'kaizen' ? 1 : 0,
      respect: 0,
      lastResult: null
    };
    return lookup;
  }, {}),
  factions: FACTIONS.reduce<SocialState['factions']>((lookup, faction) => {
    const score = faction.id === 'CIRCUIT' ? 5 : 0;
    lookup[faction.id] = {
      score,
      rank: getFactionRank(score)
    };
    return lookup;
  }, {} as SocialState['factions'])
});

export const mergeSocialState = (social?: Partial<SocialState>): SocialState => {
  const base = createDefaultSocialState();
  const mergedTrainers = { ...base.trainers };
  const mergedFactions = { ...base.factions };

  Object.entries(social?.trainers ?? {}).forEach(([trainerId, relationship]) => {
    mergedTrainers[trainerId] = {
      ...base.trainers[trainerId],
      ...relationship
    };
  });

  Object.entries(social?.factions ?? {}).forEach(([factionId, reputation]) => {
    const typedFactionId = factionId as FactionId;
    const score = reputation?.score ?? base.factions[typedFactionId].score;
    mergedFactions[typedFactionId] = {
      ...base.factions[typedFactionId],
      ...reputation,
      rank: getFactionRank(score)
    };
  });

  return {
    trainers: mergedTrainers,
    factions: mergedFactions
  };
};

export const applyTrainerRelationshipDelta = (
  profile: PlayerProfile,
  trainerId: string,
  deltas: Partial<Pick<SocialState['trainers'][string], 'affinity' | 'rivalry' | 'respect'>> & {
    lastResult?: SocialState['trainers'][string]['lastResult'];
  }
): SocialState => {
  const social = mergeSocialState(profile.social);
  const current = social.trainers[trainerId] ?? { affinity: 0, rivalry: 0, respect: 0, lastResult: null };

  social.trainers[trainerId] = {
    affinity: Math.max(0, current.affinity + (deltas.affinity ?? 0)),
    rivalry: Math.max(0, current.rivalry + (deltas.rivalry ?? 0)),
    respect: Math.max(0, current.respect + (deltas.respect ?? 0)),
    lastResult: deltas.lastResult ?? current.lastResult ?? null
  };

  return social;
};

export const applyFactionReputationDelta = (profile: PlayerProfile, factionId: FactionId, delta: number): SocialState => {
  const social = mergeSocialState(profile.social);
  const nextScore = Math.max(0, social.factions[factionId].score + delta);
  social.factions[factionId] = {
    score: nextScore,
    rank: getFactionRank(nextScore)
  };
  return social;
};
