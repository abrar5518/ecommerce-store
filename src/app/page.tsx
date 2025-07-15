import Slider from "@/components/home/slider";
import { Metadata } from "next";
import Link from "next/link";
import { Icon } from '@iconify/react';
// import Product_slider from "@/components/product/slider";
import ProductCard from "@/components/product/product_card";
import CategoryCard from "@/components/category/category_card";
// import Footer from "@/components/footer/footer";
import { CategoryResponse } from "@/types/categories";
import { ProductResponse } from "@/types/product_list";
import { Fetch } from "../utils/Fetch";
import HeroSection from "@/components/home/hero";


export async function generateMetadata(): Promise<Metadata> {


  return {
    title: "Islamic Clothing, Hijabs, Fragrances, and More | Best Fashion ",
    description: "Shop for a wide range of Islamic products including hijabs, thobes, Islamic caps, fragrances, and more at IslamicMart. Enjoy modest fashion and quality Islamic accessories.",
    keywords: "thobes, thobes for men, Islamic clothing for men, modest mens wear, buy thobes online, Muslim thobes, best fashion llc",
    robots: "index, follow",
    alternates: {
      canonical: process.env.NEXT_PUBLIC_IMAGE_BASE_URL,
    },
  };
}

export default async function Home() {

  const { data: categoryData } = await Fetch<CategoryResponse>("categories");
  const { data: productData } = await Fetch<ProductResponse>("products");
  const fourProducts = productData.slice(0, 4);

  // console.log(data);

  return (
    <div className="custom_container py-5">
      <Slider />
      <HeroSection />
      {/* section 2 start */}
      <div>
        <div className="flex justify-between items-center mt-20 pb-4 border-b-2 border-b-primary flex-col sm:flex-row">
          <h1 className="text-2xl font-bold text-text text-center sm:text-left sm:text-3xl">
            Grab the best deal on <span className="text-primary">Islamic Apparel & Accessories</span>
          </h1>
          <Link href={'/shop'} className="flex items-center gap-2 text-text mt-4 sm:mt-0">
            View All
            <Icon icon="mdi:arrow-right" width={30} height={30} className="text-primary" />
          </Link>
        </div>

        {/* <Product_slider /> */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5 mb-16">
          {fourProducts?.map((product) => (
            <ProductCard
              imageUrl={product.main_image || "/assets/images/product-1.jpg"} // Fallback image if main_image is null
              key={product.id} // Use product id as key for each ProductCard
              altText={product.name}
              productName={product.name}
              category={product.category.name}
              price={product.price}
              offer={product.sale_price ? `${((product.price - parseFloat(product.sale_price)) / product.price * 100).toFixed(0)}% Off` : "No Offer"}
              slug={product.slug}
              category_slug={product.category.slug}
            />
          ))}

        </div>
      </div>
      {/* section 2 end */}
      {/* section 3 start */}
      <div>
        <div className="flex justify-between items-center mt-20 pb-4 border-b-2 border-b-primary flex-col sm:flex-row">
          <h1 className="text-2xl font-bold text-text text-center sm:text-left sm:text-3xl">
            Shop From Top <span className="text-primary">Categories</span>
          </h1>
          <Link href={'/all-categories'} className="flex items-center gap-2 text-text mt-4 sm:mt-0">
            View All
            <Icon icon="mdi:arrow-right" width={30} height={30} className="text-primary" />
          </Link>
        </div>


        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-8 gap-5 mt-5">
          {/* // grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5 mb-16 */}
          {categoryData?.map((category) => (
            <CategoryCard
              key={category.slug} // Use category id as key for each CategoryCard
              slug={category.slug}
              name={category.name}
              image={category.image}
              alt={category.name}
            />
          ))}
        </div>
      </div>
      {/* section 3 end */}
      {/* section 4 start */}
      <div>
        <div className="flex justify-between items-center mt-20 pb-4 border-b-2 border-b-primary flex-col sm:flex-row">
          <h2 className="text-2xl font-bold text-text text-center sm:text-left sm:text-3xl">
            Discover a wide range of <span className="text-primary">Islamic Products</span> for Every Need
          </h2>
          <Link href={'/shop'} className="flex items-center gap-2 text-text mt-4 sm:mt-0">
            View All
            <Icon icon="mdi:arrow-right" width={30} height={30} className="text-primary" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5 mb-16">
          {productData?.map((product) => (
            <ProductCard
              key={product.id} // Use product id as key for each ProductCard
              slug={product.slug}
              imageUrl={product.main_image || "/assets/images/product-1.jpg"} // Fallback image if main_image is null
              altText={product.name}
              productName={product.name}
              category={product.category.name}
              category_slug={product.category.slug}

              price={product.price}
              offer={product.sale_price ? `${((product.price - parseFloat(product.sale_price)) / product.price * 100).toFixed(0)}% Off` : "No Offer"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
