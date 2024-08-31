import { db } from "./client";

export const getRegistrations = async (happeningId: string) => {
  return await db
    .selectFrom("registration")
    .selectAll()
    .where("happening_id", "=", happeningId)
    .execute();
};

export const isUserRegistered = async (happeningId: string, userId: string) => {
  const registration = await db
    .selectFrom("registration")
    .selectAll()
    .where("happening_id", "=", happeningId)
    .where("user_id", "=", userId)
    .executeTakeFirst();

  return registration !== undefined;
};

export const register = async (happeningId: string, userId: string) => {
  await db
    .insertInto("registration")
    .values({
      happening_id: happeningId,
      user_id: userId,
      status: "registered",
    })
    .execute();
};

export const unregister = async (happeningId: string, userId: string) => {
  await db
    .updateTable("registration")
    .set({ status: "unregistered" })
    .where("happening_id", "=", happeningId)
    .where("user_id", "=", userId)
    .execute();
};
