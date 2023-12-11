import { defineMiddleware } from "astro:middleware";
import { importJWK } from "jose";
import { isAdmin, verifyToken } from "~/server/users";

const publicRoutes = new Set([
  "/",
  "/api/loginuser",
  "/api/createuser",
  "/login",
  "/create",
  "/api/feed",
  "/api/getuser",
  "/api/singlePost",
  "/api/page",
  "/api/loggedinuser",
  "/404",
]);

const adminRoutes = new Set(["/admin", "/admin/users", "/admin/posts"]);

export const onRequest = defineMiddleware(async (context, next) => {
  if (publicRoutes.has(context.url.pathname)) {
    return next();
  }

  const authToken = context.cookies.get("authToken")?.value;
  if (!authToken) {
    return context.redirect("/404");
  }

  const secretKey = await importJWK({
    kty: "oct",
    k: import.meta.env.JWT_SECRET,
    alg: "HS256",
  });

  const { status, payload, message } = await verifyToken(authToken, secretKey);

  if (status === "authorized") {
    return next();
  }

  if (adminRoutes.has(context.url.pathname)) {
    const hasAuthority = await isAdmin(payload?.sub?.replace(/['"]+/g, ""));
    if (hasAuthority) {
      return next();
    }
    return new Response(JSON.stringify("Not authorized"), { status: 401 });
  }

  context.cookies.set("authToken", "invalid", {
    httpOnly: true,
    secure: true,
    maxAge: 0,
    path: "/",
  });

  if (context.url.pathname.startsWith("/api/")) {
    return new Response(JSON.stringify({ error: message }), { status: 401 });
  }

  return context.redirect("/404");
});
