import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  define: {
    'process.env.GITHUB_OWNER': JSON.stringify(process.env.GITHUB_OWNER || 'aaif-qutwo-ai'),
    'process.env.GITHUB_REPO': JSON.stringify(process.env.GITHUB_REPO || 'qutwo-ai'),
    'process.env.QUTWO_AI_BUNDLE_NAME': JSON.stringify(process.env.QUTWO_AI_BUNDLE_NAME || 'Qutwo-AI'),
  },
});
