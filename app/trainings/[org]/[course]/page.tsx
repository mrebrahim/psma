import Link from "next/link";
import { notFound } from "next/navigation";
import { getTraining, TRAINING_ORGS } from "@/lib/trainings";

export function generateStaticParams() {
  return TRAINING_ORGS.flatMap((o) =>
    o.trainings.map((t) => ({ org: o.slug, course: t.slug })),
  );
}

export async function generateMetadata({ params }: { params: Promise<{ org: string; course: string }> }) {
  const { org: orgSlug, course } = await params;
  const found = getTraining(orgSlug, course);
  return { title: found ? `${found.training.title} — ${found.org.name}` : "تدريب" };
}

export default async function TrainingDetail({ params }: { params: Promise<{ org: string; course: string }> }) {
  const { org: orgSlug, course } = await params;
  const found = getTraining(orgSlug, course);
  if (!found) notFound();
  const { org, training } = found;

  const related = org.trainings.filter((t) => t.category === training.category && t.slug !== training.slug).slice(0, 4);

  return (
    <>
      <section className="brand-bar text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={`/trainings/${org.slug}`} className="text-white/80 text-sm hover:text-white mb-3 inline-block">
            ← كل تدريبات {org.name}
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white text-[var(--color-primary)] flex items-center justify-center text-3xl shrink-0">
              📚
            </div>
            <div>
              <span className="inline-block text-xs font-bold bg-white/15 px-3 py-1 rounded-full mb-2">
                {training.category}
              </span>
              <h1 className="text-2xl md:text-4xl font-extrabold mb-1">{training.title}</h1>
              <div className="text-white/85 font-bold">{org.name}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card">
            <h2 className="text-xl font-extrabold text-[var(--color-primary)] mb-3">
              عن التدريب
            </h2>
            {training.description ? (
              <p className="text-[var(--color-ink)] leading-relaxed whitespace-pre-line">
                {training.description}
              </p>
            ) : (
              <div className="text-[var(--color-ink)] leading-relaxed space-y-3">
                <p>
                  تدريب <strong>{training.title}</strong> مقدّم من <strong>{org.name}</strong>{" "}
                  ضمن مجال <strong>{training.category}</strong>. التدريب <strong>مجاني بالكامل</strong>،
                  ومتاح للشباب الراغبين في تطوير مهاراتهم في هذا المجال.
                </p>
                <p>
                  للاطلاع على التفاصيل الكاملة (المتطلبات، المواعيد، مكان التدريب، الشهادة الممنوحة)
                  والتقديم، اضغط على الزر بالأسفل للانتقال لصفحة التدريب على موقع {org.name}.
                </p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-[var(--color-line)] text-center">
              <a
                href={training.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3"
              >
                قدّم الآن ↗
              </a>
              <p className="text-xs text-[var(--color-muted)] mt-3">
                هتتحوّل لصفحة التدريب على موقع {org.name}
              </p>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-10">
              <h3 className="text-lg font-extrabold text-[var(--color-primary)] mb-4">
                تدريبات تانية في {training.category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {related.map((t) => (
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
          )}
        </div>
      </section>
    </>
  );
}
