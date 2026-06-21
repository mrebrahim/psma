"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase, type Company } from "@/lib/supabase";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.replace("/companies/login");
        return;
      }
      const { data: c } = await supabase
        .from("companies")
        .select("*")
        .eq("auth_user_id", session.user.id)
        .maybeSingle();
      if (!mounted) return;
      if (!c) {
        // Logged in but no company row — odd state, send to register
        router.replace("/companies/register");
        return;
      }
      setCompany(c as Company);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/companies/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--color-muted)]">
        جارٍ التحميل...
      </div>
    );
  }

  const links = [
    { href: "/companies/dashboard", label: "الرئيسية" },
    { href: "/companies/dashboard/jobs", label: "وظائفي" },
    { href: "/companies/dashboard/jobs/new", label: "إضافة وظيفة" },
    { href: "/companies/dashboard/profile", label: "بيانات الشركة" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-cream)]/40">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {company?.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logo_url} alt={company.name} className="w-10 h-10 rounded-lg object-cover bg-[var(--color-cream)]" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-[var(--color-cream)] text-[var(--color-primary)] flex items-center justify-center font-extrabold">
                {company?.name?.charAt(0) ?? "ش"}
              </div>
            )}
            <div className="min-w-0">
              <div className="font-extrabold text-[var(--color-primary)] truncate">{company?.name}</div>
              <div className="text-xs text-[var(--color-muted)]">لوحة تحكم الشركة</div>
            </div>
          </div>
          <button onClick={logout} className="text-sm font-bold text-[var(--color-accent)] hover:underline">
            تسجيل خروج
          </button>
        </div>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 overflow-x-auto">
          {links.map((l) => {
            const active = pathname === l.href || (l.href !== "/companies/dashboard" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 text-sm font-bold border-b-2 whitespace-nowrap ${
                  active
                    ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                    : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-primary)]"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
