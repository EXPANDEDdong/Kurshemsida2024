import type { APIRoute } from "astro";
import { importJWK } from "jose";
import { getCommentAuthorId, deleteComment } from "~/server/posts";
import { verifyToken } from "~/server/users";

export const DELETE: APIRoute = async ({ request, cookies }) => {
    const body = await request.json();
    const commentId = String(body.id);
    const authorId = String(await getCommentAuthorId(commentId));

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

  const userId = payload.sub?.replace(/['"]+/g, "");
  if (userId == authorId) {
    await deleteComment(commentId);
    return new Response(JSON.stringify(body), {
        status: 200,
      });
      
  }
  return new Response(JSON.stringify(body))
}