import { comments, posts, users } from "@drizzle/schema/posts";
import db, { type InsertComment, type InsertPost, type InsertUser, type SelectPost } from "~/server/db";
import { eq } from "drizzle-orm";
import type { PostsData } from "./users";


export interface PostsOnFeed {
  id: string;
    title: string;
    content: string;
    user: {
      username: string;
  };
    comments: {
        content: string | null;
        user: {
            username: string;
        };
    }[];
}

export const createPost = async (data: InsertPost) => {
  const insertData = await db.insert(posts).values(data);
  return await db
    .select()
    .from(posts)
    .where(eq(posts.id, insertData.insertId));
};

export const createComment = async (data: InsertComment) => {
  const insertData = await db.insert(comments).values(data);
}

export const getPosts = async ():Promise<PostsOnFeed[]> => {
  const posts = await db.query.posts.findMany({
    with: {
      user: {
        columns: {
          username: true,
        }
      },
      comments: {
        columns: {
          content: true
        },
        with: {
          user: {
            columns: {
              username: true
            }
          }
        }
      },
    },
    columns: {
      id: true,
      content: true,
      title: true
    }
  })
  return posts;
};

export const getSinglePost = async (postId: string):Promise<PostsOnFeed | undefined> => {
  return await db.query.posts.findFirst({
    where: eq(posts.id, postId),
    with: {
      user: {
        columns: {
          username: true,
        }
      },
      comments: {
        with: {
          user: {
            columns: {
              username: true
            }
          }
        }
      }
    },
    columns: {
      id: true,
      content: true,
      title: true
    }
  })
}