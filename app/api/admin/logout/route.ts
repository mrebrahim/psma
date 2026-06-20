import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";

export async function POST() {
  const res = new NextResponse(null, {
    status: 303,
    headers: { Location: "/admin/login" },
  });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
