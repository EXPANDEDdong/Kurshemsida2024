import { createPost, deletePost, getPostAuthorId } from "~/server/posts";
import type { APIRoute } from "astro";
import { importJWK } from "jose";
import { verifyToken } from "~/server/users";

export const DELETE: APIRoute = async ({ cookies, request }) => {
  const body = await request.json();
  const postId = String(body.id);
  const authorId = String(await getPostAuthorId(postId));

  const authToken = cookies.get("authToken")?.value;
  if (!authToken)
    return new Response(JSON.stringify("not work"), { status: 401 });

  const secretKey = await importJWK({
    kty: "oct",
    k: import.meta.env.JWT_SECRET,
    alg: "HS256",
  });

  const { payload } = await verifyToken(authToken, secretKey);
  if (!payload) return new Response(JSON.stringify("nope"), { status: 401 });

  const playerId = payload.sub?.replace(/['"]+/g, "");
  if (playerId == authorId) {
    await deletePost(postId);
    return new Response(JSON.stringify(body), {
      status: 200,
    });
  }
  return new Response(JSON.stringify(body));
};
