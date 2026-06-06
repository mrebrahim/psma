import Image from "next/image";
import { EVENTS_PAST } from "@/lib/content";

export default function EventsGallery() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="chip mb-3">ملتقيات سابقة</span>
          <h2 className="section-title">جولاتنا في خدمة شباب المحافظات</h2>
          <p className="section-sub max-w-2xl mx-auto">
            ملتقيات Job Hub في القاهرة الكبرى والجيزة — أرقام موثّقة من فعاليات منفذة على أرض الواقع.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {EVENTS_PAST.map((ev, i) => (
            <div
              key={i}
              className="group rounded-2xl overflow-hidden bg-white border border-[var(--color-line)] hover:shadow-xl transition-shadow"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={ev.image}
                  alt={ev.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                  <span className="inline-block text-[11px] font-extrabold bg-[var(--color-accent)] px-2.5 py-1 rounded-full mb-2">
                    {ev.date}
                  </span>
                  <h3 className="font-extrabold text-lg md:text-xl drop-shadow">
                    {ev.title}
                  </h3>
                  <div className="text-xs text-white/85 mt-1">{ev.location}</div>
                </div>
              </div>
              <div className="grid grid-cols-4 divide-x divide-[var(--color-line)] text-center border-t border-[var(--color-line)]">
                <div className="py-3">
                  <div className="font-extrabold text-[var(--color-primary)] text-lg tabular-nums">
                    {ev.companies}
                  </div>
                  <div className="text-[11px] text-[var(--color-muted)] font-bold">شركة</div>
                </div>
                <div className="py-3">
                  <div className="font-extrabold text-[var(--color-primary)] text-lg tabular-nums">
                    {ev.jobs.toLocaleString("ar-EG")}
                  </div>
                  <div className="text-[11px] text-[var(--color-muted)] font-bold">وظيفة</div>
                </div>
                <div className="py-3">
                  <div className="font-extrabold text-[var(--color-primary)] text-lg tabular-nums">
                    {ev.applications.toLocaleString("ar-EG")}
                  </div>
                  <div className="text-[11px] text-[var(--color-muted)] font-bold">طلب تقديم</div>
                </div>
                <div className="py-3">
                  <div className="font-extrabold text-[var(--color-primary)] text-lg tabular-nums">
                    {ev.training.toLocaleString("ar-EG")}
                  </div>
                  <div className="text-[11px] text-[var(--color-muted)] font-bold">فرصة تدريب</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
