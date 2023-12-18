import type { APIRoute } from "astro";
import { importJWK } from "jose";
import {
  updateUser,
  verifyToken,
  type JwtPayload,
  generateToken,
} from "~/server/users";

function isValidUsername(username: string): boolean {
  if (username === "") return true;
  const regex = /^[A-Za-z0-9]{4,36}$/;
  return regex.test(username);
}

export const PATCH: APIRoute = async ({ cookies, request }) => {
  const authToken = cookies.get("authToken")?.value;
  if (!authToken) {
    return new Response(JSON.stringify("Authentication required"), {
      status: 401,
    });
  }

  const secretKey = await importJWK({
    kty: "oct",
    k: import.meta.env.JWT_SECRET,
    alg: "HS256",
  });

  const { payload } = await verifyToken(authToken, secretKey);
  if (!payload || !payload.sub) {
    return new Response(JSON.stringify("Invalid or expired token"), {
      status: 403,
    });
  }

  const body = await request.json();

  // Validate input
  if (!body || typeof body !== "object") {
    return new Response(JSON.stringify("Invalid request body"), {
      status: 400,
    });
  }

  const { username, description } = body;

  if (!isValidUsername(username)) {
    return new Response(JSON.stringify("Invalid username"), { status: 400 });
  }

  if (
    description &&
    (typeof description !== "string" || description.length > 500)
  ) {
    return new Response(JSON.stringify("Invalid description"), { status: 400 });
  }

  // Sanitize description
  const sanitizedDescription = description
    ? description.replace(/<[^>]*>?/gm, "")
    : null;

  const userId = payload.sub.replace(/['"]+/g, "");
  const updatedUsername = await updateUser(
    userId,
    username,
    sanitizedDescription
  );
  if (!updatedUsername) {
    return new Response(JSON.stringify("Error updating user"), { status: 409 });
  }

  const newPayload: JwtPayload = {
    sub: JSON.stringify(userId),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    iat: Math.floor(Date.now() / 1000),
    customData: {
      username: updatedUsername,
    },
  };

  const token = await generateToken(newPayload, secretKey);
  cookies.set("authToken", token, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return new Response(JSON.stringify(body), { status: 200 });
};
