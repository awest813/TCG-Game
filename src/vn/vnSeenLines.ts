/**
 * Persist which dialogue lines have been advanced past (per script), for “skip read text” behavior.
 */

const STORAGE_KEY = 'vn-seen-dialogue-v1';

export function scriptFingerprint(scriptUrl: string): string {
  let h = 0;
  for (let i = 0; i < scriptUrl.length; i += 1) {
    h = (Math.imul(31, h) + scriptUrl.charCodeAt(i)) | 0;
  }
  return `fp${(h >>> 0).toString(16)}`;
}

export function dialogueLineKey(scriptFp: string, sceneId: string, stepIndex: number): string {
  return `${scriptFp}|${sceneId}|${stepIndex}`;
}

function loadMap(): Record<string, true> {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as Record<string, true>;
  } catch {
    return {};
  }
}

export function isDialogueLineSeen(key: string): boolean {
  const map = loadMap();
  return Boolean(map[key]);
}

export function markDialogueLineSeen(key: string): void {
  try {
    if (typeof localStorage === 'undefined') return;
    const map = loadMap();
    map[key] = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* quota / private mode */
  }
}
