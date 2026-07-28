import type { Metadata } from "next";
import { AdminDashboard } from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "询盘数据后台",
  description: "TK Classic 私密询盘与访问数据后台。",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
