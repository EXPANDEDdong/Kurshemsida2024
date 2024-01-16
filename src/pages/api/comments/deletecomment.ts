import type { APIRoute } from "astro";
import { importJWK } from "jose";
import { getSecret } from "~/server/misc";
import { getCommentAuthorId, deleteComment } from "~/server/posts";
import { verifyToken } from "~/server/users";

export const DELETE: APIRoute = async ({ request, cookies }) => {
  const body = await request.json();
  const commentId = String(body.id);
  const authorId = String(await getCommentAuthorId(commentId));

  const authToken = cookies.get("authToken")?.value;
  if (!authToken)
    return new Response(JSON.stringify("not work"), { status: 401 });

  const secretKey = await getSecret();

  const { payload } = await verifyToken(authToken, secretKey);
  if (!payload) return new Response(JSON.stringify("nope"), { status: 401 });

  const userId = payload.sub;
  if (!userId)
    return new Response(JSON.stringify("Token error"), { status: 401 });

  if (userId == authorId) {
    await deleteComment(commentId);
    return new Response(JSON.stringify(body), {
      status: 200,
    });
  }
  return new Response(JSON.stringify(body));
};
