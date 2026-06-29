"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Experience = {
  id: string;
  company: string;
  title: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
};

type Course = {
  id: string;
  course_name: string;
  provider: string | null;
  completed_at: string | null;
};

export default function ExperiencesAndCoursesPage() {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  async function load() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    const { data: p } = await supabase.from("profiles").select("id").eq("auth_user_id", session.user.id).maybeSingle();
    if (!p) return;
    setProfileId(p.id);
    const [{ data: exps }, { data: crs }] = await Promise.all([
      supabase.from("profile_experiences").select("id, company, title, start_date, end_date, description").eq("profile_id", p.id).order("start_date", { ascending: false, nullsFirst: false }),
      supabase.from("profile_courses").select("id, course_name, provider, completed_at").eq("profile_id", p.id).order("completed_at", { ascending: false, nullsFirst: false }),
    ]);
    setExperiences((exps ?? []) as Experience[]);
    setCourses((crs ?? []) as Course[]);
  }

  useEffect(() => { load(); }, []);

  async function addExperience(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!profileId) return;
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      profile_id: profileId,
      company: String(fd.get("company") ?? "").trim(),
      title: String(fd.get("title") ?? "").trim(),
      start_date: (fd.get("start_date") as string) || null,
      end_date: (fd.get("end_date") as string) || null,
      description: String(fd.get("description") ?? "").trim() || null,
    };
    if (!payload.company || !payload.title) { setBusy(false); return; }
    await supabase.from("profile_experiences").insert(payload);
    setBusy(false);
    (e.target as HTMLFormElement).reset();
    load();
  }

  async function removeExperience(id: string) {
    if (!confirm("حذف الخبرة؟")) return;
    await supabase.from("profile_experiences").delete().eq("id", id);
    load();
  }

  async function addCourse(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!profileId) return;
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      profile_id: profileId,
      course_name: String(fd.get("course_name") ?? "").trim(),
      provider: String(fd.get("provider") ?? "").trim() || null,
      completed_at: (fd.get("completed_at") as string) || null,
    };
    if (!payload.course_name) { setBusy(false); return; }
    await supabase.from("profile_courses").insert(payload);
    setBusy(false);
    (e.target as HTMLFormElement).reset();
    load();
  }

  async function removeCourse(id: string) {
    if (!confirm("حذف الكورس؟")) return;
    await supabase.from("profile_courses").delete().eq("id", id);
    load();
  }

  async function rescore() {
    if (!profileId) return;
    setBusy(true);
    setInfo(null);
    const { data, error } = await supabase.rpc("rescore_profile", { p_profile_id: profileId });
    setBusy(false);
    if (error) return setInfo("فشل: " + error.message);
    setInfo(`اتحدثت ${data ?? 0} ترشيحات لك ✓`);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-primary)]">خبراتي وكورساتي</h1>
          <p className="text-sm text-[var(--color-muted)]">كل ما تضيف خبرة، احنا بنوصلك بوظائف أقرب لمجالك.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/applicants/dashboard/profile" className="btn-outline text-sm">← التاجز والمهارات</Link>
          <button onClick={rescore} disabled={busy} className="btn-primary text-sm disabled:opacity-60">
            {busy ? "جارٍ..." : "تحديث ترشيحاتي ↻"}
          </button>
        </div>
      </div>
      {info && <div className="card bg-emerald-50 text-emerald-900 text-sm">{info}</div>}

      <div className="card">
        <h2 className="font-extrabold text-xl text-[var(--color-primary)] mb-3">الخبرات السابقة</h2>
        <form onSubmit={addExperience} className="border border-gray-200 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="label">الشركة</label>
              <input name="company" required className="input" placeholder="اسم الشركة" />
            </div>
            <div>
              <label className="label">المسمى الوظيفي</label>
              <input name="title" required className="input" placeholder="مثال: مندوب مبيعات" />
            </div>
            <div>
              <label className="label">من تاريخ</label>
              <input name="start_date" type="month" dir="ltr" className="input" />
            </div>
            <div>
              <label className="label">إلى تاريخ (سيب فاضي لو لسه فيها)</label>
              <input name="end_date" type="month" dir="ltr" className="input" />
            </div>
            <div className="md:col-span-2">
              <label className="label">وصف باختصار</label>
              <textarea name="description" className="textarea" rows={2} placeholder="إيه اللي كنت بتعمله؟" />
            </div>
          </div>
          <button disabled={busy} className="btn-primary mt-3 disabled:opacity-60">+ إضافة خبرة</button>
        </form>
        <div className="space-y-2">
          {experiences.length === 0 ? (
            <div className="text-sm text-[var(--color-muted)] text-center py-4">لا توجد خبرات بعد.</div>
          ) : experiences.map((e) => (
            <div key={e.id} className="border border-gray-100 rounded-lg p-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-bold">{e.title}</div>
                <div className="text-sm text-[var(--color-muted)]">{e.company}</div>
                <div className="text-xs text-[var(--color-muted)]" dir="ltr">
                  {e.start_date ?? "-"} → {e.end_date ?? "الآن"}
                </div>
                {e.description && <div className="text-sm mt-1 text-[var(--color-ink)]">{e.description}</div>}
              </div>
              <button onClick={() => removeExperience(e.id)} className="text-red-700 font-bold text-sm hover:underline">حذف</button>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="font-extrabold text-xl text-[var(--color-primary)] mb-3">الكورسات والشهادات</h2>
        <form onSubmit={addCourse} className="border border-gray-200 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="label">اسم الكورس</label>
              <input name="course_name" required className="input" placeholder="مثال: دبلومة Digital Marketing" />
            </div>
            <div>
              <label className="label">الجهة المانحة</label>
              <input name="provider" className="input" placeholder="مثال: ITI / Coursera" />
            </div>
            <div>
              <label className="label">تاريخ الإتمام</label>
              <input name="completed_at" type="month" dir="ltr" className="input" />
            </div>
          </div>
          <button disabled={busy} className="btn-primary mt-3 disabled:opacity-60">+ إضافة كورس</button>
        </form>
        <div className="space-y-2">
          {courses.length === 0 ? (
            <div className="text-sm text-[var(--color-muted)] text-center py-4">لا توجد كورسات بعد.</div>
          ) : courses.map((c) => (
            <div key={c.id} className="border border-gray-100 rounded-lg p-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-bold">{c.course_name}</div>
                {c.provider && <div className="text-sm text-[var(--color-muted)]">{c.provider}</div>}
                {c.completed_at && <div className="text-xs text-[var(--color-muted)]" dir="ltr">{c.completed_at}</div>}
              </div>
              <button onClick={() => removeCourse(c.id)} className="text-red-700 font-bold text-sm hover:underline">حذف</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
