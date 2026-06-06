"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/content";

function diff(target: Date) {
  const now = new Date().getTime();
  const t = target.getTime() - now;
  if (t <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true };
  return {
    d: Math.floor(t / 86400000),
    h: Math.floor((t / 3600000) % 24),
    m: Math.floor((t / 60000) % 60),
    s: Math.floor((t / 1000) % 60),
    done: false,
  };
}

export default function Countdown() {
  const target = new Date(SITE.nextEvent.date);
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const cells: { label: string; value: number }[] = [
    { label: "يوم", value: t.d },
    { label: "ساعة", value: t.h },
    { label: "دقيقة", value: t.m },
    { label: "ثانية", value: t.s },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-xl">
      <div className="text-xs font-bold text-[var(--color-cream)] mb-2">الملتقى القادم</div>
      <h3 className="text-xl md:text-2xl font-extrabold mb-1">
        {SITE.nextEvent.title}
      </h3>
      <p className="text-sm text-white/80 mb-5">
        {SITE.nextEvent.location} — مستهدف {SITE.nextEvent.target}
      </p>

      <div className="grid grid-cols-4 gap-2 mb-5">
        {cells.map((c) => (
          <div
            key={c.label}
            className="bg-white/15 rounded-xl py-3 text-center border border-white/10"
          >
            <div className="text-2xl md:text-3xl font-extrabold tabular-nums">
              {String(c.value).padStart(2, "0")}
            </div>
            <div className="text-[11px] font-bold text-white/80 mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>

      <Link href="/jobs" className="block w-full text-center bg-white text-[var(--color-primary)] font-extrabold py-3 rounded-full hover:bg-[var(--color-cream)] transition">
        سجّل اهتمامك الآن
      </Link>
    </div>
  );
}
