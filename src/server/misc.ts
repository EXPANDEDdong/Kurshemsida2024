import db from "~/server/db";
import {
  comments,
  posts,
  userPermissions,
  users,
} from "@drizzle/schema/schema";
import { eq, like, sql } from "drizzle-orm";
import type { PostData, UserData, userRole } from "@utils/types";
import { getUser, verifyToken } from "~/server/users.js";
import { importJWK } from "jose";

export const getSecret = async () => {
  return await importJWK({
    kty: "oct",
    k: import.meta.env.JWT_SECRET,
    alg: "HS256",
  });
};

export const getUserPage = async (
  username: string
): Promise<UserData | null> => {
  const { user } = await getUser(username);
  if (!user) {
    return null;
  }
  return user as UserData;
};

export const getCurrentUser = async (
  request: Request
): Promise<{
  user: null | {
    username: string;
    role: userRole;
  };
}> => {
  // Parse the Cookie header to get the auth cookie
  const cookieString = request.headers.get("Cookie");
  const cookies = parseCookieHeader(cookieString);
  const authCookie = cookies["authToken"];

  if (!authCookie) {
    return { user: null };
  }

  const secretKey = await getSecret();

  const jwtResult = await verifyToken(authCookie, secretKey);

  if (!jwtResult || !jwtResult.payload) {
    return { user: null };
  }
  const { user } = await getUser(jwtResult.payload.username, [
    "username",
    "permissions",
  ]);

  if (!user) {
    return { user: null };
  }
  const userData = user as Pick<UserData, "username" | "permissions">;
  return {
    user: {
      username: userData.username,
      role: userData.permissions.role,
    },
  };
};

// Helper function to parse cookies from header string
function parseCookieHeader(header: string | null): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (header) {
    header.split(";").forEach((cookie) => {
      const [name, ...rest] = cookie.trim().split("=");
      cookies[name] = decodeURIComponent(rest.join("="));
    });
  }
  return cookies;
}

export const getAdminData = async () => {
  const userCount = await db
    .select({ v: sql`count(${users.id})`.mapWith(Number) })
    .from(users);

  const postCount = await db
    .select({ v: sql`count(${posts.id})`.mapWith(Number) })
    .from(posts);

  const commentCount = await db
    .select({ v: sql`count(${comments.id})`.mapWith(Number) })
    .from(comments);

  const adminCount = await db
    .select({ v: sql`count(${userPermissions.userId})`.mapWith(Number) })
    .from(userPermissions)
    .where(eq(userPermissions.role, "admin"));

  return {
    users: userCount[0].v,
    posts: postCount[0].v,
    comments: commentCount[0].v,
    admins: adminCount[0].v,
  };
};

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
): Promise<
  Array<Pick<UserData, "username" | "description" | "permissions">>
> => {
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

export const searchUsersAdmin = async (
  searchQuery: string,
  limit: number,
  offset: number
): Promise<
  Array<
    Pick<UserData, "username" | "description" | "permissions"> & {
      id: string;
      email: string;
    }
  >
> => {
  const results = await db.query.users.findMany({
    limit: limit,
    offset: offset,
    where: like(users.username, `%${searchQuery}%`),
    columns: {
      username: true,
      description: true,
      id: true,
      email: true,
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
