import { defineMiddleware } from "astro:middleware";
import { importJWK } from "jose";
import { getSecret } from "~/server/misc";
import { isAdmin, verifyToken } from "~/server/users";

const publicRoutes = new Set(["/", "/login", "/create", "/404"]);

const adminRoutes = new Set(["/admin", "/admin/users", "/admin/manage"]);

export const onRequest = defineMiddleware(async (context, next) => {
  if (
    publicRoutes.has(context.url.pathname) ||
    context.url.pathname.startsWith("/api/")
  ) {
    return next();
  }

  const authToken = context.cookies.get("authToken")?.value;
  if (!authToken) {
    return context.redirect("/login");
  }

  const secretKey = await getSecret();

  const { status, payload, message } = await verifyToken(authToken, secretKey);

  if (adminRoutes.has(context.url.pathname)) {
    const hasAuthority = await isAdmin(payload?.sub);
    if (hasAuthority) {
      return next();
    }
    return new Response(JSON.stringify("Not authorized"), { status: 403 });
  }

  if (status === "authorized") {
    return next();
  }

  context.cookies.set("authToken", "invalid", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  if (context.url.pathname.startsWith("/api/")) {
    return new Response(JSON.stringify({ error: message }), { status: 401 });
  }

  return context.redirect("/login");
});
