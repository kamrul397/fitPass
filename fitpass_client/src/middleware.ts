import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    const isAuthPage = pathname === "/login" || pathname === "/register";
    const isProtectedPage = pathname.startsWith("/dashboard");

    // 1. If user is logged in and tries to access /login or /register -> redirect to /dashboard
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 2. If user is NOT logged in and tries to access protected pages -> redirect to /login
    if (!token && isProtectedPage) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/register", "/dashboard/:path*"],
};
