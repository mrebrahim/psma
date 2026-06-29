"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginForm() {
  const router = useRouter();
  const [phase, setPhase] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function sendOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null); setInfo(null);
    const target = email.trim();
    if (!target) return setError("ادخل بريدك الإلكتروني.");
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithOtp({
      email: target,
      options: { shouldCreateUser: true },
    });
    setBusy(false);
    if (err) return setError(err.message);
    setPhase("otp");
    setInfo(`بعتنا كود تحقق على ${target}`);
  }

  async function verifyOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (otp.length < 6) return setError("الكود ناقص.");
    setBusy(true);
    const { error: err } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: "email",
    });
    setBusy(false);
    if (err) return setError("الكود غلط أو انتهت صلاحيته.");
    router.push("/applicants/dashboard");
  }

  async function resend() {
    setError(null); setInfo(null);
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    });
    setBusy(false);
    if (err) return setError(err.message);
    setInfo("اتبعت كود جديد.");
  }

  if (phase === "otp") {
    return (
      <form onSubmit={verifyOtp} className="card">
        <h2 className="font-extrabold text-xl text-[var(--color-primary)] mb-1">رمز التحقق</h2>
        <p className="text-sm text-[var(--color-muted)] mb-4">
          ادخل الكود اللي وصل على <span dir="ltr" className="font-bold">{email}</span>
        </p>
        <input
          autoFocus dir="ltr" inputMode="numeric" maxLength={10}
          value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="input text-center text-2xl font-extrabold tracking-[0.4em]"
          placeholder="••••••"
        />
        {info && <div className="mt-3 text-sm text-[var(--color-primary)] font-bold">{info}</div>}
        {error && <div className="mt-3 text-sm text-[var(--color-accent)] font-bold">{error}</div>}
        <button type="submit" disabled={busy} className="btn-primary w-full justify-center mt-4 disabled:opacity-60">
          {busy ? "جارٍ التحقق..." : "دخول"}
        </button>
        <div className="flex justify-between mt-4 text-sm">
          <button type="button" onClick={resend} disabled={busy} className="text-[var(--color-primary)] font-bold hover:underline">
            إرسال كود تاني
          </button>
          <button type="button" onClick={() => { setPhase("email"); setOtp(""); setInfo(null); setError(null); }} className="text-[var(--color-muted)] hover:underline">
            تغيير الإيميل
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={sendOtp} className="card space-y-3">
      <div>
        <label className="label">البريد الإلكتروني</label>
        <input
          type="email" required dir="ltr" autoFocus autoComplete="email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="input" placeholder="you@example.com"
        />
        <div className="text-xs text-[var(--color-muted)] mt-1">
          لو سبق وقدّمت على وظيفة، استخدم نفس الإيميل أو نفس الموبايل بعد ما تدخل.
        </div>
      </div>
      {error && <div className="text-sm text-[var(--color-accent)] font-bold">{error}</div>}
      <button type="submit" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-60">
        {busy ? "جارٍ الإرسال..." : "إرسال رمز التحقق"}
      </button>
      <div className="text-sm text-center text-[var(--color-muted)]">
        مهتم تشوف الوظائف بدون تسجيل؟{" "}
        <Link href="/jobs" className="text-[var(--color-primary)] font-bold hover:underline">صفحة الوظائف</Link>
      </div>
    </form>
  );
}
