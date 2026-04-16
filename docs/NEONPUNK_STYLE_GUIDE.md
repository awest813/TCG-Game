# Neonpunk — Art & UI Style Guide

**Codename:** Neonpunk  
**Status:** Living document (revise as ships land)  
**Scope:** 2D/UI, narrative presentation, marketing beats, and guidance for future 3D/card art — *not* a license to copy third-party IP.

---

## 1. North star

Neonpunk is a **friendly, slightly futuristic** look: **high-energy color**, **round and approachable shapes**, and **readable “sport + anime city” optimism**. It should feel like stepping into a **well-lit district at night** — neon and glass, but **warm and inviting**, not grim cyberpunk.

Think **community sports broadcast** meets **colorful RPG hub**, not blade-runner noir.

---

## 2. Creative touchstones (tone only)

Use these as **mood references** for saturation, silhouettes, UI chunkiness, and character energy — always original execution.

| Reference | What to borrow |
|-----------|----------------|
| **Splatoon** | Complementary neon pairs, bold graphic shapes, playful ink/splat *energy* (not literal ink), sporty HUD confidence |
| **Pokémon Scarlet / Violet** | Open-world optimism, soft industrial + pastel neon mix, chunky rounded UI, “school trip adventure” warmth |
| **Pokémon Champions** (presentation) | Clean hero framing, readable competitive clarity, celebratory highlights |
| **Newer Digimon titles** | Crisp anime-tech overlays, clear tiered UI, friend-forward character posing |
| **Nintendo Switch Sports** | Big friendly typography feel, bright courts, **instant legibility** at a glance |

**Avoid:** muddy brown-only palettes, hyper-gritty realism, tiny UI on busy backgrounds, pure “hacker terminal” green-on-black as the default read.

---

## 3. Design pillars

1. **Neon with a smile** — Cyan, magenta, and yellow accents pop against deep blues; pair with **soft lavender / ice** highlights so it never feels cold-only.
2. **Futuristic, not hostile** — Curves, pills, and **glass** over razor edges; “tomorrow’s city” as a place you’d *want* to hang out.
3. **Sporty clarity** — Primary actions read in **one glance**; secondary info steps back (opacity, size, desaturation).
4. **Controlled chaos** — Busy *allowed* in hero moments (titles, victories), but **dialogue and deck flows stay calm**.

---

## 4. Color system

### 4.1 Core roles (align with code tokens)

These map to **`src/index.css` `:root`** tokens — keep new screens consistent with them.

| Role | Token | Hex (current) | Usage |
|------|--------|-----------------|--------|
| Deep space | `--bg-deep`, `--bg-dream` | `#050508`–`#0b1020` | Page base, letterboxing |
| Primary neon | `--accent-primary` / `--accent-cyan` | `#7ef2ff` | CTAs, focus rings, key lines |
| Warm contrast | `--accent-secondary` / `--accent-magenta` | `#ff8ac6` | Rivals, “pulse”, secondary emphasis |
| Sunshine / rank | `--accent-yellow` | `#ffe39a` | Rewards, kicker text, caution-soft |
| Soft sci-fi | `--accent-lavender` | `#b6b2ff` | Tertiary accents, faction-adjacent fills |
| Air / glass edge | `--accent-ice` | `#dff7ff` | Borders, inner glow hints |
| Body text | `--text-main` | `#e5ebff` | Paragraphs, VN body |
| Muted | `--text-secondary` | ~66% white | Captions, helper copy |

### 4.2 Neonpunk rules

- **Backgrounds:** Dark blue-violet gradients + **one** radial “pool” of cyan or magenta (already on `html, body`).
- **Accents:** Prefer **cyan ↔ magenta** tension for energy; use **yellow** for “win / notice” without shouting every frame.
- **Never** rely on a single hue for both “background” and “critical text” — maintain **luminance separation** (WCAG-minded for interactive UI).

---

## 5. Typography

| Role | Family (current) | Neonpunk intent |
|------|------------------|-----------------|
| Display / buttons | `Orbitron` (`--font-display`) | Tech-sport **confidence**; keep tracking slightly wide for small caps feel |
| UI & dialogue | `Sora` (`--font-main`) | **Friendly** geometric sans; primary reading comfort |
| Data / codes | `Space Mono` (`--font-mono`) | Optional for stats, deck IDs, “terminal” flavor in *small* doses |
| Title / mythic beats | `Cinzel` (`--font-launcher`) | Use sparingly for **ceremony** (title, crown moments) — not for dense UI |

**Guidelines:** Short labels can be uppercase + letterspaced; long narrative stays mixed case. Prefer **weight contrast** (600/700 vs 400) over shrinking font size.

---

## 6. Shape language & materials

- **Corners:** Favor **large radii** (pills, 16–24px panels) over sharp tiles for player-facing chrome.
- **Panels:** **Frosted glass** (`glass-panel`): soft border, subtle top bevel, restrained inner gradient — *Switch Sports–like cleanliness*, not heavy metal plates.
- **Buttons:** Pill neo-buttons with **soft lift** on hover; primary actions get **gradient fill** (cyan → magenta) with **dark text** for contrast.
- **Depth:** Soft drop shadow + **thin specular** (inset highlight). Avoid harsh black-only vignettes on gameplay text.

---

## 7. Characters & narrative art

- **Proportions:** Slightly **heroic** heads and expressive eyes OK; keep **silhouettes readable** at small VN bust sizes.
- **Line & color:** Clean cel-style or **flat-vector with selective gradient**; **rim light** in accent cyan or magenta to tie cast to UI.
- **Mood:** Coaches, rivals, and handlers feel **approachable** — smirk and swagger, not cruelty.
- **Backgrounds:** Stylized city **geometry + sky gradients**; neon as **structured signage**, not random noise.

---

## 8. UI & HUD (TCG-specific)

- **Lanes / zones:** Read as **sport courts** — clear boundaries, light grid or hex *hint*, not cluttered texture.
- **Damage / tempo:** **Big numerals**, short words, color-coded by faction or energy type where possible.
- **Card frames:** **Gloss + thin neon edge**; rarity reads from **glow strength + particle budget**, not only hue.
- **VN:** Dialogue box feels like a **broadcast lower third** — legible, stable height; stage BG can be bolder than the text chrome.

---

## 9. Motion & VFX

- **Easing:** Snappy in (**ease-out**), gentle settle — *bouncy but not childish* for rewards; **sub-200ms** for standard hovers.
- **Particles:** **Confetti / light streaks** for wins; **soft bloom** on accents, not full-screen wash that kills readability.
- **Screen transitions:** **Iris / slide / color wipe** in accent colors — avoid long dark fades during frequent navigation.

---

## 10. Audio direction (pairing)

- **Music:** Synth-pop, light funk, or **stadium chords** with airy pads — supports “neon” without dread.
- **SFX:** **Plastic + glass + soft thud** for UI; bright **chime** for success, **muted boop** for cancel.

---

## 11. Do / Don’t (quick checklist)

| Do | Don’t |
|----|--------|
| Pair neon with **warm yellow or lavender** | Single-color neon fatigue |
| Use **glass + glow** for depth | Flat gray boxes with no hierarchy |
| **Large tap targets** and clear focus states | Illegible text on busy art |
| **Celebrate** player milestones with color + motion | Punitive, muddy failure screens |
| Keep **faction color** consistent in UI + card chrome | Random rainbow per screen with no system |

---

## 12. Implementation map (this repo)

| Area | Primary files / folders |
|------|-------------------------|
| Global tokens | `src/index.css` (`:root`, `.glass-panel`, `.neo-button`) |
| Scene chrome | `src/styles/SonsotyoScenes.css`, scene components |
| VN | `src/styles/VNPresentation.css`, `src/ui/VNRunner.tsx` |
| Static art | `public/assets/**`, `public/*.svg` busts/portraits |
| Narrative data | `public/vn/**/*.json` |

When adding new screens, **extend tokens** before inventing one-off hex values.

---

## 13. Glossary

| Term | Meaning |
|------|--------|
| **Neonpunk** | This project’s codename for the friendly-neon futuristic art direction |
| **Sport clarity** | UI that a tired player parses in one second |
| **Warm neon** | Saturated accents always balanced with soft ice/lavender/yellow |

---

*Maintainers: update §4 and §12 when `:root` tokens or folder layout changes.*
