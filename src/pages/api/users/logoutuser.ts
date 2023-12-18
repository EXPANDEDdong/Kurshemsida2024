import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.set("authToken", "logged out", {
    httpOnly: true,
    secure: true,
    maxAge: 0,
    path: "/",
  });
  return redirect("/login");
};
