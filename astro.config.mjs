import { defineConfig } from "astro/config";

import node from "@astrojs/node";

import sanity from "@sanity/astro";
import react from "@astrojs/react";

export default defineConfig({
  output: "server",

  security: {
    checkOrigin: true,
  },

  adapter: node({
    mode: "standalone",
  }),

  integrations: [
    sanity({
      projectId: "pgq2pd26",
      dataset: "production",
      studioBasePath: "/sanity",
    }),
    react(),
  ],
});
