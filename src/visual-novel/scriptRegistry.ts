import { SceneType, TimeOfDay, VNSession } from '../core/types';
import { NPCS } from '../npc/npcs';

export const createChampionSession = (
  npcId: string,
  timeOfDay: TimeOfDay,
  overrides?: Partial<VNSession>
): VNSession | null => {
  const npc = NPCS.find((entry) => entry.id === npcId);
  if (!npc) return null;

  return {
    scriptUrl: `/vn/champions/${npc.id}.json`,
    title: `${npc.name} Route`,
    subtitle: `${npc.role} // ${timeOfDay} Link`,
    returnScene: 'DISTRICT_EXPLORE',
    nextSceneOnComplete: 'BATTLE',
    sourceId: npc.id,
    ...overrides
  };
};

const slugifyLabel = (label: string) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const createActionSession = (
  districtId: string,
  locationId: string,
  label: string,
  type: 'EVENT' | 'TRAVEL' | 'DUEL',
  timeOfDay: TimeOfDay
): VNSession => {
  const slug = slugifyLabel(label);
  const nextSceneOverrides: Record<string, SceneType> = {
    'challenge-elite-four': 'TOURNAMENT'
  };
  const baseSession: VNSession = {
    scriptUrl: `/vn/routes/${districtId.toLowerCase()}/${slug}.json`,
    title: `${label} Route`,
    subtitle: `${districtId.replace(/_/g, ' ')} // ${timeOfDay}`,
    returnScene: 'DISTRICT_EXPLORE',
    nextSceneOnComplete: nextSceneOverrides[slug] ?? 'DISTRICT_EXPLORE',
    sourceId: `${locationId}:${slug}`
  };

  if (type === 'TRAVEL') {
    return {
      ...baseSession,
      nextSceneOnComplete: 'TRANSIT'
    };
  }

  if (type === 'DUEL') {
    return {
      ...baseSession,
      nextSceneOnComplete: 'BATTLE'
    };
  }

  return baseSession;
};

export const createApartmentOnboardingSession = (starterLabel: string | undefined, canvasId: string): VNSession => ({
  scriptUrl: '/vn/demo-prologue.json',
  title: 'Apartment Onboarding',
  subtitle: `Lucy // ${starterLabel ?? 'Starter'} Route`,
  returnScene: 'APARTMENT',
  nextSceneOnComplete: 'DECK_EDITOR',
  canvasId,
  sourceId: 'lucy-onboarding'
});

export const resolveCompletionScene = (session: VNSession | null, launchBattle: boolean): SceneType => {
  if (launchBattle) return 'BATTLE';
  return session?.nextSceneOnComplete ?? session?.returnScene ?? 'DISTRICT_EXPLORE';
};
