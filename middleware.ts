import { NextRequest, NextResponse } from "next/server";

const AUTH_TOKEN_KEY = "coworking_access_token";
const AUTH_ROLE_KEY = "coworking_role";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;
  const role = request.cookies.get(AUTH_ROLE_KEY)?.value;

  const isMemberRoute = pathname.startsWith("/member");
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isMemberRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  if (!token || !role) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isMemberRoute && role !== "member") {
    const redirectUrl = new URL(
      role === "admin_space" ? "/admin/dashboard" : "/login",
      request.url
    );
    return NextResponse.redirect(redirectUrl);
  }

  if (isAdminRoute && role !== "admin_space") {
    const redirectUrl = new URL(
      role === "member" ? "/member/dashboard" : "/login",
      request.url
    );
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/member/:path*", "/admin/:path*"],
};