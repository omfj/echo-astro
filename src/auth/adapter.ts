import type { Kysely } from "kysely";
import type { Adapter, DatabaseSession, DatabaseUser } from "lucia";
import type { DB } from "../../database.types";

export class LuciaDatabaseAdapter implements Adapter {
  #db: Kysely<DB>;

  constructor(db: Kysely<DB>) {
    this.#db = db;
  }

  async getSessionAndUser(
    sessionId: string,
  ): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
    const result = await this.#db
      .selectFrom("session")
      .innerJoin("user", "session.user_id", "user.id")
      .selectAll("session")
      .selectAll("user")
      .where("session.session_token", "=", sessionId)
      .executeTakeFirst();

    if (!result) {
      return [null, null];
    }

    const session = {
      id: result.session_token,
      userId: result.user_id,
      expiresAt: result.expires,
      attributes: {},
    };

    const user = {
      id: result.user_id,
      attributes: {
        ...result,
      },
    };

    return [session, user];
  }

  async getUserSessions(userId: string): Promise<Array<DatabaseSession>> {
    return await this.#db
      .selectFrom("session")
      .where("user_id", "=", userId)
      .selectAll()
      .execute()
      .then((rows) =>
        rows.map((row) => ({
          id: row.session_token,
          userId: row.user_id,
          expiresAt: row.expires,
          attributes: {},
        })),
      );
  }

  async setSession(session: DatabaseSession): Promise<void> {
    await this.#db
      .insertInto("session")
      .values({
        expires: session.expiresAt,
        session_token: session.id,
        user_id: session.userId,
      })
      .execute();
  }

  async updateSessionExpiration(
    sessionId: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.#db
      .updateTable("session")
      .set({ expires: expiresAt })
      .where("session_token", "=", sessionId)
      .execute();
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.#db
      .deleteFrom("session")
      .where("session_token", "=", sessionId)
      .execute();
  }

  async deleteUserSessions(userId: string): Promise<void> {
    await this.#db
      .deleteFrom("session")
      .where("user_id", "=", userId)
      .execute();
  }

  async deleteExpiredSessions(): Promise<void> {
    await this.#db
      .deleteFrom("session")
      .where("expires", "<", new Date())
      .execute();
  }
}
