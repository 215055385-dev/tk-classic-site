import { company, languages } from "@/lib/site-data";

export function SiteStructuredData() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${company.siteUrl}#organization`,
      name: company.legalName,
      alternateName: company.brand,
      url: company.siteUrl,
      logo: `${company.siteUrl}/favicon.svg`,
      email: company.emailBowie,
      telephone: company.phoneBowie,
      knowsAbout: [
        "Portable espresso machines",
        "Portable coffee machine OEM and ODM",
        "Private label coffee equipment",
        "Coffee machine accessories and retail bundles",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: company.emailBowie,
        telephone: company.phoneBowie,
        availableLanguage: languages.map((language) => language.native),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${company.siteUrl}#website`,
      name: company.brand,
      url: company.siteUrl,
      inLanguage: languages.map((language) => language.code),
      publisher: { "@id": `${company.siteUrl}#organization` },
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
