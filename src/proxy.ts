import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DASHBOARD_SESSION_COOKIE, verifySessionToken } from "@/lib/dashboard-auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/dashboard/login") {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(DASHBOARD_SESSION_COOKIE)?.value;

  if (!verifySessionToken(sessionToken)) {
    const loginUrl = new URL("/dashboard/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
