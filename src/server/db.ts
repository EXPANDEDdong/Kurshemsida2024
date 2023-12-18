import { connect } from "@planetscale/database";
import "dotenv/config";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import type { comments, posts, users } from "@drizzle/schema/posts";
import * as schema from "@drizzle/schema/posts";

const connection = connect({
  host: import.meta.env.DATABASE_HOST,
  username: import.meta.env.DATABASE_USERNAME,
  password: import.meta.env.DATABASE_PASSWORD,
  url: import.meta.env.DATABASE_URL,
});

const db = drizzle(connection, { schema });

export type SelectUser = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;

export type SelectPost = InferSelectModel<typeof posts>;
export type InsertPost = InferInsertModel<typeof posts>;

export type InsertComment = InferInsertModel<typeof comments>;

export default db;
