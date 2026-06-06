import { PROGRAMS } from "@/lib/content";

const ICONS: Record<string, React.ReactNode> = {
  briefcase: <path d="M9 4h6m-9 4h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2zm3 0V6a2 2 0 012-2h4a2 2 0 012 2v2" />,
  laptop: <path d="M4 6h16v10H4zM2 18h20" />,
  star: <path d="M12 3l2.7 5.5 6 .9-4.4 4.3 1.1 6L12 17l-5.4 2.7 1.1-6-4.4-4.3 6-.9z" />,
  rocket: <path d="M5 19l3-3m6-12c4 0 6 2 6 6l-6 6-6-6c0-4 2-6 6-6zm0 5a1 1 0 100 2 1 1 0 000-2z" />,
  heart: <path d="M12 21s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 11c0 5.5-7 10-7 10z" />,
  megaphone: <path d="M3 11v2l8 4V7zM15 7v10M19 10v4" />,
  globe: <path d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 0v18M3 12h18" />,
};

export default function ProgramsGrid() {
  return (
    <section id="programs" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="chip mb-3">برامجنا</span>
          <h2 className="section-title">ماذا نقدّم للشباب المصري؟</h2>
          <p className="section-sub max-w-2xl mx-auto">
            منظومة متكاملة من البرامج تغطي التوظيف والتدريب والقيادة وريادة
            الأعمال والصحة المجتمعية.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROGRAMS.map((p) => (
            <div key={p.key} className="card group">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-cream)] text-[var(--color-primary)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {ICONS[p.icon]}
                </svg>
              </div>
              <h3 className="font-extrabold text-lg text-[var(--color-primary)] mb-2">{p.title}</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
