// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "./server/utils/schema.ts", // adapte si besoin
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: {
      rejectUnauthorized: false, // requis pour Supabase
    },
  },
  schemaFilter: ["public"], // ✅ correct spelling
  verbose: true,
  strict: true,
});
