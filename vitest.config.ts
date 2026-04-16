import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.smoke.test.ts', 'src/content/publicAssets.test.ts'],
    passWithNoTests: false
  }
});
