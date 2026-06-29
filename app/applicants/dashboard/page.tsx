"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Rec = {
  id: string;
  score: number;
  reasons: Record<string, unknown>;
  status: string;
  jobs: { id: string; title: string; governorate: string | null; companies: { name: string } | { name: string }[] | null } | null;
};

function reasonChips(r: Record<string, unknown>): string[] {
  const chips: string[] = [];
  const t = r.tag_overlap as { matched?: number; total_job_tags?: number } | undefined;
  if (t?.matched && t.matched > 0) chips.push(`اتطابق ${t.matched} من ${t.total_job_tags} تاج`);
  const cat = r.category as { match?: boolean; job_field?: string } | undefined;
  if (cat?.match) chips.push(`نفس المجال (${cat.job_field ?? ""})`);
  const exp = r.experience as { relevant?: boolean } | undefined;
  if (exp?.relevant) chips.push("خبرة سابقة في نفس المجال");
  const sk = r.skills as { matched?: number } | undefined;
  if (sk?.matched && sk.matched > 0) chips.push(`${sk.matched} مهارة في الوصف`);
  const city = r.city as { match?: boolean; job_city?: string } | undefined;
  if (city?.match) chips.push(`نفس المحافظة (${city.job_city ?? ""})`);
  return chips;
}

export default function ApplicantDashboardHome() {
  const [recs, setRecs] = useState<Rec[]>([]);
  const [loading, setLoading] = useState(true);
  const [appsCount, setAppsCount] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const { data: p } = await supabase.from("profiles").select("id").eq("auth_user_id", session.user.id).maybeSingle();
      if (!p) return;
      const { data } = await supabase
        .from("recommendations")
        .select("id, score, reasons, status, jobs(id, title, governorate, companies(name))")
        .eq("profile_id", p.id)
        .order("score", { ascending: false })
        .limit(5);
      setRecs((data ?? []) as unknown as Rec[]);
      const { count } = await supabase.from("applications").select("id", { count: "exact", head: true }).eq("profile_id", p.id);
      setAppsCount(count ?? 0);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="text-[var(--color-muted)]">جارٍ تحميل الترشيحات...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card">
          <div className="text-xs text-[var(--color-muted)] mb-1">أعلى ترشيحاتي</div>
          <div className="text-2xl font-extrabold text-[var(--color-primary)]">{recs.length}</div>
        </div>
        <div className="card">
          <div className="text-xs text-[var(--color-muted)] mb-1">تقديماتي</div>
          <div className="text-2xl font-extrabold text-[var(--color-primary)]">{appsCount}</div>
        </div>
        <div className="card col-span-2">
          <div className="text-xs text-[var(--color-muted)] mb-1">أعلى تطابق</div>
          <div className="text-lg font-bold text-[var(--color-primary)] truncate">
            {recs[0]?.jobs ? `${recs[0].jobs.title} (${recs[0].score}/100)` : "لسه مفيش"}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-extrabold text-[var(--color-primary)]">أعلى 5 وظائف ليك</h2>
          <Link href="/applicants/dashboard/jobs" className="text-sm font-bold text-[var(--color-primary)] hover:underline">
            كل الترشيحات ←
          </Link>
        </div>

        {recs.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-[var(--color-muted)] mb-3">لسه مفيش ترشيحات. ضيف تاجاتك ومهاراتك في صفحة "بياناتي" عشان نلاقيلك المناسب.</p>
            <Link href="/applicants/dashboard/profile" className="btn-primary">أكمّل بياناتي</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recs.map((r) => {
              const job = r.jobs;
              if (!job) return null;
              const company = Array.isArray(job.companies) ? job.companies[0] : job.companies;
              return (
                <Link key={r.id} href={`/jobs/${job.id}`} className="card block hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-[var(--color-primary)] truncate">{job.title}</h3>
                      <div className="text-sm text-[var(--color-muted)]">
                        {company?.name} · {job.governorate}
                      </div>
                    </div>
                    <div className="shrink-0 text-center bg-[var(--color-primary)] text-white px-3 py-2 rounded-lg">
                      <div className="text-xl font-extrabold leading-none">{r.score}</div>
                      <div className="text-[10px] opacity-80">/ 100</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {reasonChips(r.reasons).map((c, i) => (
                      <span key={i} className="text-xs font-bold bg-[var(--color-cream)] text-[var(--color-primary)] px-2 py-1 rounded-full">
                        ✓ {c}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
