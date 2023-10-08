import crypto from 'crypto';
import { users } from '@drizzle/schema/posts';
import db, { type InsertUser } from '~/server/db';
import { eq } from 'drizzle-orm';

const generateSalt = (length: number): string => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};

const sha512 = (password: string, salt: string): string => {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  const value = hash.digest('hex');
  return value;
};

const encryptPassword = async (password: string): Promise<string> => {
  const salt = generateSalt(16);
  const passwordHash = sha512(password, salt);
  return `${salt}$${passwordHash}`;
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