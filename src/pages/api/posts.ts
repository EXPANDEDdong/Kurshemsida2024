import { createUser } from "@lib/posts";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ params, request }) => {
  const body = await request.json();
  const name = body.name;
  const asd = await createUser({ name });
  console.log(asd);
  return {
    status: 200,
    body: JSON.stringify(body),
  };
};
