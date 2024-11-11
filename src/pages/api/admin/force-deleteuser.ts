import type { APIRoute } from "astro";
import { getSecret } from "~/server/misc";
import { deleteUser, isAdmin, verifyToken } from "~/server/users";

export const DELETE: APIRoute = async ({ request, cookies }) => {
  const body = await request.json();
  const id = String(body.id);

  const authToken = cookies.get("authToken")?.value;
  if (!authToken)
    return new Response(JSON.stringify("Not logged in."), { status: 401 });

  const secretKey = await getSecret();

  const { payload } = await verifyToken(authToken, secretKey);
  if (!payload)
    return new Response(JSON.stringify("Invalid token."), { status: 401 });

  const currentId = payload.sub;

  if (!currentId)
    return new Response(JSON.stringify("Token error."), { status: 401 });

  const isAuthorized = await isAdmin(currentId);

  if (!isAuthorized)
    return new Response(JSON.stringify("Does not have required authority."), {
      status: 403,
    });

  const didDelete = await deleteUser(id);

  if (!didDelete)
    return new Response(JSON.stringify("Not deleted."), { status: 404 });

  return new Response(JSON.stringify(body), { status: 200 });
};
