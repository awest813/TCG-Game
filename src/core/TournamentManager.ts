export interface TournamentTier {
  id: string;
  name: string;
  description: string;
  locationId: string;
  entryFee: number;
  baseReward: number;
  rarityMultiplier: number;
  enemyLevelRange: [number, number];
  isEndless: boolean;
}

export interface TournamentBanterPack {
  intro: string;
  /** What the opponent says — displayed under their archetype label */
  rival: string;
  /** How the player responds — displayed under the player label */
  player: string;
  /** Display label for the opponent line, e.g. 'RIVAL' | 'CLUB MASTER' | 'ELITE' | 'CHAMPION' */
  opponentLabel: string;
  /** Display label for the player response line */
  playerLabel: string;
  /** Accent color for the opponent panel, sourced from trainer data */
  accentColor: string;
}

export const TOURNAMENT_TIERS: TournamentTier[] = [
  {
    id: 'rookie-scrim',
    name: 'Casual Under-Circuit',
    description: 'Zero fees. Low stakes. Perfect for testing new deck engines.',
    locationId: 'sunset-station',
    entryFee: 0,
    baseReward: 200,
    rarityMultiplier: 1.0,
    enemyLevelRange: [1, 3],
    isEndless: false
  },
  {
    id: 'market-pro-am',
    name: 'Grand Interchange Pro-Am',
    description: 'Official circuit entry. Entry fee required. Serious rewards for serious duelists.',
    locationId: 'market-street',
    entryFee: 500,
    baseReward: 1500,
    rarityMultiplier: 1.5,
    enemyLevelRange: [3, 7],
    isEndless: false
  },
  {
    id: 'neon-night-league',
    name: 'Neon Night Elite',
    description: 'Exclusive club circuit. High stakes for high rolls.',
    locationId: 'neon-club',
    entryFee: 2000,
    baseReward: 6000,
    rarityMultiplier: 2.2,
    enemyLevelRange: [7, 12],
    isEndless: false
  },
  {
    id: 'crown-unlimited',
    name: 'UNLIMITED CROWN GAUNTLET',
    description: 'The Endless Circuit. Entry fee is massive. Rewards grow exponentially with every win. How long can your data stay stable?',
    locationId: 'crown-hall',
    entryFee: 10000,
    baseReward: 25000,
    rarityMultiplier: 5.0,
    enemyLevelRange: [15, 99],
    isEndless: true
  }
];

const TOURNAMENT_BRACKETS: Record<string, string[]> = {
  'rookie-scrim': ['kaizen', 'maya', 'vex'],
  'market-pro-am': ['maya', 'vex', 'luna', 'kaizen'],
  'neon-night-league': ['vex', 'luna', 'valerious', 'kaizen'],
  'crown-unlimited': ['kaizen', 'maya', 'vex', 'luna', 'valerious', 'zeno']
};

type RawBanterPack = Pick<TournamentBanterPack, 'intro' | 'rival' | 'player'>;

const DEFAULT_BANTER: Record<string, RawBanterPack> = {
  kaizen: {
    intro: 'Rival sync signature detected in the bracket tunnel.',
    rival: 'You kept climbing. Good. Losing to me here would finally make this circuit honest.',
    player: 'Then make it count. I did not enter the bracket to play safe.'
  },
  maya: {
    intro: 'Bayline analysts project a tempo-control duel with heavy pressure turns.',
    rival: 'Tournament crowds are noisy. Good duelists still hear the current underneath all of it.',
    player: 'Then I will meet you in the part of the wave that decides the whole match.'
  },
  vex: {
    intro: 'Pulse telemetry is spiking. The arena staff keeps warning challengers about the opening pace.',
    rival: 'This bracket moves faster than fear. If you blink, the scoreboard will finish the story for you.',
    player: 'Then I will write the first turn before you even settle into yours.'
  },
  luna: {
    intro: 'Stage lights recalibrated. Crowd sentiment is rising with every callout of her name.',
    rival: 'The bracket is a stage. If your heart goes flat under pressure, the whole arena can hear it.',
    player: 'Then let the whole city hear what a winning deck sounds like.'
  },
  valerious: {
    intro: 'Elite garden protocol active. The hall has gone quiet in the polished way that means trouble.',
    rival: 'Most challengers confuse spectacle with control. I prune both mistakes and egos.',
    player: 'Then try pruning this one. I brought roots and teeth.'
  },
  zeno: {
    intro: 'Crown authority signature confirmed. Championship-level spectators are filling every balcony.',
    rival: 'This deep in the bracket, excuses die before the duel starts. Only intent survives.',
    player: 'Good. Intent is the only thing I brought more of than nerves.'
  }
};

// Per-opponent archetype metadata — drives labels and accent colors in the UI
const OPPONENT_META: Record<string, { label: string; accentColor: string; panelHeaderLabel: string }> = {
  kaizen:    { label: 'RIVAL',       accentColor: '#cf6547', panelHeaderLabel: 'Rival Encounter' },
  maya:      { label: 'CLUB MASTER', accentColor: '#76b7ff', panelHeaderLabel: 'Club Master Duel' },
  vex:       { label: 'CLUB MASTER', accentColor: '#7dd7dd', panelHeaderLabel: 'Club Master Duel' },
  luna:      { label: 'CLUB MASTER', accentColor: '#a855f7', panelHeaderLabel: 'Club Master Duel' },
  valerious: { label: 'ELITE',       accentColor: '#8effa7', panelHeaderLabel: 'Elite Challenger' },
  zeno:      { label: 'CHAMPION',    accentColor: '#f0c67c', panelHeaderLabel: 'Championship Bout' }
};

const FALLBACK_META = { label: 'OPPONENT', accentColor: 'var(--accent-cyan)', panelHeaderLabel: 'Pre-Fight Briefing' };

export const getOpponentMeta = (opponentId: string) => OPPONENT_META[opponentId] ?? FALLBACK_META;

export const getTournamentOpponents = (tierId: string) => TOURNAMENT_BRACKETS[tierId] ?? TOURNAMENT_BRACKETS['rookie-scrim'];

export const getTournamentBracketSize = (tierId: string) => getTournamentOpponents(tierId).length;

export const getTournamentOpponent = (tierId: string, wins: number) => {
  const bracket = getTournamentOpponents(tierId);
  if (bracket.length === 0) return 'kaizen';
  return bracket[Math.min(wins, bracket.length - 1)];
};

export const getTournamentRoundLabel = (tierId: string, wins: number) => {
  const bracket = getTournamentOpponents(tierId);
  const roundNumber = Math.min(wins + 1, bracket.length);

  if (tierId === 'crown-unlimited') {
    return wins >= bracket.length ? `OVERCLOCK ROUND ${wins + 1}` : `GAUNTLET ROUND ${roundNumber}`;
  }

  if (roundNumber === bracket.length) return 'FINAL TABLE';
  if (roundNumber === bracket.length - 1) return 'SEMIFINAL';
  if (roundNumber === 1) return 'OPENING ROUND';
  return `ROUND ${roundNumber}`;
};

export const getTournamentPreviewLine = (tier: TournamentTier) => {
  if (tier.id === 'rookie-scrim') return 'Local rivals, fast prize cycles, and enough pressure to teach without wrecking your wallet.';
  if (tier.id === 'market-pro-am') return 'A proper city bracket with scouts watching for duelists who can perform on command.';
  if (tier.id === 'neon-night-league') return 'High-visibility night circuit. Stronger rivals, louder crowds, and no quiet turns.';
  return 'The crown-side gauntlet where each win turns the bracket crueler and the payout more addictive.';
};

export const getTournamentBanter = (opponentId: string, relationship = 0, wins = 0): TournamentBanterPack => {
  const base = DEFAULT_BANTER[opponentId] ?? DEFAULT_BANTER.kaizen;
  const meta = getOpponentMeta(opponentId);

  const playerLabel = 'YOU';

  if (relationship >= 3) {
    return {
      intro: `${base.intro} Familiarity detected. This is rivalry territory now, not a first meeting.`,
      rival: `${base.rival} And do not mistake history for mercy.`,
      player: `${base.player} We know each other too well for empty lines now.`,
      opponentLabel: meta.label,
      playerLabel,
      accentColor: meta.accentColor
    };
  }

  if (wins >= 2) {
    return {
      intro: `${base.intro} Your bracket streak is drawing attention from the upper balconies.`,
      rival: `${base.rival} You have momentum now, which makes beating you worth more.`,
      player: `${base.player} Then let's give the bracket a round worth remembering.`,
      opponentLabel: meta.label,
      playerLabel,
      accentColor: meta.accentColor
    };
  }

  return {
    ...base,
    opponentLabel: meta.label,
    playerLabel,
    accentColor: meta.accentColor
  };
};
