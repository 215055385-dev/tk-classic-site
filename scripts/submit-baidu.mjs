const origin = process.env.SEO_SUBMIT_ORIGIN ?? "https://portablecoffeemachine.com";
const endpoint = process.env.BAIDU_API_ENDPOINT;

if (!endpoint) {
  throw new Error(
    "BAIDU_API_ENDPOINT is missing. Copy the complete API submission URL from Baidu Search Resource Platform > Resource submission > Normal inclusion > API submission.",
  );
}

const endpointUrl = new URL(endpoint);
if (endpointUrl.hostname !== "data.zz.baidu.com") {
  throw new Error("BAIDU_API_ENDPOINT must use the official data.zz.baidu.com host.");
}

const sitemapResponse = await fetch(`${origin}/sitemap-zh.xml`);
if (!sitemapResponse.ok) {
  throw new Error(`Unable to read the Chinese sitemap: ${sitemapResponse.status}`);
}

const sitemap = await sitemapResponse.text();
const originUrl = new URL(origin);
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
  .map((match) => match[1].replaceAll("&amp;", "&"))
  .filter((value) => {
    const url = new URL(value);
    return url.origin === originUrl.origin && url.pathname.startsWith("/zh");
  });

if (!urls.length) {
  throw new Error("No same-domain Chinese URLs were found in sitemap-zh.xml.");
}

const response = await fetch(endpointUrl, {
  method: "POST",
  headers: { "content-type": "text/plain" },
  body: urls.join("\n"),
});
const result = await response.text();

if (!response.ok) {
  throw new Error(`Baidu submission failed: ${response.status} ${result}`);
}

console.log(`Baidu accepted the Chinese URL submission request for ${urls.length} URLs: ${result}`);
