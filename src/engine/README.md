# VN Engine Scaffold

This folder contains the first-pass hybrid VN framework scaffold:

- `Engine.ts`: runtime coordinator for scripts, state, choices, and plugin triggers
- `StateManager.ts`: serializable engine state with save/load helpers
- `PluginManager.ts`: plugin registration and trigger execution
- `EventBus.ts`: decoupled engine/plugin event flow
- `plugins/BabylonCombatPlugin.ts`: example Babylon-facing plugin contract
- Sample narrative JSON ships under `public/vn/` (e.g. `demo-prologue.json`) and is loaded at runtime by URL

The core engine remains renderer-agnostic. It only knows how to:

1. read script steps
2. mutate serializable state
3. dispatch custom plugin triggers
4. wait for a promise-based result

That separation is what keeps Babylon.js optional and swappable.

## World content & authoring (trainers, districts, shops, quests)

For **adding NPCs, locations, champion routes, district scripts, shop/tournament gates, and navigation**, see **`src/visual-novel/README.md`**. It documents `scriptRegistry.ts`, URL conventions under `public/vn/`, and dev helpers (`paths.ts`, `contentIndex.ts`).

For **tournament brackets, deck editor return routes, battle handoff, shop SKUs, transit flags, and `GameState` fields** (`activeTournament`, `deckEditorReturn`, …), see **`src/gameplay/README.md`** and `src/gameplay/systemsIndex.ts` (Dev Console → dump tournament tiers).

For **adding files under `public/`, URL conventions, `fetchJson`, prefetch, and automated asset checks**, see **`src/content/README.md`** (`npm run content:verify`, Dev Console → verify strict assets).

## Related engines & ideas

- **[Monogatari](https://developers.monogatari.io/documentation)** treats a VN as a normal web app: anything you can do on a website (DOM, canvas, APIs) can ship inside the story. That composability matches our split between `Engine` (data + steps) and React UI shells.
- **[easyvn](https://github.com/Eshan276/easyvn)** (`npm i easyvn`) is a small TypeScript library that drives dialogue via fixed element IDs (`#speaker`, `#dialogue`, `#textbox`, …). This repo includes an optional **EasyVN demo** (debug console → “EasyVN demo”) that mounts those nodes under `src/vn/EasyVNHost.tsx` with assets in `public/assets/backgrounds/` and `public/assets/characters/`. It is a bridge experiment, not a replacement for `Engine` + JSON routes.
- **[RenJS](https://renjs.net)** (Phaser-based, Ren’Py-like scripting for the web) reinforces the same split: **stage layer** (backgrounds, sprites) + **message window** (name + body + advance). Our immersive `VNRunner` borrows that layout (`vn-ren-*` in `VNPresentation.css`): one clickable message area, line reveal, and ▶ cue instead of a wall of chrome. **Auto** / **Skip** in the toolbar mirror Ren’Py-style read modes (timed advance vs. rush through dialogue); toggles persist in `sessionStorage` for the session. See also the [RenJS docs](https://renjs.net/docs-page.html) for plugins (e.g. text input) when we add more interactive beats.
