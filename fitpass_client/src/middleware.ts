import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Next.js Edge Middleware cannot read cross-origin/cross-port cookies set by the external backend (port 5000).
    // Route protection is handled client-side via useAuthUser & backend profile verification.
    return NextResponse.next();
}

export const config = {
    matcher: [],
};


