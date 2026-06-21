"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { GOVERNORATES, FIELDS, JOB_TYPES } from "@/lib/content";

export default function NewJobForm() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGovs, setSelectedGovs] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const { data } = await supabase
        .from("companies").select("id").eq("auth_user_id", session.user.id).maybeSingle();
      setCompanyId(data?.id ?? null);
    })();
  }, []);

  function toggleGov(g: string) {
    setSelectedGovs((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!companyId) {
      setError("لازم تكون مسجّل دخول كشركة.");
      return;
    }
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);

    const title = String(fd.get("title") ?? "").trim();
    const description = String(fd.get("description") ?? "").trim();
    const ageMin = Number(fd.get("age_min")) || null;
    const ageMax = Number(fd.get("age_max")) || null;

    if (!title || !description) {
      setError("المسمى الوظيفي والوصف مطلوبان.");
      setLoading(false);
      return;
    }
    if (selectedGovs.length === 0) {
      setError("اختر محافظة واحدة على الأقل.");
      setLoading(false);
      return;
    }
    if (ageMin && ageMax && ageMin > ageMax) {
      setError("السن الأدنى أكبر من الأقصى.");
      setLoading(false);
      return;
    }

    const payload = {
      company_id: companyId,
      title,
      description,
      requirements: String(fd.get("requirements") ?? "").trim() || null,
      experience_required: String(fd.get("experience_required") ?? "").trim() || null,
      age_min: ageMin,
      age_max: ageMax,
      governorates: selectedGovs,
      governorate: selectedGovs[0],
      job_type: String(fd.get("job_type") ?? "") || null,
      field: String(fd.get("field") ?? "") || null,
      openings: Number(fd.get("openings")) || null,
      deadline: String(fd.get("deadline") ?? "") || null,
      location: String(fd.get("location") ?? "").trim() || null,
      status: "pending",
      submitted_by_company: true,
    };

    const { data, error: err } = await supabase
      .from("jobs").insert(payload).select("id").single();
    setLoading(false);
    if (err || !data) {
      setError("فشل إنشاء الوظيفة: " + (err?.message ?? "خطأ غير معروف"));
      return;
    }
    router.push("/companies/dashboard/jobs");
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="label">المسمى الوظيفي *</label>
          <input name="title" required className="input" placeholder="مثال: مهندس مبيعات" />
        </div>

        <div className="md:col-span-2">
          <label className="label">الوصف الوظيفي (Job Description) *</label>
          <textarea name="description" required rows={5} className="textarea" placeholder="المسؤوليات والمهام اليومية للوظيفة" />
        </div>

        <div className="md:col-span-2">
          <label className="label">المتطلبات والمهارات</label>
          <textarea name="requirements" className="textarea" placeholder="المؤهلات / الشهادات / المهارات التقنية المطلوبة" />
        </div>

        <div>
          <label className="label">الخبرة المطلوبة</label>
          <input name="experience_required" className="input" placeholder="مثال: من سنة لـ 3 سنين" />
        </div>

        <div>
          <label className="label">عدد الفرص المتاحة</label>
          <input name="openings" type="number" min={1} dir="ltr" className="input" placeholder="مثال: 5" />
        </div>

        <div>
          <label className="label">السن من</label>
          <input name="age_min" type="number" min={16} max={70} dir="ltr" className="input" placeholder="20" />
        </div>
        <div>
          <label className="label">السن إلى</label>
          <input name="age_max" type="number" min={16} max={70} dir="ltr" className="input" placeholder="40" />
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

        <div className="md:col-span-2">
          <label className="label">المحافظات المطلوبة *</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {GOVERNORATES.map((g) => {
              const sel = selectedGovs.includes(g);
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGov(g)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                    sel
                      ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                      : "bg-white text-[var(--color-ink)] border-gray-200 hover:border-[var(--color-primary)]"
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
          <div className="text-xs text-[var(--color-muted)] mt-2">
            اختار محافظة واحدة على الأقل. اللي مختار: {selectedGovs.length}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="label">العنوان التفصيلي (اختياري)</label>
          <input name="location" className="input" placeholder="مثال: شارع التحرير - المعادي" />
        </div>

        <div className="md:col-span-2">
          <label className="label">آخر موعد للتقديم</label>
          <input name="deadline" type="date" dir="ltr" className="input" />
        </div>
      </div>

      {error && <div className="mt-3 text-sm text-[var(--color-accent)] font-bold">{error}</div>}

      <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-5 disabled:opacity-60">
        {loading ? "جارٍ الإرسال..." : "إرسال للمراجعة"}
      </button>
    </form>
  );
}
