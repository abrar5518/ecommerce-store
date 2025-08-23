"use client";
import { useEffect, useState } from "react";
import { Fetch } from "@/utils/Fetch";
import { ProductResponse } from "@/types/product_list";
import { CategoryResponse } from "@/types/categories";
import ProductCard from "@/components/product/product_card"; // Import ProductCard
import ProductListSchema from "@/components/schema/productList";
import { mapProductsForSchema } from "@/utils/lib/mapProducts";

export default function ShopPage() {
  const [products, setProducts] = useState<ProductResponse["data"]>([]);
  const [categories, setCategories] = useState<CategoryResponse["data"]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<ProductResponse["data"]>([]);

  useEffect(() => {
    // Fetch categories and products
    async function fetchCategoriesAndProducts() {
      try {
        const categoryResponse = await Fetch<CategoryResponse>("categories");
        setCategories(categoryResponse.data || []);

        const productResponse = await Fetch<ProductResponse>("products");
        setProducts(productResponse.data || []);
        setFilteredProducts(productResponse.data || []); // Initially show all products
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoriesAndProducts();
  }, []);

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    filterProducts(e.target.value, selectedCategory);
  };

  // Handle category selection
  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    filterProducts(searchQuery, categorySlug);
  };

  // Filter products based on search query and category
  const filterProducts = (query: string, category: string) => {
    let filtered = products;

    if (category) {
      filtered = filtered.filter((product) => product.category.slug === category);
    }

    if (query) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };
    // 🔥 Convert API products into schema format
  const mapProducts = mapProductsForSchema(products);
  return (
    <div className="min-h-screen bg-gray-50 custom_container py-8">
      <ProductListSchema products={mapProducts} categoryName={"/shop"} />
      {/* Header Section with Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
        <div className="w-full md:w-2/5">
          {/* Search Bar */}
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => handleCategoryChange("")}
            className={`px-4 py-2 rounded-full border text-sm ${!selectedCategory ? "bg-primary text-white" : "bg-white text-gray-700 border-gray-300"}`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.slug)}
              className={`px-4 py-2 rounded-full border text-sm ${selectedCategory === category.slug ? "bg-primary text-white" : "bg-white text-gray-700 border-gray-300"}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-gray-500 py-16">
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-16">
            No products found.
          </div>
        ) : (
          filteredProducts.map((product) => (
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
    </div>
  );
}
