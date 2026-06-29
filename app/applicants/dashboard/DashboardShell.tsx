"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  city: string | null;
  headline: string | null;
  status: string;
  completeness: number;
};

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [phase, setPhase] = useState<"loading" | "claim" | "ready">("loading");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.replace("/applicants/login");
        return;
      }
      const { data: existing } = await supabase
        .from("profiles")
        .select("id, full_name, phone, email, city, headline, status, completeness")
        .eq("auth_user_id", session.user.id)
        .maybeSingle();
      if (existing) {
        setProfile(existing as Profile);
        setPhase("ready");
      } else {
        setPhase("claim");
      }
    })();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/applicants/login");
  }

  async function handleClaim(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const phone = String(fd.get("phone") ?? "").trim();
    const full_name = String(fd.get("full_name") ?? "").trim();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setBusy(false); router.replace("/applicants/login"); return; }

    const { data, error: rpcErr } = await supabase.rpc("claim_profile_by_phone", {
      p_phone: phone,
      p_full_name: full_name || null,
      p_email: user.email,
    });
    setBusy(false);
    if (rpcErr) return setError(rpcErr.message);

    const { data: p } = await supabase
      .from("profiles").select("id, full_name, phone, email, city, headline, status, completeness")
      .eq("id", data).maybeSingle();
    if (p) {
      setProfile(p as Profile);
      setPhase("ready");
    }
  }

  if (phase === "loading") {
    return <div className="min-h-screen flex items-center justify-center text-[var(--color-muted)]">جارٍ التحميل...</div>;
  }

  if (phase === "claim") {
    return (
      <div className="min-h-screen bg-[var(--color-cream)]/40 py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="card">
            <h2 className="font-extrabold text-xl text-[var(--color-primary)] mb-1">أهلًا بك 👋</h2>
            <p className="text-sm text-[var(--color-muted)] mb-5">
              عشان نلاقيلك الوظائف المرشّحة، احنا محتاجين رقم موبايلك. لو قدّمت قبل كده، هنوصّل البروفايل القديم بحسابك.
            </p>
            <form onSubmit={handleClaim} className="space-y-3">
              <div>
                <label className="label">الاسم الكامل</label>
                <input name="full_name" className="input" placeholder="الاسم الكامل" required />
              </div>
              <div>
                <label className="label">رقم الموبايل *</label>
                <input name="phone" required dir="ltr" className="input" placeholder="01xxxxxxxxx" />
              </div>
              {error && <div className="text-sm text-[var(--color-accent)] font-bold">{error}</div>}
              <button type="submit" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-60">
                {busy ? "جارٍ الحفظ..." : "ربط الحساب"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const links = [
    { href: "/applicants/dashboard", label: "الرئيسية" },
    { href: "/applicants/dashboard/jobs", label: "الوظائف المرشّحة" },
    { href: "/applicants/dashboard/profile", label: "تاجاتي ومهاراتي" },
    { href: "/applicants/dashboard/profile/experiences", label: "خبراتي وكورساتي" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-cream)]/40">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="font-extrabold text-[var(--color-primary)] truncate">{profile?.full_name}</div>
            <div className="text-xs text-[var(--color-muted)]">
              {profile?.city && `${profile.city} · `}اكتمال البروفايل: {profile?.completeness}%
            </div>
          </div>
          <button onClick={logout} className="text-sm font-bold text-[var(--color-accent)] hover:underline">
            تسجيل خروج
          </button>
        </div>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 overflow-x-auto">
          {links.map((l) => {
            const active = pathname === l.href || (l.href !== "/applicants/dashboard" && pathname.startsWith(l.href));
            return (
              <Link key={l.href} href={l.href}
                className={`px-4 py-2 text-sm font-bold border-b-2 whitespace-nowrap ${
                  active ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                         : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-primary)]"
                }`}>
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
