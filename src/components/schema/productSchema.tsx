// components/ProductSchema.tsx

interface ProductSchemaProps {
  name: string;
  description: string;
  sku: string;
  brand: string;
  image: string;
  price: string;
  currency: string;
  aggregateRating: {
    ratingValue: number;
    reviewCount: number;
  };
}

const ProductSchema: React.FC<ProductSchemaProps> = ({
  name,
  description,
  sku,
  brand,
  image,
  price,
  currency,
  aggregateRating,
}) => {
  // Static reviews list (4–5)
  const staticReviews = [
    {
      author: "Ali",
      reviewBody: "Best product I’ve ever purchased from Best Fashion LLC!",
      ratingValue: 5,
    },
    {
      author: "Sara",
      reviewBody: "High quality and comfortable, definitely recommend.",
      ratingValue: 4,
    },
    {
      author: "Usman",
      reviewBody: "Excellent value for money, will buy again.",
      ratingValue: 5,
    },
    {
      author: "Fatima",
      reviewBody: "Good product but delivery was a little slow.",
      ratingValue: 4,
    },
    {
      author: "Ahmed",
      reviewBody: "Amazing! Perfect fit and top quality fabric.",
      ratingValue: 5,
    },
  ];

  // Shuffle reviews and pick random 2–3 reviews for each product
  const shuffledReviews = staticReviews
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 2);

  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name,
    image,
    description,
    sku,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    offers: {
      "@type": "Offer",
      url: typeof window !== "undefined" ? window.location.href : "",
      priceCurrency: currency,
      price,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
    },
    review: shuffledReviews.map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.author,
      },
      reviewBody: review.reviewBody,
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.ratingValue,
        bestRating: "5",
        worstRating: "1",
      },
    })),
  };

  return (
    
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    
  );
};

export default ProductSchema;
