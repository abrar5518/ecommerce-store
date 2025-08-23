
interface Product {
  id: string | number;
  name: string;
  slug: string;
  image: string;
  price: string;
  brand?: string;
  description?: string;
}

interface ProductListSchemaProps {
  products: Product[];
  categoryName?: string;
}

const ProductListSchema: React.FC<ProductListSchemaProps> = ({ products, categoryName }) => {
  if (!products || products.length === 0) return null;

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "Product",
      position: index + 1,
      name: product.name,
      image: product.image,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${categoryName}/${product.slug}`,
      description: product.description || `${product.name} available at Best Fashion LLC.`,
      brand: product.brand || "Best Fashion",
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: product.price,
        availability: "https://schema.org/InStock",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${categoryName}/${product.slug}`,
      },
    })),
  };

  return (
      <script type="application/ld+json">
        {JSON.stringify(itemListSchema)}
      </script>
  );
};

export default ProductListSchema;
