import { getUser, verifyToken } from "~/server/users";
import type { APIRoute } from "astro";
import { importJWK } from "jose";

export const GET: APIRoute = async ({ cookies }) => {
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

  const { user } = await getUser(payload.username);
  if (!user) return new Response(JSON.stringify("no"), { status: 401 });

  const body = { username: user.username, description: user.description };
  console.log(body)
  return new Response(JSON.stringify(payload.username));
};
