import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config
export default defineConfig({
  define: {
    'process.env.QUTWO_AI_TUNNEL': JSON.stringify(process.env.QUTWO_AI_TUNNEL !== 'no' && process.env.QUTWO_AI_TUNNEL !== 'none'),
  },

  plugins: [tailwindcss()],

  // Vite caches a copy of @aaif/qutwo-ai-acp-client and doesn't notice when we rebuild it
  // locally, so it serves stale code until you clear node_modules/.vite by hand.
  // Excluding it makes Vite always read the latest ui/qutwo-ai-acp-client/dist build.
  // Dev-server only — release builds ignore optimizeDeps.
  optimizeDeps: {
    exclude: ['@aaif/qutwo-ai-acp-client'],
  },

  build: {
    target: 'esnext'
  },
});
