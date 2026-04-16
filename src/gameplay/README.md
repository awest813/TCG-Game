# Gameplay systems — developer guide (tournaments, deck, battle, shop, and more)

Companion to **`src/visual-novel/README.md`** (routes & narrative JSON). This file covers **brackets, deck building, combat handoff, commerce, transit**, and how they hang off **`GameState`** / **`PlayerProfile`**.

## Architecture (mental model)

```text
┌──────────────────────────────────────────────────────────────┐
│  GameState (core/types.ts)                                    │
│  activeTournament · pendingTournamentId · tournamentLobbyReturn │
│  deckEditorReturn · transitReturn · profileReturn              │
│  currentScene · location · currentQuest                        │
└───────────────┬──────────────────────────────────────────────┘
                │
     ┌──────────┴──────────┬──────────────┬──────────────┐
     ▼                     ▼              ▼              ▼
 Tournament.tsx    DeckEditor.tsx  BattleBoard.tsx  CardShop.tsx
     │                     │              │              │
     └──────────┬──────────┴──────────────┴──────────────┘
                ▼
     TournamentManager.ts · circuitProgression.ts · economy.ts
```

---

## Tournaments

### Source of truth

| Piece | File | Role |
|-------|------|------|
| Tier definitions (fee, rewards, `locationId`, prestige, endless) | `src/core/TournamentManager.ts` → **`TOURNAMENT_TIERS`** | Lobby lists, entry checks, economy captions. |
| Opponent order per bracket | **`TOURNAMENT_BRACKETS`** (same file) | `getTournamentOpponent(tierId, wins)` — must include real trainer/NPC ids where battle expects them. |
| Banter + labels | **`DEFAULT_BANTER`**, **`OPPONENT_META`**, `getTournamentBanter` | UI copy; extend when adding a recurring bracket opponent. |
| District unlock copy | `circuitProgression.ts` → `isDistrictTournamentUnlocked`, `districtUnlockReason` | Shown when a major is locked. |
| Flag mutations on sweep | `mergeFlagsAfterTournamentVictory` | Maps tier id → `profile.progress.flags` (shop + district majors). |
| District unlock after major | `unlockedDistrictsAfterVictory` | Appends `MARKET_CENTRAL`, `NEON_MISSION`, etc. |

### Runtime state: `ActiveTournament`

```ts
{ tierId, wins, currentOpponentId, status: 'ACTIVE' | 'WON' | 'LOST' }
```

- **`Tournament.tsx`**: starts a run (deducts entry fee), handles `pendingTournamentId` auto-start, launches **`createTournamentBattleTransition`** into **`BATTLE`**.
- **`BattleBoard.tsx`**: reads `state.activeTournament`; on **win**, increments `wins`, advances `currentOpponentId` via `getTournamentOpponent`, or clears the run and applies **`mergeFlagsAfterTournamentVictory`** + **`bracketVictoryToast`** when the bracket is fully cleared (non–crown-unlimited).
- **`crown-unlimited`**: endless path — win logic differs (`BattleBoard`); rewards scale with `economy` helpers.

### Lobby routing

- **`tournamentLobbyReturn`**: `'STORE' | 'DISTRICT_EXPLORE' | null` — where **Back** from the tournament scene should send the player (Card Annex vs streets).
- **`pendingTournamentId`**: used when entering the tournament scene with a pre-selected tier (invite flow); cleared if invalid or if a run is already active.

### Checklist: add a new tournament tier

1. Append to **`TOURNAMENT_TIERS`** (unique `id`, `locationId` either `card-shop` for annex or a district hub id used in UI).
2. Add **`TOURNAMENT_BRACKETS[id]`** — ordered opponent ids (must exist in trainer/social/battle resolution paths).
3. For **district** tiers (not annex): wire **`isDistrictTournamentUnlocked`** + **`districtUnlockReason`** in `circuitProgression.ts`, and any **`mergeFlagsAfterTournamentVictory`** / **`unlockedDistrictsAfterVictory`** behavior.
4. Optional: **`DEFAULT_BANTER`** / **`OPPONENT_META`** entries for marquee opponents.
5. If the tier appears in **district explore** hints, update **`locations.ts`** `routeHint` strings to match tier **names** from `TOURNAMENT_TIERS` (display only).

### Dev helper

- **`src/gameplay/systemsIndex.ts`**: `listTournamentTierDevRows(flags)`, `logTournamentSystemsIndex(flags)` — console table of tiers, round counts, fees, lock reasons (pass `{}` vs real flags).

---

## Deck editor

### Data

- **Deck list**: `state.profile.inventory.deck` — `string[]` of **card ids** (max length enforced in UI, e.g. 60).
- **Card pool**: `src/data/cards.ts` → **`CARD_POOL`**, **`getCardById`**, art resolvers used by `DeckEditor.tsx`.

### Navigation

- **`deckEditorReturn`**: `SceneType | null` — set **before** opening `DECK_EDITOR` from Apartment, District, Main Menu, etc. `DeckEditor` clears it on exit and sets **`currentScene`** back to that scene (`exitDeckTerminal`).

### Checklist: open deck from a new surface

1. On navigation into deck, set **`updateGameState({ deckEditorReturn: '<SCENE>', currentScene: 'DECK_EDITOR', ... })`** (and any `sceneTransition` you want).
2. Ensure exit copy in `DeckEditor` matches new return targets if you add labels (`exitLabel` uses `MAIN_MENU`, `DISTRICT_EXPLORE`, default apartment).

---

## Battle (tournament context)

- **`BattleBoard.tsx`** uses **`state.activeTournament`** + **`TOURNAMENT_TIERS.find`** for subtitles and post-win bookkeeping.
- **Win / loss** updates tournament state or clears it; **flags** and **`tournamentsWon`** update on full bracket sweep; **`currentQuest`** refreshed via **`nextCircuitQuest`**.
- Non-tournament battles: `activeTournament` is null — still uses opponent id defaults as documented in `BattleBoard`.

---

## Card shop (`STORE`)

- **Inventory table**: `SHOP_INVENTORY` in `src/data/shopInventory.ts` (used by `CardShop.tsx`).
- **Purchases** mutate **`profile.inventory`** (`packs`, `cards`, `items`) and **`currency`**.
- **Annex brackets** are launched from the same scene via links into **`TOURNAMENT`** with `tournamentLobbyReturn: 'STORE'` where applicable.

### Checklist: new SKU

1. Add **`ShopItem`** row in **`src/data/shopInventory.ts`** (unique `id`, `targetId` matching pack name or card id, `type`, `cost`, `image` path under `public/`).
2. Extend **`buyItem`** in `CardShop.tsx` if you introduce a new `type` branch.

---

## Transit (`TRANSIT`)

- **`transitReturn`**: scene to return to when leaving the grid (often `APARTMENT` or `DISTRICT_EXPLORE`).
- **Progress**: `circuitProgression` flags such as **`transitLucyGridIntroDone`** / **`transitLucyBriefingDismissed`** gate **`nextCircuitQuest`** copy.

---

## Pack opening (`PACK_OPENING`)

- Opened from flows that push **`currentScene: 'PACK_OPENING'`** with inventory state; returns typically via **`deckEditorReturn`** / explicit scene set. (Trace call sites from `updateGameState` when extending.)

---

## Save / load (`SAVE_LOAD`)

- **`gameStatePersistence.ts`** lists which slices persist; tournament + deck live under **profile** / **game state** as implemented there. After changing `GameState` shape, update persistence + smoke tests.

---

## Social & profile (`SOCIAL`, `PROFILE`)

- **`profileReturn`**: when opening Profile from **main menu**, exit respects it.
- **Trainer affinity**: `profile.social.trainers` — tournament banter uses relationship scores (`Tournament.tsx` / `getTournamentBanter`).

---

## Cross-links

| Topic | Doc |
|-------|-----|
| Narrative JSON, districts, NPCs | `src/visual-novel/README.md` |
| Engine steps, plugins | `src/engine/README.md` |
| VN player shell | `VNRunner.tsx`, `VNPresentation.css` |
