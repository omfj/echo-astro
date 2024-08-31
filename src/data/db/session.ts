import { db } from "./client";

export const getUserBySessionId = async (sessionId: string) => {
  return await db
    .selectFrom("session")
    .where("sessionToken", "=", sessionId)
    .leftJoin("user", "user.id", "session.userId")
    .selectAll("user")
    .executeTakeFirst();
};
