/**
 * Helpers for static files served from Vite `public/` (URLs are site-root absolute).
 */

/** Ensure a public URL starts with `/` (Vite serves `public/foo` as `/foo`). */
export function publicUrl(path: string): string {
  if (!path) return '/';
  return path.startsWith('/') ? path : `/${path}`;
}

/** Card art file under `public/assets/card-art/`. */
export function cardArtUrl(file: string): string {
  const name = file.replace(/^\/+/, '').replace(/^assets\/card-art\//, '');
  return publicUrl(`assets/card-art/${name}`);
}

/** Pack art under `public/assets/packs/`. */
export function packArtUrl(file: string): string {
  const name = file.replace(/^\/+/, '').replace(/^assets\/packs\//, '');
  return publicUrl(`assets/packs/${name}`);
}

/** Root-level portrait / bust SVGs (`public/portrait_maya.svg`, etc.). */
export function trainerPortraitUrl(file: string): string {
  const name = file.replace(/^\/+/, '');
  return publicUrl(name);
}
