import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
  build: { outDir: 'dist', sourcemap: false },
  server: { port: 3000, open: true },
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
});
