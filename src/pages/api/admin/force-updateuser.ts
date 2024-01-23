import type { APIRoute } from "astro";
import { getSecret } from "~/server/misc";
import { isAdmin, updateUser, verifyToken } from "~/server/users";

function isValidUsername(username: string): boolean {
  if (username === "") return true;
  const regex = /^[A-Za-z0-9]{4,36}$/;
  return regex.test(username);
}

export const PATCH: APIRoute = async ({ request, cookies }) => {
  const body = await request.json();
  const id = String(body.id);
  const username = String(body.username);
  const description = String(body.description);

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

  if (!body || typeof body !== "object") {
    return new Response(JSON.stringify("Invalid request body."), {
      status: 400,
    });
  }

  if (!isValidUsername(username)) {
    return new Response(JSON.stringify("Invalid username."), { status: 400 });
  }

  if (
    description &&
    (typeof description !== "string" || description.length > 500)
  ) {
    return new Response(JSON.stringify("Invalid description."), {
      status: 400,
    });
  }

  // Sanitize description
  const sanitizedDescription = description.replace(/<[^>]*>?/gm, "");

  const updatedUsername = await updateUser(id, username, sanitizedDescription);
  if (!updatedUsername) {
    return new Response(JSON.stringify("Error updating user."), {
      status: 409,
    });
  }

  return new Response(JSON.stringify(body), { status: 200 });
};
