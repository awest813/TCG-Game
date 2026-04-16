/**
 * Small loaders for JSON and static checks — use from UI, tests, or Dev Console.
 */

import { publicUrl } from './publicUrl';

export class ContentLoadError extends Error {
  readonly url: string;
  readonly status: number;

  constructor(url: string, status: number, message?: string) {
    super(message ?? `Failed to load ${url} (${status})`);
    this.name = 'ContentLoadError';
    this.url = url;
    this.status = status;
  }
}

/** Fetch JSON from a site-root path (e.g. `/vn/champions/maya.json`) or absolute URL. */
export async function fetchJson<T>(pathOrUrl: string): Promise<T> {
  const url = pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://') ? pathOrUrl : publicUrl(pathOrUrl);
  const response = await fetch(url);
  if (!response.ok) {
    throw new ContentLoadError(url, response.status);
  }
  return (await response.json()) as T;
}

/** Warm the HTTP cache (and decode images) before showing a scene. Fire-and-forget in dev. */
export function prefetchAssetUrls(urls: readonly string[]): void {
  for (const raw of urls) {
    const u = publicUrl(raw);
    if (/\.(png|jpe?g|webp|gif|svg)$/i.test(u)) {
      const img = new Image();
      img.src = u;
    } else {
      void fetch(u, { method: 'GET', cache: 'force-cache' }).catch(() => undefined);
    }
  }
}

/** True if the URL responds OK (HEAD, or GET byte range if HEAD is unsupported). */
export async function verifyPublicUrlReachable(url: string): Promise<boolean> {
  const u = publicUrl(url);
  try {
    let response = await fetch(u, { method: 'HEAD' });
    if (!response.ok && response.status !== 405) {
      response = await fetch(u, { method: 'GET', headers: { Range: 'bytes=0-0' } });
    } else if (response.status === 405) {
      response = await fetch(u, { method: 'GET', headers: { Range: 'bytes=0-0' } });
    }
    return response.ok;
  } catch {
    return false;
  }
}

export async function verifyPublicUrlsReachable(urls: readonly string[]): Promise<{ url: string; ok: boolean }[]> {
  const out = await Promise.all(
    urls.map(async (url) => ({
      url: publicUrl(url),
      ok: await verifyPublicUrlReachable(url)
    }))
  );
  return out;
}
