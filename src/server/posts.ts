import { comments, posts } from "@drizzle/schema/posts";
import db, { type InsertComment, type InsertPost } from "~/server/db";
import { eq, sql } from "drizzle-orm";
import type { PostData, SinglePostData } from "@utils/types";

export const createPost = async (data: InsertPost) => {
  const insertData = await db.insert(posts).values(data);
  return await db.select().from(posts).where(eq(posts.id, insertData.insertId));
};

export const createComment = async (data: InsertComment) => {
  const insertData = await db.insert(comments).values(data);
  return;
};

const getAllPosts = async () => {};

export const getPosts = async (
  limit: number,
  offset: number
): Promise<PostData[]> => {
  const posts = await db.query.posts.findMany({
    limit: limit,
    offset: offset,
    orderBy: (posts, { desc }) => [desc(posts.postedDate)],
    with: {
      user: {
        columns: {
          username: true,
        },
        with: {
          permissions: {
            columns: {
              role: true,
            },
          },
        },
      },
      comments: {
        columns: {
          id: true,
          content: true,
          postedDate: true,
        },
        with: {
          user: {
            columns: {
              username: true,
            },
            with: {
              permissions: {
                columns: {
                  role: true,
                },
              },
            },
          },
        },
      },
    },
    columns: {
      id: true,
      content: true,
      title: true,
      postedDate: true,
    },
  });

  return posts;
};

export const deletePost = async (postId: string) => {
  await db.delete(posts).where(eq(posts.id, postId));
  await db.delete(comments).where(eq(comments.targetPostId, postId));
  return;
};

export const deleteComment = async (commentId: string) => {
  await db.delete(comments).where(eq(comments.id, commentId));
  return;
};

export const getPostAuthorId = async (postId: string) => {
  const author = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
    columns: {
      authorId: true,
    },
  });
  return author?.authorId;
};

export const getCommentAuthorId = async (commentId: string) => {
  const author = await db.query.comments.findFirst({
    where: eq(comments.id, commentId),
    columns: {
      authorId: true,
    },
  });
  return author?.authorId;
};

export const getSinglePost = async (
  postId: string
): Promise<SinglePostData | null> => {
  const result = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
    with: {
      user: {
        columns: {
          username: true,
        },
        with: {
          permissions: {
            columns: {
              role: true,
            },
          },
        },
      },
      comments: {
        orderBy: (comments, { desc }) => [desc(comments.postedDate)],
        columns: {
          id: true,
          content: true,
          postedDate: true,
        },
        with: {
          user: {
            columns: {
              username: true,
            },
            with: {
              permissions: {
                columns: {
                  role: true,
                },
              },
            },
          },
          post: {
            columns: {
              id: true,
              title: true,
              content: true,
              postedDate: true,
            },
            with: {
              user: {
                columns: {
                  username: true,
                },
                with: {
                  permissions: {
                    columns: {
                      role: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    columns: {
      id: true,
      content: true,
      title: true,
      postedDate: true,
    },
  });
  if (!result) {
    return null;
  }
  return result;
};
