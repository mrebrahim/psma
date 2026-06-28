"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const NAV = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "من نحن" },
  { href: "/programs", label: "البرامج" },
  { href: "/team", label: "فريقنا" },
  { href: "/jobs", label: "الوظائف" },
  { href: "/trainings", label: "التدريبات" },
  { href: "/companies/register", label: "للشركات" },
  { href: "/contact", label: "تواصل معنا" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[var(--color-line)]">
      <div className="h-1.5 brand-bar" />
      <div className="h-[2px] bg-[var(--color-accent)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/images/logo-shield.png"
              alt="شعار بصمة شباب مصر"
              width={44}
              height={44}
              priority
              className="h-11 w-11 object-contain"
            />
            <div className="hidden sm:block">
              <div className="font-extrabold text-[var(--color-primary)] leading-tight">
                بصمة شباب مصر
              </div>
              <div className="text-[11px] text-[var(--color-muted)] tracking-wide">
                أعرف · إعمل · أثر
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-[15px] font-bold text-[var(--color-ink)] hover:text-[var(--color-primary)] transition-colors rounded-md"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Link href="/companies/login" className="btn-outline text-sm">
              دخول الشركات
            </Link>
            <Link href="/jobs" className="btn-primary text-sm">
              تقدّم على وظيفة
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            aria-label="القائمة"
            className="lg:hidden p-2 rounded-md text-[var(--color-primary)]"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              {open ? (
                <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="lg:hidden pb-4 border-t border-[var(--color-line)] pt-3 space-y-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-base font-bold text-[var(--color-ink)] hover:bg-[var(--color-cream-soft)] rounded-md"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/companies/login"
              onClick={() => setOpen(false)}
              className="btn-outline w-full justify-center mt-2"
            >
              دخول الشركات
            </Link>
            <Link
              href="/jobs"
              onClick={() => setOpen(false)}
              className="btn-primary w-full justify-center mt-2"
            >
              تقدّم على وظيفة
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
