import db from "~/server/db";
import { comments, posts, users } from "@drizzle/schema/posts";
import { exists, like, lte, sql } from "drizzle-orm";
import { QueryBuilder } from "drizzle-orm/mysql-core";

export const searchPosts = async (
  searchQuery: string,
  limit: number,
  offset: number
) => {
  const results = await db.query.posts.findMany({
    limit: limit,
    offset: offset,
    where: like(posts.content && posts.title, `%${searchQuery}%`),
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
          },
          post: {
            columns: {
              id: true,
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

  return results;
};

export const searchUsers = async (
  searchQuery: string,
  limit: number,
  offset: number
) => {
  const results = await db.query.users.findMany({
    limit: limit,
    offset: offset,
    where: like(users.username, `%${searchQuery}%`),
    columns: {
      username: true,
      description: true,
    },
    with: {
      permissions: {
        columns: {
          role: true,
        },
      },
    },
  });
  return results;
};
