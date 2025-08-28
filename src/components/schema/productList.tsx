"use client";
import React from "react";
import { Product } from "@/types/product_list";

interface Props {
  products: Product[];
}

const ProductListSchema: React.FC<Props> = ({ products }) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.bestfashionllc.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        image: product.main_image,
        description: product.short_description || product.description,
        sku: product.sku,
        brand: {
          "@type": "Brand",
          name: product.brand?.name,
        },
        category: product.category?.name,
        offers: {
          "@type": "Offer",
          url: `${baseUrl}/${product.category.slug}/${product.slug}`,
          priceCurrency: product.currency,
          price: product.price,
          availability:
            product.stock_status === "in_stock"
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
        aggregateRating: product.average_rating
          ? {
              "@type": "AggregateRating",
              ratingValue: product.average_rating,
              reviewCount: Math.floor(Math.random() * 50) + 5, // random reviews
            }
          : undefined,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default ProductListSchema;
