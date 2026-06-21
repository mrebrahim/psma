import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidToken, ADMIN_COOKIE } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const c = await cookies();
  if (!(await isValidToken(c.get(ADMIN_COOKIE)?.value))) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { id } = await params;
  const { error } = await supabaseAdmin()
    .from("jobs")
    .update({ status: "published", rejection_reason: null, reviewed_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json({ ok: true });
}
