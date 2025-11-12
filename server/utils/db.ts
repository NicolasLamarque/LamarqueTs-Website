// server/utils/db.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

// ✅ Toujours SSL pour Neon
const client = postgres(databaseUrl, {
  ssl: {
    rejectUnauthorized: false,
  },
  prepare: false,
});

export const db = drizzle(client);
