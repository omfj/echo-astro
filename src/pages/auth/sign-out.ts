import type { APIRoute } from "astro";
import { lucia } from "../../auth/lucia";

export const GET: APIRoute = async (c) => {
  const redirectTo =
    new URL(c.request.url).searchParams.get("redirectTo") ?? "/";

  const sessionId = c.cookies.get(lucia.sessionCookieName)?.value;
  if (!sessionId) {
    return new Response(null, {
      status: 400,
    });
  }

  await lucia.invalidateSession(sessionId);
  const sessionCookie = lucia.createBlankSessionCookie();

  c.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectTo,
    },
  });
};
