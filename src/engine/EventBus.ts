import { JSONValue, PluginResult, VNEngineState } from './types';

export interface EngineEventMap {
  'engine:state-changed': VNEngineState;
  'engine:step-changed': { sceneId: string; stepIndex: number };
  'plugin:triggered': { trigger: string; params?: Record<string, JSONValue> };
  'plugin:completed': { trigger: string; payload: PluginResult };
}

type EventKey = keyof EngineEventMap;
type EventHandler<K extends EventKey> = (payload: EngineEventMap[K]) => void;

export class EventBus {
  private listeners = new Map<EventKey, Set<EventHandler<EventKey>>>();

  on<K extends EventKey>(event: K, handler: EventHandler<K>) {
    const handlers = this.listeners.get(event) ?? new Set<EventHandler<EventKey>>();
    handlers.add(handler as EventHandler<EventKey>);
    this.listeners.set(event, handlers);

    return () => {
      handlers.delete(handler as EventHandler<EventKey>);
    };
  }

  emit<K extends EventKey>(event: K, payload: EngineEventMap[K]) {
    const handlers = this.listeners.get(event);
    if (!handlers) return;

    handlers.forEach((handler) => {
      handler(payload as never);
    });
  }
}
