import { IMPACT } from "@/lib/content";

export default function StatsBar() {
  return (
    <section className="bg-[var(--color-cream-soft)] border-y border-[var(--color-line)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {IMPACT.map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-extrabold text-[var(--color-primary)] mb-1 tabular-nums tracking-tight">
                {s.value}
              </div>
              <div className="text-sm font-bold text-[var(--color-muted)]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
