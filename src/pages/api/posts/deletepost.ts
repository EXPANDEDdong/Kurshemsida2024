import { deletePost, getPostAuthorId } from "~/server/posts";
import type { APIRoute } from "astro";
import { verifyToken } from "~/server/users";
import { getSecret } from "~/server/misc";

export const DELETE: APIRoute = async ({ cookies, request }) => {
  const body = await request.json();
  const postId = String(body.id);
  const authorId = String(await getPostAuthorId(postId));

  const authToken = cookies.get("authToken")?.value;
  if (!authToken)
    return new Response(JSON.stringify("Not logged in."), { status: 401 });

  const secretKey = await getSecret();

  const { payload } = await verifyToken(authToken, secretKey);
  if (!payload)
    return new Response(JSON.stringify("Invalid token."), { status: 401 });

  const currentId = payload.sub;
  if (currentId == authorId) {
    await deletePost(postId);
    return new Response(JSON.stringify(body), {
      status: 200,
    });
  }
  return new Response(JSON.stringify(body));
};
