import { createUser, generateToken, type JwtPayload } from "~/server/users";
import type { APIRoute } from "astro";

function isValidUsername(username: string) {
  // Regular expression to match valid characters (alphanumeric and both uppercase & lowercase)
  // with a length between 5 and 36 characters.
  const regex = /^[A-Za-z0-9]{4,36}$/;

  return regex.test(username);
}

export const POST: APIRoute = async ({ params, request }) => {
  const body = await request.json();
  const username = String(body.username);
  const password = body.password;
  const isValid = isValidUsername(username);
  if (!isValid) {
    return {
      status: 400,
      body: JSON.stringify({
        success: false,
        message:
          "Invalid username, the username should be 4 - 36 characters only containing letters and numbers.",
      }),
    };
  }

  const { user, message } = await createUser({ username, password });
  if (!user) {
    return {
      status: 409,
      body: JSON.stringify(message),
    };
  }
  const payload: JwtPayload = {
    sub: JSON.stringify(user?.id),
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    iat: Math.floor(Date.now() / 1000),
    customData: {
      username: username,
    },
  };
  const token = generateToken(payload);

  return {
    status: 200,
    body: JSON.stringify(message),
    headers: {
      'Set-Cookie': `authToken=${token}; Path=/; HttpOnly; Secure`,
    },
  };
};
