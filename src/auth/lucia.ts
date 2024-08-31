import { Lucia } from "lucia";
import { LuciaDatabaseAdapter } from "./adapter";
import { db } from "../data/db/client";
import type { User } from "./types";

const adapter = new LuciaDatabaseAdapter(db);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD,
    },
  },
  getUserAttributes: (user) => user,
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: User;
  }
}
