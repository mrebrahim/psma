import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import JobReviewActions from "./JobReviewActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "مراجعة الوظائف — لوحة الإدارة" };

type SearchParams = { tab?: string };

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  pending: { label: "في انتظار الموافقة", cls: "bg-amber-100 text-amber-800" },
  published: { label: "منشورة", cls: "bg-emerald-100 text-emerald-800" },
  rejected: { label: "مرفوضة", cls: "bg-red-100 text-red-800" },
};

export default async function AdminJobsQueuePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const tab = sp.tab ?? "pending";

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card border-2 border-[var(--color-accent)]">
          <h1 className="text-xl font-extrabold text-[var(--color-accent)]">SUPABASE_SERVICE_ROLE_KEY مش متظبط</h1>
        </div>
      </div>
    );
  }

  const db = supabaseAdmin();
  const statusFilter = tab === "all" ? undefined : tab;
  let q = db
    .from("jobs")
    .select("id, title, description, requirements, experience_required, age_min, age_max, governorates, openings, status, rejection_reason, created_at, reviewed_at, submitted_by_company, companies(name, logo_url, email)")
    .order("created_at", { ascending: false })
    .limit(500);
  if (statusFilter) q = q.eq("status", statusFilter);

  const { data: jobs, error } = await q;

  type JobRow = {
    id: string; title: string; description: string; requirements: string | null;
    experience_required: string | null; age_min: number | null; age_max: number | null;
    governorates: string[] | null; openings: number | null; status: string;
    rejection_reason: string | null; created_at: string; reviewed_at: string | null;
    submitted_by_company: boolean;
    companies: { name: string; logo_url: string | null; email: string } | { name: string; logo_url: string | null; email: string }[] | null;
  };

  const list = ((jobs ?? []) as JobRow[]).map((j) => ({
    ...j,
    company: Array.isArray(j.companies) ? j.companies[0] ?? null : j.companies,
  }));

  const tabs = [
    { key: "pending", label: "في الانتظار" },
    { key: "published", label: "منشورة" },
    { key: "rejected", label: "مرفوضة" },
    { key: "all", label: "الكل" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-primary)]">مراجعة الوظائف من الشركات</h1>
          <p className="text-sm text-[var(--color-muted)]">
            وافق أو ارفض الوظائف اللي قدّمتها الشركات قبل نشرها على الموقع.
          </p>
        </div>
        <Link href="/admin" className="btn-outline text-sm">→ التقديمات</Link>
      </div>

      <div className="flex gap-1 border-b">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={`/admin/jobs?tab=${t.key}`}
            className={`px-4 py-2 text-sm font-bold border-b-2 ${
              tab === t.key
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-primary)]"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {error && (
        <div className="card border-2 border-[var(--color-accent)]">
          <div className="text-sm text-[var(--color-accent)] font-bold">{error.message}</div>
        </div>
      )}

      {list.length === 0 ? (
        <div className="card text-center py-10 text-[var(--color-muted)]">لا توجد وظائف في هذه القائمة.</div>
      ) : (
        <div className="space-y-3">
          {list.map((j) => {
            const s = STATUS_LABEL[j.status] ?? { label: j.status, cls: "bg-gray-100" };
            return (
              <div key={j.id} className="card">
                <div className="flex items-start gap-3 flex-wrap">
                  {j.company?.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={j.company.logo_url} alt={j.company.name} className="w-12 h-12 rounded-lg object-cover bg-[var(--color-cream)]" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-[var(--color-cream)] text-[var(--color-primary)] flex items-center justify-center font-extrabold">
                      {j.company?.name?.charAt(0) ?? "ش"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-[var(--color-primary)]">{j.title}</h3>
                      <span className={`inline-block text-xs font-bold px-2 py-1 rounded-full ${s.cls}`}>
                        {s.label}
                      </span>
                      <span className={`inline-block text-xs font-bold px-2 py-1 rounded-full ${j.submitted_by_company ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700"}`}>
                        {j.submitted_by_company ? "من شركة مسجّلة" : "مستوردة"}
                      </span>
                    </div>
                    <div className="text-sm text-[var(--color-muted)]">
                      {j.company?.name} {j.company?.email && !j.company.email.endsWith("@psma.local") && <span dir="ltr">— {j.company.email}</span>}
                    </div>
                  </div>
                  <div className="text-xs text-[var(--color-muted)] whitespace-nowrap">
                    {new Date(j.created_at).toLocaleDateString("ar-EG")}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-sm">
                  <div>
                    <div className="text-xs font-bold text-[var(--color-muted)]">الوصف</div>
                    <p className="whitespace-pre-line">{j.description}</p>
                  </div>
                  {j.requirements && (
                    <div>
                      <div className="text-xs font-bold text-[var(--color-muted)]">المتطلبات</div>
                      <p className="whitespace-pre-line">{j.requirements}</p>
                    </div>
                  )}
                  {j.experience_required && (
                    <div>
                      <div className="text-xs font-bold text-[var(--color-muted)]">الخبرة</div>
                      <p>{j.experience_required}</p>
                    </div>
                  )}
                  {(j.age_min || j.age_max) && (
                    <div>
                      <div className="text-xs font-bold text-[var(--color-muted)]">السن</div>
                      <p>{j.age_min ?? "—"} إلى {j.age_max ?? "—"}</p>
                    </div>
                  )}
                  {j.governorates && j.governorates.length > 0 && (
                    <div className="md:col-span-2">
                      <div className="text-xs font-bold text-[var(--color-muted)]">المحافظات</div>
                      <p>{j.governorates.join("، ")}</p>
                    </div>
                  )}
                </div>

                {j.status === "rejected" && j.rejection_reason && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
                    <span className="font-bold text-red-800">سبب الرفض السابق:</span>{" "}
                    <span className="text-red-900">{j.rejection_reason}</span>
                  </div>
                )}

                <JobReviewActions
                  jobId={j.id}
                  status={j.status}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
