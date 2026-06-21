"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase, type Job } from "@/lib/supabase";

type JobRow = Job & { _count?: number };

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  pending: { label: "في انتظار الموافقة", cls: "bg-amber-100 text-amber-800" },
  published: { label: "منشورة", cls: "bg-emerald-100 text-emerald-800" },
  rejected: { label: "مرفوضة", cls: "bg-red-100 text-red-800" },
  draft: { label: "مسودة", cls: "bg-gray-100 text-gray-700" },
  closed: { label: "مغلقة", cls: "bg-gray-200 text-gray-700" },
};

export default function CompanyJobsPage() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const { data: c } = await supabase
        .from("companies").select("id").eq("auth_user_id", session.user.id).maybeSingle();
      if (!c) return;
      const { data: js } = await supabase
        .from("jobs")
        .select("*")
        .eq("company_id", c.id)
        .order("created_at", { ascending: false });

      const ids = (js ?? []).map((j) => j.id);
      const counts: Record<string, number> = {};
      if (ids.length > 0) {
        const { data: apps } = await supabase
          .from("applications").select("job_id").in("job_id", ids);
        (apps ?? []).forEach((a: { job_id: string }) => {
          counts[a.job_id] = (counts[a.job_id] ?? 0) + 1;
        });
      }
      setJobs((js ?? []).map((j: Job) => ({ ...j, _count: counts[j.id] ?? 0 })));
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="text-[var(--color-muted)]">جارٍ التحميل...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-[var(--color-primary)]">وظائفي</h1>
        <Link href="/companies/dashboard/jobs/new" className="btn-primary">
          + إضافة وظيفة
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-[var(--color-muted)] mb-3">لم تضِف أي وظيفة بعد.</p>
          <Link href="/companies/dashboard/jobs/new" className="btn-primary">
            أضف أول وظيفة
          </Link>
        </div>
      ) : (
        <div className="card p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-cream)] text-[var(--color-primary)]">
              <tr>
                <th className="p-3 text-right">الوظيفة</th>
                <th className="p-3 text-right">الحالة</th>
                <th className="p-3 text-right">المتقدّمون</th>
                <th className="p-3 text-right">التاريخ</th>
                <th className="p-3 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => {
                const s = STATUS_LABEL[j.status] ?? { label: j.status, cls: "bg-gray-100" };
                return (
                  <tr key={j.id} className="border-t">
                    <td className="p-3">
                      <div className="font-bold">{j.title}</div>
                      {j.status === "rejected" && j.rejection_reason && (
                        <div className="text-xs text-red-700 mt-1">سبب الرفض: {j.rejection_reason}</div>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`inline-block text-xs font-bold px-2 py-1 rounded-full ${s.cls}`}>
                        {s.label}
                      </span>
                    </td>
                    <td className="p-3 font-bold">{j._count}</td>
                    <td className="p-3 text-xs text-[var(--color-muted)]">
                      {new Date(j.created_at).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <Link
                        href={`/companies/dashboard/jobs/${j.id}`}
                        className="text-[var(--color-primary)] font-bold hover:underline text-sm"
                      >
                        عرض / تعديل
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
