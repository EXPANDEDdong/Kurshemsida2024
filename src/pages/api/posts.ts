import { createPost, createUser } from "@lib/posts";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ params, request }) => {
  const body = await request.json();
  const title = body.title;
  const content = body.content;
  await createPost({ title, content });
  
  return {
    status: 200,
    body: JSON.stringify("hello"),
  };
};
