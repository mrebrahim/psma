import NewJobForm from "./NewJobForm";

export const metadata = { title: "إضافة وظيفة — لوحة تحكم الشركة" };

export default function NewJobPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-extrabold text-[var(--color-primary)] mb-2">إضافة وظيفة جديدة</h1>
      <p className="text-sm text-[var(--color-muted)] mb-6">
        املأ بيانات الوظيفة. الوظيفة هتروح للمراجعة من الأدمن، وبعد الموافقة هتنزل في صفحة الوظائف.
      </p>
      <NewJobForm />
    </div>
  );
}
