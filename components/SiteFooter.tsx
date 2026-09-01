import Link from "next/link";
import { company, copy, products, type Lang } from "@/lib/site-data";
import { privacyCopy } from "@/lib/support-page-data";
import { brandTagline, footerCopy } from "@/lib/translation-copy";
import { phoneHref, whatsappHref } from "@/lib/contact";

type SiteFooterProps = {
  lang: Lang;
};

function localizedPath(path: string, lang: Lang) {
  if (lang === "en") return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

export function SiteFooter({ lang }: SiteFooterProps) {
  const t = copy[lang];
  const footer = footerCopy[lang];
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-intro">
        <Link className="brand footer-brand" href={localizedPath("/", lang)} aria-label="TK Classic home">
          <span className="brand-mark">TK</span>
          <span>
            <strong>TK Classic</strong>
            <small>{brandTagline[lang]}</small>
          </span>
        </Link>
        <p>{footer.description}</p>
        <div className="footer-direct" aria-label="Direct contact">
          <a href={phoneHref(company.phoneBowie)}>{footer.phoneLabel}: {company.phoneBowie}</a>
          <a href={whatsappHref()} target="_blank" rel="noreferrer">
            {footer.whatsappLabel} Bowie
          </a>
        </div>
      </div>

      <nav aria-label="Footer products">
        <h2>{t.nav.products}</h2>
        {products.slice(0, 6).map((product) => (
          <Link key={product.slug} href={localizedPath(`/products/${product.slug}`, lang)}>
            {product.model}
          </Link>
        ))}
      </nav>

      <nav className="footer-company" aria-label="Footer company">
        <h2>{t.nav.about}</h2>
        {lang === "en" ? <Link href="/about">About TK Classic</Link> : <Link href={localizedPath("/company", lang)}>{t.nav.about}</Link>}
        {lang === "en" ? <Link href="/manufacturer">Manufacturer</Link> : null}
        <Link href={localizedPath("/oem-odm", lang)}>{t.nav.oem}</Link>
        <Link href={localizedPath("/factory", lang)}>{t.nav.factory}</Link>
        <Link href={localizedPath("/certifications", lang)}>{t.nav.certs}</Link>
        <Link href={localizedPath("/contact", lang)}>{t.nav.contact}</Link>
        <Link href={localizedPath("/privacy", lang)}>{privacyCopy[lang].navLabel}</Link>
      </nav>

      <nav className="footer-resources" aria-label="Footer resources">
        <h2>{t.nav.blog}</h2>
        <Link href={localizedPath("/resources", lang)}>{t.nav.blog}</Link>
        <Link href={localizedPath("/accessories", lang)}>{t.sectionTitles.accessories}</Link>
        {lang === "en" ? <Link href="/solutions">Solutions</Link> : null}
        {lang === "en" ? <Link href="/wholesale/usa">US importer sourcing</Link> : null}
        {lang === "en" ? <Link href="/camping-coffee-machine">Camping coffee guide</Link> : null}
        {lang === "en" ? <Link href="/travel-coffee-machine">Travel coffee guide</Link> : null}
        {lang === "en" ? <Link href="/car-coffee-machine">Car coffee guide</Link> : null}
        <a href={company.brochure}>{t.hero.tertiaryCta}</a>
      </nav>

      <div className="footer-bottom">
        <span>© {year} {company.legalName}</span>
        <span>{footer.city}</span>
      </div>
    </footer>
  );
}
