import Link from "next/link";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import ProgramsGrid from "@/components/ProgramsGrid";
import PartnersStrip from "@/components/PartnersStrip";
import TeamGrid from "@/components/TeamGrid";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />

      {/* About brief */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="chip mb-3">من نحن</span>
            <h2 className="section-title">مؤسسة وطنية لتمكين الشباب المصري</h2>
            <p className="text-[var(--color-ink)] leading-relaxed mb-4">
              «بصمة شباب مصر» مبادرة وطنية تابعة لوزارة الشباب والرياضة، تأسست
              لتكون جسرًا بين الشباب وسوق العمل، ومنصة لإطلاق طاقاتهم في خدمة
              التنمية المستدامة لجمهورية مصر العربية.
            </p>
            <p className="text-[var(--color-muted)] leading-relaxed mb-6">
              نعمل في إطار القانون 149 لسنة 2019، ضمن منظومة الحوكمة المؤسسية،
              عبر مجلس أمناء، ومجلس إدارة، ولجان تنفيذية متخصصة في التوظيف
              والتدريب وريادة الأعمال والتوعية المجتمعية.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/about" className="btn-primary">
                اعرف المزيد عنّا
              </Link>
              <Link href="/programs" className="btn-outline">
                استعرض البرامج
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "أعرف", desc: "نشر الوعي وبناء المعرفة" },
              { title: "إعمل", desc: "تأهيل وتوظيف الشباب" },
              { title: "أثر", desc: "أثر مجتمعي ملموس ومستدام" },
              { title: "الهوية", desc: "وطنية، مهنية، شفافة" },
            ].map((c, i) => (
              <div
                key={i}
                className="bg-[var(--color-cream-soft)] border border-[var(--color-line)] rounded-2xl p-5"
              >
                <div className="font-extrabold text-xl text-[var(--color-primary)] mb-1">
                  {c.title}
                </div>
                <div className="text-sm text-[var(--color-muted)]">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProgramsGrid />

      {/* Jobs CTA dual */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-3xl p-8 md:p-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/5" />
              <span className="inline-block text-xs font-extrabold bg-white/15 px-3 py-1 rounded-full mb-3">
                للشباب
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold mb-3">
                دوّر على وظيفتك الجاية من هنا
              </h3>
              <p className="text-white/85 mb-6 leading-relaxed">
                استعرض أحدث الوظائف من شركاتنا في كل المحافظات، وقدّم خلال دقيقة
                واحدة بدون تعقيدات.
              </p>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 bg-white text-[var(--color-primary)] font-extrabold px-6 py-3 rounded-full hover:bg-[var(--color-cream)]"
              >
                استعرض الوظائف
              </Link>
            </div>
            <div className="rounded-3xl p-8 md:p-10 bg-gradient-to-br from-[var(--color-accent)] to-[#7a2419] text-white relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
              <span className="inline-block text-xs font-extrabold bg-white/15 px-3 py-1 rounded-full mb-3">
                للشركات
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold mb-3">
                سجّل شركتك واعرض وظائفك
              </h3>
              <p className="text-white/85 mb-6 leading-relaxed">
                انضم لشبكة شركاء «بصمة شباب مصر» وأعلن عن وظائفك أمام آلاف
                الشباب الباحثين عن فرصة.
              </p>
              <Link
                href="/companies/register"
                className="inline-flex items-center gap-2 bg-white text-[var(--color-accent)] font-extrabold px-6 py-3 rounded-full hover:bg-[var(--color-cream)]"
              >
                سجّل شركتك
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TeamGrid />
      <PartnersStrip />
    </>
  );
}
