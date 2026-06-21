"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const MAX_LOGO_KB = 200;
const ALLOWED_LOGO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);

    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const name = String(fd.get("name") ?? "").trim();

    if (!email || !password || !name) {
      setError("اسم الشركة والإيميل وكلمة المرور مطلوبين.");
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("كلمة المرور لازم تكون 8 حروف على الأقل.");
      setLoading(false);
      return;
    }

    if (logoFile) {
      if (logoFile.size > MAX_LOGO_KB * 1024) {
        setError(`حجم اللوجو لازم يكون أقل من ${MAX_LOGO_KB} كيلوبايت.`);
        setLoading(false);
        return;
      }
      if (!ALLOWED_LOGO_TYPES.includes(logoFile.type)) {
        setError("نوع الملف غير مدعوم. ارفع JPG أو PNG أو WebP أو SVG.");
        setLoading(false);
        return;
      }
    }

    // 1) Sign up
    const { data: signup, error: signErr } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signErr || !signup.user) {
      setError(signErr?.message?.includes("already") ? "الإيميل ده مسجّل قبل كده. سجّل دخول بدل التسجيل." : (signErr?.message ?? "فشل التسجيل."));
      setLoading(false);
      return;
    }
    const userId = signup.user.id;

    // 2) Upload logo (if any) to logos bucket
    let logo_url: string | null = null;
    if (logoFile) {
      const ext = logoFile.name.split(".").pop()?.toLowerCase() ?? "png";
      const path = `${userId}/logo-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("logos")
        .upload(path, logoFile, { contentType: logoFile.type, upsert: true });
      if (!upErr) {
        const { data: pub } = supabase.storage.from("logos").getPublicUrl(path);
        logo_url = pub.publicUrl;
      }
    }

    // 3) Insert company row owned by this user
    const payload = {
      auth_user_id: userId,
      name,
      representative: String(fd.get("representative") ?? "").trim() || null,
      email,
      phone: String(fd.get("phone") ?? "").trim() || null,
      sector: String(fd.get("sector") ?? "").trim() || null,
      website: String(fd.get("website") ?? "").trim() || null,
      description: String(fd.get("description") ?? "").trim() || null,
      address: String(fd.get("address") ?? "").trim() || null,
      logo_url,
      status: "approved",
    };
    const { error: insertErr } = await supabase.from("companies").insert(payload);
    if (insertErr) {
      setError("فشل حفظ بيانات الشركة: " + insertErr.message);
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
    setTimeout(() => router.push("/companies/dashboard"), 1200);
  }

  if (done) {
    return (
      <div className="card text-center">
        <div className="w-14 h-14 rounded-full bg-[var(--color-primary)] text-white mx-auto mb-3 flex items-center justify-center text-2xl">
          ✓
        </div>
        <h3 className="font-extrabold text-[var(--color-primary)] text-xl mb-2">
          تم إنشاء حساب الشركة بنجاح
        </h3>
        <p className="text-[var(--color-muted)] mb-5">جارٍ تحويلك إلى لوحة التحكم...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2 className="font-extrabold text-xl text-[var(--color-primary)] mb-1">
        إنشاء حساب الشركة
      </h2>
      <p className="text-sm text-[var(--color-muted)] mb-5">
        سجّل مرة واحدة، وبعدها ادخل لوحة التحكم لرفع وظائف من غير ما تكرر بيانات الشركة.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="label">اسم الشركة *</label>
          <input name="name" required className="input" placeholder="مثال: شركة النور للخدمات" />
        </div>

        <div>
          <label className="label">البريد الإلكتروني *</label>
          <input name="email" type="email" required dir="ltr" autoComplete="email" className="input" placeholder="hr@company.com" />
        </div>
        <div>
          <label className="label">كلمة المرور * (8 حروف على الأقل)</label>
          <input name="password" type="password" required minLength={8} dir="ltr" autoComplete="new-password" className="input" placeholder="••••••••" />
        </div>

        <div>
          <label className="label">اسم الممثل</label>
          <input name="representative" className="input" placeholder="مسؤول التواصل" />
        </div>
        <div>
          <label className="label">القطاع</label>
          <input name="sector" className="input" placeholder="مثال: تكنولوجيا المعلومات" />
        </div>

        <div>
          <label className="label">رقم الموبايل</label>
          <input name="phone" dir="ltr" className="input" placeholder="01xxxxxxxxx" />
        </div>
        <div>
          <label className="label">الموقع الإلكتروني</label>
          <input name="website" dir="ltr" className="input" placeholder="https://" />
        </div>

        <div className="md:col-span-2">
          <label className="label">عنوان الشركة</label>
          <input name="address" className="input" placeholder="مثال: مدينة نصر، القاهرة" />
        </div>

        <div className="md:col-span-2">
          <label className="label">نبذة عن الشركة</label>
          <textarea name="description" className="textarea" placeholder="نبذة قصيرة عن نشاط الشركة وحجمها" />
        </div>

        <div className="md:col-span-2">
          <label className="label">لوجو الشركة (PNG/JPG/SVG - حد أقصى {MAX_LOGO_KB}KB)</label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
            className="input file:ml-3 file:rounded-full file:border-0 file:bg-[var(--color-cream)] file:text-[var(--color-primary)] file:font-bold file:py-1 file:px-3"
          />
          {logoFile && (
            <div className="text-xs text-[var(--color-muted)] mt-1 truncate">
              {logoFile.name} — {(logoFile.size / 1024).toFixed(0)}KB
            </div>
          )}
        </div>
      </div>

      {error && <div className="mt-3 text-sm text-[var(--color-accent)] font-bold">{error}</div>}

      <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-5 disabled:opacity-60">
        {loading ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
      </button>

      <div className="text-sm text-center mt-4 text-[var(--color-muted)]">
        عندك حساب بالفعل؟{" "}
        <Link href="/companies/login" className="text-[var(--color-primary)] font-bold hover:underline">
          سجّل دخول
        </Link>
      </div>
    </form>
  );
}
