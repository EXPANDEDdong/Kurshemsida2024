import { createPost } from "~/server/posts";
import type { APIRoute } from "astro";
import { importJWK } from "jose";
import { updateUser, verifyToken, type JwtPayload, generateToken } from "~/server/users";

export const PATCH: APIRoute = async ({ cookies, request }) => {
  const body = await request.json();
  const username = body.username;
  const description = body.description;
  if (cookies.has("authToken")) {
    const authToken = cookies.get("authToken")?.value || "";
    const secretKey = await importJWK({
      kty: "oct",
      k: import.meta.env.JWT_SECRET,
      alg: "HS256",
    });
    const { payload } = await verifyToken(authToken, secretKey);
    if (!payload) {
      return new Response(JSON.stringify(body), {
        status: 401,
      });
    }
    const userId = payload.sub?.replace(/['"]+/g, "");
    if (userId) {
      const updatedUser = await updateUser(userId, username, description);
      if (!updatedUser) {
        return new Response(JSON.stringify("error updating user"), {
          status: 409,
        });
      }
      const payload: JwtPayload = {
        sub: JSON.stringify(userId),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
        iat: Math.floor(Date.now() / 1000),
        customData: {
          username: updatedUser,
        },
      };
      const token = await generateToken(payload);
      cookies.set("authToken", token, {
        httpOnly: true,
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }
  }
  return new Response(JSON.stringify(body), {
    status: 200,
  });
};
