import { describe, expect, it } from 'vitest';
import {
  districtUnlockReason,
  hasClubLicense,
  hasLucyOnboardingComplete,
  hasNeonNightCleared,
  hasShopBeginnerCleared,
  hasShopMiniCleared,
  hasShopVeteranCleared,
  hasTransitOnboardingComplete,
  isDistrictTournamentUnlocked,
  mergeFlagsAfterTournamentVictory,
  migrateCircuitFlags,
  nextCircuitQuest,
  shouldShowFirstSessionChecklist
} from './core/circuitProgression';
import { sanitizeGameState } from './core/gameStateSanitize';
import type { GameState } from './core/types';
import {
  getTournamentBracketSize,
  getTournamentOpponent,
  getTournamentOpponents,
  TOURNAMENT_TIERS
} from './core/TournamentManager';

describe('playthrough smoke: tournament data', () => {
  it('every tier id has a bracket and positive size', () => {
    for (const tier of TOURNAMENT_TIERS) {
      const n = getTournamentBracketSize(tier.id);
      expect(n).toBeGreaterThan(0);
      expect(getTournamentOpponents(tier.id).length).toBe(n);
    }
  });

  it('opponent indices stay in range for typical win counts', () => {
    for (const tier of TOURNAMENT_TIERS) {
      const n = getTournamentBracketSize(tier.id);
      for (let w = 0; w <= n + 2; w++) {
        const id = getTournamentOpponent(tier.id, w);
        expect(typeof id).toBe('string');
        expect(id.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('playthrough smoke: circuit progression', () => {
  const fresh: Record<string, boolean | string> = {
    onboardingStarter: 'Pulse',
    onboardingComplete: false
  };

  it('tutorial order: Lucy then transit then annex copy', () => {
    expect(nextCircuitQuest(fresh, 0)).toMatch(/Lucy|briefing/i);
    const afterLucy = migrateCircuitFlags({ ...fresh, onboardingComplete: true });
    expect(hasLucyOnboardingComplete(afterLucy)).toBe(true);
    expect(nextCircuitQuest(afterLucy, 0)).toMatch(/Transit/i);

    const afterTransit = { ...afterLucy, transitLucyGridIntroDone: true };
    expect(hasTransitOnboardingComplete(migrateCircuitFlags(afterTransit))).toBe(true);
    expect(nextCircuitQuest(migrateCircuitFlags(afterTransit), 0)).toMatch(/Annex|Beginner|Novice/i);
  });

  it('annex ladder merges flags toward club license', () => {
    let f = migrateCircuitFlags({ ...fresh, onboardingComplete: true, transitLucyBriefingDismissed: true });
    f = mergeFlagsAfterTournamentVictory('shop-beginner-circuit', f);
    expect(hasShopBeginnerCleared(f)).toBe(true);
    expect(isDistrictTournamentUnlocked('rookie-scrim', f)).toBe(false);

    f = mergeFlagsAfterTournamentVictory('storefront-mini', f);
    expect(hasShopMiniCleared(f)).toBe(true);

    f = mergeFlagsAfterTournamentVictory('shop-veteran-gauntlet', f);
    expect(hasShopVeteranCleared(f)).toBe(true);
    expect(hasClubLicense(f)).toBe(true);
    expect(isDistrictTournamentUnlocked('rookie-scrim', f)).toBe(true);
    expect(districtUnlockReason('rookie-scrim', f)).toBeNull();
  });

  it('district majors unlock in chain', () => {
    const base = migrateCircuitFlags({
      ...fresh,
      onboardingComplete: true,
      transitLucyBriefingDismissed: true,
      shopBeginnerCleared: true,
      shopMiniCleared: true,
      shopVeteranCleared: true
    });
    expect(isDistrictTournamentUnlocked('rookie-scrim', base)).toBe(true);
    expect(isDistrictTournamentUnlocked('market-pro-am', base)).toBe(false);

    const afterRookie = mergeFlagsAfterTournamentVictory('rookie-scrim', base);
    expect(isDistrictTournamentUnlocked('market-pro-am', afterRookie)).toBe(true);

    const afterMarket = mergeFlagsAfterTournamentVictory('market-pro-am', afterRookie);
    expect(isDistrictTournamentUnlocked('neon-night-league', afterMarket)).toBe(true);

    const afterNeon = mergeFlagsAfterTournamentVictory('neon-night-league', afterMarket);
    expect(hasNeonNightCleared(afterNeon)).toBe(true);
    expect(isDistrictTournamentUnlocked('crown-unlimited', afterNeon)).toBe(true);
  });

  it('first-session checklist gate matches annex beginner flag', () => {
    expect(shouldShowFirstSessionChecklist(fresh)).toBe(true);
    const done = mergeFlagsAfterTournamentVictory('shop-beginner-circuit', migrateCircuitFlags(fresh));
    expect(shouldShowFirstSessionChecklist(done)).toBe(false);
  });

  it('endgame quest mentions crown after neon; repeat copy when titles high', () => {
    const neonDone = migrateCircuitFlags({
      ...fresh,
      onboardingComplete: true,
      transitLucyBriefingDismissed: true,
      shopBeginnerCleared: true,
      shopMiniCleared: true,
      shopVeteranCleared: true,
      rookieScrimCleared: true,
      marketProAmCleared: true,
      neonNightCleared: true
    });
    expect(nextCircuitQuest(neonDone, 6)).toMatch(/Crown|Gauntlet/i);
    expect(nextCircuitQuest(neonDone, 8)).toMatch(/Repeat champion|bracket clears/i);
  });
});

describe('playthrough smoke: save sanitize', () => {
  it('repairs invalid pending tier, toast, and active tournament', () => {
    const shell = {
      location: '',
      currentScene: 'TOURNAMENT',
      timeOfDay: 'MORNING',
      currentQuest: 'q',
      profile: { stats: { tournamentsWon: 0 } },
      activeTournament: {
        tierId: 'not-a-real-tier',
        wins: 0,
        currentOpponentId: 'kaizen',
        status: 'ACTIVE' as const
      },
      pendingTournamentId: 'bogus-tier-id',
      bracketVictoryToast: { tierId: 'rookie-scrim', credits: 500 },
      tournamentLobbyReturn: 'STORE' as const,
      vnSession: null,
      visuals: { presentationTier: 'HIGH' as const }
    } as unknown as GameState;

    const out = sanitizeGameState(shell);
    expect(out.location).toBe('SUNSET_TERMINAL');
    expect(out.pendingTournamentId).toBeNull();
    expect(out.bracketVictoryToast).toBeNull();
    expect(out.activeTournament).toBeNull();
    expect(out.tournamentLobbyReturn).toBeNull();
  });
});
