import type { SceneTransition } from '../core/types';

export type SceneLoaderFlavor = {
  bgAsset: string;
  iconAsset: string;
  label: string;
  telemetry: [string, string, string];
  checklist: [string, string, string];
};

/** Scene-transition splash art — single source for `App` loader + asset verification. */
export const loaderFlavorByVariant: Record<SceneTransition['variant'], SceneLoaderFlavor> = {
  DEFAULT: {
    bgAsset: '/assets/bg/onboarding-route.svg',
    iconAsset: '/assets/ui/icon-core.svg',
    label: 'Scene relay',
    telemetry: ['Cache sync', 'UI shell', 'Packet restore'],
    checklist: ['Seal outgoing scene', 'Mount next channel', 'Release player control']
  },
  VN: {
    bgAsset: '/assets/bg/vn-stage-orbit.svg',
    iconAsset: '/assets/ui/icon-signal.svg',
    label: 'Narrative uplink',
    telemetry: ['Portrait feed', 'Branch state', 'Dialogue lattice'],
    checklist: ['Resolve route source', 'Hydrate VN state', 'Fade stage lighting']
  },
  BATTLE: {
    bgAsset: '/assets/bg/sweep-protocol.svg',
    iconAsset: '/assets/ui/icon-core.svg',
    label: 'Combat staging',
    telemetry: ['Deck lock', 'Field rules', 'Rival telemetry'],
    checklist: ['Freeze match seed', 'Calibrate arena HUD', 'Authorize duel start']
  },
  TOURNAMENT: {
    bgAsset: '/assets/bg/card-annex.svg',
    iconAsset: '/assets/ui/icon-route.svg',
    label: 'Bracket desk',
    telemetry: ['Entry ledger', 'Round table', 'Announcer feed'],
    checklist: ['Read current bracket', 'Sync payout board', 'Prep live pairing']
  },
  TRAVEL: {
    bgAsset: '/assets/bg/onboarding-route.svg',
    iconAsset: '/assets/ui/icon-route.svg',
    label: 'Metro routing',
    telemetry: ['Rail lanes', 'District gate', 'Station uplink'],
    checklist: ['Ping transit graph', 'Confirm destination', 'Open route control']
  }
};

export function listSceneLoaderAssetUrls(): string[] {
  const urls: string[] = [];
  for (const flavor of Object.values(loaderFlavorByVariant)) {
    urls.push(flavor.bgAsset, flavor.iconAsset);
  }
  return urls;
}
