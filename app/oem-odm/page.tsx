import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Handshake,
  PackageCheck,
  ShieldCheck,
  Ship,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SectionFloatNav } from "@/components/SectionFloatNav";
import { RevealArticle, RevealSection } from "@/components/MotionPrimitives";
import { SiteFooter } from "@/components/SiteFooter";
import { buyerGuides } from "@/lib/buyer-guides";
import { commercialCopy } from "@/lib/support-page-data";
import { company, copy, languages, type Lang } from "@/lib/site-data";
import { languageAlternates, localizedUrl } from "@/lib/seo";
import { brandTagline } from "@/lib/translation-copy";
import { PrimaryNav } from "@/components/PrimaryNav";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

const pageCopy: Record<Lang, {
  evidenceEyebrow: string;
  evidenceTitle: string;
  evidenceLead: string;
  years: string;
  markets: string;
  patent: string;
  established: string;
  termsEyebrow: string;
  termsTitle: string;
  processEyebrow: string;
  processTitle: string;
  guideLabel: string;
  guideCta: string;
  finalTitle: string;
  finalLead: string;
}> = {
  en: { evidenceEyebrow: "Verifiable business evidence", evidenceTitle: "Trust built on records buyers can review.", evidenceLead: "We separate verified company and document facts from project-specific commercial terms.", years: "Years OEM experience", markets: "Countries and markets served", patent: "Patent design", established: "Legal company established", termsEyebrow: "Procurement framework", termsTitle: "Commercial points confirmed before order approval.", processEyebrow: "OEM approval path", processTitle: "One clear record from brief to export packing.", guideLabel: "Buyer guide", guideCta: "Read the packaging checklist", finalTitle: "Build a quotation around your actual project.", finalLead: "Send the model, estimated quantity, market, branding, packaging and accessory requirements. We will confirm the remaining commercial items in writing." },
  es: { evidenceEyebrow: "Evidencia empresarial verificable", evidenceTitle: "Confianza basada en documentos revisables.", evidenceLead: "Separamos los datos verificados de las condiciones comerciales de cada proyecto.", years: "Años de experiencia OEM", markets: "Países y mercados atendidos", patent: "Diseño patentado", established: "Empresa legal constituida", termsEyebrow: "Marco de compras", termsTitle: "Puntos comerciales confirmados antes de aprobar el pedido.", processEyebrow: "Ruta de aprobación OEM", processTitle: "Un registro claro desde el brief hasta el embalaje de exportación.", guideLabel: "Guía de compra", guideCta: "Leer la lista de embalaje", finalTitle: "Prepare una cotización para su proyecto real.", finalLead: "Envíe modelo, cantidad estimada, mercado, marca, embalaje y accesorios. Confirmaremos por escrito los puntos comerciales pendientes." },
  pt: { evidenceEyebrow: "Evidência comercial verificável", evidenceTitle: "Confiança baseada em documentos que o comprador pode revisar.", evidenceLead: "Separamos fatos verificados das condições comerciais específicas de cada projeto.", years: "Anos de experiência OEM", markets: "Países e mercados atendidos", patent: "Design patenteado", established: "Empresa legal constituída", termsEyebrow: "Estrutura de compra", termsTitle: "Pontos comerciais confirmados antes da aprovação.", processEyebrow: "Fluxo de aprovação OEM", processTitle: "Um registro claro do briefing à embalagem de exportação.", guideLabel: "Guia de compra", guideCta: "Ler o checklist de embalagem", finalTitle: "Monte uma cotação para o seu projeto real.", finalLead: "Envie modelo, quantidade estimada, mercado, marca, embalagem e acessórios. Confirmaremos por escrito os itens comerciais pendentes." },
  fr: { evidenceEyebrow: "Preuves commerciales vérifiables", evidenceTitle: "Une confiance fondée sur des documents consultables.", evidenceLead: "Nous séparons les faits vérifiés des conditions commerciales propres à chaque projet.", years: "Années d'expérience OEM", markets: "Pays et marchés desservis", patent: "Design breveté", established: "Société légalement constituée", termsEyebrow: "Cadre d'achat", termsTitle: "Points commerciaux confirmés avant validation.", processEyebrow: "Parcours de validation OEM", processTitle: "Un dossier clair du brief à l'emballage export.", guideLabel: "Guide d'achat", guideCta: "Lire la checklist emballage", finalTitle: "Construisez un devis adapté à votre projet réel.", finalLead: "Envoyez le modèle, la quantité estimée, le marché, la marque, l'emballage et les accessoires. Nous confirmerons les points commerciaux restants par écrit." },
  ar: { evidenceEyebrow: "أدلة تجارية قابلة للتحقق", evidenceTitle: "ثقة مبنية على سجلات يمكن للمشتري مراجعتها.", evidenceLead: "نفصل بين الحقائق الموثقة والشروط التجارية الخاصة بكل مشروع.", years: "سنوات خبرة في OEM", markets: "الدول والأسواق المخدومة", patent: "تصميم حاصل على براءة", established: "تأسيس الشركة قانونياً", termsEyebrow: "إطار المشتريات", termsTitle: "تأكيد النقاط التجارية قبل اعتماد الطلب.", processEyebrow: "مسار اعتماد OEM", processTitle: "سجل واضح من المتطلبات إلى تغليف التصدير.", guideLabel: "دليل المشتري", guideCta: "قراءة قائمة فحص التغليف", finalTitle: "أنشئ عرض سعر لمشروعك الفعلي.", finalLead: "أرسل الطراز والكمية التقديرية والسوق والعلامة والتغليف والملحقات. سنؤكد البنود التجارية المتبقية كتابياً." },
  zh: { evidenceEyebrow: "可核验的企业证据", evidenceTitle: "用采购商可以核验的资料建立信任。", evidenceLead: "已确认的企业与文件事实，与具体项目商业条款分开说明。", years: "OEM 经验", markets: "服务国家和市场", patent: "外观专利设计", established: "公司依法成立", termsEyebrow: "采购条款框架", termsTitle: "订单确认前书面确认关键商业条款。", processEyebrow: "OEM 审批路径", processTitle: "从需求到出口包装，保持一份清晰的确认记录。", guideLabel: "采购指南", guideCta: "阅读包装检查清单", finalTitle: "围绕真实项目建立报价。", finalLead: "请提供型号、预计数量、目标市场、品牌、包装和配件需求；剩余商业条款将以书面形式确认。" },
  ru: { evidenceEyebrow: "Проверяемые деловые данные", evidenceTitle: "Доверие на основе документов, доступных закупщику.", evidenceLead: "Мы отделяем подтверждённые факты от коммерческих условий конкретного проекта.", years: "Лет опыта OEM", markets: "Стран и рынков", patent: "Запатентованный дизайн", established: "Год регистрации компании", termsEyebrow: "Условия закупки", termsTitle: "Коммерческие условия подтверждаются до утверждения заказа.", processEyebrow: "Согласование OEM", processTitle: "Единая запись от брифа до экспортной упаковки.", guideLabel: "Руководство", guideCta: "Открыть чек-лист упаковки", finalTitle: "Получите расчёт для реального проекта.", finalLead: "Укажите модель, объём, рынок, брендинг, упаковку и аксессуары. Остальные коммерческие условия будут подтверждены письменно." },
};

const qualityEvidenceCopy: Record<Lang, { eyebrow: string; title: string; lead: string; caption: string }> = {
  en: { eyebrow: "Real quality evidence", title: "DQ-010 quality inspection, documented step by step.", lead: "The supplied DQ-010 inspection record shows appearance, power and function, extraction, charging and battery, assembly and cleaning, and packing checks.", caption: "DQ-010 inspection-process record supplied by the manufacturer. Detailed project records are shared after inquiry when applicable." },
  es: { eyebrow: "Evidencia real de calidad", title: "Inspección de calidad del DQ-010, documentada paso a paso.", lead: "El registro facilitado del DQ-010 muestra controles de apariencia, alimentación y función, extracción, carga y batería, montaje y limpieza, y embalaje.", caption: "Registro del proceso de inspección del DQ-010 facilitado por el fabricante. Los documentos detallados se comparten tras la consulta cuando corresponda." },
  pt: { eyebrow: "Evidência real de qualidade", title: "Inspeção de qualidade do DQ-010, documentada passo a passo.", lead: "O registro fornecido do DQ-010 mostra verificações de aparência, energia e função, extração, carga e bateria, montagem e limpeza, e embalagem.", caption: "Registro do processo de inspeção do DQ-010 fornecido pelo fabricante. Documentos detalhados são compartilhados após a consulta, quando aplicável." },
  fr: { eyebrow: "Preuve qualité réelle", title: "Contrôle qualité du DQ-010, documenté étape par étape.", lead: "Le relevé fourni pour le DQ-010 présente les contrôles d'aspect, d'alimentation et de fonctionnement, d'extraction, de charge et de batterie, d'assemblage et de nettoyage, ainsi que d'emballage.", caption: "Relevé du processus de contrôle du DQ-010 fourni par le fabricant. Les documents détaillés sont communiqués après demande, le cas échéant." },
  ar: { eyebrow: "دليل جودة حقيقي", title: "فحص جودة DQ-010 موثق خطوة بخطوة.", lead: "يوضح سجل فحص DQ-010 المقدم فحوص المظهر والطاقة والوظائف والاستخلاص والشحن والبطارية والتجميع والتنظيف والتعبئة.", caption: "سجل عملية فحص DQ-010 مقدم من الشركة المصنعة. تُشارك سجلات المشروع التفصيلية بعد الاستفسار عند انطباقها." },
  zh: { eyebrow: "真实质检证据", title: "DQ-010 质检流程，按步骤真实记录。", lead: "所提供的 DQ-010 质检记录展示了外观、电源与功能、萃取、充电与电池、装配与清洁以及包装检查。", caption: "由制造商提供的 DQ-010 质检流程记录；适用时可在询盘后按项目提供更详细资料。" },
  ru: { eyebrow: "Реальное подтверждение качества", title: "Контроль качества DQ-010, документированный по этапам.", lead: "Предоставленная запись DQ-010 показывает проверку внешнего вида, питания и функций, экстракции, зарядки и батареи, сборки и очистки, а также упаковки.", caption: "Запись процесса проверки DQ-010 предоставлена производителем. Подробные документы по проекту предоставляются после запроса, когда применимо." },
};

function getLang(value: string | string[] | undefined): Lang {
  const code = Array.isArray(value) ? value[0] : value;
  return languages.some((language) => language.code === code) ? (code as Lang) : "en";
}

function queryFor(lang: Lang) { return lang === "en" ? "" : `?lang=${lang}`; }

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const t = copy[lang];
  return {
    title: { absolute: `${t.sectionTitles.oem} | TK Classic` },
    description: t.oem.join(" "),
    keywords: ["portable coffee machine OEM", "portable espresso ODM", "private label coffee machine", "custom coffee machine packaging"],
    alternates: { canonical: localizedUrl("/oem-odm", lang), languages: languageAlternates("/oem-odm") },
  };
}

export default async function OemOdmPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const lang = getLang(params?.lang);
  const query = queryFor(lang);
  const t = copy[lang];
  const support = commercialCopy[lang];
  const local = pageCopy[lang];
  const qualityEvidence = qualityEvidenceCopy[lang];
  const dir = languages.find((language) => language.code === lang)?.dir ?? "ltr";
  const packagingGuide = buyerGuides.find((guide) => guide.slug.includes("packaging-checklist"));
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Portable coffee machine OEM and ODM program",
    serviceType: "Portable coffee equipment OEM, ODM, private label and packaging support",
    provider: { "@type": "Organization", name: company.legalName, url: `${company.siteUrl}/company` },
    areaServed: "International wholesale markets",
    url: localizedUrl("/oem-odm", lang),
  };

  const terms = [
    { icon: Handshake, title: support.orderTermsTitle, body: support.orderTerms },
    { icon: Clock3, title: support.leadTimeTitle, body: support.leadTime },
    { icon: Ship, title: support.shippingTitle, body: support.shipping },
    { icon: ShieldCheck, title: support.warrantyTitle, body: support.warranty },
  ];

  return (
    <main className="inner-page oem-page" dir={dir} lang={lang}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="site-header detail-header">
        <Link className="brand" href={`/${query}`} aria-label="TK Classic home"><span className="brand-mark">TK</span><span><strong>TK Classic</strong><small>{brandTagline[lang]}</small></span></Link>
        <PrimaryNav lang={lang} current="oem" ariaLabel="OEM and ODM navigation" />
        <LanguageSwitcher currentLang={lang} hrefForLang={(language) => `/oem-odm${language === "en" ? "" : `?lang=${language}`}`} />
      </header>
      <SectionFloatNav lang={lang} path="/oem-odm" label={t.sectionTitles.oem} />

      <section className="inner-hero section">
        <p className="eyebrow">{t.nav.oem}</p>
        <h1>{t.sectionTitles.oem}</h1>
        <p className="inner-hero-lead">{t.contactLead}</p>
        <Link className="primary-action" href={`/contact${query}#inquiry-form`}>{t.hero.primaryCta}<ArrowUpRight size={17} aria-hidden="true" /></Link>
      </section>

      <RevealSection className="section oem-evidence-section" aria-labelledby="oem-evidence-title">
        <div className="section-heading align-left"><span>{local.evidenceEyebrow}</span><h2 id="oem-evidence-title">{local.evidenceTitle}</h2><p>{local.evidenceLead}</p></div>
        <div className="oem-trust-grid">
          <RevealArticle className="oem-trust-card"><strong>15+</strong><span>{local.years}</span><BadgeCheck aria-hidden="true" /></RevealArticle>
          <RevealArticle className="oem-trust-card"><strong>50+</strong><span>{local.markets}</span><BadgeCheck aria-hidden="true" /></RevealArticle>
          <RevealArticle className="oem-trust-card"><strong>Patent</strong><span>{local.patent}</span><BadgeCheck aria-hidden="true" /></RevealArticle>
          <RevealArticle className="oem-trust-card"><strong>2016</strong><span>{local.established}</span><BadgeCheck aria-hidden="true" /></RevealArticle>
        </div>
        <div className="oem-evidence-links">
          <Link href={`/company${query}`}>{t.sectionTitles.about}<ArrowUpRight size={15} /></Link>
          <Link href={`/factory${query}`}>{t.nav.factory}<ArrowUpRight size={15} /></Link>
          <Link href={`/certifications${query}`}>{t.nav.certs}<ArrowUpRight size={15} /></Link>
          <Link href={`/products${query}`}>{t.nav.products}<ArrowUpRight size={15} /></Link>
        </div>
      </RevealSection>

      <RevealSection className="section split-section oem-process-section" aria-labelledby="oem-process-title">
        <div className="section-heading align-left"><span>{local.processEyebrow}</span><h2 id="oem-process-title">{local.processTitle}</h2><p>{support.qualityLead}</p></div>
        <div className="process-grid">{t.oem.map((item, index) => <RevealArticle className="process-card" key={item}><strong>{String(index + 1).padStart(2, "0")}</strong><p>{item}</p><CheckCircle2 size={19} aria-hidden="true" /></RevealArticle>)}</div>
      </RevealSection>

      <section className="section procurement-section" aria-labelledby="procurement-title">
        <div className="section-heading align-left"><span>{local.termsEyebrow}</span><h2 id="procurement-title">{local.termsTitle}</h2></div>
        <div className="procurement-grid">{terms.map(({ icon: Icon, title, body }) => <article className="procurement-term-card" key={title}><Icon size={22} aria-hidden="true" /><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>

      <RevealSection className="section oem-quality-section" aria-labelledby="oem-quality-title">
        <div className="section-heading align-left"><span>{support.qualityTitle}</span><h2 id="oem-quality-title">{support.qualityLead}</h2></div>
        <ol>{support.qualityItems.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><PackageCheck size={19} aria-hidden="true" /><p>{item}</p></li>)}</ol>
      </RevealSection>

      <RevealSection className="section oem-qc-evidence" aria-labelledby="oem-qc-evidence-title">
        <div className="oem-qc-copy">
          <span>{qualityEvidence.eyebrow}</span>
          <h2 id="oem-qc-evidence-title">{qualityEvidence.title}</h2>
          <p>{qualityEvidence.lead}</p>
          <Link href={`/contact${query}#inquiry-form`}>{t.hero.primaryCta}<ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
        <figure>
          <Image
            src="/images/factory/dq-010-quality-inspection-process.png"
            alt="DQ-010 portable espresso machine quality inspection process showing appearance, function, extraction, charging, assembly and packing checks"
            width={1600}
            height={900}
            sizes="(max-width: 900px) 100vw, 58vw"
          />
          <figcaption>{qualityEvidence.caption}</figcaption>
        </figure>
      </RevealSection>

      {packagingGuide ? <section className="section oem-guide-callout"><div><span>{local.guideLabel}</span><h2>{packagingGuide.title}</h2><p>{packagingGuide.description}</p></div><Link href={`/resources/${packagingGuide.slug}`}>{local.guideCta}<ArrowUpRight size={17} /></Link></section> : null}

      <section className="section oem-final-cta"><FileCheck2 size={28} aria-hidden="true" /><div><h2>{local.finalTitle}</h2><p>{local.finalLead}</p></div><Link className="primary-action" href={`/contact${query}#inquiry-form`}>{t.hero.primaryCta}<ArrowUpRight size={17} /></Link></section>
      <SiteFooter lang={lang} />
    </main>
  );
}
