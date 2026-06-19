import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidToken, ADMIN_COOKIE } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const c = await cookies();
  if (!(await isValidToken(c.get(ADMIN_COOKIE)?.value))) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { id } = await params;

  const { data: app } = await supabaseAdmin
    .from("applications")
    .select("cv_url")
    .eq("id", id)
    .single();

  if (!app?.cv_url) return new NextResponse("Not found", { status: 404 });

  const { data: signed, error } = await supabaseAdmin.storage
    .from("cvs")
    .createSignedUrl(app.cv_url, 300);

  if (error || !signed) return new NextResponse("Failed", { status: 500 });
  return NextResponse.redirect(signed.signedUrl);
}
