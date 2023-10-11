import { loginUser, type JwtPayload, generateToken } from "~/server/users";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ params, request }) => {
  const body = await request.json();
  const username = body.username;
  const password = body.password;
  
  const ifLogged = await loginUser({ username, password });
  if (ifLogged.message == "User not found" ) {
  return {
    status: 401,
    body: JSON.stringify("Invalid Username")
  }
  } else if (ifLogged.message == "Invalid password") {
    return {
      status: 401,
      body: JSON.stringify("Invalid Password")
    }
  } else {
    const payload: JwtPayload = {
      sub: JSON.stringify(ifLogged.user?.id),
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      iat: Math.floor(Date.now() / 1000),
      customData: {
        username: username
      }
    };
    const token = generateToken(payload);
    return {
      status: 200,
      body: JSON.stringify("Login Successful"),
      headers: {
        'Set-Cookie': `authToken=${token}; Path=/; HttpOnly; Secure`
      }
    }
  }

};
