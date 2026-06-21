import { SITE } from "@/lib/content";

export const metadata = { title: "تواصل معنا — بصمة شباب مصر" };

export default function ContactPage() {
  return (
    <>
      <section className="brand-bar text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block text-xs font-extrabold bg-white/15 px-3 py-1 rounded-full mb-3">
            تواصل
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3">تواصل معنا</h1>
          <p className="text-white/85 max-w-2xl leading-relaxed">
            نحن هنا للإجابة على استفساراتك ودعم أي تعاون.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-4">
          <div className="card">
            <div className="font-extrabold text-[var(--color-primary)] mb-1">العنوان</div>
            <div className="text-sm text-[var(--color-muted)]">{SITE.address}</div>
          </div>
          <div className="card">
            <div className="font-extrabold text-[var(--color-primary)] mb-1">البريد الإلكتروني</div>
            <a
              href={`mailto:${SITE.email}`}
              className="text-sm text-[var(--color-primary)] font-bold hover:underline block"
              dir="ltr"
            >
              {SITE.email}
            </a>
            <span className="text-xs text-[var(--color-muted)]">اضغط لإرسال بريد إلكتروني</span>
          </div>
        </div>
      </section>
    </>
  );
}
