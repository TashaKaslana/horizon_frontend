import {NextResponse, type NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

const supportedLocales = ['en', 'vn'];
const defaultLocale = 'en';

export async function middleware(request: NextRequest) {
    const authRes = await auth0.middleware(request)

    const localeCookie = request.cookies.get('locale')?.value;

    if (!localeCookie || !supportedLocales.includes(localeCookie)) {
        const acceptLang = request.headers.get('accept-language');
        const detectedLocale = acceptLang?.split(',')[0]?.split('-')[0] || defaultLocale;

        const locale = supportedLocales.includes(detectedLocale) ? detectedLocale : defaultLocale;

        // Set cookie in response
        authRes.cookies.set('locale', locale);
    }

    if (request.nextUrl.pathname.startsWith("/auth")) {
        return authRes
    }

    const session = await auth0.getSession(request)

    if (!session) {
        return NextResponse.redirect(new URL("/auth/login", request.nextUrl.origin))
    }

    await auth0.updateSession(request, authRes, {
        ...session,
        user: {
            ...session.user,
            updatedAt: Date.now(),
        },
    })

    return authRes
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