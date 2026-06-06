import Link from "next/link";
import TeamCard from "./TeamCard";
import { TEAM, STAFF } from "@/lib/content";

export default function TeamGrid() {
  return (
    <section className="py-16 md:py-20 bg-[var(--color-cream-soft)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="chip mb-3">فريق العمل</span>
          <h2 className="section-title">قيادات بصمة شباب مصر</h2>
          <p className="section-sub max-w-2xl mx-auto">
            مجلس الأمناء ومجلس الإدارة واللجان التنفيذية الذين يقودون عمل المؤسسة.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
          {TEAM.map((m, i) => (
            <TeamCard key={i} name={m.name} role={m.role} photo={m.photo} />
          ))}
        </div>

        <div className="text-center mb-10">
          <div className="inline-block w-24 h-px bg-[var(--color-line)] mb-6" />
          <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--color-primary)] mb-2">
            فريق العمل
          </h3>
          <p className="text-[var(--color-muted)] max-w-2xl mx-auto">
            الفِرق المتخصصة اللي بتنفّذ أنشطة المؤسسة يومًا بيوم.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {STAFF.slice(0, 8).map((m, i) => (
            <TeamCard key={i} name={m.name} role={m.role} photo={m.photo} compact />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/team" className="btn-outline">
            شوف فريقنا كامل
            <span aria-hidden>←</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
