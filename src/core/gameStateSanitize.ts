import type { GameState } from './types';
import { TOURNAMENT_TIERS } from './TournamentManager';

const tierIds = new Set(TOURNAMENT_TIERS.map((t) => t.id));

/** Repair persisted game state after load, dev edits, or schema drift. */
export function sanitizeGameState(state: GameState): GameState {
  const next: GameState = { ...state };
  let changed = false;

  if (typeof next.location !== 'string' || !next.location.trim()) {
    next.location = 'SUNSET_TERMINAL';
    changed = true;
  }

  if (next.pendingTournamentId && !tierIds.has(next.pendingTournamentId)) {
    next.pendingTournamentId = null;
    changed = true;
  }

  if (next.bracketVictoryToast != null) {
    next.bracketVictoryToast = null;
    changed = true;
  }

  if (next.sceneTransition != null) {
    next.sceneTransition = null;
    changed = true;
  }

  if (next.activeTournament) {
    const { tierId, wins } = next.activeTournament;
    if (!tierIds.has(tierId)) {
      next.activeTournament = null;
      next.tournamentLobbyReturn = null;
      changed = true;
    } else if (typeof wins !== 'number' || !Number.isFinite(wins) || wins < 0) {
      const clamped = Math.max(0, Math.floor(Number(wins) || 0));
      const current = next.activeTournament;
      next.activeTournament = { ...current, wins: clamped };
      changed = true;
    }
  }

  return changed ? next : state;
}
