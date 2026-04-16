# Visual novel & world content — developer guide

This document is the **authoring counterpart** to the player-facing immersive shell (`VNRunner`, `VNPresentation.css`). It explains how **districts, NPCs, trainers, shops, quests, and navigation** connect to narrative JSON and the game state—at the same tier of clarity you would expect from Tyrano / Ren’Py tooling docs.

## Architecture (mental model)

```text
┌─────────────────────────────────────────────────────────────────┐
│  DATA LAYER (TypeScript)                                        │
│  locations.ts · npcs.ts · trainers.ts · world.ts · circuit*     │
└───────────────┬───────────────────────────────────┬───────────────┘
                │                                   │
                ▼                                   ▼
┌───────────────────────────┐       ┌─────────────────────────────┐
│  SESSION FACTORY          │       │  STATIC SCRIPTS             │
│  scriptRegistry.ts        │       │  public/vn/champions/*.json │
│  (VNSession + URLs)       │       │  public/vn/routes/.../*.json│
└───────────────┬───────────┘       └──────────────┬──────────────┘
                │                                   │
                └──────────────┬────────────────────┘
                               ▼
                    ┌────────────────────┐
                    │  Engine + VNRunner │
                    │  (VN_SCENE, etc.)  │
                    └────────────────────┘
```

- **World data** decides *what the player can click* in `DistrictExplore` and *which URL* loads.
- **Narrative JSON** is the script the engine runs (dialogue, choices, visuals, `trigger` steps).
- **`scriptRegistry.ts`** is the **single bridge**: it turns a location action + district into a `VNSession` (`scriptUrl`, `returnScene`, `nextSceneOnComplete`, …).

## Core types

| Concept | Where it lives | Purpose |
|--------|----------------|---------|
| `SceneLocation` / `LocationAction` | `src/data/locations.ts` | Places in a district; each **action** can open a VN, jump scenes, or open shop. |
| `NPC` | `src/npc/npcs.ts` | Street cast: dialogue lines per time of day, optional **deck**, **location**, **activeTimes**. Used for **TALK → champion route**. |
| `TrainerRecord` | `src/data/trainers.ts` | Profile / tournaments / social: portraits, factions, lore—not the same object as `NPC`, but ids often align (`maya`, `kaizen`, …). |
| `DistrictProfile` | `src/visual-novel/world.ts` | Flavor copy + **championId** pointer into `NPCS` for UI. |
| `VNSession` | `src/core/types.ts` | Staging payload: `scriptUrl`, `title`, `subtitle`, `returnScene`, `nextSceneOnComplete`, `sourceId`, optional `canvasId`. |
| `NarrativeScript` | `src/engine/types.ts` | JSON schema: `scenes`, `steps` (`dialogue`, `choice`, `visual`, `audio`, `state`, `jump`, `trigger`). |

### NPC vs trainer (important)

- **`NPC`** drives **district explore** talk flows and **`/vn/champions/<id>.json`** via `createChampionSession`.
- **`TrainerRecord`** drives **deck metadata, profile, tournaments**. Keep **ids aligned** (`maya`, `vex`, …) so story flags and combat stay coherent.

## How scripts are resolved from the world

### 1) Champion / club master talk (`TALK`)

- **Trigger**: `LocationAction` with `type: 'TALK'` and `targetId: '<npcId>'`.
- **Handler**: `createChampionSession(npcId, …)` in `scriptRegistry.ts`.
- **Expected file**: `public/vn/champions/<npcId>.json`  
  Helper: `championScriptUrl(npcId)` in `paths.ts`.

### 2) District scripted beats (`EVENT`, `TRAVEL`, `DUEL`)

- **Trigger**: `EVENT` | `TRAVEL` | `DUEL` actions on a location.
- **Handler**: `createActionSession(districtId, locationId, label, type, timeOfDay)` in `scriptRegistry.ts`.
- **URL rule**: `/vn/routes/<districtLower>/<slug>.json` where `slug = slugifyRouteLabel(label)`.  
  Example: district `SUNSET_TERMINAL`, label `"Board NEORail"` → `public/vn/routes/sunset_terminal/board-neorail.json`.  
  Helper: `districtRouteScriptUrl(districtId, label)`.

**Renaming a button label in `locations.ts` without adding a JSON file will 404**—the slug is derived from the label string.

### 3) Apartment onboarding

- **Handler**: `createApartmentOnboardingSession` → `scriptUrl: '/vn/demo-prologue.json'`.
- Constant: `APARTMENT_ONBOARDING_SCRIPT` in `paths.ts`.

### 4) Completion routing

- **`resolveCompletionScene(session, launchBattle)`** picks the next `SceneType` after the script ends (battle, transit, return to district, etc.).
- Scripts set flags like `launchBattle`, `advanceTime`; `VNScene` syncs them into `profile.progress.flags` and `currentQuest`.

## Shop mechanics (dev view)

- **Card shop** is a **scene** (`STORE`), not a JSON route, for normal `SHOP` actions from the district.
- **Progression gates** (Club License, district tournament tiers) live in **`circuitProgression.ts`** + flags such as `shopBeginnerCleared`, `rookieScrimCleared`, …
- Tournament tier strings used in UI (`SHOP_BRACKET_ROUTE_HINT`, `CITY_MAJOR_ROUTE_HINT` in `locations.ts`) should stay aligned with `TournamentManager` / `mergeFlagsAfterTournamentVictory`.

When adding a **new shop bracket**, update: tournament tier id → circuit flags → any `routeHint` copy in locations.

## Quests & “current quest”

- **`GameState.currentQuest`** is a **string line** shown in the status bar and can be overwritten from VN variables (`vnState.variables.currentQuest`) in `VNScene` / `ApartmentHub` sync handlers.
- **Long-running objectives** usually map to **`profile.progress.flags`** (see `circuitProgression.ts` and `migrateCircuitFlags`).

Prefer **named flags** for anything that unlocks navigation; use **`currentQuest`** for player-facing one-liners.

## Navigation graph (scenes)

`SceneType` in `src/core/types.ts` is the authoritative list (`APARTMENT`, `DISTRICT_EXPLORE`, `VN_SCENE`, `STORE`, `TRANSIT`, …).

Typical VN exits:

- `returnScene` on `VNSession` → where **Exit** or dismiss goes.
- `nextSceneOnComplete` → default after script completes unless battle/transit overrides.
- `sceneTransition` (`createSceneTransition`, `createVNEntryTransition`) → animated handoff between scenes.

## Narrative JSON authoring

- **Schema**: `NarrativeScript` / `NarrativeStep` in `src/engine/types.ts`.
- **Steps**: `dialogue` (speakerId matches NPC id for consistency), `choice` with optional `conditions` / `effects`, `visual` for BG/portraits, `audio`, `state` patches, `trigger` for Babylon/plugins, `jump` between scenes.
- **Saves**: engine serializes `VNEngineState` to `localStorage` keys derived from `storageKey` in `VNRunner` / `VNScene`.

## Dev tooling in-repo

| Tool | Purpose |
|------|---------|
| `src/visual-novel/paths.ts` | Canonical `championScriptUrl`, `districtRouteScriptUrl`, onboarding path. |
| `src/visual-novel/contentIndex.ts` | `listExpectedNarrativeAssets()`, `logExpectedNarrativeIndex()` — expected JSON list from locations + npcs. |
| `slugifyRouteLabel` | Exported from `scriptRegistry.ts` — must match filesystem slugs. |
| Debug console | “Dump VN path index” button logs the table (see `DevConsole.tsx`). |

## Checklist: add a new champion route

1. Add or update **`NPC`** in `src/npc/npcs.ts` (`id`, `location`, `activeTimes`, optional `deck`).
2. Add **`public/vn/champions/<id>.json`** (copy structure from `maya.json` / `luna.json`).
3. Wire **`TALK`** on a location in `src/data/locations.ts` with `targetId` = that `id`.
4. Ensure **`speakerId`** in dialogue steps matches `npc.id` for traceability.
5. Playtest from **District Explore** at the correct **time of day** and district.

## Checklist: add a new district event / travel / duel script

1. Add the **action** on a `SceneLocation` in `locations.ts` (`EVENT`, `TRAVEL`, or `DUEL`).
2. Compute the URL with `districtRouteScriptUrl(districtId, action.label)` or run `logExpectedNarrativeIndex()`.
3. Add **`public/vn/routes/<district>/<slug>.json`** with matching slug (label changes ⇒ slug changes).
4. If `type === 'TRAVEL'`, `scriptRegistry` forces **`nextSceneOnComplete: 'TRANSIT'`**; adjust story accordingly.
5. If `type === 'DUEL'`, completion tends toward **`BATTLE`**—set flags in JSON as needed.

## Checklist: new district on the map

1. Add entries to **`DISTRICT_LOCATIONS`** under a new key (matches `GameState.location` values used elsewhere).
2. Add **`DistrictProfile`** in `world.ts` (crest, arc copy, optional `championId`).
3. Ensure **transit / explore** UI can select that `location` (see `DistrictExplore`, `GameState` defaults).
4. Add **background images** under `public/` and reference them in `SceneLocation.backgroundImage`.

## Related

- Engine internals: `src/engine/README.md`
- Tournaments, deck editor, battle/shop/transit authoring: `src/gameplay/README.md`
- Static files, `fetchJson`, prefetch / verify: `src/content/README.md`
- Player UX (Auto, skip, prefs): `VNPresentation.css`, `VNRunner.tsx`, `vn/*.ts`
