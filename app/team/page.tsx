import TeamCard from "@/components/TeamCard";
import { TEAM, STAFF } from "@/lib/content";

export const metadata = { title: "فريقنا — بصمة شباب مصر" };

export default function TeamPage() {
  return (
    <>
      <section className="brand-bar text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block text-xs font-extrabold bg-white/15 px-3 py-1 rounded-full mb-3">
            فريقنا
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3">
            الفريق وراء بصمة شباب مصر
          </h1>
          <p className="text-white/85 max-w-2xl leading-relaxed">
            مجلس الإدارة، اللجان التنفيذية، وفِرق العمل اللي بنفّذ أنشطة
            المؤسسة في كل المحافظات.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="chip mb-3">القيادة</span>
            <h2 className="section-title">مجلس الإدارة واللجان</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {TEAM.map((m, i) => (
              <TeamCard key={i} name={m.name} role={m.role} photo={m.photo} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-[var(--color-cream-soft)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="chip mb-3">فريق العمل</span>
            <h2 className="section-title">الفِرق التنفيذية</h2>
            <p className="section-sub max-w-2xl mx-auto">
              منسّقي البرامج والعمليات الميدانية والإعلام وتكنولوجيا المعلومات.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {STAFF.map((m, i) => (
              <TeamCard key={i} name={m.name} role={m.role} photo={m.photo} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title">انضم لفريقنا</h2>
          <p className="section-sub">
            بنرحّب بالمتطوّعين والكوادر اللي عايزة تساهم في تمكين الشباب المصري.
          </p>
          <a
            href={`https://wa.me/201000000000`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            تواصل معانا
          </a>
        </div>
      </section>
    </>
  );
}
