import Link from "next/link";
import { TRAINING_ORGS } from "@/lib/trainings";

export const metadata = { title: "التدريبات المجانية — بصمة شباب مصر" };

export default function TrainingsIndex() {
  return (
    <>
      <section className="brand-bar text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block text-xs font-extrabold bg-white/15 px-3 py-1 rounded-full mb-3">
            التدريبات
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3">
            تدريبات مجانية من شركائنا
          </h1>
          <p className="text-white/85 max-w-2xl leading-relaxed">
            مجموعة مختارة من المؤسسات اللي بتقدّم تدريب مهني وتقني وإداري مجاني للشباب.
            اضغط على المؤسسة عشان تشوف كل التدريبات المتاحة وتقدّم.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TRAINING_ORGS.map((org) => (
              <Link
                key={org.slug}
                href={`/trainings/${org.slug}`}
                className="card hover:shadow-lg transition-shadow flex flex-col"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-extrabold text-xl mb-3"
                  style={{ background: org.color }}
                >
                  {org.shortName.charAt(0)}
                </div>
                <h3 className="font-extrabold text-[var(--color-primary)] text-xl mb-1">
                  {org.name}
                </h3>
                <p className="text-sm text-[var(--color-muted)] mb-3">{org.tagline}</p>
                <p className="text-sm text-[var(--color-ink)] leading-relaxed mb-4 flex-1">
                  {org.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-line)]">
                  <span className="text-xs font-bold text-[var(--color-primary)]">
                    {org.trainings.length} تدريب متاح
                  </span>
                  <span className="text-[var(--color-primary)] font-bold text-sm">
                    عرض التدريبات ←
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
