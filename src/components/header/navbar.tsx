import { CategoryResponse } from "@/types/categories";
import { Fetch } from "@/utils/Fetch";
import Link from "next/link";

export default async function Navbar() {
  const { data: categoryData } = await Fetch<CategoryResponse>("categories");
  const topCategories = categoryData.slice(0, 10);


  return (
    <div className="bg-white border-b-2 custom_container hidden md:block">
      {/* Nav container */}
      <div className="flex justify-center items-center py-4 space-x-6 text-sm text-black">
        {/* Groceries with background, text-primary font-semibold */}
        <div className="relative">
          <Link href={'/'} className="bg-primary text-white font-semibold px-4 py-2 rounded-full hover:bg-secondary hover:text-black focus:outline-none">
            Home
          </Link>
        </div>
        <Link
          href={`/shop`} className="bg-secondary px-4 py-2 rounded-full hover:bg-primary hover:text-white focus:outline-none" >
Shop
          </Link>
            <Link
          href={`/all-categories`} className="bg-secondary px-4 py-2 rounded-full hover:bg-primary hover:text-white focus:outline-none" >
Categories
          </Link>

        {topCategories.map((category) => (
          <Link
          href={`/${category.slug}`}
            key={category.id}
            className="bg-secondary px-4 py-2 rounded-full hover:bg-primary hover:text-white focus:outline-none"
          >
            {category.name} {/* Display category name */}
          </Link>
        ))}
      </div>
    </div>
  );
}
