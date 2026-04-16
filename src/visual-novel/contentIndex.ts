/**
 * Dev tooling: expected narrative JSON URLs derived from `locations` + `npcs`.
 * Use from Dev Console or tests to spot missing scripts before playtesting.
 */

import { DISTRICT_LOCATIONS } from '../data/locations';
import { NPCS } from '../npc/npcs';
import { APARTMENT_ONBOARDING_SCRIPT, championScriptUrl, districtRouteScriptUrl } from './paths';

export type NarrativeAssetEntry = {
  url: string;
  kind: 'champion' | 'district-route' | 'onboarding';
  detail: string;
};

export function listExpectedNarrativeAssets(): NarrativeAssetEntry[] {
  const rows: NarrativeAssetEntry[] = [
    { url: APARTMENT_ONBOARDING_SCRIPT, kind: 'onboarding', detail: 'Apartment Lucy onboarding (FirstSessionChecklist)' }
  ];

  for (const npc of NPCS) {
    rows.push({
      url: championScriptUrl(npc.id),
      kind: 'champion',
      detail: `${npc.name} (${npc.role}) · TALK from district explore`
    });
  }

  for (const [districtId, locations] of Object.entries(DISTRICT_LOCATIONS)) {
    for (const loc of locations) {
      for (const action of loc.actions) {
        if (action.type === 'EVENT' || action.type === 'TRAVEL' || action.type === 'DUEL') {
          rows.push({
            url: districtRouteScriptUrl(districtId, action.label),
            kind: 'district-route',
            detail: `${loc.name} · ${action.type} · "${action.label}"`
          });
        }
      }
    }
  }

  rows.sort((a, b) => a.url.localeCompare(b.url));
  return rows;
}

/** Logs a sortable table in the browser console (dev only). */
export function logExpectedNarrativeIndex(): void {
  const rows = listExpectedNarrativeAssets();
  console.table(rows.map((r) => ({ kind: r.kind, url: r.url, detail: r.detail })));
  console.info(`[VN] ${rows.length} expected narrative JSON paths (see src/visual-novel/README.md)`);
}

export function formatExpectedNarrativeIndexText(): string {
  return listExpectedNarrativeAssets()
    .map((r) => `${r.url}\t${r.kind}\t${r.detail}`)
    .join('\n');
}
