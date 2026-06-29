import LoginForm from "./LoginForm";

export const metadata = { title: "دخول الباحثين عن عمل — بصمة شباب مصر" };

export default function ApplicantLoginPage() {
  return (
    <>
      <section className="brand-bar text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-extrabold">دخول الباحثين عن عمل</h1>
          <p className="text-white/85 max-w-2xl leading-relaxed mt-2">
            ادخل تشوف الوظائف المرشّحة ليك على مقاسك وتقدّم بضغطة واحدة.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <LoginForm />
        </div>
      </section>
    </>
  );
}
