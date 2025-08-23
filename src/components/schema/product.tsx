// components/ProductSchema.tsx
"use client";

interface ProductSchemaProps {
  name: string;
  description: string;
  sku: string;
  brand: string;
  image: string;
  url: string;
  price: string;
  currency: string;
  availability?: string;
}

export default function ProductSchema({
  name,
  description,
  sku,
  brand,
  image,
  url,
  price,
  currency,
  availability = "https://schema.org/InStock",
}: ProductSchemaProps) {
  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name,
    image: [image],
    description,
    sku,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: currency,
      price,
      availability,
    },
  };

  return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    
  );
}
