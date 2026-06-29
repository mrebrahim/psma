import DashboardShell from "./DashboardShell";

export const metadata = { title: "لوحة المتقدم — بصمة شباب مصر" };

export default function ApplicantDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
