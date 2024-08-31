import { db } from "./client";

export const getRegistrations = async (happeningId: string) => {
  return await db
    .selectFrom("registration")
    .selectAll()
    .where("happeningId", "=", happeningId)
    .execute();
};

export const isUserRegistered = async (happeningId: string, userId: string) => {
  const registration = await db
    .selectFrom("registration")
    .selectAll()
    .where("happeningId", "=", happeningId)
    .where("userId", "=", userId)
    .executeTakeFirst();

  return registration !== undefined;
};

export const register = async (happeningId: string, userId: string) => {
  await db
    .insertInto("registration")
    .values({
      happeningId: happeningId,
      userId: userId,
      status: "registered",
    })
    .execute();
};

export const unregister = async (happeningId: string, userId: string) => {
  await db
    .updateTable("registration")
    .set({ status: "unregistered" })
    .where("happeningId", "=", happeningId)
    .where("userId", "=", userId)
    .execute();
};
