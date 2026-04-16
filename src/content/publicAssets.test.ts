import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { describe, expect, it } from 'vitest';
import { listStrictPublicAssetUrls } from './referencedUrls';

/** Vitest is run from the repo root (`npm test` / `npm run content:verify`). */
const projectRoot = cwd();

describe('content: strict public assets', () => {
  it('every referenced .json / .svg URL exists under public/', () => {
    const missing: string[] = [];
    for (const url of listStrictPublicAssetUrls()) {
      const rel = url.startsWith('/') ? url.slice(1) : url;
      if (!existsSync(join(projectRoot, 'public', rel))) {
        missing.push(url);
      }
    }
    expect(missing, `Add files under public/ or fix references:\n${missing.join('\n')}`).toEqual([]);
  });
});
