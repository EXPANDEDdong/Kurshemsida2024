import { posts, users } from "@drizzle/schema/posts";
import db, { type InsertPost, type InsertUser, type SelectPost } from "~/server/db";
import { eq } from "drizzle-orm";

export const createPost = async (data: InsertPost) => {
  const insertData = await db.insert(posts).values(data);
  return await db
    .select()
    .from(posts)
    .where(eq(posts.id, parseInt(insertData.insertId)));
};

export const getPosts = async ():Promise<SelectPost[]> => {
  return await db.select().from(posts)
};