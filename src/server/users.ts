import crypto from "crypto";
import { postsRelations, users } from "@drizzle/schema/posts";
import db, { type InsertUser, type SelectUser } from "~/server/db";
import { eq } from "drizzle-orm";
import { SignJWT, jwtVerify, importJWK, type JWTPayload, errors, type KeyLike } from "jose";
import type { PostsOnFeed } from "./posts";

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
  username: string
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

export const generateToken = async (payload: JwtPayload): Promise<string> => {
  const secretKey = await importJWK({
    kty: "oct",
    k: import.meta.env.JWT_SECRET,
    alg: "HS256",
  });
  const token: JWTPayload = { username: `${payload.customData.username}` };
  return await new SignJWT(token)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setExpirationTime(payload.exp)
    .setIssuedAt(payload.iat)
    .sign(secretKey);
};

export const verifyToken = async (jwt: string, secretKey: KeyLike | Uint8Array): Promise<{status: string; payload?: usernamePayload; message: string}> => {
  try {
    const payload = (await jwtVerify(jwt, secretKey)).payload as usernamePayload;
    return {
      status: "authorized",
      payload: payload,
      message: "Verified auth token"
      
    } as const;
  } catch (error) {
    console.error("Token verification error:", error);
    
    if (error instanceof errors.JOSEError) {
      return { status: "error", message: error.message } as const;
    }
    console.debug(error);
    return { status: "error", message: "could not validate auth token" } as const;
    
  }
};

// ===============================================================================

export const createUser = async (
  data: InsertUser
): Promise<{ success: boolean; user: SelectUser | null; message: string }> => {
  
  const encryptedPassword = await encryptPassword(data.password);

  try {
    const insertData = await db.insert(users).values({
      username: data.username,
      email: data.email,
      password: encryptedPassword,
    });
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, insertData.insertId));
    const userData: SelectUser = user[0];
    return { success: true, user: userData, message: "User created" };
  } catch (error) {
    return { success: false, user: null, message: "User already exists" };
  }
};

// ===============================================================================
export interface CommentsData {
  user: {
    username: string;
};
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
        description: true
      },
      with: {
        posts: {
          orderBy: (posts, { desc }) => [desc(posts.postedDate)],
          columns: {
            id: true,
            title: true,
            content: true,
            postedDate: true
          },
        with: {
          user: {
            columns: {
              username: true
            }
          },
          comments: {
            columns: {
              content: true,
              postedDate: true
            },
            with: {
              user: {
                columns: {
                  username: true
                }
              },
            }
          }
        }
      },
        comments: {
          orderBy: (comments, { desc }) => [desc(comments.postedDate)],
          columns: {
            content: true,
            postedDate: true
          },
          with: {
            post: {
              columns: {
                id: true,
                title: true,
                content: true,
                postedDate: true
              },
              with: {
                user: {
                  columns: {
                    username: true
                  }
                },
              }
            },
            user: {
              columns: {
                username: true
              }
            }
          }
        }
      }
    })
  if (!user) {
    return { message: "Unsuccessful", user: null };
  }


    return { message: "Success", user: user };
  
};
export const updateUser = async (
  id: string, newUsername: string, newDescription: string
): Promise<string | null | undefined> => {
  try {
    // Retrieve user from database
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        username: true,
        description: true
      }
    })
    // if a field is empty dont change that value in the database
    let newUser: string | null | undefined = user?.username;
    let newBio: string | null | undefined = user?.description;

    if (newUsername != "") {
      newUser = newUsername;
    }
    if (newDescription != "") {
      newBio = newDescription;
    }
    await db.update(users).set({ username: newUser, description: newBio}).where(eq(users.id, id));
    // return the new username after updating
    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        username: true
      }
    })
    return updatedUser?.username;
  } catch (error) {
    return null;
  }
};

// ===============================================================================
