import LoginForm from "./LoginForm";

export const metadata = { title: "تسجيل دخول الإدارة — بصمة شباب مصر" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  return (
    <section className="py-20">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card">
          <h1 className="text-2xl font-extrabold text-[var(--color-primary)] mb-1">
            لوحة تحكم الإدارة
          </h1>
          <p className="text-sm text-[var(--color-muted)] mb-5">
            أدخل كلمة مرور الإدارة للدخول.
          </p>
          <LoginForm next={sp.next ?? "/admin"} error={sp.error === "1"} />
        </div>
      </div>
    </section>
  );
}
