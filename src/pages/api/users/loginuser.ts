import { loginUser, type JwtPayload, generateToken } from "~/server/users";
import type { APIRoute } from "astro";
import { importJWK } from "jose";
import { getSecret } from "~/server/misc";

export const POST: APIRoute = async ({ cookies, request }) => {
  const body = await request.json();
  const email = body.email;
  const password = body.password;

  const { success, user, message } = await loginUser(email, password);
  if (!user) {
    return new Response(JSON.stringify({ success, message }), {
      status: 401,
    });
  }
  const payload: JwtPayload = {
    sub: user.id,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    iat: Math.floor(Date.now() / 1000),
    customData: {
      username: user.username,
    },
  };

  const secretKey = await getSecret();

  const token = await generateToken(payload, secretKey);

  cookies.set("authToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return new Response(JSON.stringify({ success, message }), {
    status: 200,
  });
};
