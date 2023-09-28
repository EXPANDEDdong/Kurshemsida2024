import { posts, users } from "@drizzle/schema/posts";
import db, { type InsertPost, type InsertUser, type SelectPost } from "@lib/db";
import { eq } from "drizzle-orm";

export const createUser = async (data: InsertUser) => {
  const insertData = await db.insert(users).values(data);
  return await db
    .select()
    .from(users)
    .where(eq(users.id, parseInt(insertData.insertId)));
};

export const createPost = async (data: InsertPost) => {
  const insertData = await db.insert(posts).values(data);
  return await db
    .select()
    .from(posts)
    .where(eq(posts.id, parseInt(insertData.insertId)));
};

export const getPosts = async () => {
  return await db.select().from(posts)
}