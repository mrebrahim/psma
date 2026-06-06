import { TEAM } from "@/lib/content";

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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {TEAM.map((m, i) => (
            <div
              key={i}
              className="bg-white border border-[var(--color-line)] rounded-2xl p-5 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white mx-auto mb-3 flex items-center justify-center text-2xl font-extrabold">
                ب
              </div>
              <div className="font-extrabold text-[var(--color-primary)] text-sm">
                {m.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
