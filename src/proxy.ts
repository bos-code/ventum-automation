import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEFAULT_ADMIN_HOST = "admin.ventumautomation.com";

function getHostname(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host") ?? "";
  return host.split(":")[0].toLowerCase();
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = getHostname(request);
  const adminHost = (process.env.ADMIN_HOST ?? DEFAULT_ADMIN_HOST).toLowerCase();
  const isProduction = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";

  if (!isProduction) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") && hostname !== adminHost) {
    return new NextResponse(null, {
      status: 404,
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  if (hostname === adminHost && pathname === "/") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};
