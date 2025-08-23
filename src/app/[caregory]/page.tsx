
import ProductCard from "@/components/product/product_card";
import { Fetch } from "@/utils/Fetch";
import { ProductResponse } from "@/types/product_list";
import { CategoryResponse } from "@/types/categories";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ caregory: string }> }): Promise<Metadata> {
  const { caregory } = await params;
  console.log("Generating metadata for category:", caregory);
  const category = await Fetch<CategoryResponse>(`categories/${caregory}`);
  // const category = await response.json();
  // console.log("Fetched category data:", category.data[0].meta_title);

  return {
    title: category.data[0]?.meta_title || "Thobe's - Latest Thobe Design",
    description: category.data[0]?.meta_description || "This is the simple test description for Thobe's category.",
    keywords: category.data[0]?.meta_keywords || "Thobe, Latest Thobe Design, Fashion, Clothing",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/${caregory}`,
    },
    openGraph: {
      title: category.data[0]?.meta_title || "Thobe's - Latest Thobe Design",
      description: category.data[0]?.meta_description || "This is the simple test description for Thobe's category.",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${caregory}`,
      images: [
        {
          url: category.data[0]?.image || "/assets/images/default-category.jpg",
          width: 800,
          height: 600,
          alt: category.data[0]?.meta_title || "Thobe's - Latest Thobe Design",
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: category.data[0]?.meta_title || "Thobe's - Latest Thobe Design",
      description: category.data[0]?.meta_description || "This is the simple test description for Thobe's category.",
      images: category.data[0]?.image || "/assets/images/default-category.jpg",
    },

  };
}


export default async function CategoryPage({
  params,
}: {
  params: Promise<{ caregory: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams?.caregory;

  if (!slug) {
    // If slug is undefined, handle it gracefully (e.g., redirect or show an error)
    return <div>Category not found.</div>;
  }

  // Filter out non-category requests (like favicon, robots.txt, etc.)
  if (slug.includes(".") || slug.startsWith("_next")) {
    return <div>Invalid category.</div>;
  }

  // Fetch category and products based on the slug
  let categoryData: CategoryResponse["data"] = [];
  let productData: ProductResponse["data"] = [];

  try {
    const categoryResponse = await Fetch<CategoryResponse>("categories");
    categoryData = categoryResponse.data || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }

  try {
    const productResponse = await Fetch<ProductResponse>(
      `products/category/${slug}`
    );
    productData = productResponse.data || [];
  } catch (error) {
    console.error(`Failed to fetch products for category ${slug}:`, error);
  }

  // Ensure categoryData and productData are valid arrays
  const categories = categoryData;
  const products = productData;

  return (
    <div className="min-h-screen bg-gray-50 custom_container py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-1">
            Shop by Category
          </h1>
          <p className="text-gray-600">
            Discover the best products in your favorite category. Filter and
            sort to find exactly what you need.
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search products..."
            defaultValue=""
            className="border rounded px-3 py-2 focus:outline-primary w-56"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full border transition text-sm ${"bg-white text-gray-700 border-gray-300 hover:bg-primary/10"}`}
              >
                {cat.name}
              </button>
            ))
          ) : (
            <span className="text-gray-500">No categories found.</span>
          )}
        </div>
        {/* Price Filter */}
        <div className="flex gap-2 flex-wrap">
          {/* Add any price filter buttons here */}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-16">
            No products found.
          </div>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id} // Use product id as key for each ProductCard
              slug={product.slug}
              imageUrl={product.main_image || "/assets/images/product-1.jpg"} // Fallback image if main_image is null
              altText={product.name}
              productName={product.name}
              category={product.category.name}
              category_slug={product.category.slug}
              price={product.price}
              offer={
                product.sale_price
                  ? `${(
                    ((product.price - parseFloat(product.sale_price)) /
                      product.price) *
                    100
                  ).toFixed(0)}% Off`
                  : "No Offer"
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
