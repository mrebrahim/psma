import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidToken, ADMIN_COOKIE } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const c = await cookies();
  if (!(await isValidToken(c.get(ADMIN_COOKIE)?.value))) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const reason = String(body?.reason ?? "").trim();
  if (!reason) return new NextResponse("reason required", { status: 400 });

  const { error } = await supabaseAdmin()
    .from("jobs")
    .update({ status: "rejected", rejection_reason: reason, reviewed_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json({ ok: true });
}
