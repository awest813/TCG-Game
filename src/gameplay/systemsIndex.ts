/**
 * Dev tooling: tournament tiers, bracket sizes, and lock rules (for console / QA).
 */

import { districtUnlockReason, migrateCircuitFlags, type CircuitFlagMap } from '../core/circuitProgression';
import { getTournamentBracketSize, TOURNAMENT_TIERS } from '../core/TournamentManager';

export type TournamentTierDevRow = {
  id: string;
  name: string;
  locationId: string;
  rounds: number;
  entryFee: number;
  annex: boolean;
  /** Null if enterable with given flags; otherwise reason shown in UI when locked. */
  lockWithFlags: string | null;
};

/**
 * @param flags — pass `state.profile.progress.flags` (or `{}` to see “fresh save” lock state).
 */
export function listTournamentTierDevRows(flags: CircuitFlagMap = {}): TournamentTierDevRow[] {
  const f = migrateCircuitFlags(flags);
  return TOURNAMENT_TIERS.map((t) => ({
    id: t.id,
    name: t.name,
    locationId: t.locationId,
    rounds: getTournamentBracketSize(t.id),
    entryFee: t.entryFee,
    annex: t.locationId === 'card-shop',
    lockWithFlags: t.locationId === 'card-shop' ? null : districtUnlockReason(t.id, f)
  })).sort((a, b) => a.entryFee - b.entryFee || a.id.localeCompare(b.id));
}

export function logTournamentSystemsIndex(flags: CircuitFlagMap = {}): void {
  const rows = listTournamentTierDevRows(flags);
  console.table(
    rows.map((r) => ({
      id: r.id,
      name: r.name,
      location: r.locationId,
      rounds: r.rounds,
      fee: r.entryFee,
      annex: r.annex,
      locked: r.lockWithFlags ? 'yes' : 'no',
      lockReason: r.lockWithFlags ?? ''
    }))
  );
  console.info(`[Gameplay] ${rows.length} tournament tiers (see src/gameplay/README.md)`);
}
