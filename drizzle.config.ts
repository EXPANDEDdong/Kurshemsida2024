import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
import 'dotenv/config'
dotenv.config();
 
export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: 'mysql2',
  dbCredentials: {
    connectionString: 'mysql://ahhwahznmef9iqjrvkmn:pscale_pw_rawfkp3aQjPG5HNZ1zO3xcwa2ZhrwEhiI6i6VJAaVKf@aws.connect.psdb.cloud/kvitter?ssl={"rejectUnauthorized":true}',
  }
} satisfies Config;