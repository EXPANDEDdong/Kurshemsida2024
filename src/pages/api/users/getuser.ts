import { getUser } from "~/server/users";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, redirect }) => {
  const body = await request.json();
  const username = body.username;
  const { user } = await getUser(username);
  if (!user) {
    return redirect("/404");
  }
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
