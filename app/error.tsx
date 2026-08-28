"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page rendering failed", error);
  }, [error]);

  return (
    <main className="not-found-page">
      <section>
        <p className="eyebrow">Temporary issue</p>
        <h1>This page could not be loaded.</h1>
        <p className="hero-support">
          Your request has not been lost. Please try again or return to the product catalog.
        </p>
        <div className="hero-actions">
          <button className="primary-action" type="button" onClick={reset}>
            Try again
          </button>
          <Link className="secondary-action" href="/products">
            View products
          </Link>
        </div>
      </section>
    </main>
  );
}
