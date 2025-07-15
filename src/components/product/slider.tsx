"use client";
import React, { useRef } from "react";
import { Icon } from "@iconify/react";
import ProductCard from "@/components/product/product_card";

const products = [
  {
    imageUrl: "/assets/images/product-3.jpg",
    altText: "Smartphone 1",
    productName: "Smartphone 1",
    category: "Smartphones",
    category_slug: "smartphones",
    price: 299.99,
    offer: "20% Off",
    slug: "smartphone-1",
  },
  {
    imageUrl: "/assets/images/product-1.jpg",
    altText: "Smartphone 2",
    productName: "Smartphone 2",
    category: "Smartphones",
    category_slug: "smartphones",
    price: 399.99,
    offer: "10% Off",
    slug: "smartphone-2",
  },
  {
    imageUrl: "/assets/images/product-2.jpg",
    altText: "Smartphone 3",
    productName: "Smartphone 3",
    category: "Smartphones",
    category_slug: "smartphones",
    price: 499.99,
    offer: "15% Off",
    slug: "smartphone-3",
  },
  {
    imageUrl: "/assets/images/product-3.jpg",
    altText: "Smartphone 4",
    productName: "Smartphone 4",
    category: "Smartphones",
    category_slug: "smartphones",
    price: 599.99,
    offer: "5% Off",
    slug: "smartphone-4",
  },
  {
    imageUrl: "/assets/images/product-2.jpg",
    altText: "Smartphone 5",
    productName: "Smartphone 5",
    category: "Smartphones",
    category_slug: "smartphones",
    price: 699.99,
    offer: "25% Off",
    slug: "smartphone-5",
  },
  {
    imageUrl: "/assets/images/product-3.jpg",
    altText: "Smartphone 6",
    productName: "Smartphone 6",
    category: "Smartphones",
    category_slug: "smartphones",
    price: 799.99,
    offer: "30% Off",
    slug: "smartphone-6",
  },
];

export default function ProductSlider() {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const cardWidth = 300;
  const gap = 20;
  const itemsToShow = 4;

  const handleScroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount =
        direction === "left" ? -(cardWidth + gap) : cardWidth + gap;
      sliderRef.current.scrollLeft += scrollAmount;
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Slider Container */}
      <div
        className="overflow-hidden"
        style={{
          width: `${cardWidth * itemsToShow + gap * (itemsToShow - 1)}px`,
        }}
      >
        {/* Slide Track */}
        <div
          ref={sliderRef}
          className="flex gap-5 mt-5 transition-transform duration-500 ease-in-out overflow-x-auto scrollbar-hide"
          style={{
            width: `${
              cardWidth * products.length + gap * (products.length - 1)
            }px`,
            scrollBehavior: "smooth",
          }}
        >
          {products.map((product, idx) => (
            <div
              key={idx}
              style={{ minWidth: cardWidth, maxWidth: cardWidth }}
              className="flex-shrink-0"
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>

      {/* Left and Right Arrows with Iconify */}
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full hover:bg-gray-800 transition z-10"
        onClick={() => handleScroll("left")}
      >
        <Icon
          icon="mdi:chevron-left"
          width={30}
          height={30}
          className="text-white"
        />
      </button>

      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full hover:bg-gray-800 transition z-10"
        onClick={() => handleScroll("right")}
      >
        <Icon
          icon="mdi:chevron-right"
          width={30}
          height={30}
          className="text-white"
        />
      </button>
    </div>
  );
}
