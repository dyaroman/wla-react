import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'child_process';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  define: {
    'import.meta.env.VITE_COMMIT_HASH': JSON.stringify(
      execSync('git rev-parse HEAD').toString().trim(),
    ),
  },
  css: {
    devSourcemap: true,
  },
});
