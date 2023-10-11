import { createUser } from "~/server/users";
import type { APIRoute } from "astro";
import { generateToken, type JwtPayload } from "~/server/users";

function isValidUsername(username: string) {
  // Regular expression to match valid characters (alphanumeric and both uppercase & lowercase)
  // with a length between 5 and 36 characters.
  const regex = /^[A-Za-z0-9]{4,36}$/;

  return regex.test(username);
}

export const POST: APIRoute = async ({ params, request }) => {
  const body = await request.json();
  const username: string = body.username;
  const password = body.password;
  const isValid = isValidUsername(username);
  if (isValid) {
    const creation = await createUser({ username, password });
    if (creation.success) {
      const payload: JwtPayload = {
        sub: JSON.stringify(creation.user?.id),
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        iat: Math.floor(Date.now() / 1000),
        customData: {
          username: username,
        },
      };
      const token = generateToken(payload);

      return {
        status: 200,
        body: JSON.stringify(`${creation.message}`),
        headers: {
          'Set-Cookie': `authToken=${token}; Path=/; HttpOnly; Secure`
        },
      };
    } 
  } else {
    
  }

  return {
    status: 200,
    body: JSON.stringify("fuck"),
  };
};
