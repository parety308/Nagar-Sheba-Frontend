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

async function getRole(request: NextRequest): Promise<UserRole | null> {
  const cookie = request.headers.get("cookie");
  if (!cookie?.includes("accessToken")) return null;

  try {
    // The backend re-verifies the token AND checks blocked/deleted accounts.
    const res = await fetch(`${BACKEND_URL}/auth/me`, {
      headers: { cookie },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { role?: UserRole } };
    return json.data?.role ?? null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = await getRole(request);

  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));
  if (isAuthPage) {
    return role
      ? NextResponse.redirect(new URL(getRoleHome(role), request.url))
      : NextResponse.next();
  }

  const rule = PROTECTED.find((r) => pathname.startsWith(r.prefix));
  if (!rule) return NextResponse.next();

  if (!role) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  if (role !== rule.role) {
    return NextResponse.redirect(new URL(getRoleHome(role), request.url));
  }

  return NextResponse.next();
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
