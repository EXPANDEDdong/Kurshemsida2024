import { getUser, verifyToken, type PostsData } from "~/server/users";
import type { APIRoute } from "astro";
import { importJWK, type JWTPayload } from "jose";
import type { PostsOnFeed } from "~/server/posts";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const username = body.username;
  const { user } = await getUser(username);
  const userBody = {
    username: user?.username,
    description: user?.description,
    role: user?.permissions.role,
    posts: user?.posts,
    comments: user?.comments,
  };
  return new Response(JSON.stringify(userBody), {
    status: 200,
  });
};
