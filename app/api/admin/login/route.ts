import { NextResponse } from "next/server";
import { ADMIN_COOKIE, expectedToken } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/admin");
  const safeNext = next.startsWith("/admin") ? next : "/admin";

  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected || password !== expected) {
    return NextResponse.redirect(
      new URL(`/admin/login?error=1&next=${encodeURIComponent(safeNext)}`, request.url),
      { status: 303 }
    );
  }

  const token = await expectedToken();
  const res = NextResponse.redirect(new URL(safeNext, request.url), { status: 303 });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
