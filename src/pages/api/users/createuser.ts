import { createUser, generateToken, type JwtPayload } from "~/server/users";
import type { APIRoute } from "astro";
import { importJWK } from "jose";
import { getSecret } from "~/server/misc";

function isValidUsername(username: string) {
  const regex = /^[A-Za-z0-9]{4,36}$/;
  return regex.test(username);
}

function isValidEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export const POST: APIRoute = async ({ cookies, request }) => {
  const body = await request.json();
  const email = String(body.email);
  const username = String(body.username);
  const password = body.password;

  if (!isValidUsername(username) || !isValidEmail(email)) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid username or email format.",
      }),
      { status: 400 }
    );
  }

  if (!password || password.length < 8) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Password too short.",
      }),
      { status: 400 }
    );
  }

  const { user, message } = await createUser({ email, username, password });
  if (!user) {
    return new Response(JSON.stringify({ success: false, message }), {
      status: 409,
    });
  }

  const payload: JwtPayload = {
    sub: user.id,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    iat: Math.floor(Date.now() / 1000),
    customData: { username: user.username },
  };

  const secretKey = await getSecret();

  const token = await generateToken(payload, secretKey);

  cookies.set("authToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return new Response(JSON.stringify({ success: true, message }), {
    status: 200,
  });
};
