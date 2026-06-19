import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import AdminFilters from "./AdminFilters";

export const dynamic = "force-dynamic";
export const metadata = { title: "التقديمات — لوحة الإدارة" };

type SearchParams = {
  company?: string;
  job?: string;
  q?: string;
  page?: string;
};

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ar-EG", { dateStyle: "short", timeStyle: "short" });
}

const PAGE_SIZE = 25;

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  let query = supabaseAdmin
    .from("applications")
    .select(
      "id, full_name, phone, email, governorate, qualification, field, position_applied, cover_note, cv_url, status, created_at, job_id, jobs(title, company_id, companies(id, name))",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (sp.job) query = query.eq("job_id", sp.job);
  if (sp.q) query = query.or(`full_name.ilike.%${sp.q}%,phone.ilike.%${sp.q}%,email.ilike.%${sp.q}%`);

  const { data: rawApps, count } = await query;

  type AppRow = {
    id: string; full_name: string; phone: string; email: string | null;
    governorate: string | null; qualification: string | null; field: string | null;
    position_applied: string | null;
    cover_note: string | null; cv_url: string | null; status: string; created_at: string;
    job_id: string | null;
    jobs: { title: string; company_id: string | null; companies: { id: string; name: string } | { id: string; name: string }[] | null } | { title: string; company_id: string | null; companies: { id: string; name: string } | { id: string; name: string }[] | null }[] | null;
  };

  const apps = ((rawApps ?? []) as AppRow[]).map((a) => {
    const job = Array.isArray(a.jobs) ? a.jobs[0] ?? null : a.jobs;
    const company = job?.companies
      ? Array.isArray(job.companies)
        ? job.companies[0] ?? null
        : job.companies
      : null;
    return { ...a, job, company };
  });

  const filtered = sp.company ? apps.filter((a) => a.company?.id === sp.company) : apps;

  const { data: companiesRows } = await supabaseAdmin
    .from("companies")
    .select("id, name")
    .order("name")
    .limit(500);

  const { data: jobsRows } = await supabaseAdmin
    .from("jobs")
    .select("id, title, company_id, companies(name)")
    .order("created_at", { ascending: false })
    .limit(500);

  type JobRow = { id: string; title: string; company_id: string | null; companies: { name: string } | { name: string }[] | null };
  const jobsForFilter = ((jobsRows ?? []) as JobRow[]).map((j) => {
    const c = Array.isArray(j.companies) ? j.companies[0] ?? null : j.companies;
    return { id: j.id, title: j.title, company_id: j.company_id, company_name: c?.name ?? "" };
  });

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-primary)]">
            تقديمات الباحثين عن عمل
          </h1>
          <p className="text-sm text-[var(--color-muted)]">
            إجمالي التقديمات: <span className="font-bold">{totalCount}</span>
          </p>
        </div>
      </div>

      <AdminFilters
        companies={companiesRows ?? []}
        jobs={jobsForFilter}
        initial={{
          company: sp.company ?? "",
          job: sp.job ?? "",
          q: sp.q ?? "",
        }}
      />

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-cream)] text-[var(--color-primary)]">
            <tr>
              <th className="p-3 text-right">المتقدم</th>
              <th className="p-3 text-right">الوظيفة المختارة</th>
              <th className="p-3 text-right">الشركة</th>
              <th className="p-3 text-right">الموبايل</th>
              <th className="p-3 text-right">المحافظة</th>
              <th className="p-3 text-right">CV</th>
              <th className="p-3 text-right">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[var(--color-muted)]">
                  لا توجد تقديمات.
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr key={a.id} className="border-t hover:bg-[var(--color-cream)]/30">
                  <td className="p-3">
                    <div className="font-bold">{a.full_name}</div>
                    {a.email && <div className="text-xs text-[var(--color-muted)] truncate max-w-[200px]">{a.email}</div>}
                  </td>
                  <td className="p-3">
                    <div className="font-bold">{a.position_applied ?? a.job?.title ?? "—"}</div>
                    {a.job && a.position_applied && a.position_applied !== a.job.title && (
                      <Link href={`/jobs/${a.job_id}`} className="text-xs text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:underline">
                        من إعلان: {a.job.title}
                      </Link>
                    )}
                  </td>
                  <td className="p-3">{a.company?.name ?? "—"}</td>
                  <td className="p-3" dir="ltr">{a.phone}</td>
                  <td className="p-3">{a.governorate ?? "—"}</td>
                  <td className="p-3">
                    {a.cv_url ? (
                      <a
                        href={`/api/admin/cv/${a.id}`}
                        target="_blank"
                        rel="noopener"
                        className="text-[var(--color-primary)] font-bold hover:underline"
                      >
                        تحميل
                      </a>
                    ) : (
                      <span className="text-[var(--color-muted)]">—</span>
                    )}
                  </td>
                  <td className="p-3 text-xs text-[var(--color-muted)]">{fmtDate(a.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            const params = new URLSearchParams();
            if (sp.company) params.set("company", sp.company);
            if (sp.job) params.set("job", sp.job);
            if (sp.q) params.set("q", sp.q);
            if (p > 1) params.set("page", String(p));
            return (
              <Link
                key={p}
                href={`/admin${params.toString() ? "?" + params.toString() : ""}`}
                className={`px-3 py-1 rounded-full text-sm font-bold ${
                  p === page ? "bg-[var(--color-primary)] text-white" : "bg-white border"
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
