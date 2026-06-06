import Link from "next/link";
import Image from "next/image";
import Countdown from "./Countdown";
import { SITE } from "@/lib/content";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="فعاليات بصمة شباب مصر"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[var(--color-primary)]/95 via-[var(--color-primary)]/85 to-[var(--color-primary-dark)]/95" />
      </div>
      <div className="absolute -bottom-1 inset-x-0 h-1 bg-[var(--color-accent)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-white">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold mb-5 backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
              مبادرة تابعة لوزارة الشباب والرياضة
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.15] mb-5 tracking-tight">
              {SITE.name}
              <span className="block text-2xl md:text-3xl font-bold text-[var(--color-cream)] mt-3">
                {SITE.slogan}
              </span>
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-2xl leading-relaxed mb-8">
              نُمكِّن الشباب المصري ونوصلهم بفرص العمل والتدريب وريادة الأعمال
              عبر شبكة من الشركاء وملتقيات التوظيف في كل المحافظات.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/jobs" className="btn-accent text-base">
                استعرض الوظائف المتاحة
                <span aria-hidden>←</span>
              </Link>
              <Link href="/about" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/40 text-white font-bold hover:bg-white/10 transition">
                تعرّف على المؤسسة
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Countdown />
          </div>
        </div>
      </div>
    </section>
  );
}
