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
      .innerJoin("user", "session.userId", "user.id")
      .selectAll("session")
      .selectAll("user")
      .where("session.sessionToken", "=", sessionId)
      .executeTakeFirst();

    if (!result) {
      return [null, null];
    }

    const session = {
      id: result.sessionToken,
      userId: result.userId,
      expiresAt: result.expires,
      attributes: {},
    };

    const user = {
      id: result.userId,
      attributes: {
        ...result,
      },
    };

    return [session, user];
  }

  async getUserSessions(userId: string): Promise<Array<DatabaseSession>> {
    return await this.#db
      .selectFrom("session")
      .where("userId", "=", userId)
      .selectAll()
      .execute()
      .then((rows) =>
        rows.map((row) => ({
          id: row.sessionToken,
          userId: row.userId,
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
        sessionToken: session.id,
        userId: session.userId,
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
      .where("sessionToken", "=", sessionId)
      .execute();
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.#db
      .deleteFrom("session")
      .where("sessionToken", "=", sessionId)
      .execute();
  }

  async deleteUserSessions(userId: string): Promise<void> {
    await this.#db.deleteFrom("session").where("userId", "=", userId).execute();
  }

  async deleteExpiredSessions(): Promise<void> {
    await this.#db
      .deleteFrom("session")
      .where("expires", "<", new Date())
      .execute();
  }
}
