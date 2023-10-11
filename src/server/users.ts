import crypto from "crypto";
import { users } from "@drizzle/schema/posts";
import db, { type InsertUser, type SelectUser } from "~/server/db";
import { eq } from "drizzle-orm";
import { SignJWT, jwtVerify, importJWK } from "jose";

interface CustomData {
  username: string;
};

export interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
  customData: CustomData;
};

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
    k: import.meta.env.JWT_SECRET, // Replace this with your base64 encoded secret
    alg: "HS256",
  });

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .sign(secretKey);
};

// ===============================================================================

export const createUser = async (
  data: InsertUser
): Promise<{ success: boolean; user: SelectUser | null; message: string }> => {
  const encryptedPassword = await encryptPassword(data.password);
  try {
    const insertData = await db.insert(users).values({
      username: data.username,
      password: encryptedPassword,
    });
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(insertData.insertId)));
    const userData: SelectUser = user[0];
    return { success: true, user: userData, message: "User created" };
  } catch (error) {
    return { success: false, user: null, message: "User already exist" };
  }
};

// ===============================================================================

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
    return { message: "User not found", user: null };
  }

  const isValid = await verifyPassword(userData.password, providedPassword);
  if (isValid) {
    // Passwords match

    return { message: "Logged In", user: userData };
  } else {
    // Passwords do not match
    return { message: "Invalid password", user: null };
  }
};

// ===============================================================================
