import { getUser, verifyToken } from "~/server/users";
import type { APIRoute } from "astro";
import { importJWK } from "jose";

export const GET: APIRoute = async ({ cookies }) => {
  if (cookies.has("authToken")) {
    const authToken = cookies.get("authToken")?.value || "";
    const secretKey = await importJWK({
      kty: "oct",
      k: import.meta.env.JWT_SECRET,
      alg: "HS256",
    });
    const { payload } = await verifyToken(authToken, secretKey);
    if (!payload) {
      return new Response(JSON.stringify("nope"), {
        status: 401,
      });
    }
    const username = payload.username;
    const { user } = await getUser(username);
    if (!user) {
      return new Response(JSON.stringify("no"), {
        status: 401,
      });
    }
    const body = {
      username: user.username,
      description: user.description,
    };
    return new Response(JSON.stringify(body), {
      status: 200,
    });
  }
  return new Response(JSON.stringify("not work"), {
    status: 200,
  });
};
