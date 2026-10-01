import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

// Runs in the Node.js runtime (not Edge) so the `jose` JWT verification
// dependency behaves identically to the rest of the server-side code.
export const runtime = "nodejs";

/**
 * First line of defence for /admin/*: bounce unauthenticated requests to the
 * login page before any admin page renders. Every admin page and API route
 * ALSO re-checks the session itself (see lib/auth.ts) — this middleware is
 * not the only gate.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const ok = await verifySession(token);
  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
