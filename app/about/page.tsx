import Link from "next/link";
import { TEAM } from "@/lib/content";

export const metadata = { title: "من نحن — بصمة شباب مصر" };

export default function AboutPage() {
  return (
    <>
      <section className="brand-bar text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block text-xs font-extrabold bg-white/15 px-3 py-1 rounded-full mb-3">
            من نحن
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3">
            مؤسسة بصمة شباب مصر
          </h1>
          <p className="text-white/85 max-w-2xl leading-relaxed">
            مبادرة وطنية تابعة لوزارة الشباب والرياضة لتمكين الشباب المصري في
            ميادين العمل والتدريب والقيادة والتوعية.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div>
            <h2 className="section-title">رؤيتنا</h2>
            <p className="text-[var(--color-ink)] leading-relaxed">
              أن نصبح المنصة الوطنية الأولى التي يثق بها الشباب المصري في
              رحلتهم من التعلم إلى العمل والأثر، وأن نُسهم في تخريج جيل قادر
              على المنافسة محليًا وإقليميًا.
            </p>
          </div>
          <div>
            <h2 className="section-title">رسالتنا</h2>
            <p className="text-[var(--color-ink)] leading-relaxed">
              تمكين الشباب المصري عبر منظومة متكاملة من التدريب وملتقيات
              التوظيف وريادة الأعمال والقيادة، بشراكات حقيقية مع الجهات
              الحكومية والقطاع الخاص ومنظمات المجتمع المدني.
            </p>
          </div>
          <div>
            <h2 className="section-title">الأبعاد الاستراتيجية</h2>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="card">
                <div className="font-extrabold text-[var(--color-primary)] mb-2">
                  البُعد الأمني والاجتماعي
                </div>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                  تحصين الشباب من الأفكار المتطرفة عبر العمل والمشاركة الإيجابية
                  في تنمية المجتمع.
                </p>
              </div>
              <div className="card">
                <div className="font-extrabold text-[var(--color-primary)] mb-2">
                  القوة الناعمة
                </div>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                  إبراز صورة مصر الحضارية عبر شبابها، وتمكين المصريين بالخارج
                  من الإسهام في التنمية.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="section-title">الإطار القانوني والحوكمة</h2>
            <p className="text-[var(--color-ink)] leading-relaxed">
              تعمل المؤسسة في إطار <strong>القانون رقم 149 لسنة 2019</strong>{" "}
              المنظِّم لعمل الجمعيات والمؤسسات الأهلية، وفقًا لمنظومة حوكمة
              واضحة تضم مجلس الأمناء ومجلس الإدارة والمجلس التنفيذي ولجاناً
              متخصصة، تعمل وفق أُطر شفافة ومحاسبية.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--color-cream-soft)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="chip mb-3">الهيكل</span>
            <h2 className="section-title">قيادات المؤسسة</h2>
            <p className="section-sub max-w-2xl mx-auto">
              مجلس الأمناء، مجلس الإدارة، والمجلس التنفيذي، واللجان المتخصصة.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {TEAM.map((m, i) => (
              <div key={i} className="bg-white border border-[var(--color-line)] rounded-2xl p-5 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white mx-auto mb-3 flex items-center justify-center text-2xl font-extrabold">
                  ب
                </div>
                <div className="font-extrabold text-[var(--color-primary)] text-sm">
                  {m.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title">انضم لرحلتنا</h2>
          <p className="section-sub">
            سواء كنت شابًا تبحث عن فرصة، أو شركة تبحث عن كفاءات، أو شريكًا يريد
            دعم التنمية، نرحب بك.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/jobs" className="btn-primary">تصفّح الوظائف</Link>
            <Link href="/companies/register" className="btn-outline">سجّل شركتك</Link>
            <Link href="/contact" className="btn-outline">تواصل معنا</Link>
          </div>
        </div>
      </section>
    </>
  );
}
