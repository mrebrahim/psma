"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase, type Job, type Application } from "@/lib/supabase";
import { JOB_TYPES } from "@/lib/content";

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  pending: { label: "في انتظار الموافقة", cls: "bg-amber-100 text-amber-800" },
  published: { label: "منشورة", cls: "bg-emerald-100 text-emerald-800" },
  rejected: { label: "مرفوضة", cls: "bg-red-100 text-red-800" },
  draft: { label: "مسودة", cls: "bg-gray-100 text-gray-700" },
  closed: { label: "مغلقة", cls: "bg-gray-200 text-gray-700" },
};

export default function JobDetailClient({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<Job | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [withCvOnly, setWithCvOnly] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: j } = await supabase.from("jobs").select("*").eq("id", jobId).maybeSingle();
      if (j) setJob(j as Job);
      const { data: a } = await supabase
        .from("applications").select("*").eq("job_id", jobId)
        .order("created_at", { ascending: false });
      setApps((a ?? []) as Application[]);
      setLoading(false);
    })();
  }, [jobId]);

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      if (withCvOnly && !a.cv_url) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          a.full_name.toLowerCase().includes(q) ||
          a.phone.includes(q) ||
          (a.email ?? "").toLowerCase().includes(q) ||
          (a.position_applied ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [apps, search, withCvOnly]);

  async function downloadCv(cv_url: string) {
    const { data, error: err } = await supabase.storage.from("cvs").createSignedUrl(cv_url, 300);
    if (err || !data) {
      alert("فشل تنزيل الـ CV: " + (err?.message ?? "خطأ"));
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener");
  }

  async function saveEdits(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!job) return;
    setSaving(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const updates = {
      title: String(fd.get("title") ?? "").trim(),
      description: String(fd.get("description") ?? "").trim(),
      requirements: String(fd.get("requirements") ?? "").trim() || null,
      experience_required: String(fd.get("experience_required") ?? "").trim() || null,
      age_min: Number(fd.get("age_min")) || null,
      age_max: Number(fd.get("age_max")) || null,
      openings: Number(fd.get("openings")) || null,
      status: "pending",
      rejection_reason: null,
    };
    const { error: err } = await supabase.from("jobs").update(updates).eq("id", job.id);
    setSaving(false);
    if (err) {
      setError("فشل الحفظ: " + err.message);
      return;
    }
    setJob({ ...job, ...updates } as Job);
    setEditing(false);
  }

  if (loading) return <div className="text-[var(--color-muted)]">جارٍ التحميل...</div>;
  if (!job) return <div className="text-red-700">الوظيفة غير موجودة.</div>;

  const status = STATUS_LABEL[job.status] ?? { label: job.status, cls: "bg-gray-100" };
  const jobTypeLabel = JOB_TYPES.find((t) => t.value === job.job_type)?.label;
  const withCvCount = apps.filter((a) => a.cv_url).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/companies/dashboard/jobs" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)]">
            ← كل الوظائف
          </Link>
          <h1 className="text-2xl font-extrabold text-[var(--color-primary)] mt-1">{job.title}</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`inline-block text-xs font-bold px-2 py-1 rounded-full ${status.cls}`}>
              {status.label}
            </span>
            {jobTypeLabel && <span className="chip">{jobTypeLabel}</span>}
            {job.openings && <span className="chip">{job.openings} فرصة</span>}
          </div>
        </div>
      </div>

      {job.status === "rejected" && job.rejection_reason && (
        <div className="card border-2 border-red-300 bg-red-50">
          <div className="font-bold text-red-800 mb-1">سبب رفض الوظيفة:</div>
          <p className="text-sm text-red-900 whitespace-pre-line">{job.rejection_reason}</p>
          <button
            onClick={() => setEditing(true)}
            className="btn-primary mt-3"
          >
            تعديل الوظيفة وإعادة الإرسال
          </button>
        </div>
      )}

      {editing ? (
        <form onSubmit={saveEdits} className="card">
          <h2 className="font-extrabold text-[var(--color-primary)] mb-3">تعديل الوظيفة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">المسمى الوظيفي</label>
              <input name="title" required defaultValue={job.title} className="input" />
            </div>
            <div className="md:col-span-2">
              <label className="label">الوصف</label>
              <textarea name="description" required defaultValue={job.description} rows={5} className="textarea" />
            </div>
            <div className="md:col-span-2">
              <label className="label">المتطلبات</label>
              <textarea name="requirements" defaultValue={job.requirements ?? ""} className="textarea" />
            </div>
            <div>
              <label className="label">الخبرة المطلوبة</label>
              <input name="experience_required" defaultValue={job.experience_required ?? ""} className="input" />
            </div>
            <div>
              <label className="label">عدد الفرص</label>
              <input name="openings" type="number" min={1} dir="ltr" defaultValue={job.openings ?? ""} className="input" />
            </div>
            <div>
              <label className="label">السن من</label>
              <input name="age_min" type="number" min={16} max={70} dir="ltr" defaultValue={job.age_min ?? ""} className="input" />
            </div>
            <div>
              <label className="label">السن إلى</label>
              <input name="age_max" type="number" min={16} max={70} dir="ltr" defaultValue={job.age_max ?? ""} className="input" />
            </div>
          </div>
          {error && <div className="mt-3 text-sm text-[var(--color-accent)] font-bold">{error}</div>}
          <div className="flex gap-2 mt-5">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? "جارٍ الحفظ..." : "حفظ وإعادة الإرسال للمراجعة"}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="btn-outline">
              إلغاء
            </button>
          </div>
        </form>
      ) : (
        <div className="card grid grid-cols-1 md:grid-cols-2 gap-4">
          <Detail label="الوصف">{job.description}</Detail>
          {job.requirements && <Detail label="المتطلبات">{job.requirements}</Detail>}
          {job.experience_required && <Detail label="الخبرة المطلوبة">{job.experience_required}</Detail>}
          {(job.age_min || job.age_max) && (
            <Detail label="السن المطلوب">
              {job.age_min ?? "—"} إلى {job.age_max ?? "—"} سنة
            </Detail>
          )}
          {job.governorates && job.governorates.length > 0 && (
            <Detail label="المحافظات">{job.governorates.join("، ")}</Detail>
          )}
          {job.field && <Detail label="المجال">{job.field}</Detail>}
          {job.openings && <Detail label="عدد الفرص">{job.openings}</Detail>}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold text-[var(--color-primary)]">
            المتقدّمون ({apps.length})
            {withCvCount > 0 && (
              <span className="text-sm text-[var(--color-muted)] font-normal mr-2">
                — {withCvCount} منهم رفع CV
              </span>
            )}
          </h2>
        </div>

        <div className="card grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم / الموبايل / الإيميل / الوظيفة"
            className="input md:col-span-2"
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={withCvOnly} onChange={(e) => setWithCvOnly(e.target.checked)} />
            <span>عرض اللي رفعوا CV فقط</span>
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="card text-center text-[var(--color-muted)] py-8">لا يوجد متقدّمون.</div>
        ) : (
          <div className="card p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-cream)] text-[var(--color-primary)]">
                <tr>
                  <th className="p-3 text-right">المتقدم</th>
                  <th className="p-3 text-right">الوظيفة</th>
                  <th className="p-3 text-right">الموبايل</th>
                  <th className="p-3 text-right">المحافظة</th>
                  <th className="p-3 text-right">CV</th>
                  <th className="p-3 text-right">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="p-3">
                      <div className="font-bold">{a.full_name}</div>
                      {a.email && <div className="text-xs text-[var(--color-muted)]">{a.email}</div>}
                    </td>
                    <td className="p-3">{a.position_applied ?? "—"}</td>
                    <td className="p-3" dir="ltr">{a.phone}</td>
                    <td className="p-3">{a.governorate ?? "—"}</td>
                    <td className="p-3">
                      {a.cv_url ? (
                        <button
                          onClick={() => downloadCv(a.cv_url!)}
                          className="text-[var(--color-primary)] font-bold hover:underline"
                        >
                          تحميل
                        </button>
                      ) : (
                        <span className="text-[var(--color-muted)]">لم يرفع</span>
                      )}
                    </td>
                    <td className="p-3 text-xs text-[var(--color-muted)]">
                      {new Date(a.created_at).toLocaleDateString("ar-EG")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-bold text-[var(--color-muted)] mb-1">{label}</div>
      <div className="whitespace-pre-line text-[var(--color-ink)]">{children}</div>
    </div>
  );
}
