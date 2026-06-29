"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Category = { id: number; name_canonical: string };
type Tag = { id: number; name_canonical: string; category_id: number | null; status: string; is_active: boolean };
type Synonym = { id: number; tag_id: number; synonym: string };
type Skill = { id: number; name_canonical: string; status: string; is_active: boolean };
type Weights = {
  tag_match_max: number; category_match: number; skills_match_max: number;
  experience_relevance_max: number; city_match: number; years_experience_in_range: number;
  notify_threshold: number;
} | null;

export default function VocabularyClient({
  categories, initialTags, initialSynonyms, initialSkills, initialWeights,
}: {
  categories: Category[]; initialTags: Tag[]; initialSynonyms: Synonym[]; initialSkills: Skill[]; initialWeights: Weights;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"tags" | "skills" | "weights">("tags");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);

  async function call(body: Record<string, unknown>) {
    setBusy(true);
    const res = await fetch("/api/admin/vocabulary", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);
    if (!res.ok) { alert("فشل: " + (await res.text())); return false; }
    router.refresh();
    return true;
  }

  const filteredTags = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return initialTags;
    return initialTags.filter((t) => t.name_canonical.toLowerCase().includes(q));
  }, [initialTags, search]);

  const tagsByCategory = useMemo(() => {
    const groups: Record<string, Tag[]> = {};
    for (const t of filteredTags) {
      const cat = categories.find((c) => c.id === t.category_id)?.name_canonical ?? "بدون تصنيف";
      (groups[cat] ||= []).push(t);
    }
    return groups;
  }, [filteredTags, categories]);

  const synonymsByTag = useMemo(() => {
    const m: Record<number, Synonym[]> = {};
    for (const s of initialSynonyms) (m[s.tag_id] ||= []).push(s);
    return m;
  }, [initialSynonyms]);

  const filteredSkills = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return initialSkills;
    return initialSkills.filter((s) => s.name_canonical.toLowerCase().includes(q));
  }, [initialSkills, search]);

  const pendingCount = initialTags.filter((t) => t.status === "pending").length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-[var(--color-primary)]">إدارة قاموس التاجز والمهارات</h1>

      <div className="flex gap-1 border-b">
        {[
          { key: "tags", label: `التاجز (${initialTags.length})${pendingCount > 0 ? ` · ${pendingCount} للموافقة` : ""}` },
          { key: "skills", label: `المهارات (${initialSkills.length})` },
          { key: "weights", label: "أوزان الـ matching" },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
            className={`px-4 py-2 text-sm font-bold border-b-2 ${
              tab === t.key ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                            : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-primary)]"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab !== "weights" && (
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث..." className="input max-w-md"
        />
      )}

      {tab === "tags" && (
        <div className="space-y-6">
          <AddTagForm categories={categories} onSubmit={(name, cat) => call({ action: "create_tag", name, category_id: cat })} busy={busy} />

          {Object.entries(tagsByCategory).map(([catName, tags]) => (
            <div key={catName} className="card">
              <h3 className="font-extrabold text-[var(--color-primary)] mb-3">{catName} ({tags.length})</h3>
              <div className="space-y-2">
                {tags.map((t) => (
                  <TagRow key={t.id} tag={t}
                    synonyms={synonymsByTag[t.id] ?? []}
                    onApprove={() => call({ action: "approve_tag", id: t.id })}
                    onDelete={() => confirm(`حذف "${t.name_canonical}" وكل مرادفاتها؟`) && call({ action: "delete_tag", id: t.id })}
                    onAddSynonym={(syn) => call({ action: "create_synonym", tag_id: t.id, synonym: syn })}
                    onDeleteSynonym={(id) => call({ action: "delete_synonym", id })}
                    busy={busy}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "skills" && (
        <div className="space-y-4">
          <AddSkillForm onSubmit={(name) => call({ action: "create_skill", name })} busy={busy} />
          <div className="card">
            <div className="flex flex-wrap gap-2">
              {filteredSkills.map((s) => (
                <div key={s.id} className="flex items-center gap-1 bg-[var(--color-cream)] rounded-full px-3 py-1 text-sm">
                  <span className="font-bold">{s.name_canonical}</span>
                  <button onClick={() => confirm(`حذف "${s.name_canonical}"؟`) && call({ action: "delete_skill", id: s.id })}
                    className="text-[var(--color-accent)] font-bold mr-1 hover:underline">×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "weights" && initialWeights && (
        <WeightsForm initial={initialWeights} onSave={(w) => call({ action: "update_weights", weights: w })} busy={busy} />
      )}
    </div>
  );
}

function AddTagForm({ categories, onSubmit, busy }: { categories: Category[]; onSubmit: (name: string, cat: number | null) => void; busy: boolean }) {
  const [name, setName] = useState("");
  const [catId, setCatId] = useState<number | null>(null);
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; onSubmit(name.trim(), catId); setName(""); }}
      className="card flex flex-wrap gap-2 items-end">
      <div className="flex-1 min-w-[200px]">
        <label className="label">إضافة تاج جديد</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="مثال: مهندس DevOps" />
      </div>
      <select value={catId ?? ""} onChange={(e) => setCatId(e.target.value ? parseInt(e.target.value) : null)} className="select max-w-xs">
        <option value="">اختر تصنيف</option>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name_canonical}</option>)}
      </select>
      <button disabled={busy} className="btn-primary disabled:opacity-60">إضافة</button>
    </form>
  );
}

function AddSkillForm({ onSubmit, busy }: { onSubmit: (name: string) => void; busy: boolean }) {
  const [name, setName] = useState("");
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; onSubmit(name.trim()); setName(""); }}
      className="card flex gap-2 items-end">
      <div className="flex-1">
        <label className="label">إضافة مهارة جديدة</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="مثال: Kubernetes" />
      </div>
      <button disabled={busy} className="btn-primary disabled:opacity-60">إضافة</button>
    </form>
  );
}

function TagRow({ tag, synonyms, onApprove, onDelete, onAddSynonym, onDeleteSynonym, busy }: {
  tag: Tag; synonyms: Synonym[];
  onApprove: () => void; onDelete: () => void;
  onAddSynonym: (s: string) => void; onDeleteSynonym: (id: number) => void;
  busy: boolean;
}) {
  const [showSyn, setShowSyn] = useState(false);
  const [syn, setSyn] = useState("");
  return (
    <div className="border border-gray-100 rounded-lg p-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="font-bold">{tag.name_canonical}</span>
          {tag.status === "pending" && <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">للموافقة</span>}
          {!tag.is_active && <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">غير نشطة</span>}
          <span className="text-xs text-[var(--color-muted)]">{synonyms.length} مرادف</span>
        </div>
        <div className="flex gap-2 text-sm">
          {tag.status === "pending" && (
            <button onClick={onApprove} disabled={busy} className="text-emerald-700 font-bold hover:underline disabled:opacity-50">✓ اعتماد</button>
          )}
          <button onClick={() => setShowSyn(!showSyn)} className="text-[var(--color-primary)] font-bold hover:underline">
            {showSyn ? "إخفاء" : "المرادفات"}
          </button>
          <button onClick={onDelete} disabled={busy} className="text-red-700 font-bold hover:underline disabled:opacity-50">حذف</button>
        </div>
      </div>
      {showSyn && (
        <div className="mt-3 space-y-2">
          <div className="flex flex-wrap gap-1">
            {synonyms.map((s) => (
              <div key={s.id} className="flex items-center gap-1 bg-[var(--color-cream)] rounded-full px-2 py-1 text-xs">
                <span>{s.synonym}</span>
                <button onClick={() => onDeleteSynonym(s.id)} className="text-[var(--color-accent)] font-bold mr-1">×</button>
              </div>
            ))}
            {synonyms.length === 0 && <span className="text-xs text-[var(--color-muted)]">لا توجد مرادفات بعد.</span>}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (!syn.trim()) return; onAddSynonym(syn.trim()); setSyn(""); }}
            className="flex gap-2">
            <input value={syn} onChange={(e) => setSyn(e.target.value)} placeholder="مرادف جديد (عربي أو إنجليزي)" className="input text-sm" />
            <button disabled={busy} className="btn-outline text-sm">+</button>
          </form>
        </div>
      )}
    </div>
  );
}

function WeightsForm({ initial, onSave, busy }: { initial: NonNullable<Weights>; onSave: (w: Record<string, number>) => void; busy: boolean }) {
  const [w, setW] = useState(initial);
  const total = w.tag_match_max + w.category_match + w.skills_match_max + w.experience_relevance_max + w.city_match + w.years_experience_in_range;
  const fields: { key: keyof typeof w; label: string; hint?: string }[] = [
    { key: "tag_match_max", label: "تطابق التاجز (max)", hint: "نسبة تطابق تاجز البروفايل مع تاجز الوظيفة" },
    { key: "category_match", label: "تطابق المجال", hint: "البروفايل عنده تاج في نفس مجال الوظيفة" },
    { key: "skills_match_max", label: "تطابق المهارات (max)", hint: "5 نقاط لكل مهارة موجودة في وصف الوظيفة" },
    { key: "experience_relevance_max", label: "صلة الخبرة السابقة", hint: "اشتغل قبل كده في نفس مجال الوظيفة" },
    { key: "city_match", label: "تطابق المحافظة" },
    { key: "years_experience_in_range", label: "سنين الخبرة (لو متظبطة)" },
    { key: "notify_threshold", label: "حد إيميل الإشعار", hint: "أقل score يبعت إيميل تلقائي" },
  ];
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(w as unknown as Record<string, number>); }} className="card max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="label">{f.label}</label>
            <input
              type="number" min={0} max={100} dir="ltr" className="input"
              value={w[f.key]} onChange={(e) => setW({ ...w, [f.key]: parseInt(e.target.value) || 0 })}
            />
            {f.hint && <div className="text-xs text-[var(--color-muted)] mt-1">{f.hint}</div>}
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-[var(--color-cream)] rounded-lg text-sm">
        مجموع نقاط الـ matching (بدون threshold): <strong className="text-[var(--color-primary)]">{total}</strong>
        {total !== 100 && <span className="text-amber-700 mr-2">(عادةً 100)</span>}
      </div>
      <button disabled={busy} className="btn-primary mt-4 disabled:opacity-60">حفظ</button>
    </form>
  );
}
