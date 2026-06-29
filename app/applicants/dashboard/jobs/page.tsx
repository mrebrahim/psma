"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Rec = {
  id: string;
  score: number;
  reasons: Record<string, unknown>;
  jobs: { id: string; title: string; governorate: string | null; companies: { name: string } | { name: string }[] | null } | null;
};

export default function RecommendedJobsPage() {
  const [recs, setRecs] = useState<Rec[]>([]);
  const [loading, setLoading] = useState(true);
  const [minScore, setMinScore] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const { data: p } = await supabase.from("profiles").select("id").eq("auth_user_id", session.user.id).maybeSingle();
      if (!p) return;
      const { data } = await supabase
        .from("recommendations")
        .select("id, score, reasons, jobs(id, title, governorate, companies(name))")
        .eq("profile_id", p.id)
        .order("score", { ascending: false })
        .limit(100);
      setRecs((data ?? []) as unknown as Rec[]);
      setLoading(false);
    })();
  }, []);

  const filtered = recs.filter((r) => r.score >= minScore);

  if (loading) return <div className="text-[var(--color-muted)]">جارٍ التحميل...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-extrabold text-[var(--color-primary)]">كل الوظائف المرشّحة ({filtered.length})</h1>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[var(--color-muted)]">حد أدنى للنقط:</span>
          <select value={minScore} onChange={(e) => setMinScore(parseInt(e.target.value))} className="select max-w-[120px]">
            <option value={0}>الكل</option>
            <option value={20}>≥ 20</option>
            <option value={40}>≥ 40</option>
            <option value={60}>≥ 60 (تطابق قوي)</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-10 text-[var(--color-muted)]">
          مفيش ترشيحات في النطاق ده. جرّب تقلل الحد الأدنى أو كمّل بياناتك.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((r) => {
            const job = r.jobs;
            if (!job) return null;
            const company = Array.isArray(job.companies) ? job.companies[0] : job.companies;
            return (
              <Link key={r.id} href={`/jobs/${job.id}`} className="card block hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-[var(--color-primary)] truncate">{job.title}</h3>
                    <div className="text-sm text-[var(--color-muted)]">
                      {company?.name} · {job.governorate}
                    </div>
                  </div>
                  <div className="shrink-0 text-center bg-[var(--color-primary)] text-white px-3 py-2 rounded-lg">
                    <div className="text-lg font-extrabold leading-none">{r.score}</div>
                    <div className="text-[10px] opacity-80">/ 100</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
