import { defineMiddleware } from "astro:middleware";
import { AUTH_COOKIE } from "./auth/cookie";
import { getUser } from "./api/users";

export const onRequest = defineMiddleware(async (c, next) => {
  const sessionId = c.cookies.get(AUTH_COOKIE)?.value;
  if (!sessionId) {
    c.locals.user = null;
    return next();
  }

  const user = await getUser(sessionId);
  c.locals.user = user;
  return next();
});
