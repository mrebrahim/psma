"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Company = { id: string; name: string };
type Job = { id: string; title: string; company_id: string | null; company_name: string };

export default function AdminFilters({
  companies,
  jobs,
  initial,
}: {
  companies: Company[];
  jobs: Job[];
  initial: { company: string; job: string; q: string };
}) {
  const router = useRouter();
  const [company, setCompany] = useState(initial.company);
  const [job, setJob] = useState(initial.job);
  const [q, setQ] = useState(initial.q);

  const jobsFiltered = useMemo(
    () => (company ? jobs.filter((j) => j.company_id === company) : jobs),
    [company, jobs]
  );

  function apply(patch: Partial<typeof initial>) {
    const final = { company, job, q, ...patch };
    const params = new URLSearchParams();
    if (final.company) params.set("company", final.company);
    if (final.job) params.set("job", final.job);
    if (final.q) params.set("q", final.q);
    router.push(`/admin${params.toString() ? "?" + params.toString() : ""}`);
  }

  function reset() {
    setCompany(""); setJob(""); setQ("");
    router.push("/admin");
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); apply({}); }}
      className="card grid grid-cols-1 md:grid-cols-12 gap-3"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="ابحث بالاسم أو الموبايل أو الإيميل..."
        className="input md:col-span-4"
      />
      <select
        value={company}
        onChange={(e) => {
          const v = e.target.value;
          setCompany(v);
          setJob("");
          apply({ company: v, job: "" });
        }}
        className="select md:col-span-3"
      >
        <option value="">كل الشركات</option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <select
        value={job}
        onChange={(e) => { setJob(e.target.value); apply({ job: e.target.value }); }}
        className="select md:col-span-3"
      >
        <option value="">كل الوظائف</option>
        {jobsFiltered.map((j) => (
          <option key={j.id} value={j.id}>
            {j.title}{!company && j.company_name ? ` — ${j.company_name}` : ""}
          </option>
        ))}
      </select>
      <button type="submit" className="btn-primary md:col-span-1 justify-center">بحث</button>
      <button type="button" onClick={reset} className="btn-outline md:col-span-1 justify-center">مسح</button>
    </form>
  );
}
