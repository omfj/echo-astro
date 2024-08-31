import { Kv } from "./kv";

const registerKv = new Kv<Array<string>>("registrations.json");

export const isRegistered = async (happeningId: string, userId: string) => {
  if (!(await registerKv.has(happeningId))) {
    return false;
  }

  const registrations = await registerKv.get(happeningId);
  return registrations?.includes(userId) ?? false;
};

export const register = async (happeningId: string, userId: string) => {
  if (await isRegistered(happeningId, userId)) {
    return;
  }

  const registrations = (await registerKv.get(happeningId)) ?? [];
  registrations.push(userId);
  await registerKv.set(happeningId, registrations);
};

export const unregister = async (happeningId: string, userId: string) => {
  if (!(await isRegistered(happeningId, userId))) {
    return;
  }

  const registrations = (await registerKv.get(happeningId)) ?? [];
  registrations.splice(registrations.indexOf(userId), 1);
  await registerKv.set(happeningId, registrations);
};
