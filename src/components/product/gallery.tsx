"use client";
import { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

interface ProductImageSliderProps {
  images: string[]; // Array of image URLs
}
const ProductImageSlider: React.FC<ProductImageSliderProps> = ({ images }) => {
  // const images = [
  //     "/assets/images/product-1.jpg",
  //     "/assets/images/product-2.jpg",
  //     "/assets/images/product-3.jpg",
  // ];
  // const baseurl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
  const [selectedImage, setSelectedImage] = useState(images[0]);
  console.log("main image : " + selectedImage);
  console.log("gallery images : " + " images link " + images.join(", "));

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
  };

  const nextImage = () => {
    const currentIndex = images.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
  };

  const prevImage = () => {
    const currentIndex = images.indexOf(selectedImage);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[prevIndex]);
  };

  return (
    <div className="">
      {/* Main Product Image */}
      <div className="relative mb-4">
        <Image
          src={selectedImage}
          alt="Product Main"
          width={500}
          height={384}
          className="w-full h-96 object-cover rounded-lg"
        />
        <button
          onClick={prevImage}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
        >
          <Icon
            icon="mdi:chevron-left"
            width={28}
            height={28}
            className="text-primary"
          />
        </button>
        <button
          onClick={nextImage}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
        >
          <Icon
            icon="mdi:chevron-right"
            width={28}
            height={28}
            className="text-primary"
          />
        </button>
      </div>

      {/* Thumbnails Slider */}
      <div className="flex space-x-2 overflow-x-auto">
        {images.map((src, idx) => (
          <Image
            key={idx}
            src={src}
            alt={`Thumbnail ${idx + 1}`}
            width={80}
            height={80}
            className="w-20 h-20 object-cover rounded-lg border cursor-pointer hover:ring-2 hover:ring-primary transition"
            onClick={() => handleImageClick(src)}
          />
        ))}
      </div>
    </div>
  );
};
export default ProductImageSlider;
