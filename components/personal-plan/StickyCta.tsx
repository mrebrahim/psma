"use client";

import { useEffect, useState } from "react";

/**
 * Sticky bottom CTA bar — appears only after the user scrolls past the hero's
 * price+CTA block. Recommended in the PRD to recapture intent after the hero
 * leaves the viewport (mobile is 86% of traffic and bounces in the first 10%).
 *
 * We watch the hero CTA via IntersectionObserver: while it's on screen the
 * sticky bar stays hidden (no duplicate CTA); once it scrolls away, we show it.
 */
export default function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const anchor = document.getElementById("hero-cta");
    if (!anchor) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 lg:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-white/95 backdrop-blur border-t border-[var(--color-line)] shadow-[0_-6px_24px_rgba(0,0,0,0.08)] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="leading-tight shrink-0">
            <div className="text-lg font-extrabold text-[var(--color-primary)]">
              ١٢.٥ ريال
            </div>
            <div className="text-[0.7rem] text-[var(--color-muted)]">/شهر</div>
          </div>
          <a
            href="#subscribe"
            className="btn-accent flex-1 justify-center !py-3 min-h-[48px] text-base"
          >
            ابدأ خطتي الشخصية
            <span aria-hidden>←</span>
          </a>
        </div>
      </div>
    </div>
  );
}
