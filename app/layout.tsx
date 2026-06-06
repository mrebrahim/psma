import type { Metadata } from "next";
import { Almarai } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";

const almarai = Almarai({
  variable: "--font-almarai",
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "بصمة شباب مصر — أعرف · إعمل · أثر",
  description:
    "مؤسسة بصمة شباب مصر — مبادرة وطنية تابعة لوزارة الشباب والرياضة لتمكين الشباب المصري عبر التدريب وملتقيات التوظيف وريادة الأعمال.",
  openGraph: {
    title: "بصمة شباب مصر",
    description: "أعرف · إعمل · أثر — مبادرة وطنية لتمكين الشباب المصري.",
    locale: "ar_EG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${almarai.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
