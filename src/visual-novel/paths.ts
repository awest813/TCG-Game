/**
 * Canonical URL builders for narrative JSON on the static server (`public/vn/...`).
 * Keep in sync with `scriptRegistry.ts` session factories.
 */

import { slugifyRouteLabel } from './scriptRegistry';

export const VN_CHAMPIONS_PREFIX = '/vn/champions';
export const VN_ROUTES_PREFIX = '/vn/routes';

/** Gym / rival / champion talk routes from `createChampionSession` (`DistrictExplore` TALK). */
export function championScriptUrl(npcId: string): string {
  return `${VN_CHAMPIONS_PREFIX}/${npcId}.json`;
}

/** District scene routes from `createActionSession` (EVENT, TRAVEL, DUEL). */
export function districtRouteScriptUrl(districtId: string, actionLabel: string): string {
  const district = districtId.toLowerCase();
  const slug = slugifyRouteLabel(actionLabel);
  return `${VN_ROUTES_PREFIX}/${district}/${slug}.json`;
}

/** Lucy apartment onboarding (`createApartmentOnboardingSession`). */
export const APARTMENT_ONBOARDING_SCRIPT = '/vn/demo-prologue.json';
