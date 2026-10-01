import { type NextRequest, NextResponse } from "next/server";
import { getRoleHome } from "@/lib/roles";
import type { UserRole } from "@/types/auth.type";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000/api/v1";

const PROTECTED: { prefix: string; role: UserRole }[] = [
  { prefix: "/admin", role: "ADMIN" },
  { prefix: "/staff", role: "STAFF" },
  { prefix: "/citizen", role: "CITIZEN" },
];

const AUTH_PAGES = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];

type Session = { role: UserRole | null; setCookies: string[] };
const NO_SESSION: Session = { role: null, setCookies: [] };

async function fetchRole(cookie: string): Promise<UserRole | null> {
  const res = await fetch(`${BACKEND_URL}/auth/me`, {
    headers: { cookie },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { data?: { role?: UserRole } };
  return json.data?.role ?? null;
}

/** Overlay freshly issued Set-Cookie values onto the request's Cookie header. */
function mergeCookies(original: string, setCookies: string[]) {
  const jar = new Map<string, string>();
  for (const part of original.split(/;\s*/).filter(Boolean)) {
    const i = part.indexOf("=");
    jar.set(part.slice(0, i), part.slice(i + 1));
  }
  for (const sc of setCookies) {
    const pair = sc.split(";")[0];
    const i = pair.indexOf("=");
    jar.set(pair.slice(0, i).trim(), pair.slice(i + 1));
  }
  return [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
}

async function getSession(request: NextRequest): Promise<Session> {
  const cookie = request.headers.get("cookie") ?? "";
  const hasAccess = cookie.includes("accessToken=");
  const hasRefresh = cookie.includes("refreshToken=");
  if (!hasAccess && !hasRefresh) return NO_SESSION;

  try {
    // The backend re-verifies the token AND checks blocked/deleted accounts.
    if (hasAccess) {
      const role = await fetchRole(cookie);
      if (role) return { role, setCookies: [] };
    }
    if (!hasRefresh) return NO_SESSION;

    // Access token missing/expired: try the refresh token once.
    const refresh = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { cookie, "content-type": "application/json" },
      body: "{}",
      cache: "no-store",
    });
    if (!refresh.ok) return NO_SESSION;

    const setCookies = refresh.headers.getSetCookie();
    const role = await fetchRole(mergeCookies(cookie, setCookies));
    return role ? { role, setCookies } : NO_SESSION;
  } catch {
    return NO_SESSION;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { role, setCookies } = await getSession(request);

  // Forward rotated cookies to the browser on whatever response we return.
  const finish = (res: NextResponse) => {
    for (const c of setCookies) res.headers.append("set-cookie", c);
    return res;
  };

  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));
  if (isAuthPage) {
    return finish(
      role
        ? NextResponse.redirect(new URL(getRoleHome(role), request.url))
        : NextResponse.next(),
    );
  }

  const rule = PROTECTED.find((r) => pathname.startsWith(r.prefix));
  if (!rule) return NextResponse.next();

  if (!role) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  if (role !== rule.role) {
    return finish(
      NextResponse.redirect(new URL(getRoleHome(role), request.url)),
    );
  }

  return finish(NextResponse.next());
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/staff/:path*",
    "/citizen/:path*",
    "/login",
    "/register",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
  ],
};
