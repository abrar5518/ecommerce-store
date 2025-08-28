"use client"; // Ensure this component is rendered client-side
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // To get query params
import { Fetch } from "@/utils/Fetch";
import ProductCard from "@/components/product/product_card"; // Assuming ProductCard is imported correctly
import { ProductResponse } from "@/types/product_list"; // Assuming ProductResponse type exists

const SearchResultsPage = () => {
  const [products, setProducts] = useState<ProductResponse["data"]>([]); // Define the state with type
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const searchParams = useSearchParams(); // Get query params from URL

  useEffect(() => {
    const searchQuery = searchParams.get("query");
    if (searchQuery) {
      setQuery(searchQuery);
      fetchProducts(searchQuery);
    }
  }, [searchParams]);

  const fetchProducts = async (query: string) => {
    try {
      setLoading(true);
      const response = await Fetch<ProductResponse>(`products/search?name=${query}`);
      setProducts(response.data || []); // Store fetched products
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

    // Schema for the Search Results page
  const schema = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_BASE_URL}/search?query=${query}`,
    },
    "headline": `Search Results for ${query}`,
    "description": "Here are the products related to your search query.",
    "query": query,
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/search?query=${query}`,
  };


  return (
    <div className="min-h-screen bg-gray-50 custom_container py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">Search Results for {query}</h1>
        <p className="text-lg text-gray-600">Here are the products related to your search query.</p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-gray-500 py-16">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-16">
            No products found.
          </div>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              imageUrl={product.main_image || "/assets/images/product-placeholder.jpg"}
              altText={product.name}
              productName={product.name}
              category={product.category.name}
              price={product.price}
              offer={
                product.sale_price
                  ? `${(
                      ((product.price - parseFloat(product.sale_price)) / product.price) *
                      100
                    ).toFixed(0)}% Off`
                  : "No Offer"
              }
              slug={product.slug}
              category_slug={product.category.slug}
            />
          ))
        )}
      </div>
            {/* Add Schema to the page */}
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </div>
  );
};

// Wrap the component in Suspense for client-side rendering
export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResultsPage />
    </Suspense>
  );
}
