"use client";

export default function LoginForm({ next, error }: { next: string; error: boolean }) {
  return (
    <form method="POST" action="/api/admin/login" className="space-y-3">
      <input type="hidden" name="next" value={next} />
      <div>
        <label className="label">كلمة المرور</label>
        <input
          name="password"
          type="password"
          required
          dir="ltr"
          autoFocus
          className="input"
          placeholder="••••••••"
        />
      </div>
      {error && (
        <div className="text-sm text-[var(--color-accent)] font-bold">
          كلمة المرور غير صحيحة.
        </div>
      )}
      <button type="submit" className="btn-primary w-full justify-center">
        دخول
      </button>
    </form>
  );
}
