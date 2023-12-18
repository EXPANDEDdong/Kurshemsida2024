import type { APIRoute } from "astro";
import { importJWK } from "jose";
import { deleteUser, isAdmin, verifyToken } from "~/server/users";

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json();
  const id = String(body.id);

  const authToken = cookies.get("authToken")?.value;
  if (!authToken)
    return new Response(JSON.stringify("Not autheticated"), { status: 401 });

  const secretKey = await importJWK({
    kty: "oct",
    k: import.meta.env.JWT_SECRET,
    alg: "HS256",
  });

  const { payload } = await verifyToken(authToken, secretKey);
  if (!payload)
    return new Response(JSON.stringify("Invalid token"), { status: 401 });

  const authorId = payload.sub?.replace(/['"]+/g, "");

  if (!authorId)
    return new Response(JSON.stringify("Token error"), { status: 401 });

  const isAuthorized = await isAdmin(authorId);

  if (!isAuthorized)
    return new Response(JSON.stringify("Does not have required authority"), {
      status: 403,
    });

  const didDelete = await deleteUser(id);

  if (!didDelete)
    return new Response(JSON.stringify("Not deleted"), { status: 404 });

  return new Response(JSON.stringify(body), { status: 200 });
};
