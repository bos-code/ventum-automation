import { NextResponse, type NextRequest } from "next/server";

// Kept in sync with lib/appwrite/config.ts's SESSION_COOKIE. Duplicated
// (rather than imported) so this file stays a minimal, dependency-free
// optimistic check, per Next.js guidance for Proxy.
const SESSION_COOKIE = "ventum_admin_session";

/**
 * Optimistic admin gate: redirects to /admin/login if there is no session
 * cookie at all. This is a fast, cookie-presence-only check — it is not
 * the security boundary. The real check is `requireAdmin()` (validated
 * against Appwrite) in `app/admin/layout.tsx` and again in every admin
 * server action.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  if (!request.cookies.has(SESSION_COOKIE)) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
