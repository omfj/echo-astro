import { db } from "./client";

export const getUserBySessionId = async (sessionId: string) => {
  return await db
    .selectFrom("session")
    .where("session_token", "=", sessionId)
    .leftJoin("user", "user.id", "session.user_id")
    .selectAll("user")
    .executeTakeFirst();
};
