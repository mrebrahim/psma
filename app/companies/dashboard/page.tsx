"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Stat = { jobs: number; pending: number; published: number; rejected: number; applications: number };

export default function CompanyDashboardHome() {
  const [stats, setStats] = useState<Stat | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const { data: c } = await supabase
        .from("companies").select("id").eq("auth_user_id", session.user.id).maybeSingle();
      if (!c) return;

      const { data: jobs } = await supabase
        .from("jobs").select("id, status").eq("company_id", c.id);

      const jobIds = (jobs ?? []).map((j) => j.id);
      let applicationsCount = 0;
      if (jobIds.length > 0) {
        const { count } = await supabase
          .from("applications").select("id", { count: "exact", head: true }).in("job_id", jobIds);
        applicationsCount = count ?? 0;
      }

      setStats({
        jobs: jobs?.length ?? 0,
        pending: (jobs ?? []).filter((j) => j.status === "pending").length,
        published: (jobs ?? []).filter((j) => j.status === "published").length,
        rejected: (jobs ?? []).filter((j) => j.status === "rejected").length,
        applications: applicationsCount,
      });
    })();
  }, []);

  const cards = [
    { label: "إجمالي الوظائف", value: stats?.jobs ?? "—" },
    { label: "في انتظار الموافقة", value: stats?.pending ?? "—" },
    { label: "منشورة", value: stats?.published ?? "—" },
    { label: "مرفوضة", value: stats?.rejected ?? "—" },
    { label: "إجمالي المتقدمين", value: stats?.applications ?? "—" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-[var(--color-primary)]">نظرة عامة</h1>
        <Link href="/companies/dashboard/jobs/new" className="btn-primary">
          + إضافة وظيفة جديدة
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="card">
            <div className="text-xs text-[var(--color-muted)] mb-1">{c.label}</div>
            <div className="text-2xl font-extrabold text-[var(--color-primary)]">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="font-extrabold text-[var(--color-primary)] mb-2">كيف بيشتغل الموضوع؟</h2>
        <ol className="list-decimal pr-5 space-y-1 text-sm text-[var(--color-ink)] leading-relaxed">
          <li>أضف وظيفة جديدة → بتروح للمراجعة من الأدمن.</li>
          <li>لما تتقبل، بتنزل تلقائيًا في صفحة الوظائف على الموقع.</li>
          <li>لو اترفضت، هتشوف سبب الرفض هنا — عدّلها وأعد التقديم.</li>
          <li>كل المتقدّمين على كل وظيفة بيظهروا في صفحة الوظيفة، وتقدر تنزّل CV.</li>
        </ol>
      </div>
    </div>
  );
}
