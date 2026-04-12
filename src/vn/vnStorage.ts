/**
 * Shared helpers: prefer localStorage, migrate once from sessionStorage for existing sessions.
 */

export function readPersisted(key: string): string | null {
  try {
    if (typeof localStorage !== 'undefined') {
      const v = localStorage.getItem(key);
      if (v !== null) return v;
    }
    if (typeof sessionStorage !== 'undefined') {
      const s = sessionStorage.getItem(key);
      if (s !== null) {
        try {
          if (typeof localStorage !== 'undefined') localStorage.setItem(key, s);
        } catch {
          /* ignore */
        }
        return s;
      }
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function writePersisted(key: string, value: string): void {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
  try {
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}
