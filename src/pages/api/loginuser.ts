import { loginUser } from "~/server/users";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ params, request }) => {
  const body = await request.json();
  const username:string = body.username;
  const password = body.password;
  const token = await loginUser({ username, password });
  const response = new Response('Body content here', {
    status: 200, 
    headers: {
        'Set-Cookie': `authToken=${token}; Path=/; HttpOnly; Secure`
      }
    });
  return response;
};
