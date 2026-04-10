# VN Engine Scaffold

This folder contains the first-pass hybrid VN framework scaffold:

- `Engine.ts`: runtime coordinator for scripts, state, choices, and plugin triggers
- `StateManager.ts`: serializable engine state with save/load helpers
- `PluginManager.ts`: plugin registration and trigger execution
- `EventBus.ts`: decoupled engine/plugin event flow
- `plugins/BabylonCombatPlugin.ts`: example Babylon-facing plugin contract
- `scripts/demo-prologue.json`: sample non-programmer-friendly narrative script

The core engine remains renderer-agnostic. It only knows how to:

1. read script steps
2. mutate serializable state
3. dispatch custom plugin triggers
4. wait for a promise-based result

That separation is what keeps Babylon.js optional and swappable.
