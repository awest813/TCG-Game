import { JSONValue, PluginResult, StatePatch, VNEngineState, VNTranscriptEntry } from './types';

type StateListener = (state: VNEngineState) => void;

const DEFAULT_STATE: VNEngineState = {
  currentSceneId: '',
  currentStepIndex: 0,
  inventory: { items: {} },
  relationships: {},
  choices: {},
  variables: {},
  pluginResults: {},
  flags: {},
  paused: false,
  transcript: [],
  presentation: {}
};

export class StateManager {
  private state: VNEngineState;

  private listeners = new Set<StateListener>();

  constructor(initialState?: Partial<VNEngineState>) {
    this.state = {
      ...DEFAULT_STATE,
      ...initialState,
      inventory: {
        items: {
          ...DEFAULT_STATE.inventory.items,
          ...(initialState?.inventory?.items ?? {})
        }
      },
      relationships: {
        ...DEFAULT_STATE.relationships,
        ...(initialState?.relationships ?? {})
      },
      choices: {
        ...DEFAULT_STATE.choices,
        ...(initialState?.choices ?? {})
      },
      variables: {
        ...DEFAULT_STATE.variables,
        ...(initialState?.variables ?? {})
      },
      pluginResults: {
        ...DEFAULT_STATE.pluginResults,
        ...(initialState?.pluginResults ?? {})
      },
      flags: {
        ...DEFAULT_STATE.flags,
        ...(initialState?.flags ?? {})
      },
      transcript: [...(initialState?.transcript ?? DEFAULT_STATE.transcript)],
      presentation: {
        ...DEFAULT_STATE.presentation,
        ...(initialState?.presentation ?? {})
      }
    };
  }

  getState() {
    return structuredClone(this.state);
  }

  subscribe(listener: StateListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  replace(nextState: VNEngineState) {
    this.state = structuredClone(nextState);
    this.notify();
  }

  patch(update: Partial<VNEngineState>) {
    this.state = {
      ...this.state,
      ...update,
      inventory: update.inventory
        ? { items: { ...this.state.inventory.items, ...update.inventory.items } }
        : this.state.inventory,
      relationships: update.relationships
        ? { ...this.state.relationships, ...update.relationships }
        : this.state.relationships,
      choices: update.choices
        ? { ...this.state.choices, ...update.choices }
        : this.state.choices,
      variables: update.variables
        ? { ...this.state.variables, ...update.variables }
        : this.state.variables,
      pluginResults: update.pluginResults
        ? { ...this.state.pluginResults, ...update.pluginResults }
        : this.state.pluginResults,
      flags: update.flags
        ? { ...this.state.flags, ...update.flags }
        : this.state.flags,
      transcript: update.transcript
        ? [...update.transcript]
        : this.state.transcript,
      presentation: update.presentation
        ? { ...this.state.presentation, ...update.presentation }
        : this.state.presentation
    };

    this.notify();
  }

  applyPatch(patch: StatePatch) {
    const nextInventory = { ...this.state.inventory.items };
    const nextRelationships = { ...this.state.relationships };
    const nextVariables = { ...this.state.variables };
    const nextFlags = { ...this.state.flags };
    const nextPluginResults = patch.pluginResults
      ? { ...this.state.pluginResults, ...patch.pluginResults }
      : this.state.pluginResults;

    Object.entries(patch.inventory ?? {}).forEach(([itemId, count]) => {
      nextInventory[itemId] = (nextInventory[itemId] ?? 0) + count;
    });

    Object.entries(patch.relationships ?? {}).forEach(([characterId, delta]) => {
      nextRelationships[characterId] = (nextRelationships[characterId] ?? 0) + delta;
    });

    Object.entries(patch.variables ?? {}).forEach(([key, value]) => {
      nextVariables[key] = value;
    });

    Object.entries(patch.flags ?? {}).forEach(([key, value]) => {
      nextFlags[key] = value;
    });

    this.patch({
      inventory: { items: nextInventory },
      relationships: nextRelationships,
      variables: nextVariables,
      flags: nextFlags,
      pluginResults: nextPluginResults
    });
  }

  setCurrentScene(sceneId: string, stepIndex = 0) {
    this.patch({
      currentSceneId: sceneId,
      currentStepIndex: stepIndex
    });
  }

  setPaused(paused: boolean) {
    this.patch({ paused });
  }

  recordChoice(choiceId: string, optionId: string) {
    this.patch({
      choices: {
        [choiceId]: optionId
      }
    });
  }

  setVariable(key: string, value: JSONValue) {
    this.patch({
      variables: {
        [key]: value
      }
    });
  }

  storePluginResult(trigger: string, payload: PluginResult) {
    this.patch({
      pluginResults: {
        [trigger]: payload
      }
    });
  }

  pushTranscript(entry: VNTranscriptEntry) {
    this.patch({
      transcript: [...this.state.transcript, entry]
    });
  }

  updatePresentation(update: VNEngineState['presentation']) {
    this.patch({
      presentation: update
    });
  }

  serialize() {
    return JSON.stringify(this.state);
  }

  save(storageKey: string) {
    localStorage.setItem(storageKey, this.serialize());
  }

  load(storageKey: string) {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return false;

    const parsed = JSON.parse(raw) as VNEngineState;
    this.replace(parsed);
    return true;
  }

  private notify() {
    const snapshot = this.getState();
    this.listeners.forEach((listener) => listener(snapshot));
  }
}
