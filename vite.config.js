import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'child_process';

const base = '/wla-react/';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  define: {
    __APP_COMMIT__: JSON.stringify(
      execSync('git rev-parse HEAD').toString().trim().slice(0, 8),
    ),
    __PAGE_TITLE__: JSON.stringify('WLA'),
    __WEBSITES_DATA_URL__: JSON.stringify(`${base}data`),
    __WLA_BACKEND_URL__: JSON.stringify(
      'https://yawjfabcunhkncinsykk.supabase.co/functions/v1/wla-api',
    ),
  },
  css: {
    devSourcemap: true,
  },
  server: {
    hmr: false,
  },
});
