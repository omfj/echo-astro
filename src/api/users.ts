import { Kv } from "./kv";

export type UserInfo = {
    id: string;
    name: string;
    email: string;
};

export const usersKv = new Kv<UserInfo>("users.json", {
    "123": {
        id: "123",
        name: "Ola Nordmann",
        email: "ola@nordmann.no",
    }
});

export const getUser = (sessionId: string) => {
    return usersKv.get(sessionId) ?? null;
};

