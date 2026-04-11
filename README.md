# NEO SF: Master Circuit
**The Definitive Urban Creature Card RPG**

Welcome to **Neo SF**, a world where your cards aren't just data—they're your partners. Rise from the **Sunset Terminal** to the **Crown Hall**! Battle through the Great Districts, earn your Grand Medals, and prove your bond is the strongest in the Master Circuit.

---

## 🌆 The Master Experience

### 🎴 Tactical Sync-Combat
- **Heart of the Circuit**: Manage your Sync Energy across a full turn structure—deploy creatures, play support cards, and unleash attacks with strategic depth.
- **Cinematic Duels**: High-fidelity holographic battleboards powered by **Babylon.js 3D**, featuring Ken Burns camera effects and digital particle fields.
- **Archetype Synergy**: Master all six creature types — **Pulse**, **Bloom**, **Tide**, **Alloy**, **Veil**, and **Current** — each with unique keywords and a weakness cycle that rewards smart team-building.
- **Evolution Chains**: Evolve your creatures mid-battle—transform Ziprail into Rail Bastion and swing the momentum in an instant.

### 🏆 The Road to Champion
- **District & Medal System**: Explore 6 living Districts — **Sunset Terminal**, **Bayline Wharf**, **Market Central**, **Neon Mission**, **Redwood Heights**, and **Crown Hall** — and collect **Grand Medals** to enter the Civic Crown Grand Finals.
- **Five Tournament Tiers**: Climb from the Rookie Sync-Den through Regional Circuits to the **Unlimited Crown Gauntlet** — an infinite, high-stakes ladder that only ends when your sync breaks.
- **Card-Master Boutique**: A high-end shopping experience for acquiring rare booster packs (Metro Pulse, Neural Veil), powerful singles, and legendary card cosmetics.
- **60-Card Deck Builder**: Filter by archetype, search by name, and fine-tune your strategy with live deck stats (average cost, creature/support ratio).

### 🆔 Pro-Duelist Features
- **Social IDs**: A rich three-tab profile tracking your **XP**, **Level**, **Medal Collection**, career win/loss record, and faction reputation across the six Circuit Factions.
- **Visual Novel Immersion**: A fully scriptable, plugin-driven VN engine with animated dialogue, branching choices, conditional flags, and per-district atmospheric transitions.
- **Time-of-Day System**: NPCs appear at different locations across three daily periods (Morning / Afternoon / Evening), making the city feel alive.
- **Music Manager**: Dynamic BGM that shifts as you travel from the quiet Wharf to the roaring Grand Stadium.

---

## 🚀 Initialize Your Journey

1. **Install**: `npm install`
2. **Sync**: `npm run dev`
3. **Begin**: Start a "New Career", choose your starter archetype (Pulse / Bloom / Tide), and enter the Rookie Sync-Den to meet your first partners!

---

## User playtest (hosts and testers)

1. **Install and run**: `npm install`. For day-to-day iteration use `npm run dev`. For a build that matches production assets and minification, use **`npm run playtest`** (runs `build` then `vite preview` on **port 4173** with **`--host`** so phones or other machines on the LAN can open the printed URLs).
2. **Suggested first session**: Main Menu → **New Career** → apartment hub → **Transit** (Lucy grid briefing + practice dock after you continue) → pick a district → **Board Train** → explore actions (shop, duel, deck terminal as available).
3. **Audio**: many browsers block autoplay until there has been a **click or tap** on the page; if BGM is silent, interact once with the UI.
4. **Saves**: progress is stored in **localStorage** under the key `neo_sf_save`. Clearing site data for this origin resets the career.
5. **Debug overlay** (optional): the backtick key **\`** toggles a small dev scene-jump console. Skip it during feedback runs if you want a clean player path.

---

## 🛠️ Tech Stack
- **Framework**: React 18 + TypeScript + Vite
- **3D Rendering**: Babylon.js 6 (Apartment Hub, Battle Arena)
- **Styling**: Tailwind CSS + Vanilla CSS (Ken Burns Effects, Data Particles)
- **Narrative Engine**: Custom plugin-driven VN Engine (JSON scripts, branching conditions, EventBus)
- **Persistence**: localStorage (auto save / load)
- **Audio**: Custom AudioManager (BGM + SFX + Text-to-Speech announcements)

---

## 📜 Legal & Governance
**© 2026 Allen West. All Rights Reserved.**
Unauthorized duplication, distribution, or use of the "Neo SF" brand, assets, or code is strictly prohibited. Final rights reserved to **Allen West (2026)**.

---
*Unleash your spirit. Trust the data.*