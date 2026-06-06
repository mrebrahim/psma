import NewJobForm from "./NewJobForm";

export const metadata = { title: "إضافة وظيفة جديدة — بصمة شباب مصر" };

export default async function NewJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <section className="brand-bar text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block text-xs font-extrabold bg-white/15 px-3 py-1 rounded-full mb-3">
            للشركات
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold">أضف وظيفة جديدة</h1>
          <p className="text-white/85 max-w-2xl leading-relaxed mt-2">
            اعرض وظيفتك أمام آلاف الشباب الباحثين عن فرصة عمل.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewJobForm companyId={id} />
        </div>
      </section>
    </>
  );
}
