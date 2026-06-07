import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Allow Next internals, static assets and API routes to pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/public") ||
    pathname.startsWith("/api") ||
    pathname === "/join-acm"
  ) {
    return NextResponse.next();
  }

  const isAuthPage = pathname === "/signin" || pathname === "/signup" || pathname.startsWith("/signin") || pathname.startsWith("/signup");

  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-minimum-32-chars-long"
  );

  // If user is on an auth page, allow access — but redirect if already authenticated
  if (isAuthPage) {
    if (token) {
      try {
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL("/", request.url));
      } catch (e) {
        const response = NextResponse.next();
        response.cookies.delete("token");
        return response;
      }
    }
    return NextResponse.next();
  }

  // All other pages require a valid token
  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    // Protect admin routes for admin users only
    if (pathname.startsWith("/admin") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (e) {
    const response = NextResponse.redirect(new URL("/signin", request.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/:path*"],
};
