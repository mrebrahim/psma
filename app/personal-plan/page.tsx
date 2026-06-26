import type { Metadata } from "next";
import PlanHero from "@/components/personal-plan/PlanHero";
import StickyCta from "@/components/personal-plan/StickyCta";

export const metadata: Metadata = {
  title: "خطتي الشخصية — منصة فاهم",
  description:
    "اتعلّم الأتمتة والفيديو والبرمجة بالذكاء الاصطناعي وابدأ تكسب منهم — ٣ كورسات عملية بالعربي بـ ١٢.٥ ريال/شهر.",
};

export default function PersonalPlanPage() {
  return (
    <>
      <PlanHero />
      <StickyCta />
    </>
  );
}
