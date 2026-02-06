// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()]
  },

  site: 'https://synclabs.ai',
  integrations: [react()],
});