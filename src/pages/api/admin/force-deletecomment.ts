import type { APIRoute } from "astro";
import { getSecret } from "~/server/misc";
import { deleteComment } from "~/server/posts";
import { isAdmin, verifyToken } from "~/server/users";

export const DELETE: APIRoute = async ({ request, cookies }) => {
  const body = await request.json();
  const commentId = String(body.id);

  const authToken = cookies.get("authToken")?.value;
  if (!authToken)
    return new Response(JSON.stringify("not work"), { status: 401 });

  const secretKey = await getSecret();

  const { payload } = await verifyToken(authToken, secretKey);
  if (!payload) return new Response(JSON.stringify("nope"), { status: 401 });

  const currentId = payload.sub;

  const isAuthorized = await isAdmin(currentId);

  if (!isAuthorized)
    return new Response(JSON.stringify("Does not have required authority"), {
      status: 403,
    });
  await deleteComment(commentId);
  return new Response(JSON.stringify(body), {
    status: 200,
  });
};
