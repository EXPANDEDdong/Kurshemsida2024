import { loginUser, type JwtPayload, generateToken } from "~/server/users";
import type { APIRoute } from "astro";
import { importJWK } from "jose";

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

  const secretKey = await importJWK({
    kty: "oct",
    k: import.meta.env.JWT_SECRET,
    alg: "HS256",
  });

  const token = await generateToken(payload, secretKey);

  cookies.set("authToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return new Response(JSON.stringify(message), {
    status: 200,
  });
};
