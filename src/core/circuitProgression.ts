import type { ProgressFlagValue } from './types';
import { TOURNAMENT_TIERS } from './TournamentManager';

export type CircuitFlagMap = Record<string, ProgressFlagValue>;

export const hasShopBeginnerCleared = (f: CircuitFlagMap) => Boolean(f.shopBeginnerCleared);
export const hasShopMiniCleared = (f: CircuitFlagMap) => Boolean(f.shopMiniCleared);

/** Lucy apartment VN finished (unlocks district / transit objective). */
export const hasLucyOnboardingComplete = (f: CircuitFlagMap) => Boolean(f.onboardingComplete);

/** Transit grid intro or briefing dismissed — see `TransitStation`. */
export const hasTransitOnboardingComplete = (f: CircuitFlagMap) =>
  Boolean(f.transitLucyGridIntroDone || f.transitLucyBriefingDismissed);
export const hasShopVeteranCleared = (f: CircuitFlagMap) => Boolean(f.shopVeteranCleared);

/** Issued after all three boutique brackets are cleared — unlocks sanctioned city events. */
export const hasClubLicense = (f: CircuitFlagMap) =>
  Boolean(f.clubLicenseIssued) ||
  (hasShopBeginnerCleared(f) && hasShopMiniCleared(f) && hasShopVeteranCleared(f));

export const hasRookieScrimCleared = (f: CircuitFlagMap) => Boolean(f.rookieScrimCleared);
export const hasMarketProAmCleared = (f: CircuitFlagMap) => Boolean(f.marketProAmCleared);
export const hasNeonNightCleared = (f: CircuitFlagMap) => Boolean(f.neonNightCleared);

export function isDistrictTournamentUnlocked(tierId: string, flags: CircuitFlagMap): boolean {
  switch (tierId) {
    case 'rookie-scrim':
      return hasClubLicense(flags);
    case 'market-pro-am':
      return hasRookieScrimCleared(flags);
    case 'neon-night-league':
      return hasMarketProAmCleared(flags);
    case 'crown-unlimited':
      return hasNeonNightCleared(flags);
    default:
      return false;
  }
}

export function districtUnlockReason(tierId: string, flags: CircuitFlagMap): string | null {
  if (isDistrictTournamentUnlocked(tierId, flags)) return null;
  switch (tierId) {
    case 'rookie-scrim':
      return 'Clear all three Card Annex backroom brackets (Beginner, Storefront Mini, Counter Gauntlet) to earn your Club License.';
    case 'market-pro-am':
      return 'Clear the full Casual Under-Circuit bracket at the Circuit Terminal first.';
    case 'neon-night-league':
      return 'Clear the full Grand Interchange Pro-Am bracket in Market Central.';
    case 'crown-unlimited':
      return 'Clear the full Neon Night Elite bracket to receive a Crown Hall invitation.';
    default:
      return 'Locked.';
  }
}

export function isShopVeteranUnlocked(flags: CircuitFlagMap): boolean {
  return hasShopMiniCleared(flags);
}

/** Ensures derived flags stay consistent after load or manual edits. */
export function migrateCircuitFlags(flags: CircuitFlagMap): CircuitFlagMap {
  const next: CircuitFlagMap = { ...flags };
  if (hasShopBeginnerCleared(next) && hasShopMiniCleared(next) && hasShopVeteranCleared(next)) {
    next.clubLicenseIssued = true;
  }
  return next;
}

/** First-session rail until the free Card Annex beginner bracket is cleared. */
export function shouldShowFirstSessionChecklist(flags: CircuitFlagMap): boolean {
  return !hasShopBeginnerCleared(migrateCircuitFlags(flags));
}

export function mergeFlagsAfterTournamentVictory(tierId: string, flags: CircuitFlagMap): CircuitFlagMap {
  const next: CircuitFlagMap = { ...flags };
  switch (tierId) {
    case 'shop-beginner-circuit':
      next.shopBeginnerCleared = true;
      break;
    case 'storefront-mini':
      next.shopMiniCleared = true;
      break;
    case 'shop-veteran-gauntlet':
      next.shopVeteranCleared = true;
      break;
    case 'rookie-scrim':
      next.rookieScrimCleared = true;
      break;
    case 'market-pro-am':
      next.marketProAmCleared = true;
      break;
    case 'neon-night-league':
      next.neonNightCleared = true;
      break;
    default:
      break;
  }
  return migrateCircuitFlags(next);
}

/** Extra districts opened after major milestones (main story pacing). */
export function unlockedDistrictsAfterVictory(
  tierId: string,
  currentUnlocked: string[]
): string[] | null {
  const set = new Set(currentUnlocked);
  let changed = false;
  if (tierId === 'rookie-scrim' && !set.has('MARKET_CENTRAL')) {
    set.add('MARKET_CENTRAL');
    changed = true;
  }
  if (tierId === 'market-pro-am' && !set.has('NEON_MISSION')) {
    set.add('NEON_MISSION');
    changed = true;
  }
  if (tierId === 'neon-night-league') {
    ['BAYLINE_WHARF', 'REDWOOD_HEIGHTS', 'CIVIC_CROWN'].forEach((id) => {
      if (!set.has(id)) {
        set.add(id);
        changed = true;
      }
    });
  }
  return changed ? Array.from(set) : null;
}

/**
 * Player-facing objective line (sidebar / frame). Mirrors classic card-RPG structure:
 * tutorial → annex ladders → club license → regional → pro-am → elite → crown.
 */
/** @param titlesWon — completed finite brackets (shop + district majors); drives endgame copy. */
export function nextCircuitQuest(flags: CircuitFlagMap, titlesWon = 0): string {
  const f = migrateCircuitFlags(flags);
  const titles = Math.max(0, Math.floor(titlesWon));
  if (!hasLucyOnboardingComplete(f)) {
    return "Tutorial: Finish Lucy's apartment briefing and optional deck check.";
  }
  if (!hasTransitOnboardingComplete(f)) {
    return "Tutorial: Open Transit (from the apartment) and finish Lucy's grid orientation.";
  }
  if (!hasShopBeginnerCleared(f)) {
    return "Novice circuit: at Sunset's Card Annex, win the free Beginner Initiation bracket.";
  }
  if (!hasShopMiniCleared(f)) {
    return 'Novice circuit: clear the Storefront Mini-Tourney (100 CR entry) at the Card Annex.';
  }
  if (!hasShopVeteranCleared(f)) {
    return 'Novice circuit: clear the Counter Run Gauntlet (five matches, 250 CR) at the Card Annex.';
  }
  if (!hasRookieScrimCleared(f)) {
    return 'Major event: clear the Casual Under-Circuit (free entry) at the Sunset Circuit Terminal — bank credits for the 500 CR Market bracket.';
  }
  if (!hasMarketProAmCleared(f)) {
    return 'Major event: clear the Grand Interchange Pro-Am (500 CR entry) at the Market Circuit Terminal — sweep pays out big if you run the full table.';
  }
  if (!hasNeonNightCleared(f)) {
    return 'Elite arc: clear Neon Night Elite after Neon Mission unlocks on your rail map.';
  }
  if (titles > 6) {
    return `Repeat champion sync: ${titles} bracket clears on file. Crown Gauntlet still scales forever—stack credits there or re-sweep any lobby tier for rivalry reps.`;
  }
  return 'Endgame: the Unlimited Crown Gauntlet at Civic Crown—each win scales the pot until you cash out or fall.';
}

export function districtTournamentsForLobby() {
  return TOURNAMENT_TIERS.filter((t) => t.locationId !== 'card-shop').slice().sort((a, b) => a.prestige - b.prestige);
}

export type CircuitNextStep = {
  phase: string;
  title: string;
  detail: string;
};

export function getCircuitNextStep(flags: CircuitFlagMap, titlesWon = 0): CircuitNextStep {
  const f = migrateCircuitFlags(flags);
  const titles = Math.max(0, Math.floor(titlesWon));

  if (!hasLucyOnboardingComplete(f)) {
    return {
      phase: 'Apartment onboarding',
      title: "Finish Lucy's apartment briefing",
      detail: 'Stay in the apartment flow until the Lucy panel wraps. The deck check is optional, but the briefing is the unlock gate.'
    };
  }

  if (!hasTransitOnboardingComplete(f)) {
    return {
      phase: 'Transit orientation',
      title: 'Open Transit and finish the grid tutorial',
      detail: 'Use the apartment transit link, clear Lucy’s grid explanation, then board Sunset Terminal when the route feed is live.'
    };
  }

  if (!hasShopBeginnerCleared(f)) {
    return {
      phase: 'First sweep',
      title: 'Sweep the Beginner Initiation bracket',
      detail: 'At Sunset Terminal, open Card Annex and clear every round in one run. A sweep here means the full bracket is finished, not just one win.'
    };
  }

  if (!hasShopMiniCleared(f)) {
    return {
      phase: 'Annex ladder',
      title: 'Clear the Storefront Mini-Tourney',
      detail: 'Your next rung is the paid mini bracket in Card Annex. Finish the full table to unlock the gauntlet.'
    };
  }

  if (!hasShopVeteranCleared(f)) {
    return {
      phase: 'Annex ladder',
      title: 'Clear the Counter Run Gauntlet',
      detail: 'Five matches, higher pressure, and the last Annex gate before your Club License comes online.'
    };
  }

  if (!hasRookieScrimCleared(f)) {
    return {
      phase: 'City circuit',
      title: 'Enter the Casual Under-Circuit regional',
      detail: 'Now that the license is live, start the first sanctioned city bracket from the tournament lobby.'
    };
  }

  if (!hasMarketProAmCleared(f)) {
    return {
      phase: 'City circuit',
      title: 'Save for and clear the Market Pro-Am',
      detail: 'The next major is a 500 CR entry bracket. Full clears are where the larger sweep payouts begin.'
    };
  }

  if (!hasNeonNightCleared(f)) {
    return {
      phase: 'Elite circuit',
      title: 'Clear Neon Night Elite',
      detail: 'Push the district ladder forward and keep chaining full bracket clears to reach Crown access.'
    };
  }

  if (titles > 6) {
    return {
      phase: 'Champion loop',
      title: 'Choose your next repeat run',
      detail: 'Re-sweep a finite bracket for rivalry progress or stay in Crown to chase bigger cash-outs.'
    };
  }

  return {
    phase: 'Endgame',
    title: 'Push the Unlimited Crown Gauntlet',
    detail: 'Keep climbing until you want to cash out. Crown is the only bracket that never truly ends.'
  };
}
