import { createUser } from "~/server/users";
import type { APIRoute } from "astro";
import * as bcrypt from 'bcrypt';

export const POST: APIRoute = async ({ params, request }) => {
  const body = await request.json();
  const username = body.username;
  const password = body.password;

  const encryptPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  };

  const encryptedPassword = await encryptPassword(password);
  await createUser({ username, encryptedPassword})
  
  return {
    status: 200,
    body: JSON.stringify("hello"),
  };
};
