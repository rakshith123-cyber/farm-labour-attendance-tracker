import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/farm-attendence/', // Set to repo name for GitHub Pages
});
