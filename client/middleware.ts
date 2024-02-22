import { NextAuthMiddlewareOptions, NextMiddlewareWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";


const guestOnlyRoutes: string[] = ["/", "auth/sign-in", "auth/sign-up", "auth/forgot-password", "auth/reset-password"]
const protectedRoutes: string[] = ["/app", "/app/:path*"]

const handler: NextMiddlewareWithAuth = (request) => {
    const { token } = request.nextauth;
    const { pathname } = request.nextUrl;
    const isGuestOnly = guestOnlyRoutes.includes(pathname);
    const isProtected = protectedRoutes.includes(pathname);

    console.log("%c[Middleware]", "color: #ff0000", { "Pathname": pathname, "Guest Only Route": isGuestOnly, "Protected Route": isProtected, "Token": token });

    console.log("%c[Middleware]", "color: #ff0000", "Executing Middleware...");

    if (isGuestOnly && token) {
        console.log("%c[Middleware]", "color: #ff0000", "Redirecting to /app");
        return NextResponse.redirect("/app");
    }

    if (isProtected && !token) {
        console.log("%c[Middleware]", "color: #ff0000", "Redirecting to /auth/sign-in");
        return NextResponse.redirect("/auth/sign-in");
    }

    console.log("%c[Middleware]", "color: #ff0000", "Middleware Passed.");

    return NextResponse.next();
}

const options: NextAuthMiddlewareOptions = {
    pages: {
        signIn: "/auth/sign-in",
        signOut: "/auth/sign-out",
        error: "/auth/error",
    }
}

export default withAuth(handler, options);


export const config = {
    matcher: [
        "/app",
        "/app/:path*"
    ]
}