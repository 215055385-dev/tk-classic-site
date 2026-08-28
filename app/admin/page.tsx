import type { Metadata } from "next";
import { AdminDashboard } from "@/components/AdminDashboard";
import { hasAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "询盘数据后台",
  description: "TK Classic 私密询盘与访问数据后台。",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminPage() {
  const initialAuthenticated = await hasAdminSession();
  return <AdminDashboard initialAuthenticated={initialAuthenticated} />;
}
