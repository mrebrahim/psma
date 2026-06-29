"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { GOVERNORATES } from "@/lib/content";

type Tag = { id: number; name_canonical: string; category_id: number | null };
type Skill = { id: number; name_canonical: string };
type Profile = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  city: string | null;
  headline: string | null;
  summary: string | null;
  years_experience: number | null;
  qualification: string | null;
  field: string | null;
  completeness: number;
};

export default function ProfileEditorPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [myTagIds, setMyTagIds] = useState<Set<number>>(new Set());
  const [mySkillIds, setMySkillIds] = useState<Set<number>>(new Set());
  const [tagSearch, setTagSearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const { data: p } = await supabase
        .from("profiles").select("*").eq("auth_user_id", session.user.id).maybeSingle();
      if (!p) return;
      setProfile(p as Profile);

      const [tags, skills, pt, ps] = await Promise.all([
        supabase.from("tags").select("id, name_canonical, category_id").eq("is_active", true).eq("status", "approved").order("name_canonical"),
        supabase.from("skills").select("id, name_canonical").eq("is_active", true).eq("status", "approved").order("name_canonical"),
        supabase.from("profile_tags").select("tag_id").eq("profile_id", p.id),
        supabase.from("profile_skills").select("skill_id").eq("profile_id", p.id),
      ]);
      setAllTags((tags.data ?? []) as Tag[]);
      setAllSkills((skills.data ?? []) as Skill[]);
      setMyTagIds(new Set((pt.data ?? []).map((r: { tag_id: number }) => r.tag_id)));
      setMySkillIds(new Set((ps.data ?? []).map((r: { skill_id: number }) => r.skill_id)));
    })();
  }, []);

  const filteredTags = useMemo(() => {
    const q = tagSearch.trim().toLowerCase();
    if (!q) return allTags.slice(0, 30);
    return allTags.filter((t) => t.name_canonical.toLowerCase().includes(q)).slice(0, 40);
  }, [allTags, tagSearch]);

  const filteredSkills = useMemo(() => {
    const q = skillSearch.trim().toLowerCase();
    if (!q) return allSkills.slice(0, 30);
    return allSkills.filter((s) => s.name_canonical.toLowerCase().includes(q)).slice(0, 40);
  }, [allSkills, skillSearch]);

  async function toggleTag(tagId: number) {
    if (!profile) return;
    const has = myTagIds.has(tagId);
    if (has) {
      await supabase.from("profile_tags").delete().eq("profile_id", profile.id).eq("tag_id", tagId);
      const next = new Set(myTagIds); next.delete(tagId); setMyTagIds(next);
    } else {
      await supabase.from("profile_tags").insert({ profile_id: profile.id, tag_id: tagId });
      setMyTagIds(new Set(myTagIds).add(tagId));
    }
  }

  async function toggleSkill(skillId: number) {
    if (!profile) return;
    const has = mySkillIds.has(skillId);
    if (has) {
      await supabase.from("profile_skills").delete().eq("profile_id", profile.id).eq("skill_id", skillId);
      const next = new Set(mySkillIds); next.delete(skillId); setMySkillIds(next);
    } else {
      await supabase.from("profile_skills").insert({ profile_id: profile.id, skill_id: skillId });
      setMySkillIds(new Set(mySkillIds).add(skillId));
    }
  }

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true); setError(null); setInfo(null);
    const fd = new FormData(e.currentTarget);
    const updates = {
      full_name: String(fd.get("full_name") ?? "").trim(),
      headline: String(fd.get("headline") ?? "").trim() || null,
      summary: String(fd.get("summary") ?? "").trim() || null,
      city: String(fd.get("city") ?? "") || null,
      years_experience: Number(fd.get("years_experience")) || null,
      qualification: String(fd.get("qualification") ?? "").trim() || null,
    };
    const filled = Object.values({
      ...updates,
      tags: myTagIds.size > 0 ? 1 : 0,
      skills: mySkillIds.size > 0 ? 1 : 0,
    }).filter((v) => v !== null && v !== "" && v !== 0).length;
    const completeness = Math.min(100, Math.round((filled / 9) * 100));

    const { error: err } = await supabase
      .from("profiles").update({ ...updates, completeness }).eq("id", profile.id);
    setSaving(false);
    if (err) return setError(err.message);
    setInfo("اتحفظ ✓");
    setProfile({ ...profile, ...updates, completeness });
  }

  async function rescore() {
    if (!profile) return;
    setSaving(true); setInfo(null); setError(null);
    const { data, error: err } = await supabase.rpc("rescore_profile", { p_profile_id: profile.id });
    setSaving(false);
    if (err) return setError(err.message);
    setInfo(`اتحدثت ${data ?? 0} ترشيحات لك ✓`);
  }

  if (!profile) return <div className="text-[var(--color-muted)]">جارٍ التحميل...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-end gap-2">
        <button onClick={rescore} disabled={saving} className="btn-primary text-sm disabled:opacity-60">
          {saving ? "جارٍ..." : "تحديث ترشيحاتي ↻"}
        </button>
      </div>
      <form onSubmit={saveProfile} className="card">
        <h2 className="font-extrabold text-xl text-[var(--color-primary)] mb-3">بياناتي الأساسية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <label className="label">الاسم الكامل *</label>
            <input name="full_name" required defaultValue={profile.full_name} className="input" />
          </div>
          <div className="md:col-span-2">
            <label className="label">عنوان مهني (Headline)</label>
            <input name="headline" defaultValue={profile.headline ?? ""} className="input" placeholder="مثال: محاسب أول بخبرة 3 سنين" />
          </div>
          <div className="md:col-span-2">
            <label className="label">نبذة عنك</label>
            <textarea name="summary" defaultValue={profile.summary ?? ""} className="textarea" placeholder="نبذة قصيرة عن خبراتك واهتماماتك" />
          </div>
          <div>
            <label className="label">المحافظة</label>
            <select name="city" defaultValue={profile.city ?? ""} className="select">
              <option value="">اختر المحافظة</option>
              {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="label">سنين الخبرة</label>
            <input name="years_experience" type="number" min={0} max={50} dir="ltr" defaultValue={profile.years_experience ?? ""} className="input" />
          </div>
          <div className="md:col-span-2">
            <label className="label">المؤهل</label>
            <input name="qualification" defaultValue={profile.qualification ?? ""} className="input" placeholder="مثال: بكالوريوس تجارة" />
          </div>
        </div>
        {info && <div className="mt-3 text-sm text-[var(--color-primary)] font-bold">{info}</div>}
        {error && <div className="mt-3 text-sm text-[var(--color-accent)] font-bold">{error}</div>}
        <button type="submit" disabled={saving} className="btn-primary mt-4 disabled:opacity-60">
          {saving ? "جارٍ الحفظ..." : "حفظ"}
        </button>
      </form>

      <div className="card">
        <h2 className="font-extrabold text-xl text-[var(--color-primary)] mb-1">التاجز ({myTagIds.size})</h2>
        <p className="text-sm text-[var(--color-muted)] mb-3">
          اختار التاجز اللي بتوصفك. كل ما تختار أكتر، الترشيحات تبقى أدق.
        </p>
        <input
          value={tagSearch}
          onChange={(e) => setTagSearch(e.target.value)}
          placeholder="ابحث في التاجز..."
          className="input mb-3"
        />
        <div className="flex flex-wrap gap-2">
          {filteredTags.map((t) => {
            const selected = myTagIds.has(t.id);
            return (
              <button key={t.id} type="button" onClick={() => toggleTag(t.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                  selected
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                    : "bg-white text-[var(--color-ink)] border-gray-200 hover:border-[var(--color-primary)]"
                }`}>
                {selected && "✓ "}{t.name_canonical}
              </button>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h2 className="font-extrabold text-xl text-[var(--color-primary)] mb-1">المهارات ({mySkillIds.size})</h2>
        <p className="text-sm text-[var(--color-muted)] mb-3">
          المهارات اللي بتعرفها — البرامج، اللغات، الأدوات.
        </p>
        <input
          value={skillSearch}
          onChange={(e) => setSkillSearch(e.target.value)}
          placeholder="ابحث في المهارات..."
          className="input mb-3"
        />
        <div className="flex flex-wrap gap-2">
          {filteredSkills.map((s) => {
            const selected = mySkillIds.has(s.id);
            return (
              <button key={s.id} type="button" onClick={() => toggleSkill(s.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                  selected
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                    : "bg-white text-[var(--color-ink)] border-gray-200 hover:border-[var(--color-primary)]"
                }`}>
                {selected && "✓ "}{s.name_canonical}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
