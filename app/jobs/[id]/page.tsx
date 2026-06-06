import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { JOB_TYPES } from "@/lib/content";
import ApplyForm from "./ApplyForm";

export const revalidate = 60;

function typeLabel(value: string | null) {
  return JOB_TYPES.find((t) => t.value === value)?.label ?? value ?? "";
}

type Params = { id: string };

function pickCompany<T>(c: T | T[] | null | undefined): T | null {
  if (!c) return null;
  return Array.isArray(c) ? c[0] ?? null : c;
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const { data } = await supabase.from("jobs").select("title, companies(name)").eq("id", id).single();
  const company = pickCompany<{ name: string }>(data?.companies);
  return { title: data ? `${data.title} — ${company?.name ?? ""}` : "وظيفة" };
}

export default async function JobDetail({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const { data: rawJob } = await supabase
    .from("jobs")
    .select("*, companies(name, sector, description, website)")
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (!rawJob) notFound();
  const job = {
    ...rawJob,
    companies: pickCompany<{ name: string; sector: string | null; description: string | null; website: string | null }>(rawJob.companies),
  };

  return (
    <>
      <section className="brand-bar text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/jobs" className="text-white/80 text-sm hover:text-white mb-3 inline-block">
            ← العودة للوظائف
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white text-[var(--color-primary)] flex items-center justify-center font-extrabold text-2xl shrink-0">
              {(job.companies?.name ?? "ب").charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold mb-2">{job.title}</h1>
              <div className="text-white/85 font-bold">{job.companies?.name}</div>
              <div className="flex flex-wrap gap-2 mt-3">
                {job.job_type && (
                  <span className="bg-white/15 px-3 py-1 rounded-full text-xs font-bold">
                    {typeLabel(job.job_type)}
                  </span>
                )}
                {job.governorate && (
                  <span className="bg-white/15 px-3 py-1 rounded-full text-xs font-bold">
                    {job.governorate}
                  </span>
                )}
                {job.field && (
                  <span className="bg-white/15 px-3 py-1 rounded-full text-xs font-bold">
                    {job.field}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-extrabold text-[var(--color-primary)] mb-3">
                الوصف الوظيفي
              </h2>
              <p className="whitespace-pre-line text-[var(--color-ink)] leading-relaxed">
                {job.description}
              </p>
            </div>

            {job.requirements && (
              <div>
                <h2 className="text-xl font-extrabold text-[var(--color-primary)] mb-3">
                  المتطلبات
                </h2>
                <p className="whitespace-pre-line text-[var(--color-ink)] leading-relaxed">
                  {job.requirements}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {job.location && (
                <div className="card">
                  <div className="text-xs font-bold text-[var(--color-muted)] mb-1">الموقع</div>
                  <div className="font-bold">{job.location}</div>
                </div>
              )}
              {job.salary_range && (
                <div className="card">
                  <div className="text-xs font-bold text-[var(--color-muted)] mb-1">الراتب</div>
                  <div className="font-bold">{job.salary_range}</div>
                </div>
              )}
              {job.deadline && (
                <div className="card">
                  <div className="text-xs font-bold text-[var(--color-muted)] mb-1">آخر موعد للتقديم</div>
                  <div className="font-bold">{job.deadline}</div>
                </div>
              )}
              {job.companies?.sector && (
                <div className="card">
                  <div className="text-xs font-bold text-[var(--color-muted)] mb-1">القطاع</div>
                  <div className="font-bold">{job.companies.sector}</div>
                </div>
              )}
            </div>

            {job.companies?.description && (
              <div>
                <h2 className="text-xl font-extrabold text-[var(--color-primary)] mb-3">
                  عن الشركة
                </h2>
                <p className="text-[var(--color-ink)] leading-relaxed">
                  {job.companies.description}
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ApplyForm jobId={job.id} jobTitle={job.title} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
