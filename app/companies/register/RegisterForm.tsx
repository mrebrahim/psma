"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const MAX_LOGO_KB = 200;
const ALLOWED_LOGO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

type FormState = {
  name: string;
  email: string;
  phone: string;
  representative: string;
  sector: string;
  website: string;
  address: string;
  description: string;
};

const EMPTY: FormState = {
  name: "", email: "", phone: "", representative: "",
  sector: "", website: "", address: "", description: "",
};

export default function RegisterForm() {
  const router = useRouter();
  const [phase, setPhase] = useState<"form" | "otp" | "saving">("form");
  const [state, setState] = useState<FormState>(EMPTY);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [alreadyAuthed, setAlreadyAuthed] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const { data: c } = await supabase
        .from("companies").select("id").eq("auth_user_id", session.user.id).maybeSingle();
      if (c) {
        router.replace("/companies/dashboard");
        return;
      }
      setAlreadyAuthed(true);
      setState((s) => ({ ...s, email: session.user.email ?? "" }));
    })();
  }, [router]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function validateForm(): string | null {
    if (!state.name.trim()) return "اسم الشركة مطلوب.";
    if (!state.email.trim()) return "البريد الإلكتروني مطلوب.";
    if (!state.phone.trim()) return "رقم الموبايل مطلوب.";
    if (!/^[+0-9 ]{8,}$/.test(state.phone.trim())) return "رقم الموبايل غير صالح.";
    if (logoFile) {
      if (logoFile.size > MAX_LOGO_KB * 1024) return `حجم اللوجو لازم يكون أقل من ${MAX_LOGO_KB}KB.`;
      if (!ALLOWED_LOGO_TYPES.includes(logoFile.type)) return "نوع اللوجو غير مدعوم (PNG/JPG/WebP/SVG).";
    }
    return null;
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const v = validateForm();
    if (v) return setError(v);

    if (alreadyAuthed) {
      await createCompany();
      return;
    }

    setBusy(true);
    const { error: err } = await supabase.auth.signInWithOtp({
      email: state.email.trim(),
      options: { shouldCreateUser: true },
    });
    setBusy(false);
    if (err) return setError(err.message);
    setPhase("otp");
    setInfo(`بعتنا رمز تحقق على ${state.email}.`);
  }

  async function handleVerifyOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (otp.length < 6) return setError("الرمز ناقص.");
    setBusy(true);
    const { error: err } = await supabase.auth.verifyOtp({
      email: state.email.trim(),
      token: otp.trim(),
      type: "email",
    });
    setBusy(false);
    if (err) return setError("الرمز غلط أو انتهت صلاحيته.");
    await createCompany();
  }

  async function resendOtp() {
    setError(null);
    setInfo(null);
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithOtp({
      email: state.email.trim(),
      options: { shouldCreateUser: true },
    });
    setBusy(false);
    if (err) return setError(err.message);
    setInfo("اتبعت كود جديد.");
  }

  async function createCompany() {
    setPhase("saving");
    setBusy(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("خطأ في الجلسة. أعد المحاولة.");
      setPhase("form");
      setBusy(false);
      return;
    }

    let logo_url: string | null = null;
    if (logoFile) {
      const ext = logoFile.name.split(".").pop()?.toLowerCase() ?? "png";
      const path = `${user.id}/logo-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("logos").upload(path, logoFile, { contentType: logoFile.type, upsert: true });
      if (!upErr) {
        logo_url = supabase.storage.from("logos").getPublicUrl(path).data.publicUrl;
      }
    }

    const { error: insErr } = await supabase.from("companies").insert({
      auth_user_id: user.id,
      name: state.name.trim(),
      email: state.email.trim(),
      phone: state.phone.trim(),
      representative: state.representative.trim() || null,
      sector: state.sector.trim() || null,
      website: state.website.trim() || null,
      description: state.description.trim() || null,
      address: state.address.trim() || null,
      logo_url,
      status: "approved",
    });
    setBusy(false);
    if (insErr) {
      setError("فشل حفظ بيانات الشركة: " + insErr.message);
      setPhase("form");
      return;
    }
    router.push("/companies/dashboard");
  }

  if (phase === "otp") {
    return (
      <form onSubmit={handleVerifyOtp} className="card">
        <h2 className="font-extrabold text-xl text-[var(--color-primary)] mb-1">رمز التحقق</h2>
        <p className="text-sm text-[var(--color-muted)] mb-4">
          ادخل الرمز اللي وصل على{" "}
          <span dir="ltr" className="font-bold">{state.email}</span>.
        </p>
        <input
          autoFocus
          dir="ltr"
          inputMode="numeric"
          maxLength={10}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="input text-center text-2xl font-extrabold tracking-[0.4em]"
          placeholder="••••••"
        />
        {info && <div className="mt-3 text-sm text-[var(--color-primary)] font-bold">{info}</div>}
        {error && <div className="mt-3 text-sm text-[var(--color-accent)] font-bold">{error}</div>}
        <button type="submit" disabled={busy} className="btn-primary w-full justify-center mt-4 disabled:opacity-60">
          {busy ? "جارٍ التحقق..." : "تأكيد"}
        </button>
        <div className="flex justify-between mt-4 text-sm">
          <button type="button" onClick={resendOtp} disabled={busy} className="text-[var(--color-primary)] font-bold hover:underline">
            إرسال كود تاني
          </button>
          <button type="button" onClick={() => { setPhase("form"); setOtp(""); setInfo(null); setError(null); }} className="text-[var(--color-muted)] hover:underline">
            تغيير الإيميل
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleFormSubmit} className="card">
      <h2 className="font-extrabold text-xl text-[var(--color-primary)] mb-1">
        إنشاء حساب الشركة
      </h2>
      <p className="text-sm text-[var(--color-muted)] mb-5">
        املأ البيانات وهنبعتلك رمز تحقق على الإيميل.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="label">اسم الشركة *</label>
          <input
            required
            value={state.name}
            onChange={(e) => update("name", e.target.value)}
            className="input"
            placeholder="مثال: شركة النور للخدمات"
          />
        </div>
        <div>
          <label className="label">البريد الإلكتروني *</label>
          <input
            required
            type="email"
            dir="ltr"
            autoComplete="email"
            disabled={alreadyAuthed}
            value={state.email}
            onChange={(e) => update("email", e.target.value)}
            className="input disabled:opacity-70"
            placeholder="hr@company.com"
          />
          {alreadyAuthed && (
            <div className="text-xs text-[var(--color-muted)] mt-1">حسابك اتفعّل بالإيميل ده.</div>
          )}
        </div>
        <div>
          <label className="label">رقم الموبايل *</label>
          <input
            required
            dir="ltr"
            value={state.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="input"
            placeholder="01xxxxxxxxx"
          />
        </div>

        <div>
          <label className="label">اسم الممثل</label>
          <input value={state.representative} onChange={(e) => update("representative", e.target.value)} className="input" placeholder="مسؤول التواصل" />
        </div>
        <div>
          <label className="label">القطاع</label>
          <input value={state.sector} onChange={(e) => update("sector", e.target.value)} className="input" placeholder="مثال: تكنولوجيا المعلومات" />
        </div>

        <div className="md:col-span-2">
          <label className="label">عنوان الشركة</label>
          <input value={state.address} onChange={(e) => update("address", e.target.value)} className="input" placeholder="مثال: مدينة نصر، القاهرة" />
        </div>
        <div className="md:col-span-2">
          <label className="label">الموقع الإلكتروني</label>
          <input dir="ltr" value={state.website} onChange={(e) => update("website", e.target.value)} className="input" placeholder="https://" />
        </div>

        <div className="md:col-span-2">
          <label className="label">نبذة عن الشركة</label>
          <textarea value={state.description} onChange={(e) => update("description", e.target.value)} className="textarea" placeholder="نبذة قصيرة عن نشاط الشركة وحجمها" />
        </div>

        <div className="md:col-span-2">
          <label className="label">لوجو الشركة (PNG/JPG/SVG - حد أقصى {MAX_LOGO_KB}KB)</label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
            className="input file:ml-3 file:rounded-full file:border-0 file:bg-[var(--color-cream)] file:text-[var(--color-primary)] file:font-bold file:py-1 file:px-3"
          />
          {logoFile && (
            <div className="text-xs text-[var(--color-muted)] mt-1 truncate">
              {logoFile.name} — {(logoFile.size / 1024).toFixed(0)}KB
            </div>
          )}
        </div>
      </div>

      {error && <div className="mt-3 text-sm text-[var(--color-accent)] font-bold">{error}</div>}

      <button type="submit" disabled={busy} className="btn-primary w-full justify-center mt-5 disabled:opacity-60">
        {busy ? "جارٍ الإرسال..." : alreadyAuthed ? "حفظ بيانات الشركة" : "إرسال رمز التحقق"}
      </button>

      <div className="text-sm text-center mt-4 text-[var(--color-muted)]">
        عندك حساب بالفعل؟{" "}
        <Link href="/companies/login" className="text-[var(--color-primary)] font-bold hover:underline">
          سجّل دخول
        </Link>
      </div>
    </form>
  );
}
