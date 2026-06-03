import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Guitar_Chord_Viewer/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
