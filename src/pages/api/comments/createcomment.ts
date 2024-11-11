import type { APIRoute } from "astro";
import { getSecret } from "~/server/misc";
import { createComment } from "~/server/posts";
import { verifyToken } from "~/server/users";

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json();
  const content = body.content;
  const targetPostId = String(body.targetId);

  const authToken = cookies.get("authToken")?.value;
  if (!authToken)
    return new Response(JSON.stringify("Not logged in."), { status: 401 });

  const secretKey = await getSecret();

  const { payload } = await verifyToken(authToken, secretKey);
  if (!payload)
    return new Response(JSON.stringify("Invalid token."), { status: 401 });

  const authorId = payload.sub;
  if (!authorId)
    return new Response(JSON.stringify("Token error."), { status: 401 });

  await createComment({ targetPostId, authorId, content });

  return new Response(JSON.stringify(body));
};
