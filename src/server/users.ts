import crypto from "crypto";
import { comments, posts, userPermissions, users } from "@drizzle/schema/posts";
import db, { type InsertUser, type SelectUser } from "~/server/db";
import { eq } from "drizzle-orm";
import {
  SignJWT,
  jwtVerify,
  type JWTPayload,
  errors,
  type KeyLike,
} from "jose";

interface CustomData {
  username: string;
}

export interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
  customData: CustomData;
}

export interface usernamePayload extends JWTPayload {
  username: string;
}

// ===============================================================================

const generateSalt = (length: number): string => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
};

const sha512 = (password: string, salt: string): string => {
  const hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  const value = hash.digest("hex");
  return value;
};

const encryptPassword = async (password: string): Promise<string> => {
  const salt = generateSalt(16);
  const passwordHash = sha512(password, salt);
  return `${salt}$${passwordHash}`;
};

// =============================================================================

export const generateToken = async (
  payload: JwtPayload,
  secretKey: KeyLike | Uint8Array
): Promise<string> => {
  try {
    const token: JWTPayload = { username: `${payload.customData.username}` };
    return await new SignJWT(token)
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(payload.sub)
      .setExpirationTime(payload.exp)
      .setIssuedAt(payload.iat)
      .sign(secretKey);
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Token generation failed");
  }
};

export const verifyToken = async (
  jwt: string,
  secretKey: KeyLike | Uint8Array
): Promise<{ status: string; payload?: usernamePayload; message: string }> => {
  try {
    const payload = (await jwtVerify(jwt, secretKey))
      .payload as usernamePayload;
    return {
      status: "authorized",
      payload: payload,
      message: "Verified auth token",
    } as const;
  } catch (error) {
    console.error("Token verification error:", error);

    if (error instanceof errors.JOSEError) {
      return { status: "error", message: error.message } as const;
    }
    console.debug(error);
    return {
      status: "error",
      message: "could not validate auth token",
    } as const;
  }
};

// ===============================================================================

export const createUser = async (
  data: InsertUser
): Promise<{ success: boolean; user: SelectUser | null; message: string }> => {
  const encryptedPassword = await encryptPassword(data.password);

  try {
    const newUser = await db.transaction(async (trx) => {
      const insertData = await trx.insert(users).values({
        username: data.username,
        email: data.email,
        password: encryptedPassword,
      });

      const newUserData = await trx.query.users.findFirst({
        where: eq(users.username, data.username),
      });
      if (!newUserData) return null;
      const insertPerms = await trx
        .insert(userPermissions)
        .values({ userId: newUserData.id });

      return await trx.select().from(users).where(eq(users.id, newUserData.id));
    });
    if (!newUser) {
      return {
        success: false,
        user: null,
        message: "Error creating user",
      };
    }
    return {
      success: true,
      user: newUser[0],
      message: "User created successfully",
    };
  } catch (error) {
    // Early exit if the error is not an instance of Error
    if (!(error instanceof Error)) {
      console.error("An unknown error occurred"); // Log a generic error message
      return {
        success: false,
        user: null,
        message: "An unknown error occurred during user creation",
      };
    }

    // Handle the Error instance
    console.error("Error creating user:", error.message); // Log the error message
    return {
      success: false,
      user: null,
      message: "Error creating user: " + error.message,
    };
  }
};

// ===============================================================================
export interface CommentsData {
  user: {
    username: string;
  };
  id: string;
  content: string | null;
  postedDate: Date;
  post: {
    id: string;
    title: string | null;
    content: string | null;
    postedDate: Date;
    user: {
      username: string | null;
    };
  };
}

export interface PostsData {
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

export interface UserData {
  username: string;
  description: string | null;
  posts: PostsData[];
  comments: CommentsData[];
  permissions: {
    role: "user" | "admin";
  };
}

const verifyPassword = async (
  storedPassword: string,
  providedPassword: string
): Promise<boolean> => {
  const [extractedSalt, extractedHash] = storedPassword.split("$");
  const hashedProvidedPassword = sha512(providedPassword, extractedSalt);
  return extractedHash === hashedProvidedPassword;
};

export const loginUser = async (
  username: string,
  providedPassword: string
): Promise<{ message: string; user: SelectUser | null }> => {
  // Retrieve user from database
  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, username));

  const userData: SelectUser = user[0];

  if (!userData) {
    return { message: "Invalid username or password", user: null };
  }

  const isValid = await verifyPassword(userData.password, providedPassword);
  if (isValid) {
    // Passwords match

    return { message: "Login Successful", user: userData };
  } else {
    // Passwords do not match
    return { message: "Invalid username or password", user: null };
  }
};
export const getUser = async (
  username: string
): Promise<{ message: string; user: UserData | undefined | null }> => {
  // Retrieve user from database along with
  // all posts and comments made by that user and the comments on those posts

  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
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
      posts: {
        orderBy: (posts, { desc }) => [desc(posts.postedDate)],
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
              },
            },
          },
          user: {
            columns: {
              username: true,
            },
          },
        },
      },
    },
  });
  if (!user) {
    return { message: "Unsuccessful", user: null };
  }

  return { message: "Success", user: user };
};

export const isUserValid = async (
  userId: string,
  email: string,
  password: string
): Promise<{ message: string; isValid: boolean }> => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      email: true,
      password: true,
    },
  });

  if (!user) return { message: "user doesnt exist", isValid: false };

  const passwordValid = await verifyPassword(user.password, password);
  const emailValid = user.email == email;

  const isValid = passwordValid && emailValid;

  if (isValid) {
    return { message: "user is valid", isValid: true };
  }
  return { message: "user not valid", isValid: false };
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    await db.transaction(async (trx) => {
      // Delete comments made by the user
      await trx.delete(comments).where(eq(comments.authorId, userId));

      // Find all posts by the user
      const userPosts = await trx.query.posts.findMany({
        where: eq(posts.authorId, userId),
        columns: {
          id: true,
        },
      });

      // Delete comments on user's posts
      for (const post of userPosts) {
        await trx.delete(comments).where(eq(comments.targetPostId, post.id));
      }

      // Delete the posts themselves
      await trx.delete(posts).where(eq(posts.authorId, userId));

      // Finally, delete the user
      await trx.delete(users).where(eq(users.id, userId));
    });

    return true; // Indicates successful deletion
  } catch (error) {
    console.error("Error deleting user:", error); // Improved error logging
    return false; // Indicates an error occurred
  }
};

export const updateUser = async (
  id: string,
  newUsername: string,
  newDescription: string
): Promise<string | null> => {
  try {
    return await db.transaction(async (trx) => {
      const updateFields: { username?: string; description?: string } = {};
      if (newUsername) updateFields.username = newUsername;
      if (newDescription) updateFields.description = newDescription;

      if (Object.keys(updateFields).length === 0) {
        throw new Error("No update fields provided");
      }

      await trx.update(users).set(updateFields).where(eq(users.id, id));

      const updatedUser = await trx.query.users.findFirst({
        where: eq(users.id, id),
        columns: {
          username: true,
        },
      });

      if (!updatedUser) {
        throw new Error("User not found after update");
      }

      return updatedUser.username;
    });
  } catch (error) {
    console.error("Update user error:", error);
    return null;
  }
};

// ===============================================================================

export const getAllUsers = async () => {
  return await db.query.users.findMany({
    columns: {
      id: true,
      email: true,
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
};

export const isAdmin = async (userId: string | undefined): Promise<boolean> => {
  if (!userId) return false;

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      permissions: {
        columns: {
          role: true,
        },
      },
    },
    columns: {},
  });
  if (!user || user.permissions.role !== "admin") {
    return false;
  }
  return true;
};
