import { selectPost } from "@lib/posts";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
    const body = await selectPost();
    return new Response (
        JSON.stringify({
            title: body.title,
            content: body.content,
        })
    )
}