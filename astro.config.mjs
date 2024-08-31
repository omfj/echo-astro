import { defineConfig, envField } from "astro/config";
import node from "@astrojs/node";
import sanity from "@sanity/astro";
import react from "@astrojs/react";

export default defineConfig({
  output: "server",

  site: "https://echo-astro.fly.dev",

  security: {
    checkOrigin: true,
  },

  adapter: node({
    mode: "standalone",
  }),

  experimental: {
    env: {
      schema: {
        DATABASE_URL: envField.string({ context: "server", access: "secret" }),
      },
    },
  },

  integrations: [
    sanity({
      projectId: "pgq2pd26",
      dataset: "production",
      studioBasePath: "/sanity",
    }),
    react(),
  ],
});
