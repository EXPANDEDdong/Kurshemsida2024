import { getPosts, getSinglePost } from "~/server/posts";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, redirect }) => {
    const body = await request.json();
    const postId = String(body.id);
    if (!postId) {
        return redirect("/404");
    }
    const post = await getSinglePost(postId);
    return new Response (
        JSON.stringify(post)
    )
}