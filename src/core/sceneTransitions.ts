import { SceneTransition, SceneTransitionVariant, SceneType, VNSession } from './types';

type SceneTransitionOverrides = Partial<Pick<SceneTransition, 'kicker' | 'title' | 'detail' | 'variant'>>;

function createTransitionId() {
  return `scene-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function variantForScene(toScene: SceneType): SceneTransitionVariant {
  switch (toScene) {
    case 'VN_SCENE':
      return 'VN';
    case 'BATTLE':
      return 'BATTLE';
    case 'TOURNAMENT':
      return 'TOURNAMENT';
    case 'TRANSIT':
      return 'TRAVEL';
    default:
      return 'DEFAULT';
  }
}

function defaultCopy(toScene: SceneType): Pick<SceneTransition, 'kicker' | 'title' | 'detail'> {
  switch (toScene) {
    case 'VN_SCENE':
      return {
        kicker: 'Story Link',
        title: 'Opening narrative channel',
        detail: 'Syncing portrait cache, route state, and dialogue feed.'
      };
    case 'BATTLE':
      return {
        kicker: 'Battle Link',
        title: 'Preparing sync arena',
        detail: 'Locking deck state, field rules, and rival telemetry.'
      };
    case 'TOURNAMENT':
      return {
        kicker: 'Bracket Link',
        title: 'Loading tournament channel',
        detail: 'Pulling bracket records, payout tables, and announcer feed.'
      };
    case 'TRANSIT':
      return {
        kicker: 'Metro Link',
        title: 'Routing to the station grid',
        detail: 'Checking rail lanes, district gates, and route pings.'
      };
    case 'DECK_EDITOR':
      return {
        kicker: 'Deck Link',
        title: 'Opening deck terminal',
        detail: 'Mounting collection cache and current build list.'
      };
    default:
      return {
        kicker: 'Scene Link',
        title: 'Switching channels',
        detail: 'Refreshing the local scene shell.'
      };
  }
}

export function createSceneTransition(
  fromScene: SceneType,
  toScene: SceneType,
  overrides: SceneTransitionOverrides = {}
): SceneTransition {
  const fallback = defaultCopy(toScene);
  return {
    id: createTransitionId(),
    fromScene,
    toScene,
    kicker: overrides.kicker ?? fallback.kicker,
    title: overrides.title ?? fallback.title,
    detail: overrides.detail ?? fallback.detail,
    variant: overrides.variant ?? variantForScene(toScene),
    phase: 'OUT'
  };
}

export function createVNEntryTransition(fromScene: SceneType, session: VNSession): SceneTransition {
  return createSceneTransition(fromScene, 'VN_SCENE', {
    kicker: 'Route Link',
    title: session.title,
    detail: session.subtitle || 'Opening scripted route feed.',
    variant: 'VN'
  });
}

export function createVNExitTransition(session: VNSession, nextScene: SceneType, launchBattle: boolean): SceneTransition {
  if (launchBattle || nextScene === 'BATTLE') {
    return createSceneTransition('VN_SCENE', 'BATTLE', {
      kicker: 'Story To Duel',
      title: 'Dropping from dialogue into live combat',
      detail: `${session.title} is handing off to the sync arena.`
    });
  }

  if (nextScene === 'TOURNAMENT') {
    return createSceneTransition('VN_SCENE', 'TOURNAMENT', {
      kicker: 'Story To Bracket',
      title: 'Posting you into the tournament lobby',
      detail: `${session.title} completed. The bracket desk is loading now.`
    });
  }

  if (nextScene === 'TRANSIT') {
    return createSceneTransition('VN_SCENE', 'TRANSIT', {
      kicker: 'Story To Transit',
      title: 'Closing the scene and opening route control',
      detail: `${session.title} completed. Metro guidance is coming online.`
    });
  }

  return createSceneTransition('VN_SCENE', nextScene, {
    kicker: 'Scene Return',
    title: 'Closing route feed',
    detail: `${session.title} completed. Restoring the next gameplay surface.`
  });
}

export function createTournamentBattleTransition(tournamentName: string, opponentName: string): SceneTransition {
  return createSceneTransition('TOURNAMENT', 'BATTLE', {
    kicker: 'Bracket To Duel',
    title: `${tournamentName} match handshake`,
    detail: `${opponentName} is syncing in. Finalizing arena rules and player decks.`,
    variant: 'BATTLE'
  });
}
