export type JSONPrimitive = string | number | boolean | null;
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export interface JSONObject {
  [key: string]: JSONValue;
}
export type JSONArray = JSONValue[];

export interface PluginResult {
  result: string;
  data?: Record<string, JSONValue>;
}

export interface VNTranscriptEntry {
  id: string;
  type: 'dialogue' | 'choice' | 'system';
  speakerId?: string;
  text: string;
}

export interface VNPresentationState {
  background?: string;
  sprite?: string;
  portrait?: string;
  bustLeft?: string;
  bustRight?: string;
  focusSide?: 'left' | 'right' | 'center';
  transition?: 'cut' | 'fade' | 'slide' | 'zoom';
  bgmTrack?: string;
  lastSfx?: string;
}

export interface Condition {
  flag?: string;
  equals?: boolean | string | number | null;
  variable?: string;
  relationship?: string;
  min?: number;
  max?: number;
  choice?: string;
  choiceEquals?: string;
  all?: Condition[];
  any?: Condition[];
}

export interface InventoryState {
  items: Record<string, number>;
}

export interface RelationshipState {
  [characterId: string]: number;
}

export interface NarrativeVariables {
  [key: string]: JSONValue;
}

export interface VNEngineState {
  currentSceneId: string;
  currentStepIndex: number;
  inventory: InventoryState;
  relationships: RelationshipState;
  choices: Record<string, string>;
  variables: NarrativeVariables;
  pluginResults: Record<string, PluginResult>;
  flags: Record<string, boolean>;
  paused: boolean;
  transcript: VNTranscriptEntry[];
  presentation: VNPresentationState;
}

export interface ChoiceOption {
  id: string;
  text: string;
  nextSceneId?: string;
  nextStepIndex?: number;
  effects?: StatePatch;
  conditions?: Condition[];
}

export interface StepBase {
  conditions?: Condition[];
}

export interface DialogueStep extends StepBase {
  type: 'dialogue';
  speakerId: string;
  text: string;
  portrait?: string;
  bustLeft?: string;
  bustRight?: string;
  focusSide?: 'left' | 'right' | 'center';
  voice?: string;
}

export interface ChoiceStep extends StepBase {
  type: 'choice';
  id: string;
  prompt: string;
  options: ChoiceOption[];
}

export interface AudioStep extends StepBase {
  type: 'audio';
  action: 'play-bgm' | 'stop-bgm' | 'play-sfx';
  track: string;
}

export interface VisualStep extends StepBase {
  type: 'visual';
  background?: string;
  sprite?: string;
  portrait?: string;
  bustLeft?: string;
  bustRight?: string;
  focusSide?: 'left' | 'right' | 'center';
  transition?: 'cut' | 'fade' | 'slide' | 'zoom';
}

export interface TriggerStep extends StepBase {
  type: 'trigger';
  event: string;
  params?: Record<string, JSONValue>;
  storeAs?: string;
}

export interface StatePatch {
  inventory?: Record<string, number>;
  relationships?: Record<string, number>;
  variables?: Record<string, JSONValue>;
  flags?: Record<string, boolean>;
}

export interface StateMutationStep extends StepBase {
  type: 'state';
  patch: StatePatch;
}

export interface JumpStep extends StepBase {
  type: 'jump';
  targetSceneId: string;
}

export type NarrativeStep =
  | DialogueStep
  | ChoiceStep
  | AudioStep
  | VisualStep
  | TriggerStep
  | StateMutationStep
  | JumpStep;

export interface NarrativeScene {
  id: string;
  title: string;
  steps: NarrativeStep[];
}

export interface NarrativeScript {
  id: string;
  title: string;
  startSceneId: string;
  scenes: Record<string, NarrativeScene>;
}

export interface PluginExecutionContext {
  state: VNEngineState;
  signal?: AbortSignal;
}

export interface VNPlugin {
  id: string;
  supportedTriggers: string[];
  initialize?: () => Promise<void> | void;
  execute: (
    trigger: string,
    params: Record<string, JSONValue> | undefined,
    context: PluginExecutionContext
  ) => Promise<PluginResult>;
}

export interface EngineHooks {
  onStateChange?: (state: VNEngineState) => void;
  onStepChange?: (step: NarrativeStep | null, sceneId: string) => void;
}
