import { getUser, verifyToken, type PostsData } from "~/server/users";
import type { APIRoute } from "astro";
import { importJWK, type JWTPayload } from "jose";
import type { PostsOnFeed } from "~/server/posts";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const username = body.username;
  const { user } = await getUser(username);
  const name = user?.username;
  const description = user?.description;
  const posts = user?.posts;
  const comments = user?.comments;
  const userBody = {
    username: name,
    description: description,
    posts: posts,
    comments: comments,
  };
  return new Response(JSON.stringify(userBody), {
    status: 200,
  });
};
