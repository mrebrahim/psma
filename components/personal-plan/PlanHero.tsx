/**
 * Hero (first screen) for /personal-plan — منصة فاهم.
 *
 * Priority order (top → bottom), tuned so the title + price + CTA all sit above
 * the fold on a 375px screen with no scroll:
 *   1. Dominant headline (learn automation + video + coding with AI → and earn)
 *   2. Sub-line naming the 3 practical courses
 *   3. Value bar (free server · 15k+ templates · live support) — truthful only
 *   4. Price + CTA together in one visual moment
 *   5. Bonus line (+30 courses) — smallest, last, a reward not the hero
 *
 * Honesty rule: every figure below must be real & provable. If any value bar
 * item or number stops being true, remove it until it is.
 */

const VALUE_ITEMS = [
  "سيرفر مجاني",
  "+١٥٬٠٠٠ قالب",
  "دعم فني مباشر",
];

const COURSES = ["n8n Automation", "AI Video", "Vibe Coding"];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      className="w-4 h-4 shrink-0 text-[var(--color-primary)]"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.3 3.29 6.8-6.8a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function PlanHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-cream-soft)]">
      {/* soft brand glow, never pushes content */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl"
      />
      <div className="absolute -bottom-1 inset-x-0 h-1 bg-[var(--color-accent)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Content — right side on desktop (RTL natural order) */}
          <div className="lg:col-span-7">
            {/* 1 — Headline (largest element on the page) */}
            <h1 className="font-extrabold tracking-tight leading-[1.18] text-[clamp(1.75rem,6.5vw,3.5rem)] text-[var(--color-ink)]">
              اتعلّم الأتمتة والفيديو والبرمجة بالذكاء الاصطناعي — وابدأ{" "}
              <span className="text-[var(--color-accent)]">تكسب</span> منهم
            </h1>

            {/* 2 — Sub-line naming the 3 courses */}
            <p className="mt-4 text-base sm:text-lg text-[var(--color-muted)] leading-relaxed">
              ٣ كورسات عملية بالعربي:{" "}
              <bdi className="font-bold text-[var(--color-ink)]">
                {COURSES.join(" · ")}
              </bdi>
            </p>

            {/* 3 — Value bar (truthful items only) */}
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {VALUE_ITEMS.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-ink)]"
                >
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>

            {/* 4 — Price + CTA, one visual moment */}
            <div
              id="subscribe"
              className="mt-6 rounded-2xl border border-[var(--color-line)] bg-white p-5 sm:p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-[var(--color-muted)] font-bold">
                  كل ده بـ
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold text-[var(--color-primary)]">
                  ١٢.٥ ريال
                </span>
                <span className="text-[var(--color-muted)] font-bold">/شهر</span>
              </div>

              <div id="hero-cta" className="mt-4 flex flex-col sm:flex-row gap-3">
                <a
                  href="#subscribe"
                  className="btn-accent w-full sm:w-auto justify-center !py-3 min-h-[48px] text-base font-extrabold"
                >
                  ابدأ خطتي الشخصية
                  <span aria-hidden>←</span>
                </a>
                <a
                  href="#courses"
                  className="btn-outline w-full sm:w-auto justify-center min-h-[48px]"
                >
                  أشوف الكورسات الأول
                </a>
              </div>
            </div>

            {/* 5 — Bonus line (smallest, last — a reward, not the hero) */}
            <p className="mt-4 text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed">
              واشتراكك بيفتحلك كمان{" "}
              <span className="font-bold text-[var(--color-ink)]">
                +٣٠ كورس
              </span>{" "}
              في التسويق والمبيعات وإدارة الفرق وتنمية الذات
            </p>
          </div>

          {/* Visual — desktop only, must never push the CTA below the fold on mobile */}
          <div className="hidden lg:flex lg:col-span-5 justify-center">
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] overflow-hidden shadow-xl">
              <div
                aria-hidden
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5"
              />
              <div
                aria-hidden
                className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/5"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
                <div className="w-28 h-28 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-5xl font-extrabold border border-white/25">
                  فاهم
                </div>
                <p className="mt-5 text-lg font-bold leading-relaxed">
                  مدرّبك الذكي يبني معاك خطتك خطوة بخطوة
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
