import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, BookOpenCheck, CheckCircle2, FileCheck2 } from "lucide-react";
import { permanentRedirect } from "next/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { PrimaryNav } from "@/components/PrimaryNav";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { SiteFooter } from "@/components/SiteFooter";
import { company } from "@/lib/site-data";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

const path = "/zh/china-oem-guide";
const url = `${company.siteUrl}${path}`;
const description = "面向跨境品牌、进口商与批发商的便携式咖啡机 OEM/ODM 采购指南，说明型号筛选、样品确认、Logo 包装定制、认证资料核对与询盘准备。";

export const metadata: Metadata = {
  title: { absolute: "便携式咖啡机 OEM/ODM 采购指南 | TK Classic" },
  description,
  keywords: ["便携式咖啡机厂家", "便携咖啡机 OEM", "咖啡机 ODM", "便携式意式咖啡机批发", "咖啡机私牌定制"],
  alternates: { canonical: url },
  openGraph: {
    type: "article",
    url,
    title: "便携式咖啡机 OEM/ODM 采购指南",
    description: "从型号筛选、样品确认到品牌与包装需求，建立一份可执行的便携咖啡机采购简报。",
    locale: "zh_CN",
    images: [{
      url: `${company.siteUrl}/optimized/product-scenes/dq-010-1.webp`,
      alt: "TK Classic DQ-010 便携式咖啡机官方产品图片",
    }],
  },
};

const sections = [
  {
    title: "1. 先定义采购项目，再选择型号",
    paragraphs: [
      "先写清目标市场、销售渠道、咖啡形式、预计数量和是否需要品牌定制。便携式咖啡机外观相近，并不代表适配器、杯体、充电方式和操作流程相同，选型应以具体型号页面与确认样品为准。",
      "DQ-001 是偏重性价比的项目起点，现有资料列明胶囊和咖啡粉适配器；DQ-010 面向更高端的产品方案，现有资料列明 LCD 显示、325 mL 杯体，以及 N-series 胶囊、Dolce Gusto 胶囊、咖啡粉和独立便携滴滤方式。",
    ],
  },
  {
    title: "2. 把样品变成可追踪的确认记录",
    paragraphs: [
      "样品确认不应只看外观。记录型号、颜色、咖啡组件、杯体、充电配件、可选配件和操作结果，并把照片、测试说明与版本日期放在同一份记录中。",
      "目前样品为收费安排；大货订单下单并发货后，样品费可按双方确认的订单条件退回或抵扣。样品订单计划在七天内发出，具体费用、运输和项目条件仍需书面确认。",
    ],
  },
  {
    title: "3. 分开确认产品、Logo 与包装",
    paragraphs: [
      "TK Classic 支持 Logo 与包装定制，实际方案根据机型、材料、图稿和订单需求确认。数字配色或 Logo 预览用于表达设计方向，不代表量产效果已经批准。",
      "建议分别确认产品配置、Logo 方法与位置、包装结构、说明书和标签，再用同一个版本号连接样品、报价和订单资料。",
    ],
  },
  {
    title: "4. 按型号和市场核对认证资料",
    paragraphs: [
      "网站展示认证与检测资料概览，但不应仅根据缩略图推断某份文件适用于全部型号或全部市场。询盘时写明目标型号和销售国家，由双方核对报告名称、申请主体、型号覆盖与日期。",
    ],
  },
  {
    title: "5. 提交一份能直接报价的询盘",
    paragraphs: [
      "有效询盘应包括公司与联系人、目标市场、型号、预计数量、咖啡形式、颜色、Logo、包装、配件、样品需求和所需文件。网站不公开统一价格、MOQ、交期和质保承诺，这些项目会根据实际配置写入正式沟通与报价。",
    ],
  },
] as const;

const faq = [
  ["便携式咖啡机 OEM 项目应该从哪里开始？", "先确认目标市场、销售渠道、具体型号和咖啡形式，再安排样品并整理 Logo、包装、配件和文件需求。"],
  ["DQ-001 和 DQ-010 应该如何初步选择？", "DQ-001 偏重性价比，现有资料列明胶囊和咖啡粉适配器；DQ-010 面向更高端方案，带 LCD，并支持现有资料列明的多种咖啡形式。最终选择以产品页和样品确认记录为准。"],
  ["样品是否免费？", "样品收费。大货订单下单并发货后，样品费可按双方确认的订单条件退回或抵扣。"],
  ["可以定制 Logo 和包装吗？", "可以。Logo 和包装均可沟通定制，具体方法、位置、材料、颜色和包装结构按项目确认。"],
  ["MOQ 和交期是多少？", "网站不发布统一数值。MOQ 与交期根据型号、数量、配置和定制范围在询盘与正式报价中确认。"],
  ["认证资料是否适用于所有型号？", "不能仅凭概览判断。应根据具体型号和目标市场核对可提供文件的名称、覆盖范围和日期。"],
] as const;

export default async function ChinaOemGuidePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const lang = Array.isArray(params?.lang) ? params.lang[0] : params?.lang;
  if (lang !== "zh") permanentRedirect(path);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "便携式咖啡机 OEM/ODM 采购指南",
      description,
      inLanguage: "zh-CN",
      datePublished: "2026-09-07",
      dateModified: "2026-09-08",
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: company.brand, url: company.siteUrl },
      publisher: { "@id": `${company.siteUrl}#organization` },
      image: `${company.siteUrl}/optimized/product-scenes/dq-010-1.webp`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: "zh-CN",
      mainEntity: faq.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "首页", item: `${company.siteUrl}/zh` },
        { "@type": "ListItem", position: 2, name: "采购资源", item: `${company.siteUrl}/zh/resources` },
        { "@type": "ListItem", position: 3, name: "OEM/ODM 采购指南", item: url },
      ],
    },
  ];

  return (
    <main className="inner-page buyer-guide-page" lang="zh">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="site-header detail-header">
        <Link className="brand" href="/zh" aria-label="TK Classic 首页"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>便携式咖啡设备 OEM</small></span></Link>
        <PrimaryNav lang="zh" current="resources" ariaLabel="采购指南导航" />
        <LanguageSwitcher currentLang="zh" hrefForLang={(language) => language === "zh" ? path : "/resources"} />
      </header>
      <SectionFloatNav lang="zh" path="/china-oem-guide" label="OEM/ODM 采购指南" />

      <article className="buyer-guide-article">
        <header className="buyer-guide-hero section">
          <Link className="back-link" href="/zh/resources"><ArrowLeft size={17} aria-hidden="true" />采购资源</Link>
          <p className="eyebrow">中国采购与跨境品牌指南</p>
          <h1>便携式咖啡机 OEM/ODM 采购指南</h1>
          <p className="buyer-guide-deck">从型号筛选、样品确认到 Logo 与包装需求，建立一份工厂能够直接执行的采购简报。</p>
          <div className="buyer-guide-meta" aria-label="文章信息"><span><BookOpenCheck size={16} aria-hidden="true" />TK Classic 事实审核</span><span>约 6 分钟阅读</span></div>
        </header>

        <div className="section buyer-guide-visual">
          <Image src="/optimized/product-scenes/dq-010-1.webp" alt="TK Classic DQ-010 便携式咖啡机官方产品图片" width={1254} height={1254} sizes="(max-width: 760px) calc(100vw - 32px), 920px" priority />
        </div>

        <div className="section buyer-guide-layout">
          <aside className="buyer-guide-takeaways" aria-labelledby="china-guide-summary">
            <span>采购结论</span><h2 id="china-guide-summary">先锁定配置，再讨论商业条款。</h2>
            <ul>{["按具体型号核对参数和图片", "用实物样品记录确认配置", "分开确认 Logo、包装与文件", "将开放条款写入正式报价"].map((item) => <li key={item}><CheckCircle2 size={17} aria-hidden="true" /><span>{item}</span></li>)}</ul>
            <Link href="/zh/contact#inquiry-form">准备采购询盘 <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </aside>
          <div className="buyer-guide-body">
            <section className="buyer-guide-direct-answer"><p className="eyebrow">简要回答</p><h2>如何开始便携式咖啡机 OEM/ODM 项目？</h2><p><strong>先确定目标市场和具体型号，再确认收费样品、咖啡组件与配件；随后把 Logo、包装、所需认证资料和商业条款集中到同一份书面采购简报中。</strong></p></section>
            {sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
          </div>
        </div>

        <section className="section buyer-guide-faq" aria-labelledby="china-guide-faq"><div className="section-heading align-left"><span>采购常见问题</span><h2 id="china-guide-faq">提交询盘前需要确认什么？</h2></div><div className="faq-list">{faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
        <section className="section buyer-guide-source-note" aria-label="事实说明"><FileCheck2 size={22} aria-hidden="true" /><div><strong>事实边界</strong><p>本文依据当前网站产品记录和已确认合作规则整理。型号页面是公开参数与图片对应关系的主要来源；最终配置、文件和商业条款以双方书面确认结果为准。</p></div></section>
        <section className="section buyer-guide-cta"><div><span>下一步</span><h2>把采购想法整理成可报价项目。</h2><p>提交目标市场、型号、预计数量、咖啡形式、品牌和包装需求，销售团队将继续确认开放事项。</p></div><Link className="primary-action" href="/zh/contact#inquiry-form">提交采购需求 <ArrowUpRight size={17} aria-hidden="true" /></Link></section>
      </article>
      <SiteFooter lang="zh" />
    </main>
  );
}
