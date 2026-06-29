"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Match = {
  out_job_id: string;
  out_score: number;
  out_reasons: {
    tag_overlap?: { matched: number; total_job_tags: number; points: number };
    category?: { match: boolean; job_field: string | null; points: number };
    skills?: { matched: number; points: number };
    experience?: { relevant: boolean; points: number };
    city?: { match: boolean; profile_city: string | null; job_city: string | null; points: number };
  };
  out_job_title: string;
  out_company_name: string | null;
  out_governorate: string | null;
};

function reasonChips(r: Match["out_reasons"]) {
  const chips: string[] = [];
  if (r.tag_overlap?.matched && r.tag_overlap.matched > 0) {
    chips.push(`اتطابق ${r.tag_overlap.matched} من ${r.tag_overlap.total_job_tags} تاج`);
  }
  if (r.category?.match) chips.push(`نفس المجال (${r.category.job_field ?? ""})`);
  if (r.experience?.relevant) chips.push("خبرة سابقة في نفس المجال");
  if (r.skills?.matched && r.skills.matched > 0) chips.push(`${r.skills.matched} مهارة في الوصف`);
  if (r.city?.match) chips.push(`نفس المحافظة (${r.city.job_city ?? ""})`);
  return chips;
}

export default function ApplicantDashboardHome() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [appsCount, setAppsCount] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const { data: p } = await supabase
        .from("profiles").select("id").eq("auth_user_id", session.user.id).maybeSingle();
      if (!p) return;
      const { data: rec } = await supabase.rpc("match_jobs", { p_profile_id: p.id, p_limit: 5 });
      setMatches((rec ?? []) as Match[]);
      const { count } = await supabase
        .from("applications").select("id", { count: "exact", head: true }).eq("profile_id", p.id);
      setAppsCount(count ?? 0);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="text-[var(--color-muted)]">جارٍ تحميل الترشيحات...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card">
          <div className="text-xs text-[var(--color-muted)] mb-1">وظائف مرشّحة</div>
          <div className="text-2xl font-extrabold text-[var(--color-primary)]">{matches.length}</div>
        </div>
        <div className="card">
          <div className="text-xs text-[var(--color-muted)] mb-1">تقديماتي</div>
          <div className="text-2xl font-extrabold text-[var(--color-primary)]">{appsCount}</div>
        </div>
        <div className="card col-span-2">
          <div className="text-xs text-[var(--color-muted)] mb-1">أعلى ترشيح</div>
          <div className="text-lg font-bold text-[var(--color-primary)] truncate">
            {matches[0] ? `${matches[0].out_job_title} (${matches[0].out_score}/100)` : "لسه مفيش"}
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

        {matches.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-[var(--color-muted)] mb-3">
              لسه مفيش وظائف مرشّحة. ضيف تاجاتك ومهاراتك عشان نلاقيلك المناسب.
            </p>
            <Link href="/applicants/dashboard/profile" className="btn-primary">
              أكمّل بياناتي
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((m) => (
              <Link key={m.out_job_id} href={`/jobs/${m.out_job_id}`} className="card block hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-[var(--color-primary)] truncate">{m.out_job_title}</h3>
                    <div className="text-sm text-[var(--color-muted)]">
                      {m.out_company_name} · {m.out_governorate}
                    </div>
                  </div>
                  <div className="shrink-0 text-center bg-[var(--color-primary)] text-white px-3 py-2 rounded-lg">
                    <div className="text-xl font-extrabold leading-none">{m.out_score}</div>
                    <div className="text-[10px] opacity-80">/ 100</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {reasonChips(m.out_reasons).map((c, i) => (
                    <span key={i} className="text-xs font-bold bg-[var(--color-cream)] text-[var(--color-primary)] px-2 py-1 rounded-full">
                      ✓ {c}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
