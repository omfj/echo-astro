import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

export default defineConfig({
  name: "echo - Linjeforeningen for informatikk",
  title: "echo - Linjeforeningen for informatikk",
  projectId: "pgq2pd26",
  dataset: "production",
  plugins: [structureTool()],
});
