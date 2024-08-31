import type { APIRoute } from "astro";
import { feide, getFeideUser } from "../../../auth/feide";
import { db } from "../../../data/db/client";
import { lucia } from "../../../auth/lucia";
import { nanoid } from "nanoid";

export const GET: APIRoute = async (c) => {
  const code = c.url.searchParams.get("code");
  const state = c.url.searchParams.get("state");
  const stateCookie = c.cookies.get("feide_oauth_state")?.value;
  const redirectTo = c.cookies.get("redirect_to")?.value ?? "/";

  if (!code || !state || !stateCookie || state !== stateCookie) {
    return new Response(null, {
      status: 400,
    });
  }

  const tokens = await feide.validateAuthorizationCode(code);
  const feideUser = await getFeideUser(tokens.accessToken);

  const existingUser = await db
    .selectFrom("account")
    .selectAll()
    .where("provider", "=", "feide")
    .where("provider_account_id", "=", feideUser.id)
    .executeTakeFirst();

  if (existingUser) {
    const session = await lucia.createSession(existingUser.user_id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    c.cookies.set(
      lucia.sessionCookieName,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectTo,
      },
    });
  }

  const userId = nanoid();

  await db.transaction().execute(async (tx) => {
    await tx
      .insertInto("user")
      .values({
        id: userId,
        email: feideUser.email,
        name: feideUser.name,
      })
      .execute();

    await tx
      .insertInto("account")
      .values({
        provider: "feide",
        provider_account_id: feideUser.id,
        user_id: userId,
        type: "oauth",
      })
      .execute();
  });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  c.cookies.set(
    lucia.sessionCookieName,
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
