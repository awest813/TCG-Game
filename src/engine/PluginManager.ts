import { EventBus } from './EventBus';
import { JSONValue, PluginExecutionContext, PluginResult, VNPlugin } from './types';

export class PluginManager {
  private plugins = new Map<string, VNPlugin>();

  constructor(private readonly eventBus: EventBus) {}

  async register(plugin: VNPlugin) {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin "${plugin.id}" is already registered.`);
    }

    await plugin.initialize?.();
    this.plugins.set(plugin.id, plugin);
  }

  getRegisteredPlugins() {
    return [...this.plugins.values()];
  }

  async executeTrigger(
    trigger: string,
    params: Record<string, JSONValue> | undefined,
    context: PluginExecutionContext
  ): Promise<PluginResult> {
    const plugin = [...this.plugins.values()].find((candidate) => candidate.supportedTriggers.includes(trigger));
    if (!plugin) {
      throw new Error(`No plugin registered for trigger "${trigger}".`);
    }

    this.eventBus.emit('plugin:triggered', { trigger, params });
    const payload = await plugin.execute(trigger, params, context);
    this.eventBus.emit('plugin:completed', { trigger, payload });
    return payload;
  }
}
