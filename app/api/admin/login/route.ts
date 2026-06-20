import { NextResponse } from "next/server";
import { ADMIN_COOKIE, expectedToken } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/admin");
  const safeNext = next.startsWith("/admin") ? next : "/admin";

  const expectedEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";

  const ok =
    expectedEmail &&
    expectedPassword &&
    email === expectedEmail &&
    password === expectedPassword;

  if (!ok) {
    return new NextResponse(null, {
      status: 303,
      headers: {
        Location: `/admin/login?error=1&next=${encodeURIComponent(safeNext)}`,
      },
    });
  }

  const token = await expectedToken();
  const res = new NextResponse(null, {
    status: 303,
    headers: { Location: safeNext },
  });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
