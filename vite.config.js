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
    __APP_COMMIT__: JSON.stringify(
      execSync('git rev-parse HEAD').toString().trim().slice(0, 8),
    ),
  },
  css: {
    devSourcemap: true,
  },
  server: {
    hmr: false,
  },
});
