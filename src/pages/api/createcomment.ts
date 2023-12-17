import type { APIRoute } from "astro";
import { importJWK } from "jose";
import { createComment } from "~/server/posts";
import { verifyToken } from "~/server/users";

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json();
  const content = body.content;
  const targetPostId = String(body.targetId);
  
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

  const authorId = payload.sub?.replace(/['"]+/g, "");
  if (!authorId) return new Response(JSON.stringify("nope"), { status: 401 });

  await createComment({ targetPostId, authorId, content });
  return new Response(JSON.stringify(body));
};
