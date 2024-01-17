import type { APIRoute } from "astro";
import { importJWK } from "jose";
import { getSecret } from "~/server/misc";
import { deleteUser, isUserValid, verifyToken } from "~/server/users";

export const DELETE: APIRoute = async ({ request, cookies }) => {
  const body = await request.json();
  const email = String(body.email);
  const password = String(body.password);

  const authToken = cookies.get("authToken")?.value;
  if (!authToken)
    return new Response(JSON.stringify("Not logged in."), { status: 401 });

  const secretKey = await getSecret();

  const { payload } = await verifyToken(authToken, secretKey);
  if (!payload) return new Response(JSON.stringify("Nope"), { status: 403 });

  const userId = String(payload.sub);

  const { isValid } = await isUserValid(userId, email, password);

  if (!isValid)
    return new Response(JSON.stringify("Not valid"), { status: 403 });

  await deleteUser(userId);

  cookies.set("authToken", "User deleted", {
    httpOnly: true,
    secure: true,
    maxAge: 0,
    path: "/",
  });

  return new Response(JSON.stringify("User deleted"), { status: 200 });
};
