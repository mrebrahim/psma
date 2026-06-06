import { PROGRAMS } from "@/lib/content";
import Link from "next/link";

export const metadata = { title: "البرامج — بصمة شباب مصر" };

export default function ProgramsPage() {
  return (
    <>
      <section className="brand-bar text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block text-xs font-extrabold bg-white/15 px-3 py-1 rounded-full mb-3">
            برامجنا
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3">
            منظومة متكاملة لتمكين الشباب
          </h1>
          <p className="text-white/85 max-w-2xl leading-relaxed">
            من التوظيف والتدريب إلى ريادة الأعمال والقيادة والصحة المجتمعية.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PROGRAMS.map((p) => (
              <div key={p.key} className="card">
                <h3 className="font-extrabold text-xl text-[var(--color-primary)] mb-2">
                  {p.title}
                </h3>
                <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                  {p.desc}
                </p>
                {p.key === "jobs" && (
                  <Link href="/jobs" className="btn-outline text-sm">
                    تصفّح وظائف الملتقى
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
