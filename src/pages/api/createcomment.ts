import type { APIRoute } from "astro";
import { importJWK } from "jose";
import { createComment } from "~/server/posts";
import { verifyToken } from "~/server/users";

export const POST: APIRoute = async ({ request, cookies }) => {
    const body = await request.json();
    const content = body.content;
    const targetPostId = String(body.targetId)
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
            await createComment({ targetPostId, authorId, content })
          }
    }
    return new Response(JSON.stringify(body))

}
