import { createUser } from "~/server/users";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ params, request }) => {
  const body = await request.json();
  const username = body.username;
  const password = body.password;
  await createUser({ username, password });
  return {
    status: 200,
    body: JSON.stringify("hello"),
  };
};
