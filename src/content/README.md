# Loading new content and assets

Vite serves everything under **`public/`** at the **site root** (`public/vn/champions/maya.json` → fetch `/vn/champions/maya.json`). TypeScript and JSON should only use **root-relative** paths starting with `/`.

## Quick start

| You are adding… | Put files here | Register in… |
|-----------------|------------------|----------------|
| VN champion talk | `public/vn/champions/<npcId>.json` | `npcs.ts` + `DistrictExplore` TALK action |
| District route | `public/vn/routes/<district_snake>/<slug>.json` | `locations.ts` label → slug must match `slugifyRouteLabel` |
| Card with custom art | `public/assets/card-art/<file>.svg` (or png) | `data/cards.ts` — set `image: '/assets/card-art/...'` |
| Card using shared type art | _(nothing)_ | `creatureType` / `cardType` maps in `resolveCardImage` |
| Shop pack / item art | `public/assets/packs/…`, `public/assets/items/…` | `data/shopInventory.ts` |
| Trainer bust / portrait | `public/portrait_<id>.svg`, `public/bust_<id>.svg` | `data/trainers.ts` |
| Scene loader backdrop | `public/assets/bg/…` | `content/sceneLoaderFlavors.ts` |
| Optional district backdrop | `public/<name>.png` | `data/locations.ts` `backgroundImage` (rasters are **not** in the strict verify list until you add the file) |

## Code helpers

- **`publicUrl.ts`** — `publicUrl`, `cardArtUrl`, `packArtUrl`, `trainerPortraitUrl` so paths stay consistent.
- **`fetchContent.ts`** — `fetchJson<T>(path)` for narrative JSON (throws `ContentLoadError` with status). `prefetchAssetUrls` to warm the cache before a scene.
- **`referencedUrls.ts`** — `listStrictPublicAssetUrls()` (JSON + SVG the repo guarantees), `listPrefetchBundleUrls()`, optional raster lists for trainers.

## Verify before you ship

```bash
npm run content:verify
```

Runs **`src/content/publicAssets.test.ts`**, which asserts every **strict** URL exists on disk: **onboarding + district route JSON**, card/shop/loader/battle/trainer **SVG** art, and EasyVN demo assets. **Champion** `/vn/champions/*.json` paths are *not* required for every NPC yet — use Dev Console **Dump VN path index** to see implied champion URLs and add files as you ship dialogue.

In the browser, open the **Dev Console** (backtick) → **Prefetch strict bundle** / **Verify strict assets (HTTP)** to warm or probe that set against a running dev server.

## Related docs

- Narrative routing: `src/visual-novel/README.md`
- Tournaments / deck / shop: `src/gameplay/README.md`
- VN engine: `src/engine/README.md`
