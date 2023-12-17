import { createPost } from "~/server/posts";
import type { APIRoute } from "astro";
import { importJWK } from "jose";
import { verifyToken } from "~/server/users";

export const POST: APIRoute = async ({ cookies, request }) => {
  const body = await request.json();
  const title = body.title;
  const content = body.content;
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
    const authorId = payload.sub?.replace(/['"]+/g, '');
    if (authorId) {
      await createPost({ authorId, title, content });
    }
  }
  return new Response(JSON.stringify(body), {
    status: 200,
  });
};
