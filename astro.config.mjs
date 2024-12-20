import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import sitemap from "@astrojs/sitemap";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  site: 'https://kurshemsida2024.vercel.app/',
  integrations: [tailwind(), sitemap(), preact()],
  output: "server",
  adapter: vercel(),
  prefetch: {
    prefetchAll: false
  }
});