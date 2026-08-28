import { company, languages } from "@/lib/site-data";

export function SiteStructuredData() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${company.siteUrl}#organization`,
      name: company.legalName,
      alternateName: company.brand,
      description: "Portable coffee equipment manufacturer serving wholesale, private label and OEM/ODM programs.",
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
      areaServed: ["United States", "Europe", "Middle East", "Global wholesale and private label buyers"],
      subjectOf: [
        { "@type": "AboutPage", url: `${company.siteUrl}/about` },
        { "@type": "WebPage", url: `${company.siteUrl}/manufacturer`, name: "Portable Coffee Machine Manufacturer" },
        { "@type": "WebPage", url: `${company.siteUrl}/factory`, name: "TK Classic Factory" },
        { "@type": "WebPage", url: `${company.siteUrl}/wholesale/usa`, name: "Portable Espresso Machines for US Importers and Wholesalers" },
        { "@type": "CollectionPage", url: `${company.siteUrl}/resources`, name: "Portable Coffee Machine Buyer Guides" },
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
