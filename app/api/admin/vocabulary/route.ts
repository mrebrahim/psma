import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidToken, ADMIN_COOKIE } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function ensureAdmin() {
  const c = await cookies();
  return isValidToken(c.get(ADMIN_COOKIE)?.value);
}

type Body =
  | { action: "create_tag"; name: string; category_id: number | null }
  | { action: "approve_tag"; id: number }
  | { action: "update_tag"; id: number; name?: string; category_id?: number | null; is_active?: boolean }
  | { action: "delete_tag"; id: number }
  | { action: "create_synonym"; tag_id: number; synonym: string }
  | { action: "delete_synonym"; id: number }
  | { action: "create_skill"; name: string }
  | { action: "delete_skill"; id: number }
  | { action: "update_weights"; weights: Record<string, number> };

export async function POST(req: Request) {
  if (!(await ensureAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  let body: Body;
  try { body = await req.json(); } catch { return new NextResponse("invalid json", { status: 400 }); }
  const db = supabaseAdmin();

  switch (body.action) {
    case "create_tag": {
      if (!body.name?.trim()) return new NextResponse("name required", { status: 400 });
      const { data, error } = await db.from("tags").insert({
        name_canonical: body.name.trim(),
        category_id: body.category_id,
        status: "approved",
      }).select("id").single();
      if (error) return new NextResponse(error.message, { status: 500 });
      return NextResponse.json({ ok: true, id: data?.id });
    }
    case "approve_tag": {
      const { error } = await db.from("tags").update({ status: "approved" }).eq("id", body.id);
      if (error) return new NextResponse(error.message, { status: 500 });
      return NextResponse.json({ ok: true });
    }
    case "update_tag": {
      const u: Record<string, unknown> = {};
      if (body.name !== undefined) u.name_canonical = body.name.trim();
      if (body.category_id !== undefined) u.category_id = body.category_id;
      if (body.is_active !== undefined) u.is_active = body.is_active;
      if (Object.keys(u).length === 0) return new NextResponse("no changes", { status: 400 });
      const { error } = await db.from("tags").update(u).eq("id", body.id);
      if (error) return new NextResponse(error.message, { status: 500 });
      return NextResponse.json({ ok: true });
    }
    case "delete_tag": {
      const { error } = await db.from("tags").delete().eq("id", body.id);
      if (error) return new NextResponse(error.message, { status: 500 });
      return NextResponse.json({ ok: true });
    }
    case "create_synonym": {
      if (!body.synonym?.trim()) return new NextResponse("synonym required", { status: 400 });
      const { error } = await db.from("tag_synonyms").insert({
        tag_id: body.tag_id,
        synonym: body.synonym.trim(),
      });
      if (error) return new NextResponse(error.message, { status: 500 });
      return NextResponse.json({ ok: true });
    }
    case "delete_synonym": {
      const { error } = await db.from("tag_synonyms").delete().eq("id", body.id);
      if (error) return new NextResponse(error.message, { status: 500 });
      return NextResponse.json({ ok: true });
    }
    case "create_skill": {
      if (!body.name?.trim()) return new NextResponse("name required", { status: 400 });
      const { error } = await db.from("skills").insert({
        name_canonical: body.name.trim(),
        status: "approved",
      });
      if (error) return new NextResponse(error.message, { status: 500 });
      return NextResponse.json({ ok: true });
    }
    case "delete_skill": {
      const { error } = await db.from("skills").delete().eq("id", body.id);
      if (error) return new NextResponse(error.message, { status: 500 });
      return NextResponse.json({ ok: true });
    }
    case "update_weights": {
      const w = body.weights;
      const allowed = ["tag_match_max","category_match","skills_match_max","experience_relevance_max","city_match","years_experience_in_range","notify_threshold"];
      const u: Record<string, number> = {};
      for (const k of allowed) {
        if (typeof w[k] === "number") u[k] = Math.max(0, Math.min(100, Math.floor(w[k])));
      }
      if (Object.keys(u).length === 0) return new NextResponse("no changes", { status: 400 });
      const { error } = await db.from("match_weights").update(u).eq("id", 1);
      if (error) return new NextResponse(error.message, { status: 500 });
      return NextResponse.json({ ok: true });
    }
    default:
      return new NextResponse("unknown action", { status: 400 });
  }
}
