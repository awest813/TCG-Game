import { EventBus } from '../EventBus';
import { JSONValue, PluginExecutionContext, PluginResult, VNPlugin } from '../types';

export class BabylonCombatPlugin implements VNPlugin {
  readonly id = 'babylon-combat';

  readonly supportedTriggers = ['start_3d_combat'];

  constructor(private readonly eventBus: EventBus, private readonly canvasId: string) {}

  initialize() {
    this.eventBus.on('plugin:triggered', ({ trigger }) => {
      if (trigger === 'start_3d_combat') {
        document.body.dataset.activePlugin = this.id;
      }
    });
  }

  async execute(
    trigger: string,
    params: Record<string, JSONValue> | undefined,
    context: PluginExecutionContext
  ): Promise<PluginResult> {
    if (trigger !== 'start_3d_combat') {
      throw new Error(`Unsupported trigger "${trigger}" for ${this.id}.`);
    }

    const canvas = document.getElementById(this.canvasId);
    if (!canvas) {
      throw new Error(`Babylon canvas "${this.canvasId}" was not found.`);
    }

    const enemyId = typeof params?.enemy === 'string' ? params.enemy : 'unknown-opponent';
    void context;

    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve({
          result: 'victory',
          data: {
            enemyId,
            healthLost: 12,
            rewards: 150
          }
        });
      }, 900);
    });
  }
}
