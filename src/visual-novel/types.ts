import { TimeOfDay } from '../core/types';
import { NPC } from '../npc/npcs';

export type VNActionId = 'DUEL' | 'CLOSE';

export interface VNChoice {
  id: VNActionId;
  label: string;
  variant?: 'primary' | 'secondary';
}

export interface VNDialogueBeat {
  id: string;
  speaker: string;
  role: string;
  line: string;
  accentColor: string;
  mood: string;
  timeOfDay: TimeOfDay;
  choices: VNChoice[];
}

export const createNpcBeat = (npc: NPC, timeOfDay: TimeOfDay): VNDialogueBeat => ({
  id: `${npc.id}-${timeOfDay.toLowerCase()}`,
  speaker: npc.name,
  role: npc.role,
  line: npc.dialogue[timeOfDay] || 'Duel with me!',
  accentColor: npc.avatarColor,
  mood: npc.deck?.length ? 'Challenge route available' : 'Conversation route only',
  timeOfDay,
  choices: [
    ...(npc.deck ? ([{ id: 'DUEL' as const, label: 'Challenge To Duel', variant: 'primary' as const }] satisfies VNChoice[]) : []),
    { id: 'CLOSE' as const, label: 'End Conversation', variant: 'secondary' as const }
  ]
});
