import { FactionId, PlayerProfile, SocialState } from '../core/types';

export interface TrainerRecord {
  id: string;
  name: string;
  title: string;
  factionId: FactionId;
  homeDistrict: string;
  deck: string[];
  avatarPath?: string;
  portraitPath?: string;
  bustPath?: string;
  accentColor: string;
  signatureField?: string;
  summary: string;
  /** Voice, habits, and how they treat rivals — shown in Profile and tournament dossier. */
  personality: string;
  specialty?: string;
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
    avatarPath: '/portrait_lucy.svg',
    portraitPath: '/portrait_lucy.svg',
    bustPath: '/bust_lucy.svg',
    accentColor: '#f0c67c',
    signatureField: 'neon-grid',
    summary: 'Your handler for the early circuit, equal parts mentor, producer, and pressure valve.',
    personality:
      'Warm and direct, with producer instincts: she reads your tells like script notes and delivers feedback you did not ask for but needed. Hates empty hype and loves a comeback story when it is earned, not invented.',
    specialty: 'Balanced tempo — she reads the board before the board reads her.'
  },
  {
    id: 'kaizen',
    name: 'Kaizen',
    title: 'Rival Duelist',
    factionId: 'PULSE',
    homeDistrict: 'SUNSET_TERMINAL',
    deck: ['ziprail', 'ziprail', 'neon-striker', 'voltlynx', 'overdrive-fox', 'signal-boost', 'quick-transfer', 'neon-grid'],
    avatarPath: '/portrait_kaizen.svg',
    portraitPath: '/portrait_kaizen.svg',
    bustPath: '/bust_kaizen.svg',
    accentColor: '#cf6547',
    signatureField: 'neon-grid',
    summary: 'Your headline rival, all acceleration and nerve, obsessed with proving the city has room for only one rising ace.',
    personality:
      'Fierce and competitive, but honest about it — she trash-talks in the open and apologizes in private when she crosses a line. Respects hard-won wins, hates getting outpaced, and treats every bracket like a race where second place is a story she refuses to star in.',
    specialty: 'Blitz aggression — she overwhelms before you can stabilize.'
  },
  {
    id: 'maya',
    name: 'Maya',
    title: 'Tide Club Master',
    factionId: 'TIDE',
    homeDistrict: 'BAYLINE_WHARF',
    deck: ['wharfin', 'mist-glider', 'coral-guard', 'wave-rider', 'tsunami-core', 'system-refresh', 'rooftop-remedy', 'tidal-nexus'],
    portraitPath: '/portrait_maya.svg',
    bustPath: '/bust_maya.svg',
    accentColor: '#76b7ff',
    signatureField: 'tidal-nexus',
    summary: 'A control specialist who treats every duel like a tide chart and every mistake like drift.',
    personality:
      'Measured and observant; speaks in long, unhurried sentences because rushing language would mean rushing the tide. Every question she asks is a test, and she remembers the answers longer than you do. Calm surface, stubborn win condition underneath.',
    specialty: 'Tide control — patience turned into inevitability.'
  },
  {
    id: 'vex',
    name: 'Vex',
    title: 'Pulse Club Master',
    factionId: 'PULSE',
    homeDistrict: 'MARKET_CENTRAL',
    deck: ['ziprail', 'neon-striker', 'voltlynx', 'overdrive-fox', 'shield-drone', 'quick-transfer', 'overclock', 'neon-grid'],
    portraitPath: '/portrait_vex.svg',
    bustPath: '/bust_vex.svg',
    accentColor: '#7dd7dd',
    signatureField: 'neon-grid',
    summary: 'A speed tyrant whose favorite tactic is making the match feel decided before the board catches up.',
    personality:
      'Sharp and efficient — no wasted words, no wasted moves, and a glare that says "pick up the pace" before she has to say it out loud. Finds hesitation offensive and treats politeness as optional once the first card hits the field.',
    specialty: 'Pure velocity — the board state shifts before opponents react.'
  },
  {
    id: 'luna',
    name: 'Luna',
    title: 'Neon Club Master',
    factionId: 'NEON',
    homeDistrict: 'NEON_MISSION',
    deck: ['seedling-bot', 'solar-rose', 'bloom-monarch', 'mirror-phantom', 'neon-striker', 'system-refresh', 'signal-boost', 'void-rift'],
    portraitPath: '/portrait_luna.svg',
    bustPath: '/bust_luna.svg',
    accentColor: '#cf6547',
    signatureField: 'void-rift',
    summary: 'A showrunner duelist who frames every game like a live set and every opponent like a scene partner.',
    personality:
      'Theatrical and magnetic: every duel is a performance and she wrote the setlist, the lighting cues, and your walk-on music without asking. Feeds off crowd noise but turns eerily focused when the match is close — the persona drops and the competitor shows.',
    specialty: 'Disruption and flair — she destabilizes while staying beautiful about it.'
  },
  {
    id: 'valerious',
    name: 'Valerious',
    title: 'Bloom Elite Master',
    factionId: 'BLOOM',
    homeDistrict: 'REDWOOD_HEIGHTS',
    deck: ['mosshop', 'verdajack', 'solar-rose', 'bloom-monarch', 'fortress-walker', 'rooftop-remedy', 'system-refresh', 'garden-haze'],
    portraitPath: '/portrait_valerious.svg',
    bustPath: '/bust_valerious.svg',
    accentColor: '#8effa7',
    signatureField: 'garden-haze',
    summary: 'An aristocratic grinder who turns sustain, board presence, and composure into a very personal kind of threat.',
    personality:
      'Composed and quietly formidable; she has seen every strategy before and finds panic beneath her like weeds to prune. Polished manners, surgical lines — compliments your deck choice while dismantling the version you brought today.',
    specialty: 'Attrition bloom — outlasting until victory is the only remaining outcome.'
  },
  {
    id: 'zeno',
    name: 'Zeno',
    title: 'Grand League Champion',
    factionId: 'CROWN',
    homeDistrict: 'CIVIC_CROWN',
    deck: ['omega-link', 'royal-bloom', 'tsunami-core', 'stream-ace', 'mirror-phantom', 'alloy-foundry', 'recursion-loop', 'master-rank-medal'],
    portraitPath: '/portrait_zeno.svg',
    bustPath: '/bust_zeno.svg',
    accentColor: '#f0c67c',
    signatureField: 'alloy-foundry',
    summary: 'The reigning apex champion, built from prestige, composure, and a deck that feels engineered to punish impatience.',
    personality:
      'Serenely authoritative — she does not need to raise her voice because the record, the lights, and the purse already did. Treats pressure like weather: acknowledge it, dress for it, then win anyway. Rarely surprised; when she is, she hides it like a champion.',
    specialty: 'Adaptive mastery — her deck shifts to reflect exactly what you are not prepared for.'
  },
  {
    id: 'arborjun',
    name: 'Arbor Jun',
    title: 'Transit Scrubs Captain',
    factionId: 'CIRCUIT',
    homeDistrict: 'SUNSET_TERMINAL',
    deck: ['signalmite', 'mosshop', 'spore-scout', 'seedling-bot', 'rooftop-remedy', 'quick-transfer', 'system-refresh', 'ziprail'],
    portraitPath: '/portrait_lucy.svg',
    accentColor: '#9ccc7a',
    summary: 'A terminal regular who farms sanctioned scrubs on lunch breaks and never skips a mulligan lecture.',
    personality:
      'Dry humor and endless patience at the scrub tables — Jun treats bad plays like weather, not moral failure, unless you blame the deck. Secretly tracks sideboard habits for half the terminal and will quote your old lines back at you in the next bracket.',
    specialty: 'Low-curve board clog — wins by never handing you a clean line.'
  },
  {
    id: 'brickhale',
    name: 'Brick Hale',
    title: 'Wharf Pickup Duelist',
    factionId: 'TIDE',
    homeDistrict: 'BAYLINE_WHARF',
    deck: ['wharfin', 'coral-guard', 'iron-mite', 'shield-beetle', 'wave-rider', 'mist-glider', 'system-refresh', 'tidal-nexus'],
    portraitPath: '/portrait_maya.svg',
    accentColor: '#5aa4e8',
    summary: 'Dockhand who treats every match like moving freight: steady lanes, heavy fronts, no drama.',
    personality:
      'Blunt and reliable like a cleat on wet wood — she respects anyone who trades prizes without whining and has no patience for theatrics that slow the wharf down. Loyal to Tide locals; tourists get one polite warning, then the tide.',
    specialty: 'Wall stacks into one decisive tide turn.'
  },
  {
    id: 'cursorwei',
    name: 'Cursor Wei',
    title: 'Grid Script Runner',
    factionId: 'PULSE',
    homeDistrict: 'SUNSET_TERMINAL',
    deck: ['ziprail', 'neon-striker', 'voltlynx', 'signalmite', 'quick-transfer', 'signal-boost', 'overclock', 'neon-grid'],
    portraitPath: '/portrait_kaizen.svg',
    accentColor: '#66d4d4',
    summary: 'Automation-minded duelist who pilots the same opener fifty times until the city learns it by heart.',
    personality:
      'Speaks in patch notes and version numbers; finds beauty in identical turn ones and gets genuinely annoyed when someone "improvises" into a loss. Secretly roots for underdogs who still sequence like adults.',
    specialty: 'Scripted aggression — punishes any hand that stumbles on tempo.'
  },
  {
    id: 'dahlbloom',
    name: 'Dahl Bloom',
    title: 'Annex Floor Coach',
    factionId: 'BLOOM',
    homeDistrict: 'MARKET_CENTRAL',
    deck: ['seedling-bot', 'solar-rose', 'bloom-whisper', 'mosshop', 'verdajack', 'rooftop-remedy', 'garden-haze', 'system-refresh'],
    portraitPath: '/portrait_valerious.svg',
    accentColor: '#7fdc8f',
    summary: 'Shop-sponsored mentor who refines rookies with soft losses and harder side questions.',
    personality:
      'Encouraging until you disrespect the rules or the plants — then the gloves come off and the coaching voice turns into a lecture you will remember. Believes growth should hurt a little or it is not real.',
    specialty: 'Growth lines that punish greedy prize trades.'
  },
  {
    id: 'echorye',
    name: 'Echo Rye',
    title: 'Backroom Odds Grinder',
    factionId: 'NEON',
    homeDistrict: 'NEON_MISSION',
    deck: ['neon-striker', 'mirror-phantom', 'void-wisp', 'hollow-glitch', 'signal-boost', 'void-rift', 'stream-ace', 'system-refresh'],
    portraitPath: '/portrait_luna.svg',
    accentColor: '#e07a5a',
    summary: 'Night-market duelist who lives for mirror lines and crowd heat.',
    personality:
      'Loud laugh, quiet reads — the crowd thinks she is chaos; the log says otherwise. Bets on herself every bracket and treats odds as suggestions written by people who lost to her already.',
    specialty: 'Disruptive tempo — forces awkward answers every turn.'
  },
  {
    id: 'fablekin',
    name: 'Fable Kin',
    title: 'Storyboard Skirmisher',
    factionId: 'NEON',
    homeDistrict: 'NEON_MISSION',
    deck: ['mirror-phantom', 'stream-ace', 'neon-striker', 'void-rift', 'signal-boost', 'data-diver', 'hollow-glitch', 'void-wisp'],
    portraitPath: '/portrait_luna.svg',
    accentColor: '#c45cff',
    summary: 'Performer who narrates the duel like a serial — each prize is another episode beat.',
    personality:
      'Theatrical and sharp; remembers your old misplays and quotes them with stage timing. Loves a narrative twist and hates duelists who refuse to be a character — if you are boring, she will assign you a role anyway.',
    specialty: 'Mind-game sequencing — baits shields then collapses tempo.'
  },
  {
    id: 'gatsbyvolt',
    name: 'Gatsby Volt',
    title: 'Interchange Speed Dealer',
    factionId: 'PULSE',
    homeDistrict: 'MARKET_CENTRAL',
    deck: ['ziprail', 'overdrive-fox', 'voltlynx', 'battery-cat', 'power-cell', 'quick-transfer', 'overclock', 'neon-grid'],
    portraitPath: '/portrait_vex.svg',
    accentColor: '#ffd447',
    summary: 'Market floor shark who sells cables by day and steals tempo by night.',
    personality:
      'Charming hustler energy — every bracket is a sales funnel and Gatsby is always closing. Flirts with risk and with customers alike; underneath the grin is someone who studied matchups the way other people study stock tickers.',
    specialty: 'Battery burst curves — spikes damage before stabilizers land.'
  },
  {
    id: 'harborsue',
    name: 'Harbor Sue',
    title: 'Tide League Qualifier',
    factionId: 'TIDE',
    homeDistrict: 'BAYLINE_WHARF',
    deck: ['tidal-whale', 'wave-rider', 'mist-glider', 'coral-guard', 'tsunami-core', 'system-refresh', 'tidal-nexus', 'rooftop-remedy'],
    portraitPath: '/portrait_maya.svg',
    accentColor: '#4b8bcd',
    summary: 'Qualifier staple with a calm voice and a deck that drowns overextensions.',
    personality:
      'Quiet confidence: offers water, asks about your day, then takes your prizes without changing tone. Treats the bracket like tide tables — inevitable, impersonal, and oddly comforting once you stop fighting the pull.',
    specialty: 'Late-game tidal bombs after soft early trades.'
  },
  {
    id: 'irisneon',
    name: 'Iris Neon',
    title: 'Pulse Satellite',
    factionId: 'PULSE',
    homeDistrict: 'MARKET_CENTRAL',
    deck: ['rail-bastion', 'shield-drone', 'fortress-walker', 'ziprail', 'neon-striker', 'quick-transfer', 'signal-boost', 'alloy-titan'],
    portraitPath: '/portrait_vex.svg',
    accentColor: '#5ef0f0',
    summary: 'Hybrid engineer who pairs maglev rush with stubborn alloy walls.',
    personality:
      'Technical and precise; annoyed by lazy sideboarding and by people who call variance what was actually a sequencing error. Explains lines like blueprints — not to help you, but because ugly play offends her.',
    specialty: 'Pivot lines — swaps between blitz and fortress mid-bracket.'
  },
  {
    id: 'jettline',
    name: 'Jett Line',
    title: 'Counter Run Analyst',
    factionId: 'CIRCUIT',
    homeDistrict: 'MARKET_CENTRAL',
    deck: ['signalmite', 'data-diver', 'system-refresh', 'quick-transfer', 'stream-ace', 'mirror-phantom', 'emergency-reboot', 'neon-grid'],
    portraitPath: '/portrait_lucy.svg',
    accentColor: '#f2d38a',
    summary: 'Bracket statistician who turned pro after too many “unlucky” pairings.',
    personality:
      'Dry wit and ruthless punishes for missed math — she keeps mental spreadsheets of your habits and will sigh when you walk into the same line twice. Respects anyone who can prove the odds wrong on purpose, not by accident.',
    specialty: 'Resource denial — bleeds you with small edges until the log looks unfair.'
  },
  {
    id: 'korimist',
    name: 'Kori Mist',
    title: 'Fogline Tactician',
    factionId: 'TIDE',
    homeDistrict: 'BAYLINE_WHARF',
    deck: ['mist-glider', 'wharfin', 'void-wisp', 'shadow-prowler', 'coral-guard', 'system-refresh', 'tidal-nexus', 'veil-reaper'],
    portraitPath: '/portrait_maya.svg',
    accentColor: '#7ec8e8',
    summary: 'Specialist in obscuring lines — you think you see win-con, then the board vanishes into fog.',
    personality:
      'Soft-spoken and unnervingly still between plays; smiles like fog rolling in when you think you are ahead. Prefers opponents who overcommit — panic tastes louder than victory to her.',
    specialty: 'Evasion stacks into sudden lethal angles.'
  },
  {
    id: 'ledgermo',
    name: 'Ledger Mo',
    title: 'Regional Gatekeeper',
    factionId: 'CIRCUIT',
    homeDistrict: 'SUNSET_TERMINAL',
    deck: ['iron-mite', 'shield-beetle', 'alloy-titan', 'rail-bastion', 'fortress-walker', 'system-refresh', 'quick-transfer', 'master-rank-medal'],
    portraitPath: '/portrait_lucy.svg',
    accentColor: '#b8a878',
    summary: 'Paperwork duelist — every exchange is logged, every prize is taxed in tempo.',
    personality:
      'Monotone jokes and ironclad discipline — the regional gatekeeper vibe is half act, half truth. Treats every exchange like a receipt: stamped, filed, and used against you in the rematch.',
    specialty: 'Metal frontline — grinds until your hand runs out of answers.'
  },
  {
    id: 'mikastream',
    name: 'Mika Stream',
    title: 'Broadcast Rookie',
    factionId: 'NEON',
    homeDistrict: 'SUNSET_TERMINAL',
    deck: ['stream-ace', 'neon-striker', 'mirror-phantom', 'signal-boost', 'data-diver', 'hollow-glitch', 'void-rift', 'system-refresh'],
    portraitPath: '/portrait_luna.svg',
    accentColor: '#ff8a65',
    summary: 'Streamer who turned chat votes into a real deck — chaotic, readable, dangerous on hot draws.',
    personality:
      'High energy; thrives on crowd sync meters and chat spam, but turns laser-focused when chat goes quiet — that is when she plays for the clip and the win at the same time. Hates being underestimated as "just entertainment."',
    specialty: 'Variance-positive lines — embraces risk for highlight turns.'
  },
  {
    id: 'novapulse',
    name: 'Nova Pulse',
    title: 'Pro-Am Wildcard',
    factionId: 'PULSE',
    homeDistrict: 'MARKET_CENTRAL',
    deck: ['voltlynx', 'overdrive-fox', 'ziprail', 'neon-striker', 'overclock', 'power-cell', 'battery-cat', 'neon-grid'],
    portraitPath: '/portrait_vex.svg',
    accentColor: '#ff6b9d',
    summary: 'Wildcard invite who earned it by upsetting two club seconds in the same weekend.',
    personality:
      'Fierce grin and zero respect for seeding tables — she earned her invite in bloodless upsets and remembers every analyst who picked against her. Plays like someone with nothing to lose until she has everything to prove.',
    specialty: 'Explosive openers — tries to end the narrative before midgame.'
  },
  {
    id: 'onyxveil',
    name: 'Onyx Veil',
    title: 'Shadow Broker',
    factionId: 'NEON',
    homeDistrict: 'NEON_MISSION',
    deck: ['shadow-prowler', 'void-wisp', 'veil-reaper', 'mirror-phantom', 'hollow-glitch', 'void-rift', 'data-diver', 'stream-ace'],
    portraitPath: '/portrait_luna.svg',
    accentColor: '#6b5b95',
    summary: 'Night operator who treats light levels like another resource to manage.',
    personality:
      'Cryptic and amused; never repeats the same win condition twice in interviews because she actually rotates lines on purpose. Enjoys watching confident duelists talk themselves into corners.',
    specialty: 'Shadow suite control — chip, fade, then one silent close.'
  },
  {
    id: 'paxbay',
    name: 'Pax Bay',
    title: 'Wharf Enforcer',
    factionId: 'TIDE',
    homeDistrict: 'BAYLINE_WHARF',
    deck: ['tsunami-core', 'wave-rider', 'tidal-whale', 'coral-guard', 'wharfin', 'system-refresh', 'tidal-nexus', 'rooftop-remedy'],
    portraitPath: '/portrait_maya.svg',
    accentColor: '#3d7ea6',
    summary: 'Enforcer energy with a Tide license — protects the wharf bracket from tourists.',
    personality:
      'Stoic and protective of Bayline locals — enforcer energy with a soft spot for first-timers who respect the water and the bracket rules. Once you are family, she will bodyguard your reputation; until then, you are just another wake.',
    specialty: 'Big-wave finishes after bruising midgame trades.'
  },
  {
    id: 'riagarden',
    name: 'Ria Garden',
    title: 'Bloom Provisional',
    factionId: 'BLOOM',
    homeDistrict: 'REDWOOD_HEIGHTS',
    deck: ['bloom-monarch', 'solar-rose', 'lush-golem', 'verdajack', 'bloom-whisper', 'garden-haze', 'royal-bloom', 'rooftop-remedy'],
    portraitPath: '/portrait_valerious.svg',
    accentColor: '#8effa7',
    summary: 'Provisional elite who walks the garden paths like a runway — every bloom is placed.',
    personality:
      'Polite menace — compliments your deck while dismantling it, always with the tone of someone watering plants. Treats Bloom like etiquette: beauty is mandatory, mercy is optional.',
    specialty: 'Monarch pressure — grows inevitability behind polite trades.'
  },
  {
    id: 'soragrid',
    name: 'Sora Grid',
    title: 'Lattice Control',
    factionId: 'CIRCUIT',
    homeDistrict: 'SUNSET_TERMINAL',
    deck: ['rail-bastion', 'shield-drone', 'fortress-walker', 'signalmite', 'system-refresh', 'data-diver', 'recursion-loop', 'neon-grid'],
    portraitPath: '/portrait_lucy.svg',
    accentColor: '#a8d8ff',
    summary: 'Grid theorist who builds “rooms” on the board and dares you to find the door.',
    personality:
      'Detached and curious; takes notes mid-duel like a researcher watching a specimen learn fear. Rarely raises her voice — the board does the shouting for her.',
    specialty: 'Recursive stabilization — outlasts until you misstep once.'
  },
  {
    id: 'tavenalloy',
    name: 'Taven Alloy',
    title: 'Night Forge Duelist',
    factionId: 'CROWN',
    homeDistrict: 'CIVIC_CROWN',
    deck: ['alloy-foundry', 'alloy-titan', 'rail-bastion', 'shield-drone', 'fortress-walker', 'omega-link', 'recursion-loop', 'master-rank-medal'],
    portraitPath: '/portrait_zeno.svg',
    accentColor: '#d4af37',
    summary: 'Crown-side smith who thinks in metal phases — every line is tempered twice.',
    personality:
      'Formal and intense, obsessed with clean victories — messy wins count in the standings but not in her self-respect. Speaks to metal like it is alive and to opponents like they are projects to temper.',
    specialty: 'Alloy towers into recursion — wins the long resource war.'
  },
  {
    id: 'yukirift',
    name: 'Yuki Rift',
    title: 'Voidline Prodigy',
    factionId: 'NEON',
    homeDistrict: 'NEON_MISSION',
    deck: ['void-rift', 'void-wisp', 'veil-reaper', 'mirror-phantom', 'hollow-glitch', 'stream-ace', 'data-diver', 'recursion-loop'],
    portraitPath: '/portrait_luna.svg',
    accentColor: '#9d7cff',
    summary: 'Prodigy who hears static between turns and plays into the gaps others ignore.',
    personality:
      'Quiet intensity with unnerving calm after big swings — the void between turns is where she lives, and she invites you in without a map. Young enough to be called prodigy, old enough in duels to feel cruel when focused.',
    specialty: 'Void suite — collapses boards into rift lethal puzzles.'
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

export const getTrainerRelationshipSignal = (
  trainer: TrainerRecord,
  relationship: SocialState['trainers'][string]
): { label: string; text: string } => {
  if (relationship.lastResult === 'WIN') {
    return {
      label: 'Afterglow',
      text: `${trainer.name} logged your last result and is reading you as a real bracket threat now.`
    };
  }

  if (relationship.lastResult === 'LOSS') {
    return {
      label: 'Heat',
      text: `${trainer.name} thinks the rematch still belongs to her unless you prove otherwise on the table.`
    };
  }

  if (relationship.affinity >= 3 && relationship.respect >= 2) {
    return {
      label: 'Open Channel',
      text: `${trainer.name} has started treating your route like an ongoing conversation instead of a one-off clash.`
    };
  }

  if (relationship.rivalry >= 3) {
    return {
      label: 'Live Rivalry',
      text: `${trainer.name} is measuring your route against her own in real time and wants the next meeting loud.`
    };
  }

  if (relationship.respect >= 3) {
    return {
      label: 'Professional Read',
      text: `${trainer.name} respects your sequencing enough to study what you do between matches.`
    };
  }

  if (relationship.affinity >= 2) {
    return {
      label: 'Warm Signal',
      text: `${trainer.name} is easing up around you and letting more of her off-stage self show.`
    };
  }

  return {
    label: 'Cold Read',
    text: `${trainer.name} is still feeling you out, which means every duel and conversation is part of the audition.`
  };
};
