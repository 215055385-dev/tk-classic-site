"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="not-found-page">
          <section>
            <p className="eyebrow">TK Classic</p>
            <h1>The website is temporarily unavailable.</h1>
            <p>Please try again. No inquiry information has been submitted from this screen.</p>
            <button className="primary-action" type="button" onClick={reset}>
              Reload website
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
