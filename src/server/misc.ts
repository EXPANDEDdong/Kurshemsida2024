import db from "~/server/db";
import { posts, users } from "@drizzle/schema/posts";
import { like } from "drizzle-orm";
import type { PostData, UserData } from "@utils/types";

export const searchPosts = async (
  searchQuery: string,
  limit: number,
  offset: number
): Promise<PostData[]> => {
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
/** search for users
 * @param {string} searchQuery - the query to search with
 */
export const searchUsers = async (
  searchQuery: string,
  limit: number,
  offset: number
): Promise<Pick<UserData, "username" | "description" | "permissions">[]> => {
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
