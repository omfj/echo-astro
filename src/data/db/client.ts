import { DATABASE_URL } from "astro:env/server";
import pg from "pg";
import { type DB } from "../../../database.types";
import { Kysely, PostgresDialect } from "kysely";

const { Pool } = pg;

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: DATABASE_URL,
    max: 15,
  }),
});

export const db = new Kysely<DB>({
  dialect,
});
