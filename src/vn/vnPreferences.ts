/**
 * Reader preferences (Ren’Py-style config subset): localStorage, with one-time migration from sessionStorage.
 */

import { readPersisted, writePersisted } from './vnStorage';

export const VN_TEXT_CPS = {
  slow: 28,
  normal: 52,
  fast: 88
} as const;

export type VNTextSpeed = keyof typeof VN_TEXT_CPS;

export const VN_AUTO_MS_PRESETS = [1400, 2200, 3000] as const;

const K = {
  textSpeed: 'vn-pref-text-speed',
  autoMs: 'vn-pref-auto-ms',
  windowAlpha: 'vn-pref-window-alpha'
} as const;

export function readTextSpeed(): VNTextSpeed {
  const v = readPersisted(K.textSpeed);
  if (v === 'slow' || v === 'normal' || v === 'fast') return v;
  return 'normal';
}

export function writeTextSpeed(s: VNTextSpeed) {
  writePersisted(K.textSpeed, s);
}

export function readAutoDelayMs(): number {
  const raw = readPersisted(K.autoMs);
  const n = raw ? parseInt(raw, 10) : NaN;
  if (Number.isFinite(n) && n >= 800 && n <= 8000) return n;
  return 2200;
}

export function writeAutoDelayMs(ms: number) {
  writePersisted(K.autoMs, String(Math.round(ms)));
}

/** Message window opacity 0.45–1 */
export function readWindowAlpha(): number {
  const raw = readPersisted(K.windowAlpha);
  const n = raw ? parseFloat(raw) : NaN;
  if (Number.isFinite(n) && n >= 0.45 && n <= 1) return n;
  return 0.92;
}

export function writeWindowAlpha(a: number) {
  writePersisted(K.windowAlpha, String(Math.min(1, Math.max(0.45, a))));
}
