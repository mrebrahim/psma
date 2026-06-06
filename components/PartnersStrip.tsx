import { PARTNERS } from "@/lib/content";

export default function PartnersStrip() {
  return (
    <section className="py-14 bg-white border-t border-[var(--color-line)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="chip mb-3">شركاؤنا</span>
          <h2 className="section-title">نعمل بالشراكة مع</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {PARTNERS.map((p) => (
            <div
              key={p}
              className="bg-[var(--color-cream-soft)] border border-[var(--color-line)] rounded-xl py-5 px-4 text-center text-sm font-bold text-[var(--color-primary-dark)]"
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
