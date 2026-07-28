import Link from "next/link";
import { Mail } from "lucide-react";
import { company } from "@/lib/site-data";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <section>
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="hero-support">
          The page may have moved, or the product link may be outdated. You can return to the product catalog or contact TK Classic for sourcing support.
        </p>
        <div className="hero-actions">
          <Link className="primary-action" href="/#products">
            View products
          </Link>
          <a className="secondary-action" href={`mailto:${company.emailBowie}`}>
            <Mail size={18} aria-hidden="true" />
            Contact sales
          </a>
        </div>
      </section>
    </main>
  );
}
