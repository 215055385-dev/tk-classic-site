import Link from "next/link";
import { Mail } from "lucide-react";

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
          <Link className="secondary-action" href="/contact#inquiry-form">
            <Mail size={18} aria-hidden="true" />
            Contact sales
          </Link>
        </div>
      </section>
    </main>
  );
}
