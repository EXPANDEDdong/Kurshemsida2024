import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
import 'dotenv/config';


dotenv.config();
 
export default {
  schema: "./src/db/schema/*",
  out: "./drizzle",
  driver: 'mysql2',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  }
} satisfies Config;