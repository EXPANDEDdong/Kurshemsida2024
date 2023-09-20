import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
import 'dotenv/config'
dotenv.config();
 
export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: 'mysql2',
  dbCredentials: {
    connectionString: '',
  }
} satisfies Config;