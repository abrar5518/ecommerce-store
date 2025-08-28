"use client";
import React from "react";
import { Category } from "@/types/categories";

interface Props {
  categories: Category[];
}

const NavigationSchema: React.FC<Props> = ({ categories }) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.bestfashionllc.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: [
      "Home",
      "Shop",
      "Categories",
      ...categories.slice(0, 7).map((cat) => cat.name),
    ],
    url: [
      `${baseUrl}/`,
      `${baseUrl}/shop`,
      `${baseUrl}/all-categories`,
      ...categories.slice(0, 7).map((cat) => `${baseUrl}/${cat.slug}`),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default NavigationSchema;
