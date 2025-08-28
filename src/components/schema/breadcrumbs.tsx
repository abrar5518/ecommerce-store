// components/seo/Breadcrumb.tsx

import React from "react";

interface BreadcrumbItem {
  name: string;
  url: string; // yahan relative ("/slug") ya absolute dono chalenge
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.bestfashionllc.com";

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
