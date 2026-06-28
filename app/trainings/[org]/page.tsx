import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrg, groupByCategory, TRAINING_ORGS } from "@/lib/trainings";

export function generateStaticParams() {
  return TRAINING_ORGS.map((o) => ({ org: o.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ org: string }> }) {
  const { org: orgSlug } = await params;
  const org = getOrg(orgSlug);
  return { title: org ? `تدريبات ${org.name} — بصمة شباب مصر` : "تدريبات" };
}

export default async function OrgTrainings({ params }: { params: Promise<{ org: string }> }) {
  const { org: orgSlug } = await params;
  const org = getOrg(orgSlug);
  if (!org) notFound();
  const groups = groupByCategory(org.trainings);

  return (
    <>
      <section className="brand-bar text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/trainings" className="text-white/80 text-sm hover:text-white mb-3 inline-block">
            ← كل المؤسسات
          </Link>
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-2xl bg-white text-[var(--color-primary)] flex items-center justify-center font-extrabold text-2xl shrink-0"
            >
              {org.shortName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold mb-1">{org.name}</h1>
              <p className="text-white/85 max-w-2xl leading-relaxed">{org.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card mb-8">
            <p className="text-[var(--color-ink)] leading-relaxed">{org.description}</p>
            <a
              href={org.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-primary)] font-bold hover:underline text-sm mt-2 inline-block"
            >
              زيارة موقع المؤسسة ↗
            </a>
          </div>

          <h2 className="text-xl font-extrabold text-[var(--color-primary)] mb-4">
            {org.trainings.length} تدريب متاح
          </h2>

          {Object.entries(groups).map(([category, items]) => (
            <div key={category} className="mb-8">
              <h3 className="font-extrabold text-[var(--color-primary)] mb-3 inline-block bg-[var(--color-cream)] px-4 py-1.5 rounded-full text-sm">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/trainings/${org.slug}/${t.slug}`}
                    className="card hover:shadow-md transition-shadow flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-cream)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                        📚
                      </div>
                      <div className="font-bold text-[var(--color-primary)] truncate">{t.title}</div>
                    </div>
                    <span className="text-[var(--color-primary)] font-bold text-sm shrink-0">عرض ←</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
