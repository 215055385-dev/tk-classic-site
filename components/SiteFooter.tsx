import Link from "next/link";
import { company, copy, products, type Lang } from "@/lib/site-data";
import { privacyCopy } from "@/lib/support-page-data";
import { footerCopy } from "@/lib/translation-copy";
import { phoneHref, whatsappHref } from "@/lib/contact";

type SiteFooterProps = {
  lang: Lang;
};

function langQuery(lang: Lang) {
  return lang === "en" ? "" : `?lang=${lang}`;
}

export function SiteFooter({ lang }: SiteFooterProps) {
  const t = copy[lang];
  const footer = footerCopy[lang];
  const query = langQuery(lang);
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div>
        <Link className="brand footer-brand" href={`/${query}`} aria-label="TK Classic home">
          <span className="brand-mark">TK</span>
          <span>
            <strong>TK Classic</strong>
            <small>Portable coffee OEM</small>
          </span>
        </Link>
        <p>{footer.description}</p>
      </div>

      <nav aria-label="Footer products">
        <h2>{t.nav.products}</h2>
        {products.slice(0, 6).map((product) => (
          <Link key={product.slug} href={`/products/${product.slug}${query}`}>
            {product.model}
          </Link>
        ))}
      </nav>

      <nav aria-label="Footer company">
        <h2>{t.nav.contact}</h2>
        <Link href={`/company${query}`}>{t.nav.about}</Link>
        <Link href={`/accessories${query}`}>{t.sectionTitles.accessories}</Link>
        <Link href={`/oem-odm${query}`}>{t.nav.oem}</Link>
        <Link href={`/factory${query}`}>{t.nav.factory}</Link>
        <Link href={`/certifications${query}`}>{t.nav.certs}</Link>
        <Link href={`/contact${query}`}>{t.nav.contact}</Link>
        <Link href={`/resources${query}`}>{t.nav.blog}</Link>
        <Link href={`/privacy${query}`}>{privacyCopy[lang].navLabel}</Link>
        <a href={phoneHref(company.phoneBowie)}>{footer.phoneLabel}: {company.phoneBowie}</a>
        <a href={whatsappHref()} target="_blank" rel="noreferrer">
          {footer.whatsappLabel} Bowie
        </a>
        <Link href={`/contact${query}`}>{t.contactTitle}</Link>
        <a href={company.brochure}>{t.hero.tertiaryCta}</a>
      </nav>

      <div className="footer-bottom">
        <span>© {year} {company.legalName}</span>
        <span>{footer.city}</span>
      </div>
    </footer>
  );
}
