import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { JOB_TYPES, GOVERNORATES, FIELDS } from "@/lib/content";
import JobsFilters from "./JobsFilters";

export const metadata = { title: "الوظائف المتاحة — بصمة شباب مصر" };
export const revalidate = 60;

function typeLabel(value: string | null) {
  return JOB_TYPES.find((t) => t.value === value)?.label ?? value ?? "";
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "الآن";
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  return `منذ ${Math.floor(diff / 86400)} يوم`;
}

type SearchParams = {
  company?: string;
  governorate?: string;
  field?: string;
  type?: string;
  q?: string;
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  let query = supabase
    .from("jobs")
    .select("id, title, location, governorate, job_type, field, openings, created_at, deadline, company_id, companies(name, sector)")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(300);

  if (sp.company) query = query.eq("company_id", sp.company);
  if (sp.governorate) query = query.eq("governorate", sp.governorate);
  if (sp.field) query = query.eq("field", sp.field);
  if (sp.type) query = query.eq("job_type", sp.type);
  if (sp.q) query = query.ilike("title", `%${sp.q}%`);

  const { data: jobs } = await query;

  const { data: companiesRows } = await supabase
    .from("companies")
    .select("id, name")
    .eq("status", "approved")
    .order("name")
    .limit(500);

  const list = (jobs ?? []).map((j) => ({
    ...j,
    companies: Array.isArray(j.companies) ? j.companies[0] ?? null : j.companies,
  }));

  return (
    <>
      <section className="brand-bar text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="inline-block text-xs font-extrabold bg-white/15 px-3 py-1 rounded-full mb-3">
              فرص العمل
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-2">
              وظائف متاحة الآن
            </h1>
            <p className="text-white/85 max-w-2xl leading-relaxed">
              أحدث الوظائف من شركاء بصمة شباب مصر — قدّم بضغطة واحدة.
            </p>
          </div>
          <Link
            href="/companies/register"
            className="bg-white text-[var(--color-primary)] font-extrabold px-6 py-3 rounded-full hover:bg-[var(--color-cream)] inline-flex items-center gap-2"
          >
            أنت شركة؟ سجّل واعرض وظائفك
          </Link>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <JobsFilters
            companies={companiesRows ?? []}
            governorates={GOVERNORATES}
            fields={FIELDS}
            jobTypes={JOB_TYPES}
            initial={{
              company: sp.company ?? "",
              governorate: sp.governorate ?? "",
              field: sp.field ?? "",
              type: sp.type ?? "",
              q: sp.q ?? "",
            }}
          />
        </div>
      </section>

      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-[var(--color-primary)]">
              {list.length} وظيفة متاحة
            </h2>
          </div>

          {list.length === 0 ? (
            <div className="card text-center py-14">
              <h3 className="text-xl font-extrabold text-[var(--color-primary)] mb-2">
                لا توجد وظائف مطابقة للبحث
              </h3>
              <p className="text-[var(--color-muted)] mb-5">
                جرّب تغيير الفلاتر أو تابعنا — يتم نشر وظائف جديدة باستمرار.
              </p>
              <Link href="/jobs" className="btn-primary">
                إعادة ضبط الفلاتر
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {list.map((j) => (
                <Link
                  key={j.id}
                  href={`/jobs/${j.id}`}
                  className="card flex flex-col"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-cream)] text-[var(--color-primary)] flex items-center justify-center font-extrabold text-lg shrink-0">
                      {(j.companies?.name ?? "ب").charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold text-[var(--color-primary)] text-lg mb-1 truncate">
                        {j.title}
                      </h3>
                      <div className="text-sm text-[var(--color-muted)] truncate">
                        {j.companies?.name ?? "شركة"}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto pt-2">
                    {j.job_type && <span className="chip">{typeLabel(j.job_type)}</span>}
                    {j.governorate && <span className="chip">{j.governorate}</span>}
                    {j.field && <span className="chip">{j.field}</span>}
                    {j.openings && <span className="chip">{j.openings} فرصة</span>}
                  </div>
                  <div className="text-xs text-[var(--color-muted)] mt-3">
                    {timeAgo(j.created_at)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
