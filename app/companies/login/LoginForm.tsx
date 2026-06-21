"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email") ?? "").trim(),
      password: String(fd.get("password") ?? ""),
    });
    setLoading(false);
    if (err) {
      setError("الإيميل أو كلمة المرور غير صحيحة.");
      return;
    }
    router.push("/companies/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3">
      <div>
        <label className="label">البريد الإلكتروني</label>
        <input name="email" type="email" required dir="ltr" autoFocus autoComplete="email" className="input" placeholder="hr@company.com" />
      </div>
      <div>
        <label className="label">كلمة المرور</label>
        <input name="password" type="password" required dir="ltr" autoComplete="current-password" className="input" placeholder="••••••••" />
      </div>
      {error && <div className="text-sm text-[var(--color-accent)] font-bold">{error}</div>}
      <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
        {loading ? "جارٍ الدخول..." : "دخول"}
      </button>
      <div className="text-sm text-center text-[var(--color-muted)]">
        مالكش حساب؟{" "}
        <Link href="/companies/register" className="text-[var(--color-primary)] font-bold hover:underline">
          سجّل شركتك
        </Link>
      </div>
    </form>
  );
}
