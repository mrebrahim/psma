"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { GOVERNORATES, FIELDS } from "@/lib/content";

const MAX_CV_MB = 5;
const ALLOWED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];

export default function ApplyForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);

    const full_name = String(fd.get("full_name") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    if (!full_name || !phone) {
      setError("الاسم ورقم الموبايل مطلوبان.");
      setLoading(false);
      return;
    }

    let cv_url: string | null = null;
    if (cvFile) {
      if (cvFile.size > MAX_CV_MB * 1024 * 1024) {
        setError(`حجم الـ CV لازم يكون أقل من ${MAX_CV_MB} ميجا.`);
        setLoading(false);
        return;
      }
      if (!ALLOWED_CV_TYPES.includes(cvFile.type)) {
        setError("نوع الملف غير مدعوم. ارفع PDF أو Word أو صورة.");
        setLoading(false);
        return;
      }
      const ext = cvFile.name.split(".").pop()?.toLowerCase() ?? "bin";
      const path = `${jobId}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("cvs")
        .upload(path, cvFile, { contentType: cvFile.type, upsert: false });
      if (upErr) {
        setError("فشل رفع الـ CV. حاول مرة أخرى.");
        setLoading(false);
        return;
      }
      cv_url = path;
    }

    const payload = {
      job_id: jobId,
      full_name,
      phone,
      email: String(fd.get("email") ?? "").trim() || null,
      governorate: String(fd.get("governorate") ?? "") || null,
      qualification: String(fd.get("qualification") ?? "").trim() || null,
      field: String(fd.get("field") ?? "") || null,
      cover_note: String(fd.get("cover_note") ?? "").trim() || null,
      cv_url,
    };

    const { error: insertErr } = await supabase.from("applications").insert(payload);
    setLoading(false);
    if (insertErr) {
      setError("حدث خطأ أثناء إرسال طلبك. حاول مرة أخرى.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="card text-center">
        <div className="w-14 h-14 rounded-full bg-[var(--color-primary)] text-white mx-auto mb-3 flex items-center justify-center text-2xl">
          ✓
        </div>
        <h3 className="font-extrabold text-[var(--color-primary)] text-lg mb-1">
          تم إرسال طلبك بنجاح
        </h3>
        <p className="text-sm text-[var(--color-muted)]">
          سيتم التواصل معك من قِبل الشركة في أقرب وقت.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="font-extrabold text-[var(--color-primary)] text-lg mb-1">
        قدّم على الوظيفة
      </h3>
      <p className="text-xs text-[var(--color-muted)] mb-4 truncate">{jobTitle}</p>

      <div className="space-y-3">
        <div>
          <label className="label">الاسم الكامل *</label>
          <input name="full_name" required className="input" placeholder="الاسم الكامل" />
        </div>
        <div>
          <label className="label">رقم الموبايل *</label>
          <input name="phone" required dir="ltr" className="input" placeholder="01xxxxxxxxx" />
        </div>
        <div>
          <label className="label">البريد الإلكتروني</label>
          <input name="email" type="email" dir="ltr" className="input" placeholder="you@example.com" />
        </div>
        <div>
          <label className="label">المحافظة</label>
          <select name="governorate" className="select" defaultValue="">
            <option value="" disabled>اختر المحافظة</option>
            {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className="label">المؤهل / التخصص</label>
          <input name="qualification" className="input" placeholder="مثال: بكالوريوس تجارة" />
        </div>
        <div>
          <label className="label">المجال المفضّل</label>
          <select name="field" className="select" defaultValue="">
            <option value="" disabled>اختر المجال</option>
            {FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="label">ارفع الـ CV (PDF / Word / صورة - حد أقصى {MAX_CV_MB}MB)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,image/jpeg,image/png"
            onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
            className="input file:ml-3 file:rounded-full file:border-0 file:bg-[var(--color-cream)] file:text-[var(--color-primary)] file:font-bold file:py-1 file:px-3"
          />
          {cvFile && (
            <div className="text-xs text-[var(--color-muted)] mt-1 truncate">
              {cvFile.name} — {(cvFile.size / 1024).toFixed(0)}KB
            </div>
          )}
        </div>
        <div>
          <label className="label">نبذة مختصرة (اختياري)</label>
          <textarea name="cover_note" className="textarea" placeholder="اكتب أي معلومة تريد إضافتها" />
        </div>
      </div>

      {error && <div className="mt-3 text-sm text-[var(--color-accent)] font-bold">{error}</div>}

      <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-4 disabled:opacity-60">
        {loading ? "جارٍ الإرسال..." : "إرسال الطلب"}
      </button>
    </form>
  );
}
