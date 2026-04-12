import type { GameState, SceneType, TimeOfDay } from './types';
import { sanitizeGameState } from './gameStateSanitize';

export const AUTOSAVE_STORAGE_KEY = 'neo_sf_save';
export const SLOTS_METADATA_KEY = 'neo_sf_slots';

/** Suggested download name for a manual JSON backup (ASCII slug + UTC timestamp). */
export function buildBackupDownloadFilename(profileName: string): string {
  const slug = profileName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 28) || 'pilot';
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  return `sleep-future-save-${slug}-${stamp}.json`;
}

/** Pretty-printed JSON for a full game snapshot (same shape as autosave). */
export function serializeGameStateForBackup(state: unknown): string {
  return `${JSON.stringify(state, null, 2)}\n`;
}

export const slotStorageKey = (slotId: number) => `neo_sf_save_${slotId}`;

export type SaveSlotMeta = {
  id: number;
  timestamp: string;
  playerName: string;
  chapter: number;
  location: string;
  scene: string;
};

const isTimeOfDay = (value: unknown): value is TimeOfDay =>
  value === 'MORNING' || value === 'AFTERNOON' || value === 'EVENING';

const isSceneType = (value: unknown): value is SceneType =>
  [
    'MAIN_MENU',
    'APARTMENT',
    'DISTRICT_EXPLORE',
    'DECK_EDITOR',
    'PACK_OPENING',
    'STORE',
    'BATTLE',
    'REWARD',
    'SOCIAL',
    'TOURNAMENT',
    'TRANSIT',
    'SAVE_LOAD',
    'PROFILE',
    'VN_SCENE'
  ].includes(String(value));

export const isGameState = (value: unknown): value is GameState => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<GameState>;
  return (
    !!candidate.profile &&
    typeof candidate.location === 'string' &&
    typeof candidate.currentQuest === 'string' &&
    isSceneType(candidate.currentScene) &&
    isTimeOfDay(candidate.timeOfDay)
  );
};

/** Parse localStorage JSON into a sanitized game state, or null if corrupt / invalid. */
export function parsePersistedGameState(jsonString: string): GameState | null {
  try {
    const parsed: unknown = JSON.parse(jsonString);
    if (!isGameState(parsed)) return null;
    return sanitizeGameState(parsed);
  } catch {
    return null;
  }
}

function readStoredMeta(): SaveSlotMeta[] {
  try {
    const raw = localStorage.getItem(SLOTS_METADATA_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (row): row is SaveSlotMeta =>
        !!row &&
        typeof row === 'object' &&
        typeof (row as SaveSlotMeta).id === 'number' &&
        typeof (row as SaveSlotMeta).timestamp === 'string' &&
        typeof (row as SaveSlotMeta).playerName === 'string'
    );
  } catch {
    return [];
  }
}

/**
 * Build slot list from disk: valid saves get a row; metadata timestamps are preserved when present.
 */
export function readReconciledSlots(): SaveSlotMeta[] {
  const prevById = new Map(readStoredMeta().map((s) => [s.id, s]));
  const next: SaveSlotMeta[] = [];

  for (let id = 0; id < 3; id++) {
    const raw = localStorage.getItem(slotStorageKey(id));
    const game = raw ? parsePersistedGameState(raw) : null;
    if (!game) continue;

    const prev = prevById.get(id);
    next.push({
      id,
      timestamp: prev?.timestamp ?? new Date().toLocaleString(),
      playerName: game.profile.name,
      chapter: game.profile.progress.chapter ?? 1,
      location: game.location,
      scene: game.currentScene
    });
  }

  return next.sort((a, b) => a.id - b.id);
}

export function writeSlotsMeta(slots: SaveSlotMeta[]) {
  localStorage.setItem(SLOTS_METADATA_KEY, JSON.stringify(slots));
}

export function hasAutosave(): boolean {
  try {
    const raw = localStorage.getItem(AUTOSAVE_STORAGE_KEY);
    return Boolean(raw && parsePersistedGameState(raw));
  } catch {
    return false;
  }
}
