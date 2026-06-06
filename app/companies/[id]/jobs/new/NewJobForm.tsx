"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { GOVERNORATES, FIELDS, JOB_TYPES } from "@/lib/content";

export default function NewJobForm({ companyId }: { companyId: string }) {
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      company_id: companyId,
      title: String(fd.get("title") ?? "").trim(),
      description: String(fd.get("description") ?? "").trim(),
      requirements: String(fd.get("requirements") ?? "").trim() || null,
      location: String(fd.get("location") ?? "").trim() || null,
      governorate: String(fd.get("governorate") ?? "") || null,
      job_type: String(fd.get("job_type") ?? "") || null,
      field: String(fd.get("field") ?? "") || null,
      salary_range: String(fd.get("salary_range") ?? "").trim() || null,
      deadline: String(fd.get("deadline") ?? "") || null,
      status: "published",
    };
    if (!payload.title || !payload.description) {
      setError("المسمى الوظيفي والوصف مطلوبان.");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from("jobs").insert(payload).select("id").single();
    setLoading(false);
    if (error || !data) {
      setError("حدث خطأ أثناء نشر الوظيفة. حاول مرة أخرى.");
      return;
    }
    setJobId(data.id);
  }

  if (jobId) {
    return (
      <div className="card text-center">
        <div className="w-14 h-14 rounded-full bg-[var(--color-primary)] text-white mx-auto mb-3 flex items-center justify-center text-2xl">
          ✓
        </div>
        <h3 className="font-extrabold text-[var(--color-primary)] text-xl mb-2">
          تم نشر الوظيفة بنجاح
        </h3>
        <p className="text-[var(--color-muted)] mb-5">
          الوظيفة متاحة الآن للباحثين عن عمل.
        </p>
        <div className="flex gap-2 justify-center flex-wrap">
          <Link href={`/jobs/${jobId}`} className="btn-primary">عرض الوظيفة</Link>
          <Link href={`/companies/${companyId}/jobs/new`} className="btn-outline">إضافة وظيفة أخرى</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="label">المسمى الوظيفي *</label>
          <input name="title" required className="input" placeholder="مثال: مطوّر واجهات أمامية" />
        </div>
        <div className="md:col-span-2">
          <label className="label">الوصف الوظيفي *</label>
          <textarea name="description" required className="textarea" placeholder="وصف المسؤوليات والمهام" />
        </div>
        <div className="md:col-span-2">
          <label className="label">المتطلبات</label>
          <textarea name="requirements" className="textarea" placeholder="المؤهلات والمهارات والخبرات المطلوبة" />
        </div>
        <div>
          <label className="label">نوع التعاقد</label>
          <select name="job_type" className="select" defaultValue="">
            <option value="" disabled>اختر نوع التعاقد</option>
            {JOB_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label">المجال</label>
          <select name="field" className="select" defaultValue="">
            <option value="" disabled>اختر المجال</option>
            {FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="label">المحافظة</label>
          <select name="governorate" className="select" defaultValue="">
            <option value="" disabled>اختر المحافظة</option>
            {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className="label">العنوان التفصيلي</label>
          <input name="location" className="input" placeholder="مثال: مدينة نصر" />
        </div>
        <div>
          <label className="label">نطاق الراتب</label>
          <input name="salary_range" className="input" placeholder="مثال: 8000 - 12000 جنيه" />
        </div>
        <div>
          <label className="label">آخر موعد للتقديم</label>
          <input name="deadline" type="date" dir="ltr" className="input" />
        </div>
      </div>

      {error && <div className="mt-3 text-sm text-[var(--color-accent)] font-bold">{error}</div>}

      <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-5 disabled:opacity-60">
        {loading ? "جارٍ النشر..." : "نشر الوظيفة"}
      </button>
    </form>
  );
}
