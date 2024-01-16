import { createPost, deletePost, getPostAuthorId } from "~/server/posts";
import type { APIRoute } from "astro";
import { importJWK } from "jose";
import { isAdmin, verifyToken } from "~/server/users";
import { getSecret } from "~/server/misc";

export const DELETE: APIRoute = async ({ cookies, request }) => {
  const body = await request.json();
  const postId = String(body.id);

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

  await deletePost(postId);
  return new Response(JSON.stringify(body), {
    status: 200,
  });
};