"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  BarChart3,
  Boxes,
  Copy,
  ExternalLink,
  FileText,
  Home,
  ImageIcon,
  Inbox,
  LogOut,
  MessagesSquare,
  Search,
  Settings,
  ShieldCheck,
  UsersRound,
  Video,
  type LucideIcon,
} from "lucide-react";

type NavigationItem = { href: string; label: string; icon: LucideIcon };
type NavigationGroup = { label: string; items: readonly NavigationItem[] };

const navigationGroups = [
  {
    label: "工作台",
    items: [{ href: "/admin", label: "数据总览", icon: BarChart3 }],
  },
  {
    label: "销售",
    items: [
      { href: "/admin/inquiries", label: "客户询盘", icon: Inbox },
      { href: "/admin/customers", label: "客户管理", icon: UsersRound },
      { href: "/admin/chats", label: "站内聊天", icon: MessagesSquare },
    ],
  },
  {
    label: "网站内容",
    items: [
      { href: "/admin/products", label: "产品管理", icon: Boxes },
      { href: "/admin/homepage", label: "首页内容", icon: Home },
      { href: "/admin/media", label: "图片与文件", icon: ImageIcon },
      { href: "/admin/videos", label: "视频管理", icon: Video },
    ],
  },
  {
    label: "增长",
    items: [
      { href: "/admin/articles", label: "文章管理", icon: FileText },
      { href: "/admin/seo", label: "SEO / GEO", icon: Search },
    ],
  },
  {
    label: "系统",
    items: [{ href: "/admin/settings", label: "系统设置", icon: Settings }],
  },
] as const satisfies readonly NavigationGroup[];

const navigation: readonly NavigationItem[] = navigationGroups.flatMap(
  (group) => [...group.items],
);

export function AdminShell({
  children,
  title = "TK Classic CMS",
  description = "企业独立站内容管理系统",
}: {
  children: ReactNode;
  title?: string;
  description?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const activeItem = navigation.find((item) =>
    item.href === "/admin"
      ? pathname === item.href
      : pathname.startsWith(item.href),
  );
  const resolvedTitle =
    title === "TK Classic CMS" && activeItem ? activeItem.label : title;
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin");
    router.refresh();
  }
  async function copyAdminUrl() {
    await navigator.clipboard.writeText(`${window.location.origin}/admin`);
    setCopied(true);
  }
  return (
    <main className="admin-cms-shell">
      <aside className="admin-cms-sidebar" aria-label="后台主菜单">
        <div className="admin-cms-brand">
          <span aria-hidden="true">TK</span>
          <div>
            <strong>TK Classic</strong>
            <small>运营管理后台</small>
          </div>
        </div>
        <nav>
          {navigationGroups.map((group) => (
            <div className="admin-nav-group" key={group.label}>
              <span className="admin-nav-group-label">{group.label}</span>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active =
                  item.href === "/admin"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.label}
                    aria-label={item.label}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon size={18} aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="admin-cms-sidebar-foot">
          <ShieldCheck size={18} />
          <span>受保护的管理区域</span>
        </div>
      </aside>
      <section className="admin-cms-workspace">
        <header className="admin-cms-topbar">
          <div>
            <span className="admin-cms-security-icon" aria-hidden="true">
              <ShieldCheck size={18} />
            </span>
            <div>
              <strong>{resolvedTitle}</strong>
              <small>{description}</small>
            </div>
          </div>
          <div className="admin-cms-top-actions">
            <span className="admin-session-badge">
              <i aria-hidden="true" />
              安全会话
            </span>
            <button
              className="admin-copy-link"
              type="button"
              onClick={() => void copyAdminUrl()}
              aria-live="polite"
            >
              <Copy size={16} />
              <span>{copied ? "已复制" : "复制地址"}</span>
            </button>
            <Link href="/" target="_blank" rel="noreferrer">
              <ExternalLink size={16} />
              <span>查看网站</span>
            </Link>
            <button type="button" onClick={() => void logout()}>
              <LogOut size={16} />
              <span>退出</span>
            </button>
          </div>
        </header>
        <div className="admin-cms-content">{children}</div>
      </section>
    </main>
  );
}
