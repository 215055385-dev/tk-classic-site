const origin = process.env.SEO_AUDIT_ORIGIN ?? "https://portablecoffeemachine.com";
const sitemapResponse = await fetch(`${origin}/sitemap.xml`);
if (!sitemapResponse.ok) throw new Error(`Sitemap returned ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => {
  const publishedUrl = new URL(match[1]);
  const auditOrigin = new URL(origin);
  return `${auditOrigin.origin}${publishedUrl.pathname}${publishedUrl.search}`;
});
const issues = [];
const titles = new Map();

for (const url of urls) {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) { issues.push(`${response.status} ${url}`); continue; }
  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("text/html")) continue;
  const html = await response.text();
  const title = html.match(/<title>(.*?)<\/title>/is)?.[1]?.trim() ?? "";
  const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1]?.trim() ?? "";
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)?.[1]?.trim() ?? "";
  const h1Count = (html.match(/<h1(?:\s|>)/gi) ?? []).length;
  if (!title) issues.push(`Missing title: ${url}`);
  if (!description) issues.push(`Missing description: ${url}`);
  if (!canonical) issues.push(`Missing canonical: ${url}`);
  if (h1Count !== 1) issues.push(`Expected one H1, found ${h1Count}: ${url}`);
  if (/name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) issues.push(`Sitemap URL is noindex: ${url}`);
  if (title) {
    const existing = titles.get(title);
    if (existing && existing !== url) issues.push(`Duplicate title: ${existing} and ${url}`);
    titles.set(title, url);
  }
}

if (issues.length) {
  console.error(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`SEO audit passed for ${urls.length} sitemap URLs.`);
}
