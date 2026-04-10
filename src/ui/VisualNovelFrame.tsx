import React, { useMemo } from 'react';
import { useGame } from '../core/GameContext';
import { SceneType } from '../core/types';
import { getDistrictChampion, getDistrictProfile } from '../visual-novel/world';

const SCENE_LABELS: Record<SceneType, { chapter: string; label: string; tone: string }> = {
  MAIN_MENU: { chapter: 'Prologue', label: 'Title Screen', tone: 'Awaiting input' },
  APARTMENT: { chapter: 'Chapter 01', label: 'Apartment Hub', tone: 'Private interior' },
  DISTRICT_EXPLORE: { chapter: 'Chapter 01', label: 'District Route', tone: 'Conversation-ready' },
  DECK_EDITOR: { chapter: 'Systems', label: 'Deck Terminal', tone: 'Analysis mode' },
  PACK_OPENING: { chapter: 'Systems', label: 'Pack Opening', tone: 'Reveal sequence' },
  STORE: { chapter: 'District', label: 'Card Boutique', tone: 'Acquisition route' },
  BATTLE: { chapter: 'Conflict', label: 'Sync Battle', tone: 'Combat staging' },
  REWARD: { chapter: 'Aftermath', label: 'Reward Feed', tone: 'Resolution' },
  SOCIAL: { chapter: 'District', label: 'Social Link', tone: 'Character route' },
  TOURNAMENT: { chapter: 'Circuit', label: 'Tournament Bracket', tone: 'High pressure' },
  TRANSIT: { chapter: 'Transit', label: 'Rail Map', tone: 'Route planning' },
  SAVE_LOAD: { chapter: 'Systems', label: 'Archive', tone: 'Persistence' },
  PROFILE: { chapter: 'Systems', label: 'Profile', tone: 'Operator record' },
  VN_SCENE: { chapter: 'Route', label: 'Visual Novel Scene', tone: 'Scripted dialogue' }
};

export const VisualNovelFrame: React.FC = () => {
  const { state } = useGame();
  const profile = state.profile;
  const sceneMeta = SCENE_LABELS[state.currentScene];
  const displayLabel = state.currentScene === 'VN_SCENE' && state.vnSession ? state.vnSession.title : sceneMeta.label;
  const districtProfile = getDistrictProfile(state.location);
  const districtChampion = getDistrictChampion(state.location);

  const partnerName = useMemo(
    () => profile.primaryPartner?.species ?? profile.mainBioSync?.species ?? 'No Partner Linked',
    [profile.mainBioSync?.species, profile.primaryPartner?.species]
  );

  const inventorySummary = useMemo(
    () => `${profile.inventory.deck.length} deck / ${profile.inventory.cards.length} collection`,
    [profile.inventory.cards.length, profile.inventory.deck.length]
  );

  if (state.currentScene === 'MAIN_MENU') return null;

  return (
    <div className="vn-frame" aria-hidden="true">
      <div className="vn-frame-corner top-left" />
      <div className="vn-frame-corner top-right" />
      <div className="vn-frame-corner bottom-left" />
      <div className="vn-frame-corner bottom-right" />

      <div className="vn-frame-top">
        <div className="vn-frame-topline">
          <span className="vn-frame-chip">{sceneMeta.chapter}</span>
          <span className="vn-frame-title">{displayLabel}</span>
        </div>
        <div className="vn-frame-topline">
          <span className="vn-frame-micro">Operator {profile.name.toUpperCase()}</span>
          <span className="vn-frame-micro">{state.timeOfDay}</span>
          <span className="vn-frame-micro">{state.location.replace(/_/g, ' ')}</span>
          {districtProfile && <span className="vn-frame-micro">{districtProfile.travelLabel}</span>}
        </div>
      </div>

      <div className="vn-frame-sidebar left">
        <div className="vn-frame-kicker">Current Route</div>
        <div className="vn-frame-sidebar-copy">{state.currentQuest}</div>
        <div className="vn-frame-divider" />
        <div className="vn-frame-kicker">Scene Tone</div>
        <div className="vn-frame-sidebar-copy">{sceneMeta.tone}</div>
        {districtProfile && (
          <>
            <div className="vn-frame-divider" />
            <div className="vn-frame-kicker">District Motto</div>
            <div className="vn-frame-sidebar-copy">{districtProfile.slogan}</div>
          </>
        )}
      </div>

      <div className="vn-frame-sidebar right">
        <div className="vn-frame-kicker">Partner Link</div>
        <div className="vn-frame-sidebar-copy">{partnerName}</div>
        <div className="vn-frame-divider" />
        <div className="vn-frame-kicker">Inventory Feed</div>
        <div className="vn-frame-sidebar-copy">{inventorySummary}</div>
        {districtChampion && (
          <>
            <div className="vn-frame-divider" />
            <div className="vn-frame-kicker">Route Champion</div>
            <div className="vn-frame-sidebar-copy">{districtChampion.name} // {districtChampion.role}</div>
          </>
        )}
      </div>

      <div className="vn-frame-bottom">
        <div className="vn-frame-kicker">Narration Feed</div>
        <div className="vn-frame-bottom-copy">
          {state.currentScene === 'BATTLE'
            ? 'The arena closes in. Every command now reads like dialogue with consequences.'
            : districtProfile
              ? `${districtProfile.arcTitle}: ${districtProfile.atmosphere}`
              : 'Every scene now plays inside a character-forward presentation frame built to feel like a visual novel.'}
        </div>
      </div>
    </div>
  );
};
