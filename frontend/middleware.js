import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("access_token")?.value;
  const pathname = request.nextUrl.pathname;

  // ⛔ allow public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // ⛔ protect user & admin routes
  if (!token && (pathname.startsWith("/user") || pathname.startsWith("/admin"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ OPTIONAL: role check (SAFE VERSION)
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    const role = payload?.role;

    if (role === "admin" && pathname.startsWith("/user")) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    if (role === "user" && pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/user/dashboard", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/admin/:path*"],
};
