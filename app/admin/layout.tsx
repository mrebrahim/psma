import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]/40">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/admin" className="font-extrabold text-[var(--color-primary)] text-lg">
            لوحة تحكم الإدارة
          </Link>
          <nav className="flex items-center gap-3 text-sm font-bold">
            <Link href="/admin" className="hover:text-[var(--color-primary)]">التقديمات</Link>
            <Link href="/admin/jobs?tab=pending" className="hover:text-[var(--color-primary)]">مراجعة الوظائف</Link>
            <Link href="/admin/vocabulary" className="hover:text-[var(--color-primary)]">القاموس</Link>
            <Link href="/" className="hover:text-[var(--color-primary)]">الموقع</Link>
            <form method="POST" action="/api/admin/logout">
              <button type="submit" className="text-[var(--color-accent)] hover:underline">
                تسجيل خروج
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="py-8">{children}</main>
    </div>
  );
}
