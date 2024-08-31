import type { getUserBySessionId } from "../data/db/session";

export type User = Exclude<
  Awaited<ReturnType<typeof getUserBySessionId>>,
  undefined
>;
