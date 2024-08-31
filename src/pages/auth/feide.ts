import type { APIRoute } from "astro";
import { generateState } from "oslo/oauth2";
import { feide } from "../../auth/feide";

export const GET: APIRoute = async (c) => {
  const state = generateState();
  const url = await feide.createAuthorizationURL(state);
  const redirectTo =
    new URL(c.request.url).searchParams.get("redirectTo") ?? "/";

  c.cookies.set("feide_oauth_state", state, {
    path: "/",
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge: 60 * 10,
  });

  c.cookies.set("redirect_to", redirectTo, {
    path: "/",
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge: 60 * 10,
  });

  return Response.redirect(url);
};
