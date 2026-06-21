import DashboardShell from "./DashboardShell";

export const metadata = { title: "لوحة تحكم الشركة — بصمة شباب مصر" };

export default function CompanyDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
