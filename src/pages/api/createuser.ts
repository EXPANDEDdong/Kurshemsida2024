import { createUser, generateToken, verifyToken, type JwtPayload } from "~/server/users";
import type { APIRoute } from "astro";

function isValidUsername(username: string) {
  // Regular expression to match valid characters (alphanumeric and both uppercase & lowercase)
  // with a length between 5 and 36 characters.
  const regex = /^[A-Za-z0-9]{4,36}$/;

  return regex.test(username);
}

export const POST: APIRoute = async ({ cookies, request }) => {
  const body = await request.json();
  const email = String(body.email);
  const username = String(body.username);
  const password = body.password;
  const isValid = isValidUsername(username);
  if (!isValid) {
    return new Response(JSON.stringify({
      success: false,
      message:
        "Invalid username, the username should be 4 - 36 characters only containing letters and numbers.",
    }), {
      status: 400,
      
    });
  }

  const { user, message } = await createUser({ email, username, password });
  if (!user) {
    return new Response (JSON.stringify(message), {
      status: 409,
      
    });
  }

  const payload: JwtPayload = {
    sub: JSON.stringify(user?.id),
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    iat: Math.floor(Date.now() / 1000),
    customData: {
      username: username,
    },
  };
  const token = await generateToken(payload);
  cookies.set("authToken", token, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return new Response(JSON.stringify(message), {
    status: 200, 
    });
};

