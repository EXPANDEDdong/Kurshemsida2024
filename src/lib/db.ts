import 'dotenv/config'
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { migrate } from 'drizzle-orm/planetscale-serverless/migrator';
 
// create the connection
const connection = connect({
  host: import.meta.env.DATABASE_HOST,
  username: import.meta.env.DATABASE_USERNAME,
  password: import.meta.env.DATABASE_PASSWORD,
  url: import.meta.env.DATABASE_URL,
});
 
const db = drizzle(connection);
await migrate(db, { migrationsFolder: './drizzle' });