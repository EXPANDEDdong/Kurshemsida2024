import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
import "dotenv/config";

dotenv.config();

export default {
  schema: "./drizzle/schema/*",
  out: "./drizzle/migrations",
  driver: "mysql2",
  dbCredentials: {
    uri: String(process.env.DATABASE_URL),
  },
} satisfies Config;
