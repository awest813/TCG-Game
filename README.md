# Sleep Future · Duel Signal

A **React + TypeScript + Vite** neo-noir card RPG: apartment onboarding, transit map, district exploration, **Card Annex** brackets, sanctioned **tournament** tiers, deck editing, saves, and **Lucy** as your circuit guide.

This repository is the playable web client (localStorage saves, optional JSON backup). It is **not** a hosted live service; you run it locally or ship the static `dist/` build.

---

## Try it in two minutes

1. **Install:** `npm install`
2. **Run:** `npm run dev` — open the URL Vite prints (typically `http://localhost:5173`).
3. **New game:** choose a callsign (≤24 characters) and a starter (**Pulse**, **Bloom**, or **Tide**), then **Begin at apartment**.
4. **First loop:** apartment (Lucy VN) → **Transit** → pick **Sunset Terminal** → **Board Train** → district → **Card Annex** → free **Beginner Initiation** bracket.
5. **Audio:** browsers often mute sound until you **click or tap** once. Use **System** (in-game) or **Settings** (title) for master / music / SFX / voice and mute.
6. **LAN preview:** `npm run playtest` — production build + `vite preview` on port **4173** with `--host`.

---

## What you are actually playing

### Card battles

Duels are a **streamlined TCG-style lane**: sync energy, hand, active creature, bench, and **prizes** (first side to take three opposing prizes wins). Play cards from the hand, **attack** with the active unit when it is your turn, then **End Sync** to pass. The opponent runs a simple AI after a short delay. Some creatures can **evolve** from the hand when a valid base is on the field (see `BattleEngine.ts`). **3D arena** presentation uses Babylon.js.

### Tournaments

- **Card Annex (shop):** three finite brackets (beginner free, mini, veteran) — clearing all three earns an implicit **club license** for city events.
- **District majors:** Casual Under-Circuit → Grand Interchange Pro-Am → Neon Night Elite → **Unlimited Crown Gauntlet** (endless; cash out or keep climbing).
- **Titles** (`tournamentsWon`) increment on each **full finite bracket clear**; the Crown endless path does not add a title on sweep.
- After a finite clear, you return to the lobby with a **trophy toast** and a short **Lucy handler ping** (panel + optional voice).

### Factions

Six factions (**Circuit Union**, **Pulse Syndicate**, **Tide Covenant**, **Bloom Accord**, **Neon Stage**, **Civic Crown**) track **score** and **rank** (UNKNOWN → LEGEND). Trainers belong to factions; duels nudge **trainer** affinity / rivalry / respect. Inspect everything under **Profile** in run or from the title screen.

### Menus

| Where | What opens |
|--------|----------------|
| Title | **Settings** — same shell as System |
| Apartment, Transit, District, Shop, Tournament, **Battle** | **System** — sound mix, sync save, fullscreen, return to menu |
| Title | **Recovery** — three manual slots + JSON import/export |

**Backtick (`)** toggles a small dev scene jumper (optional).

---

## Saves and data

- **Autosave:** `localStorage` key `neo_sf_save`.
- **Slots + backup:** **Recovery** scene — numbered slots and **Export / Import JSON**.
- **Sanitize on load:** invalid tournament tier, bad pending invite, or stale victory toast fields are cleared when parsing saves (`gameStateSanitize.ts`).

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | `tsc` + production Vite bundle |
| `npm run preview` | Serve last `dist/` |
| `npm run playtest` | `build` then preview on **4173** with `--host` |
| `npm run lint` | ESLint on `src/` |
| `npm test` | Vitest smoke: brackets, annex→license→majors chain, quest strings, sanitize |

---

## Tech stack

- **UI:** React 18, TypeScript, Vite, Tailwind + project CSS (`SonsotyoScenes.css`, battle styles)
- **3D:** Babylon.js 6 — apartment hub + battle arena
- **Narrative:** JSON-driven VN routes under `public/vn/`
- **Audio:** `AudioManager` — dual-deck BGM crossfade, SFX pool, Web Speech for announcer/Lucy lines

---

## Legal

**© 2026 Allen West. All Rights Reserved.**

Unauthorized duplication, distribution, or use of the **Sleep Future / Neo SF** brand, assets, or code is prohibited unless you have written permission from the rights holder.

---

*Unleash your spirit. Trust the data.*
