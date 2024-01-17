import { createPost } from "~/server/posts";
import type { APIRoute } from "astro";
import { importJWK } from "jose";
import { verifyToken } from "~/server/users";
import { getSecret } from "~/server/misc";

export const POST: APIRoute = async ({ cookies, request }) => {
  const body = await request.json();
  const title = body.title;
  const content = body.content;
  const authToken = cookies.get("authToken")?.value;
  if (!authToken)
    return new Response(JSON.stringify("Not authenticated"), { status: 401 });

  const secretKey = await getSecret();

  const { payload } = await verifyToken(authToken, secretKey);
  if (!payload)
    return new Response(JSON.stringify("Invalid token"), { status: 401 });

  const authorId = payload.sub;

  if (!authorId)
    return new Response(JSON.stringify("Token error"), { status: 401 });

  await createPost({ authorId, title, content });

  return new Response(JSON.stringify(body), {
    status: 200,
  });
};
