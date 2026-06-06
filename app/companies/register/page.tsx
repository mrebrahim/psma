import RegisterForm from "./RegisterForm";

export const metadata = { title: "تسجيل شركة — بصمة شباب مصر" };

export default function CompanyRegisterPage() {
  return (
    <>
      <section className="brand-bar text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block text-xs font-extrabold bg-white/15 px-3 py-1 rounded-full mb-3">
            للشركات
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3">سجّل شركتك</h1>
          <p className="text-white/85 max-w-2xl leading-relaxed">
            انضم لشبكة شركاء بصمة شباب مصر، وأعلن عن وظائفك أمام آلاف الشباب
            الباحثين عن فرصة في كل المحافظات.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <RegisterForm />
        </div>
      </section>
    </>
  );
}
