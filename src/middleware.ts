import {NextResponse, type NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
    // Let auth0 process the request first
    const authRes = await auth0.middleware(request);

    // If Auth0 middleware already responded (redirect, etc.), honor it
    if (authRes) {
        return authRes;
    }

    const pathname = request.nextUrl.pathname;

    // Skip auth check for login-related routes
    if (pathname.startsWith("/auth")) {
        return NextResponse.next();
    }

    let session;
    try {
        session = await auth0.getSession(request);
    } catch (err) {
        console.error("Error getting session:", err);
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (!session) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    try {
        await auth0.getAccessToken(request, authRes)
    } catch (err) {
        console.error("Error getting access token:", err);
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};