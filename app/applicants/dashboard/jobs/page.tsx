"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Match = {
  out_job_id: string;
  out_score: number;
  out_reasons: Record<string, unknown>;
  out_job_title: string;
  out_company_name: string | null;
  out_governorate: string | null;
};

export default function RecommendedJobsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const { data: p } = await supabase
        .from("profiles").select("id").eq("auth_user_id", session.user.id).maybeSingle();
      if (!p) return;
      const { data } = await supabase.rpc("match_jobs", { p_profile_id: p.id, p_limit: 50 });
      setMatches((data ?? []) as Match[]);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="text-[var(--color-muted)]">جارٍ التحميل...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-[var(--color-primary)]">كل الوظائف المرشّحة</h1>
      {matches.length === 0 ? (
        <div className="card text-center py-10 text-[var(--color-muted)]">
          لا توجد وظائف متاحة بعد. تابعنا لاحقًا.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {matches.map((m) => (
            <Link key={m.out_job_id} href={`/jobs/${m.out_job_id}`} className="card block hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-[var(--color-primary)] truncate">{m.out_job_title}</h3>
                  <div className="text-sm text-[var(--color-muted)]">
                    {m.out_company_name} · {m.out_governorate}
                  </div>
                </div>
                <div className="shrink-0 text-center bg-[var(--color-primary)] text-white px-3 py-2 rounded-lg">
                  <div className="text-lg font-extrabold leading-none">{m.out_score}</div>
                  <div className="text-[10px] opacity-80">/ 100</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
