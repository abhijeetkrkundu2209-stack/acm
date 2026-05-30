import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isAuthPage = pathname.startsWith("/signin") || pathname.startsWith("/signup");
  const isAdminPage = pathname.startsWith("/admin");

  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-minimum-32-chars-long"
  );

  if (isAuthPage) {
    if (token) {
      try {
        await jwtVerify(token, secret);
        // Token is valid, redirect away from signin/signup to home
        return NextResponse.redirect(new URL("/", request.url));
      } catch (e) {
        // Token invalid, clear cookie and proceed
        const response = NextResponse.next();
        response.cookies.delete("token");
        return response;
      }
    }
  }

  if (isAdminPage) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      if (payload.role !== "admin") {
        // Logged in but not an admin, redirect to home page
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (e) {
      // Token invalid/expired, clear cookie and redirect to signin
      const response = NextResponse.redirect(new URL("/signin", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/signin", "/signup", "/admin/:path*"],
};
