import type { TournamentTier } from './TournamentManager';
import { getTournamentBracketSize } from './TournamentManager';

export const CREDITS_LABEL = 'CR' as const;

/** New-game cushion: annex entries + packs without soft-locking before the first major payout. */
export const DEFAULT_STARTING_CREDITS = 1400;

export function formatCredits(amount: number): string {
  const n = Math.floor(amount);
  return `${n.toLocaleString('en-US')} ${CREDITS_LABEL}`;
}

/**
 * Credits awarded if you cash out (or clear the bracket) with this many wins already banked.
 * Matches legacy: floor(base * (1 + wins * rarityMultiplier)).
 */
export function getBracketPotAtWins(tier: TournamentTier, wins: number): number {
  const w = Math.max(0, Math.floor(wins));
  return Math.floor(tier.baseReward * (1 + w * tier.rarityMultiplier));
}

/** Pot after clearing every opponent in the fixed bracket list (not counting endless overclock rounds). */
export function getBracketSweepPot(tier: TournamentTier): number {
  const n = getTournamentBracketSize(tier.id);
  return getBracketPotAtWins(tier, n);
}

export function getNetProfitAfterSweep(tier: TournamentTier): number {
  return getBracketSweepPot(tier) - tier.entryFee;
}

export function getBracketEconomyCaption(tier: TournamentTier): string {
  if (tier.isEndless) {
    return 'Pot grows every win — cash out between rounds before a loss.';
  }
  const net = getNetProfitAfterSweep(tier);
  if (tier.entryFee <= 0) {
    return `Full clear pays ${formatCredits(getBracketSweepPot(tier))}.`;
  }
  return net >= 0
    ? `${formatCredits(net)} ahead of entry on a sweep.`
    : `${formatCredits(net)} vs entry on a sweep.`;
}
