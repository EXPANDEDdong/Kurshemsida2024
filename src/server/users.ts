import { users } from "@drizzle/schema/posts";
import db, { type InsertUser, type SelectUser } from "~/server/db";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcrypt";

const encryptPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const createUser = async (data: InsertUser): Promise<{ success: boolean, user: SelectUser | null, message: string }> => {
  const encryptedPassword = await encryptPassword(data.password);
  try {
    const insertData = await db.insert(users).values({
      username: data.username,
      password: encryptedPassword,
    });
    const user = await db.select(users).where({ id: insertData.insertId }).single();
    return { success: true, user, message: 'User created' }
  } catch (error) {
    return { success: false, user: null, message: 'User already exist' };
  }
};