/**
 * Inventory of site-root URLs referenced by TypeScript so authors can verify `public/` before shipping.
 * Raster placeholders (district explore `.png`, some trainer `avatarPath`) are listed separately — not all ship in-repo.
 */

import { listExpectedNarrativeAssets } from '../visual-novel/contentIndex';
import { CARD_POOL, resolveCardBadgeIcon, resolveCardImage } from '../data/cards';
import { SHOP_INVENTORY } from '../data/shopInventory';
import { TRAINERS } from '../data/trainers';
import { listSceneLoaderAssetUrls as listSceneLoaderAssetUrlsFromFlavors } from './sceneLoaderFlavors';

function uniqueSorted(urls: readonly string[]): string[] {
  return [...new Set(urls.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

/** Shop rows that declare an explicit image path. */
export function listShopImageUrls(): string[] {
  return SHOP_INVENTORY.map((item) => item.image).filter((src): src is string => Boolean(src && src.startsWith('/')));
}

/** Card + badge art used by the pool (deduped). */
export function listCardUiAssetUrls(): string[] {
  const urls: string[] = [];
  for (const card of CARD_POOL) {
    urls.push(resolveCardImage(card));
    urls.push(resolveCardBadgeIcon(card));
    if (card.image && typeof card.image === 'string' && card.image.startsWith('/')) {
      urls.push(card.image);
    }
  }
  return uniqueSorted(urls);
}

/** Trainer bust/portrait SVGs (root `public/*.svg`). PNG avatars are optional — see `listOptionalRasterTrainerUrls`. */
export function listTrainerSvgUrls(): string[] {
  const urls: string[] = [];
  for (const t of TRAINERS) {
    if (t.portraitPath?.endsWith('.svg')) urls.push(t.portraitPath);
    if (t.bustPath?.endsWith('.svg')) urls.push(t.bustPath);
  }
  return uniqueSorted(urls);
}

export function listOptionalRasterTrainerUrls(): string[] {
  const urls: string[] = [];
  for (const t of TRAINERS) {
    if (t.avatarPath?.match(/\.(png|jpe?g|webp)$/i)) urls.push(t.avatarPath);
  }
  return uniqueSorted(urls);
}

/** BattleBoard arena plates. */
export function listBattleFieldAssetUrls(): string[] {
  return ['/assets/fields/garden-haze.svg', '/assets/fields/battle-base.svg'];
}

/** EasyVN demo sample (Dev Console). */
export function listEasyVNDemoAssetUrls(): string[] {
  return ['/assets/backgrounds/demo.svg', '/assets/characters/lucy.svg'];
}

/**
 * URLs that should exist on disk for `npm test` / `npm run content:verify`.
 * Restricted to `.json` and `.svg` so optional raster placeholders do not fail CI.
 *
 * **Champion** talk scripts (`/vn/champions/<npc>.json`) are intentionally omitted here:
 * the NPC roster is larger than the set of shipped dialogue files. Use Dev Console
 * “Dump VN path index” to see the full implied list, then add JSON as you author it.
 */
export function listStrictPublicAssetUrls(): string[] {
  const urls: string[] = [];

  for (const row of listExpectedNarrativeAssets()) {
    if (row.kind === 'champion') continue;
    urls.push(row.url);
  }

  urls.push(...listCardUiAssetUrls());
  urls.push(...listShopImageUrls());
  urls.push(...listSceneLoaderAssetUrlsFromFlavors());
  urls.push(...listBattleFieldAssetUrls());
  urls.push(...listTrainerSvgUrls());
  urls.push(...listEasyVNDemoAssetUrls());

  return uniqueSorted(urls).filter((u) => /\.(json|svg)$/i.test(u));
}

/** Narrative JSON + strict assets — good set to prefetch before a playtest session. */
export function listPrefetchBundleUrls(): string[] {
  const narrative = listExpectedNarrativeAssets().map((r) => r.url);
  return uniqueSorted([...narrative, ...listStrictPublicAssetUrls()]);
}
