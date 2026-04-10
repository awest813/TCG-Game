import { EventBus } from './EventBus';
import { PluginManager } from './PluginManager';
import { StateManager } from './StateManager';
import {
  ChoiceStep,
  Condition,
  EngineHooks,
  NarrativeScript,
  NarrativeStep,
  PluginResult,
  TriggerStep
} from './types';

export class Engine {
  private script: NarrativeScript | null = null;

  readonly eventBus: EventBus;

  readonly pluginManager: PluginManager;

  readonly stateManager: StateManager;

  constructor(initialState?: ConstructorParameters<typeof StateManager>[0], private readonly hooks: EngineHooks = {}) {
    this.eventBus = new EventBus();
    this.pluginManager = new PluginManager(this.eventBus);
    this.stateManager = new StateManager(initialState);

    this.stateManager.subscribe((state) => {
      this.eventBus.emit('engine:state-changed', state);
      this.hooks.onStateChange?.(state);
    });
  }

  loadScript(script: NarrativeScript) {
    this.script = script;
    this.stateManager.setCurrentScene(script.startSceneId, 0);
  }

  start(sceneId?: string) {
    const script = this.getScript();
    const startSceneId = sceneId ?? script.startSceneId;
    this.stateManager.setCurrentScene(startSceneId, 0);
    this.emitStepChange();
  }

  getCurrentStep(): NarrativeStep | null {
    const script = this.getScript();
    const state = this.stateManager.getState();
    const scene = script.scenes[state.currentSceneId];
    if (!scene) return null;

    for (let index = state.currentStepIndex; index < scene.steps.length; index += 1) {
      const candidate = scene.steps[index];
      if (!this.matchesConditions(candidate.conditions)) continue;

      if (candidate.type === 'choice') {
        const options = candidate.options.filter((option) => this.matchesConditions(option.conditions));
        if (options.length === 0) continue;
        return { ...candidate, options };
      }

      return candidate;
    }

    return null;
  }

  async advance(choiceOptionId?: string): Promise<NarrativeStep | ChoiceStep | null> {
    this.getScript();
    const currentStep = this.getCurrentStep();
    if (!currentStep) return null;

    switch (currentStep.type) {
      case 'choice':
        return this.resolveChoice(currentStep, choiceOptionId);
      case 'dialogue':
        this.stateManager.updatePresentation({
          portrait: currentStep.portrait ?? this.stateManager.getState().presentation.portrait,
          bustLeft: currentStep.bustLeft ?? this.stateManager.getState().presentation.bustLeft,
          bustRight: currentStep.bustRight ?? this.stateManager.getState().presentation.bustRight,
          focusSide: currentStep.focusSide ?? this.stateManager.getState().presentation.focusSide
        });
        this.stateManager.pushTranscript({
          id: `${this.stateManager.getState().currentSceneId}-${this.stateManager.getState().currentStepIndex}`,
          type: 'dialogue',
          speakerId: currentStep.speakerId,
          text: currentStep.text
        });
        this.incrementStep();
        return this.getCurrentStep();
      case 'audio':
        this.stateManager.updatePresentation({
          bgmTrack: currentStep.action === 'play-bgm' ? currentStep.track : undefined,
          lastSfx: currentStep.action === 'play-sfx' ? currentStep.track : this.stateManager.getState().presentation.lastSfx
        });
        this.incrementStep();
        return this.getCurrentStep();
      case 'visual':
        this.stateManager.updatePresentation({
          background: currentStep.background ?? this.stateManager.getState().presentation.background,
          sprite: currentStep.sprite ?? this.stateManager.getState().presentation.sprite,
          portrait: currentStep.portrait ?? this.stateManager.getState().presentation.portrait,
          bustLeft: currentStep.bustLeft ?? this.stateManager.getState().presentation.bustLeft,
          bustRight: currentStep.bustRight ?? this.stateManager.getState().presentation.bustRight,
          focusSide: currentStep.focusSide ?? this.stateManager.getState().presentation.focusSide,
          transition: currentStep.transition ?? this.stateManager.getState().presentation.transition
        });
        this.incrementStep();
        return this.getCurrentStep();
      case 'state':
        this.stateManager.applyPatch(currentStep.patch);
        this.incrementStep();
        return this.advance();
      case 'jump':
        this.stateManager.setCurrentScene(currentStep.targetSceneId, 0);
        this.emitStepChange();
        return this.getCurrentStep();
      case 'trigger':
        return this.resolveTrigger(currentStep);
      default:
        this.incrementStep();
        return this.getCurrentStep();
    }
  }

  save(storageKey = 'vn_engine_save') {
    this.stateManager.save(storageKey);
  }

  load(storageKey = 'vn_engine_save') {
    return this.stateManager.load(storageKey);
  }

  private async resolveTrigger(step: TriggerStep): Promise<NarrativeStep | null> {
    this.stateManager.setPaused(true);
    const payload = await this.pluginManager.executeTrigger(step.event, step.params, {
      state: this.stateManager.getState()
    });

    this.applyPluginPayload(step, payload);
    this.stateManager.setPaused(false);
    this.incrementStep();
    return this.getCurrentStep();
  }

  private resolveChoice(step: ChoiceStep, choiceOptionId?: string): NarrativeStep | ChoiceStep | null {
    if (!choiceOptionId) return step;

    const option = step.options.find((candidate) => candidate.id === choiceOptionId);
    if (!option) {
      throw new Error(`Choice option "${choiceOptionId}" was not found in choice "${step.id}".`);
    }

    this.stateManager.recordChoice(step.id, option.id);
    this.stateManager.pushTranscript({
      id: `${this.stateManager.getState().currentSceneId}-${step.id}-${option.id}`,
      type: 'choice',
      text: option.text
    });
    if (option.effects) {
      this.stateManager.applyPatch(option.effects);
    }

    if (option.nextSceneId) {
      this.stateManager.setCurrentScene(option.nextSceneId, option.nextStepIndex ?? 0);
      this.emitStepChange();
      return this.getCurrentStep();
    }

    this.incrementStep(option.nextStepIndex);
    return this.getCurrentStep();
  }

  private applyPluginPayload(step: TriggerStep, payload: PluginResult) {
    if (step.storeAs) {
      this.stateManager.setVariable(step.storeAs, payload.result);
    }

    this.stateManager.storePluginResult(step.event, payload);

    if (payload.data) {
      Object.entries(payload.data).forEach(([key, value]) => {
        this.stateManager.setVariable(key, value);
      });
    }
  }

  private incrementStep(stepIndex?: number) {
    const state = this.stateManager.getState();
    this.stateManager.patch({
      currentStepIndex: stepIndex ?? state.currentStepIndex + 1
    });
    this.emitStepChange();
  }

  private emitStepChange() {
    const state = this.stateManager.getState();
    this.eventBus.emit('engine:step-changed', {
      sceneId: state.currentSceneId,
      stepIndex: state.currentStepIndex
    });
    this.hooks.onStepChange?.(this.getCurrentStep(), state.currentSceneId);
  }

  private getScript() {
    if (!this.script) {
      throw new Error('No narrative script is loaded.');
    }
    return this.script;
  }

  private matchesConditions(conditions?: Condition[]) {
    if (!conditions || conditions.length === 0) return true;
    return conditions.every((condition) => this.evaluateCondition(condition));
  }

  private evaluateCondition(condition: Condition): boolean {
    const state = this.stateManager.getState();

    if (condition.all) {
      return condition.all.every((entry) => this.evaluateCondition(entry));
    }

    if (condition.any) {
      return condition.any.some((entry) => this.evaluateCondition(entry));
    }

    if (condition.flag) {
      const flagValue = state.flags[condition.flag] ?? false;
      return condition.equals === undefined ? Boolean(flagValue) : flagValue === condition.equals;
    }

    if (condition.variable) {
      const variableValue = state.variables[condition.variable];
      if (condition.equals !== undefined) return variableValue === condition.equals;
      if (condition.min !== undefined) return typeof variableValue === 'number' && variableValue >= condition.min;
      if (condition.max !== undefined) return typeof variableValue === 'number' && variableValue <= condition.max;
      return variableValue !== undefined;
    }

    if (condition.relationship) {
      const relationshipValue = state.relationships[condition.relationship] ?? 0;
      if (condition.min !== undefined && relationshipValue < condition.min) return false;
      if (condition.max !== undefined && relationshipValue > condition.max) return false;
      return true;
    }

    if (condition.choice) {
      const chosen = state.choices[condition.choice];
      return condition.choiceEquals ? chosen === condition.choiceEquals : Boolean(chosen);
    }

    return true;
  }
}
