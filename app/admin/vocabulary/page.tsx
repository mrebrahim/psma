import { supabaseAdmin } from "@/lib/supabase-admin";
import VocabularyClient from "./VocabularyClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "إدارة التاجز والمهارات — لوحة الإدارة" };

export default async function VocabularyPage() {
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
  const [{ data: categories }, { data: tags }, { data: synonyms }, { data: skills }, { data: weights }] = await Promise.all([
    db.from("tag_categories").select("id, name_canonical, display_order").order("display_order"),
    db.from("tags").select("id, name_canonical, category_id, status, is_active, created_at").order("status").order("name_canonical"),
    db.from("tag_synonyms").select("id, tag_id, synonym").order("synonym"),
    db.from("skills").select("id, name_canonical, status, is_active").order("name_canonical"),
    db.from("match_weights").select("*").eq("id", 1).maybeSingle(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <VocabularyClient
        categories={categories ?? []}
        initialTags={tags ?? []}
        initialSynonyms={synonyms ?? []}
        initialSkills={skills ?? []}
        initialWeights={weights ?? null}
      />
    </div>
  );
}
