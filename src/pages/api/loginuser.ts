import { loginUser, type JwtPayload, generateToken } from "~/server/users";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ params, request }) => {
  const body = await request.json();
  const username = body.username;
  const password = body.password;

  const { user, message } = await loginUser({ username, password });
  if (!user) {
    return {
      status: 401,
      body: JSON.stringify(message),
    };
  } else {
    const payload: JwtPayload = {
      sub: JSON.stringify(user.id),
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      iat: Math.floor(Date.now() / 1000),
      customData: {
        username: username,
      },
    };
    const token = generateToken(payload);
    return {
      status: 200,
      body: JSON.stringify(message),
      headers: {
        'Set-Cookie': `authToken=${token}; Path=/; HttpOnly; Secure`,
      },
    };
  }
};
