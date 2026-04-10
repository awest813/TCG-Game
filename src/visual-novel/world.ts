import { NPCS } from '../npc/npcs';

export interface DistrictProfile {
  id: string;
  crest: string;
  crestColor: string;
  arcTitle: string;
  travelLabel: string;
  slogan: string;
  atmosphere: string;
  storyRole: string;
  signatureStyle: string;
  championId?: string;
}

export const DISTRICT_PROFILES: Record<string, DistrictProfile> = {
  SUNSET_TERMINAL: {
    id: 'SUNSET_TERMINAL',
    crest: 'ST-01',
    crestColor: '#7dd7dd',
    arcTitle: 'Rookie Rise Arc',
    travelLabel: 'Home Chapter',
    slogan: 'Where new duelists first sync with the city.',
    atmosphere: 'Warm apartment lights, station chatter, and the first pulse of ambition.',
    storyRole: 'Opening chapter and tutorial route.',
    signatureStyle: 'Balanced intros, rival teases, first-deck confidence.',
    championId: 'kaizen'
  },
  MARKET_CENTRAL: {
    id: 'MARKET_CENTRAL',
    crest: 'MC-02',
    crestColor: '#f0c67c',
    arcTitle: 'Velocity Circuit Arc',
    travelLabel: 'Commerce Route',
    slogan: 'Fast decks, bright signage, and no wasted turns.',
    atmosphere: 'Crowded neon markets and hard-edged challenger energy.',
    storyRole: 'Mid-early pressure test for tempo players.',
    signatureStyle: 'Pulse aggression and crowd-pleasing duel swagger.',
    championId: 'vex'
  },
  NEON_MISSION: {
    id: 'NEON_MISSION',
    crest: 'NM-03',
    crestColor: '#cf65d7',
    arcTitle: 'Midnight Stage Arc',
    travelLabel: 'Showtime Route',
    slogan: 'Every duel is a performance and every victory needs style.',
    atmosphere: 'Arcades, after-hours glow, and pop-idol battle energy.',
    storyRole: 'Flashiest district route with stage-battle vibes.',
    signatureStyle: 'Veil tricks, spectacle, and character drama.',
    championId: 'luna'
  },
  BAYLINE_WHARF: {
    id: 'BAYLINE_WHARF',
    crest: 'BW-04',
    crestColor: '#68c6ff',
    arcTitle: 'Harbor Trial Arc',
    travelLabel: 'Tide Route',
    slogan: 'The city slows just long enough to drown you in control.',
    atmosphere: 'Salt air, ferry lights, and disciplined waterline calm.',
    storyRole: 'Control-minded route with a cooler dramatic tempo.',
    signatureStyle: 'Tide setups, composed rivals, relentless pressure.',
    championId: 'maya'
  },
  REDWOOD_HEIGHTS: {
    id: 'REDWOOD_HEIGHTS',
    crest: 'RH-05',
    crestColor: '#d06c5b',
    arcTitle: 'Garden Prestige Arc',
    travelLabel: 'Bloom Route',
    slogan: 'Grace, elegance, and champions who bloom under pressure.',
    atmosphere: 'Rooftop gardens and luxury-club tension.',
    storyRole: 'Elite route with high-status, character-heavy scenes.',
    signatureStyle: 'Bloom sustain, pride, and theatrical refinement.',
    championId: 'valerious'
  },
  CIVIC_CROWN: {
    id: 'CIVIC_CROWN',
    crest: 'CC-FINAL',
    crestColor: '#f5efe5',
    arcTitle: 'Champion Crown Arc',
    travelLabel: 'Final Route',
    slogan: 'The city’s myth made physical, lit by stadium glass.',
    atmosphere: 'Ceremony, pressure, and final-boss grandeur.',
    storyRole: 'Endgame destination and title-match stage.',
    signatureStyle: 'Champion speeches, elite clashes, and anime finals energy.',
    championId: 'zeno'
  }
};

export const getDistrictProfile = (districtId: string): DistrictProfile | null => DISTRICT_PROFILES[districtId] ?? null;

export const getDistrictChampion = (districtId: string) => {
  const championId = DISTRICT_PROFILES[districtId]?.championId;
  return championId ? NPCS.find((npc) => npc.id === championId) ?? null : null;
};
