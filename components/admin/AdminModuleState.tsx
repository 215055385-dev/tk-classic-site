import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type AdminModuleStateProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  fields: string[];
};

export function AdminModuleState({ eyebrow, title, description, icon: Icon, fields }: AdminModuleStateProps) {
  return (
    <section className="admin-module-page" aria-labelledby="admin-module-title">
      <header className="admin-module-heading">
        <div>
          <span>{eyebrow}</span>
          <h1 id="admin-module-title">{title}</h1>
          <p>{description}</p>
        </div>
        <span className="admin-module-icon" aria-hidden="true"><Icon size={26} /></span>
      </header>

      <div className="admin-module-empty" role="status">
        <strong>Supabase 数据库与管理员权限已连接</strong>
        <p>真实数据结构已经建立且受到行级安全保护。下一阶段将逐个启用本模块的新增、编辑、上传、排序和发布功能；这里不会显示虚构内容或示例产品。</p>
        <div className="admin-module-field-list" aria-label="计划管理的内容">
          {fields.map((field) => <span key={field}>{field}</span>)}
        </div>
        <Link href="/admin">返回数据总览</Link>
      </div>
    </section>
  );
}
