import { getPosts } from "~/server/posts";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);
  const page = parseInt(params.page);
  const limit = 10;
  const offset = page * limit;
  const posts = await getPosts(limit, offset);
  return new Response(JSON.stringify(posts));
};
