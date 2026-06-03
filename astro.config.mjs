import { defineConfig } from 'astro/config';
// import tailwind from "@astrojs/tailwind";

import icon from "astro-icon";

import preact from '@astrojs/preact';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [icon(), preact()],
  site: 'https://juanpsama.github.io',
  base: '/portfolio-astro',

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    prefixDefaultLocale: true,
    redirectToDefaultLocale: false,
  },

  vite: {
    plugins: [tailwindcss()],
  },
});