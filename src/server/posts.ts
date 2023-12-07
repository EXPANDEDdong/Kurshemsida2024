import { comments, posts, users } from "@drizzle/schema/posts";
import db, { type InsertComment, type InsertPost, type InsertUser, type SelectPost } from "~/server/db";
import { eq } from "drizzle-orm";
import type { PostsData } from "./users";


export interface PostsOnFeed {
  id: string;
    title: string;
    content: string;
    postedDate: Date;
    user: {
      username: string;
  };
    comments: {
      id: string;
        content: string | null;
        postedDate: Date;
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

export const getPosts = async (limit: number, offset: number):Promise<PostsOnFeed[]> => {
  const posts = await db.query.posts.findMany({
    limit: limit,
    offset: offset,
    orderBy: (posts, { desc }) => [desc(posts.postedDate)],
    with: {
      user: {
        columns: {
          username: true,
        }
      },
      comments: {
        columns: {
          id: true,
          content: true,
          postedDate: true
        },
        with: {
          user: {
            columns: {
              username: true
            }
          },
          post: {
            columns: {
              id: true
            }
          }
        }
      },
    },
    columns: {
      id: true,
      content: true,
      title: true,
      postedDate: true
    }
  })
  return posts;
};

export const deletePost = async (postId: string) => {
  await db.delete(posts).where(eq(posts.id, postId));
  await db.delete(comments).where(eq(comments.targetPostId, postId));
  return;
}

export const deleteComment = async (commentId: string) => {
  await db.delete(comments).where(eq(comments.id, commentId));
  return;
}

export const getPostAuthorId = async (postId: string) => {
  const author = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
    columns: {
      authorId: true
    }
  })
  return author?.authorId;
}

export const getCommentAuthorId = async (commentId: string) => {
  const author = await db.query.comments.findFirst({
    where: eq(comments.id, commentId),
    columns: {
      authorId: true
    }
  })
  return author?.authorId;
}

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
        orderBy: (comments, { desc }) => [desc(comments.postedDate)],
        columns: {
          id: true,
          content: true,
          postedDate: true
        },
        with: {
          user: {
            columns: {
              username: true
            }
          },
          post: {
            columns: {
              id: true
            }
          }
        }
      }
    },
    columns: {
      id: true,
      content: true,
      title: true,
      postedDate: true
    }
  })
}