import type { APIRoute } from "astro";
import { searchPosts, searchUsersAdmin } from "~/server/misc";

export const POST: APIRoute = async ({ request }) => {
  const { query, type }: { query: string; type: "Posts" | "Users" } =
    await request.json();
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);
  const page = parseInt(params.page);
  const limit = 10;
  const offset = page * limit;
  if (type === "Posts") {
    const results = await searchPosts(query, limit, offset);
    return new Response(JSON.stringify(results), { status: 200 });
  }
  const results = await searchUsersAdmin(query, limit, offset);

  return new Response(JSON.stringify(results), { status: 200 });
};
