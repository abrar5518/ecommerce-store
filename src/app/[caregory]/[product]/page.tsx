import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/product/product_card";
import Productcontent from "@/components/product/product_content";
import Gallery from "@/components/product/gallery";
import { Fetch } from "@/utils/Fetch";
import { SingleProductRes } from "@/types/product_list";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.product;

  if (!slug) {
    return <div>Product not found.</div>;
  }

  // Filter out non-product requests (like favicon, robots.txt, etc.)
  if (slug.includes(".") || slug.startsWith("_next")) {
    return <div>Invalid product.</div>;
  }

  let productData;
  try {
    const response = await Fetch<SingleProductRes>(`products/${slug}`);
    productData = response.data;
  } catch (error) {
    console.error(`Failed to fetch product ${slug}:`, error);
    return <div>Product not found.</div>;
  }
  const images = [productData.main_image, ...productData.gallery_images].filter(
    (image) => image !== null
  ) as string[];

  const structuredData = {
    id: productData.id,
    name: productData.name,
    price: Number(productData.price),
    main_image: productData.main_image,
    variations: productData.variations,
    description: productData.description,
    short_description: productData.short_description,
    gallery_images: images,
    // sizes: sizes, // Added structured sizes
    // colors: colors, // Added structured colors
  };

  return (
    <div className="custom_container py-5">
      <nav className="text-sm mb-4" aria-label="Breadcrumb">
        <ol className="list-reset flex text-text">
          <li>
            <Link href="/" className="hover:underline text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
          </li>
          <li>
            <Link href="#" className="hover:underline text-primary">
              Category
            </Link>
            <span className="mx-2">/</span>
          </li>
          <li className="text-text font-semibold">Product</li>
        </ol>
      </nav>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left Column: Product Images */}
        <div>
          <Gallery images={images || []} />
        </div>

        {/* Right Column: Product Details */}
        <div className="flex flex-col space-y-4 mt-6 md:mt-0 md:pl-20">
          <h1 className="text-4xl leading-10 font-bold">{productData.name}</h1>
          <h3 className="text-3xl text-primary font-bold">
            $ {productData.price}
          </h3>
          <div
            className="text-text pb-4"
            dangerouslySetInnerHTML={{ __html: productData.short_description }}
          />
          {/* <Productcontent
                        sizes={sizes.length > 0 ? sizes : []} // Only pass sizes if available
                        colors={colors.length > 0 ? colors : []} // Only pass colors if available
                    /> */}
          <Productcontent
            productData={structuredData}
            variations={productData.variations}
          />
        </div>
      </div>
      {/* Product Long Description */}
      <div className="md:flex justify-between gap-10 mt-20">
        <div className="w-full md:w-[70%]">
          <section className="">
            <h2 className="text-2xl font-semibold mb-4">Product Description</h2>
            <div
              className="text-text mb-6"
              dangerouslySetInnerHTML={{ __html: productData.description }}
            ></div>
          </section>

          {/* Customer Reviews */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="font-bold mr-2">John Doe</span>
                  <span className="text-yellow-500">★★★★★</span>
                </div>
                <p className="text-text">Great product! Highly recommended.</p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="font-bold mr-2">Jane Smith</span>
                  <span className="text-yellow-500">★★★★☆</span>
                </div>
                <p className="text-text">
                  Good quality, but delivery was a bit slow.
                </p>
              </div>
            </div>
          </section>
        </div>
        {/* side bar */}

        <aside className="w-full md:w-[30%] mt-6 md:mt-0 bg-gray-50 border rounded-lg p-6 h-fit md:sticky top-24">
          <h3 className="text-lg font-semibold mb-4">Why Shop With Us?</h3>
          <ul className="space-y-3 text-text text-sm">
            <li className="flex items-center">
              <span className="mr-2 text-green-600">✔</span>
              Fast & Free Shipping
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-600">✔</span>
              24/7 Customer Support
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-600">✔</span>
              Easy Returns & Refunds
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-600">✔</span>
              100% Secure Payment
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-600">✔</span>
              Authentic Products Guarantee
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-600">✔</span>
              Exclusive Member Discounts
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-600">✔</span>
              Trusted by Thousands of Customers
            </li>
          </ul>
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Need Help?</h4>
            <p className="text-xs text-gray-600">
              Call us at{" "}
              <a href="tel:+1234567890" className="text-primary underline">
                +1 234 567 890
              </a>
            </p>
            <p className="text-xs text-gray-600">
              or{" "}
              <a
                href="mailto:support@example.com"
                className="text-primary underline"
              >
                Email Support
              </a>
            </p>
          </div>
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Safe Shopping</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>SSL Secured Checkout</li>
              <li>Privacy Protected</li>
              <li>No Hidden Charges</li>
            </ul>
          </div>
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Accepted Payments</h4>
            <div className="flex space-x-2">
              <Image
                src="/assets/images/visa.png"
                alt="Visa"
                width={24}
                height={24}
              />
              <Image
                src="/assets/images/master.png"
                alt="Mastercard"
                width={24}
                height={24}
              />
              <Image
                src="/assets/images/paypal.png"
                alt="PayPal"
                width={24}
                height={24}
              />
            </div>
          </div>
        </aside>
      </div>

      {/* Related Products */}
      <section className="my-14">
        <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <ProductCard
            imageUrl="/assets/images/product-1.jpg"
            altText="Product 1"
            productName="Product 1"
            category="Category A"
            price={49.99}
            offer="10% OFF"
            slug={"1234"}
            category_slug="asdf"
          />
        </div>
      </section>
    </div>
  );
}
