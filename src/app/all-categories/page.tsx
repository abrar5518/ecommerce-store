"use client";
import { useEffect, useState } from "react";
import { Fetch } from "@/utils/Fetch";
import { CategoryResponse } from "@/types/categories";
import Link from "next/link";

export default function AllCategoriesPage() {
  const [categories, setCategories] = useState<CategoryResponse["data"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all categories
    async function fetchCategories() {
      try {
        const response = await Fetch<CategoryResponse>("categories");
        setCategories(response.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const baseurl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

  return (
    <div className="min-h-screen bg-gray-50 custom_container py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">Explore Our Categories</h1>
        <p className="text-lg text-gray-600">Click on any category to discover amazing products.</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-gray-500 py-16">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-16">
            No categories found.
          </div>
        ) : (
          categories.map((category) => (
            <Link
              href={`/category/${category.slug}`} // Link to category page
              key={category.id}
              className="group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl"
            >
              <div className="relative">
                {/* Category Image */}
                <img
                  src={baseurl + category.image || "/assets/images/category-placeholder.jpg"}
                  alt={category.name}
                  className="w-full h-48 object-cover transition-all duration-300 group-hover:scale-110"
                />
                {/* Bottom Gradient Overlay */}
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black to-transparent opacity-80 group-hover:opacity-90 transition-all duration-300"></div>
                {/* Category Name */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white font-semibold text-lg transition-all duration-300">
                  {category.name}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
