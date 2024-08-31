import type { APIRoute } from "astro";
import { AUTH_COOKIE } from "../../auth/cookie";

export const GET: APIRoute = async (c) => {
  c.cookies.delete(AUTH_COOKIE, {
    path: "/",
    httpOnly: true,
    secure: import.meta.env.PROD,
  });

  const redirectTo =
    new URL(c.request.url).searchParams.get("redirectTo") ?? "/";

  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectTo,
    },
  });
};
