import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] text-white mt-20">
      <div className="h-[3px] bg-[var(--color-accent)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-white/10 p-1 flex items-center justify-center">
              <Image
                src="/images/logo-shield.png"
                alt="شعار بصمة شباب مصر"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
            </div>
            <div>
              <div className="font-extrabold">{SITE.name}</div>
              <div className="text-xs text-white/70">{SITE.slogan}</div>
            </div>
          </div>
          <p className="text-sm text-white/80 leading-relaxed max-w-md">
            مبادرة وطنية تابعة لوزارة الشباب والرياضة لتمكين الشباب المصري عبر
            ملتقيات التوظيف والتدريب وريادة الأعمال وبرامج القيادة والتوعية المجتمعية.
          </p>
        </div>

        <div>
          <h4 className="font-extrabold mb-3">روابط</h4>
          <ul className="space-y-2 text-sm text-white/85">
            <li><Link href="/about" className="hover:text-white">من نحن</Link></li>
            <li><Link href="/programs" className="hover:text-white">البرامج</Link></li>
            <li><Link href="/team" className="hover:text-white">فريقنا</Link></li>
            <li><Link href="/jobs" className="hover:text-white">الوظائف</Link></li>
            <li><Link href="/trainings" className="hover:text-white">التدريبات</Link></li>
            <li><Link href="/companies/register" className="hover:text-white">للشركات</Link></li>
            <li><Link href="/contact" className="hover:text-white">تواصل معنا</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-extrabold mb-3">تواصل</h4>
          <ul className="space-y-2 text-sm text-white/85">
            <li>{SITE.address}</li>
            <li>
              <a href={`mailto:${SITE.email}`} className="hover:text-white" dir="ltr">
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/70">
          <div>© {new Date().getFullYear()} بصمة شباب مصر — جميع الحقوق محفوظة.</div>
          <div>تابع لوزارة الشباب والرياضة — جمهورية مصر العربية</div>
        </div>
      </div>
    </footer>
  );
}
