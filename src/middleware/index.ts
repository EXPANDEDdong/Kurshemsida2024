import { defineMiddleware } from "astro:middleware";
import { importJWK, type JWTPayload } from "jose";
import { verifyToken } from "~/server/users";

const publicRoutes = ["/", "/api/loginuser", "/api/createuser", "/login", "/create", "/api/feed", "/api/getuser", "/api/singlePost"];

export const onRequest = defineMiddleware(async (context, next) => {
    if (publicRoutes.includes(context.url.pathname)) {
        return next();
    }
    if (context.cookies.has("authToken")) {
    const authToken = context.cookies.get("authToken")?.value || "";
    const secretKey = await importJWK({
        kty: "oct",
        k: import.meta.env.JWT_SECRET, 
        alg: "HS256",
      });
    const { status, message } = await verifyToken(authToken, secretKey);

    switch (status) {
        case "authorized":
            return next();

        case "error":
            context.cookies.set("authToken", "invalid", {
                httpOnly: true,
                secure: true,
                maxAge: 0,
                path: "/",
            })
            if (context.url.pathname.startsWith("/api/")) {
                return new Response(JSON.stringify(message), {
                    status: 401,
                })
            }
            return context.redirect("/login");

        default:
            return context.redirect("/login");
    }
 
    }
    
    return context.redirect(`/login`);
})
    
