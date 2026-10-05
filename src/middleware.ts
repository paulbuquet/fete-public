import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/enter", "/api", "/_next", "/favicon.ico"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PUBLIC_PATHS.some((path) => pathname.startsWith(path)) ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const hasAccess = request.cookies.get("access_granted")?.value === "true";

  if (!hasAccess) {
    const enterUrl = new URL("/enter", request.url);
    return NextResponse.redirect(enterUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};