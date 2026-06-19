"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Company = { id: string; name: string };
type JobType = { value: string; label: string };

export default function JobsFilters({
  companies,
  governorates,
  fields,
  jobTypes,
  initial,
}: {
  companies: Company[];
  governorates: string[];
  fields: string[];
  jobTypes: JobType[];
  initial: { company: string; governorate: string; field: string; type: string; q: string };
}) {
  const router = useRouter();
  const [company, setCompany] = useState(initial.company);
  const [governorate, setGovernorate] = useState(initial.governorate);
  const [field, setField] = useState(initial.field);
  const [type, setType] = useState(initial.type);
  const [q, setQ] = useState(initial.q);

  function apply(patch: Partial<typeof initial>) {
    const params = new URLSearchParams();
    const final = { company, governorate, field, type, q, ...patch };
    if (final.company) params.set("company", final.company);
    if (final.governorate) params.set("governorate", final.governorate);
    if (final.field) params.set("field", final.field);
    if (final.type) params.set("type", final.type);
    if (final.q) params.set("q", final.q);
    router.push(`/jobs${params.toString() ? "?" + params.toString() : ""}`);
  }

  function reset() {
    setCompany(""); setGovernorate(""); setField(""); setType(""); setQ("");
    router.push("/jobs");
  }

  const hasAny = company || governorate || field || type || q;

  return (
    <div className="card">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply({});
        }}
        className="grid grid-cols-1 md:grid-cols-12 gap-3"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث بالمسمى الوظيفي..."
          className="input md:col-span-4"
        />
        <select
          value={company}
          onChange={(e) => { setCompany(e.target.value); apply({ company: e.target.value }); }}
          className="select md:col-span-3"
        >
          <option value="">كل الشركات</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={governorate}
          onChange={(e) => { setGovernorate(e.target.value); apply({ governorate: e.target.value }); }}
          className="select md:col-span-2"
        >
          <option value="">كل المحافظات</option>
          {governorates.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select
          value={field}
          onChange={(e) => { setField(e.target.value); apply({ field: e.target.value }); }}
          className="select md:col-span-2"
        >
          <option value="">كل المجالات</option>
          {fields.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <button type="submit" className="btn-primary md:col-span-1 justify-center">بحث</button>

        {hasAny && (
          <div className="md:col-span-12 flex flex-wrap items-center gap-2">
            <select
              value={type}
              onChange={(e) => { setType(e.target.value); apply({ type: e.target.value }); }}
              className="select max-w-xs"
            >
              <option value="">كل أنواع التعاقد</option>
              {jobTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <button type="button" onClick={reset} className="btn-outline text-sm">
              مسح الفلاتر
            </button>
          </div>
        )}
        {!hasAny && (
          <div className="md:col-span-12">
            <select
              value={type}
              onChange={(e) => { setType(e.target.value); apply({ type: e.target.value }); }}
              className="select max-w-xs"
            >
              <option value="">كل أنواع التعاقد</option>
              {jobTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        )}
      </form>
    </div>
  );
}
