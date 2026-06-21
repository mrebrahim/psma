"use client";

import { useEffect, useState } from "react";
import { supabase, type Company } from "@/lib/supabase";

const MAX_LOGO_KB = 200;
const ALLOWED_LOGO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

export default function CompanyProfilePage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const { data } = await supabase
        .from("companies").select("*").eq("auth_user_id", session.user.id).maybeSingle();
      setCompany(data as Company);
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!company) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    const fd = new FormData(e.currentTarget);

    let logo_url = company.logo_url;
    if (logoFile) {
      if (logoFile.size > MAX_LOGO_KB * 1024) {
        setError(`حجم اللوجو لازم يكون أقل من ${MAX_LOGO_KB} كيلوبايت.`);
        setSaving(false);
        return;
      }
      if (!ALLOWED_LOGO_TYPES.includes(logoFile.type)) {
        setError("نوع الملف غير مدعوم.");
        setSaving(false);
        return;
      }
      const ext = logoFile.name.split(".").pop()?.toLowerCase() ?? "png";
      const path = `${company.auth_user_id}/logo-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("logos").upload(path, logoFile, { contentType: logoFile.type, upsert: true });
      if (upErr) {
        setError("فشل رفع اللوجو: " + upErr.message);
        setSaving(false);
        return;
      }
      logo_url = supabase.storage.from("logos").getPublicUrl(path).data.publicUrl;
    }

    const updates = {
      name: String(fd.get("name") ?? "").trim(),
      representative: String(fd.get("representative") ?? "").trim() || null,
      phone: String(fd.get("phone") ?? "").trim() || null,
      sector: String(fd.get("sector") ?? "").trim() || null,
      website: String(fd.get("website") ?? "").trim() || null,
      description: String(fd.get("description") ?? "").trim() || null,
      address: String(fd.get("address") ?? "").trim() || null,
      logo_url,
    };
    const { error: updErr } = await supabase
      .from("companies").update(updates).eq("id", company.id);
    setSaving(false);
    if (updErr) {
      setError("فشل الحفظ: " + updErr.message);
      return;
    }
    setSuccess(true);
    setCompany({ ...company, ...updates });
    setLogoFile(null);
  }

  if (!company) {
    return <div className="text-[var(--color-muted)]">جارٍ التحميل...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-extrabold text-[var(--color-primary)] mb-4">بيانات الشركة</h1>
      <p className="text-sm text-[var(--color-muted)] mb-6">
        البيانات دي بتستخدم تلقائيًا عند نشر أي وظيفة جديدة.
      </p>

      <form onSubmit={handleSubmit} className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 flex items-center gap-4">
            {company.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logo_url} alt={company.name} className="w-20 h-20 rounded-xl object-cover bg-[var(--color-cream)] shrink-0" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-[var(--color-cream)] text-[var(--color-primary)] flex items-center justify-center font-extrabold text-3xl shrink-0">
                {company.name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <label className="label">لوجو الشركة (حد أقصى {MAX_LOGO_KB}KB)</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                className="input file:ml-3 file:rounded-full file:border-0 file:bg-[var(--color-cream)] file:text-[var(--color-primary)] file:font-bold file:py-1 file:px-3"
              />
              {logoFile && (
                <div className="text-xs text-[var(--color-muted)] mt-1 truncate">
                  جاهز للرفع: {logoFile.name} — {(logoFile.size / 1024).toFixed(0)}KB
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="label">اسم الشركة *</label>
            <input name="name" required defaultValue={company.name} className="input" />
          </div>
          <div>
            <label className="label">اسم الممثل</label>
            <input name="representative" defaultValue={company.representative ?? ""} className="input" />
          </div>
          <div>
            <label className="label">القطاع</label>
            <input name="sector" defaultValue={company.sector ?? ""} className="input" />
          </div>
          <div>
            <label className="label">رقم الموبايل</label>
            <input name="phone" dir="ltr" defaultValue={company.phone ?? ""} className="input" />
          </div>
          <div>
            <label className="label">الموقع الإلكتروني</label>
            <input name="website" dir="ltr" defaultValue={company.website ?? ""} className="input" />
          </div>
          <div className="md:col-span-2">
            <label className="label">عنوان الشركة</label>
            <input name="address" defaultValue={company.address ?? ""} className="input" placeholder="مثال: مدينة نصر، القاهرة" />
          </div>
          <div className="md:col-span-2">
            <label className="label">نبذة عن الشركة</label>
            <textarea name="description" defaultValue={company.description ?? ""} className="textarea" />
          </div>
        </div>

        {error && <div className="mt-3 text-sm text-[var(--color-accent)] font-bold">{error}</div>}
        {success && <div className="mt-3 text-sm text-[var(--color-primary)] font-bold">تم الحفظ ✓</div>}

        <button type="submit" disabled={saving} className="btn-primary mt-5 disabled:opacity-60">
          {saving ? "جارٍ الحفظ..." : "حفظ التعديلات"}
        </button>
      </form>
    </div>
  );
}
