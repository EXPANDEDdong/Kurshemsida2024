import { defineMiddleware } from "astro:middleware";
import { importJWK } from "jose";
import { verifyToken } from "~/server/users";

const publicRoutes = new Set(["/", "/api/loginuser", "/api/createuser", "/login", "/create", "/api/feed", "/api/getuser", "/api/singlePost", "/api/page", "/api/loggedinuser", "/api/deletepost"]);

export const onRequest = defineMiddleware(async (context, next) => {
    if (publicRoutes.has(context.url.pathname)) {
        return next();
    }

    const authToken = context.cookies.get("authToken")?.value;
    if (!authToken) {
        return context.redirect("/login");
    }

    const secretKey = await importJWK({
        kty: "oct",
        k: import.meta.env.JWT_SECRET,
        alg: "HS256",
    });

    const { status, message } = await verifyToken(authToken, secretKey);
    if (status === "authorized") {
        return next();
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

    return context.redirect("/login");
});