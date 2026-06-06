"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      representative: String(fd.get("representative") ?? "").trim() || null,
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim() || null,
      sector: String(fd.get("sector") ?? "").trim() || null,
      website: String(fd.get("website") ?? "").trim() || null,
      description: String(fd.get("description") ?? "").trim() || null,
    };
    if (!payload.name || !payload.email) {
      setError("اسم الشركة والبريد الإلكتروني مطلوبان.");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("companies")
      .insert(payload)
      .select("id")
      .single();
    setLoading(false);
    if (error || !data) {
      setError("حدث خطأ أثناء التسجيل. حاول مرة أخرى.");
      return;
    }
    setCompanyId(data.id);
  }

  if (companyId) {
    return (
      <div className="card text-center">
        <div className="w-14 h-14 rounded-full bg-[var(--color-primary)] text-white mx-auto mb-3 flex items-center justify-center text-2xl">
          ✓
        </div>
        <h3 className="font-extrabold text-[var(--color-primary)] text-xl mb-2">
          تم استلام تسجيلك بنجاح
        </h3>
        <p className="text-[var(--color-muted)] mb-5">
          سيراجع فريقنا بيانات الشركة. يمكنك الآن إضافة أول وظيفة لديك.
        </p>
        <Link href={`/companies/${companyId}/jobs/new`} className="btn-primary">
          أضف أول وظيفة
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2 className="font-extrabold text-xl text-[var(--color-primary)] mb-1">
        بيانات الشركة
      </h2>
      <p className="text-sm text-[var(--color-muted)] mb-5">
        المعلومات الأساسية للتسجيل في شبكة شركائنا.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="label">اسم الشركة *</label>
          <input name="name" required className="input" placeholder="مثال: شركة النور للخدمات" />
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
          <label className="label">البريد الإلكتروني *</label>
          <input name="email" type="email" required dir="ltr" className="input" placeholder="hr@company.com" />
        </div>
        <div>
          <label className="label">رقم الموبايل</label>
          <input name="phone" dir="ltr" className="input" placeholder="01xxxxxxxxx" />
        </div>
        <div className="md:col-span-2">
          <label className="label">الموقع الإلكتروني</label>
          <input name="website" dir="ltr" className="input" placeholder="https://" />
        </div>
        <div className="md:col-span-2">
          <label className="label">نبذة مختصرة عن الشركة</label>
          <textarea name="description" className="textarea" placeholder="نبذة قصيرة عن نشاط الشركة وحجمها" />
        </div>
      </div>

      {error && <div className="mt-3 text-sm text-[var(--color-accent)] font-bold">{error}</div>}

      <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-5 disabled:opacity-60">
        {loading ? "جارٍ الإرسال..." : "سجّل الشركة وانتقل لإضافة وظيفة"}
      </button>
    </form>
  );
}
