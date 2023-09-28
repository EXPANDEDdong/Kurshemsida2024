import { getPosts } from "@lib/posts";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
    const posts = await getPosts();
    return new Response (
        JSON.stringify(posts)
    )
}