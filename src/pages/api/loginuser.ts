import { loginUser, type JwtPayload, generateToken } from "~/server/users";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ cookies, request }) => {
  const body = await request.json();
  const username = body.username;
  const password = body.password;

  const { user, message } = await loginUser(username, password);
  if (!user) {
    return new Response(JSON.stringify(message), {
      status: 401,
    });
  }
  const payload: JwtPayload = {
    sub: JSON.stringify(user.id),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    iat: Math.floor(Date.now() / 1000),
    customData: {
      username: username,
    },
  };
  const token = await generateToken(payload);
  cookies.set("authToken", token, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return new Response(JSON.stringify(message), {
    status: 200,
  });
};
