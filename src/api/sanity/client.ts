import { createClient } from "@sanity/client";

export type SanityResult<T> = T | null;

export const projectId = "pgq2pd26";
export const dataset = "production";

export const client = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion: "2023-03-15",
});
