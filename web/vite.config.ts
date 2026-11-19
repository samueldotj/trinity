import { defineConfig } from 'vite';

// `npm run dev` proxies /api to the local Rust dev server (cargo run -p dev-server --release).
export default defineConfig({
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true,
    proxy: { '/api': 'http://127.0.0.1:3001' },
  },
  envPrefix: ['VITE_', 'TAURI_ENV_'],
  build: { target: 'es2022', outDir: 'dist', emptyOutDir: true },
});
