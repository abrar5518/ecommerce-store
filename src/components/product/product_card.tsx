import Image from 'next/image';
import React from 'react';
import { Icon } from '@iconify/react';
import { ProductCardProps } from '@/types/product_card';
import Link from 'next/link';

export default function ProductCard({
  imageUrl,
  altText,
  productName,
  category,
  price,
  offer,
  slug,
  category_slug
}: ProductCardProps) {
  // const baseurl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

  return (
    <div className="relative bg-white rounded-2xl overflow-hidden border w-full hover:border-2 hover:border-primary transition-all ease-in-out hover:shadow-lg">
      <Link href={`${category_slug}/${slug}`} >

        <div className="relative">
          <Image
            src={imageUrl}
            alt={altText}
            className="w-full h-64 object-cover"
            priority
            width={500}
            height={256}
          />
          {/* Display the offer */}
          <p className="bg-primary px-2 py-1 rounded-full absolute top-1 left-1 text-white text-xs">
            {offer}
          </p>
        </div>

        <div className="p-4">
          <h3 className="text-xl font-semibold mt-2">{productName}</h3>
          <p className="text-sm text-gray-500">{category}</p>
          <div className="flex gap-3 justify-between items-center">
            <p className="text-2xl font-bold mt-1">${price}</p>
            <button className="bg-primary hover:bg-b_text hover:text-white text-white py-[6px] px-4 rounded-2xl text-sm flex gap-2">
Buy Now              <Icon icon="mdi:cart" width={20} height={20} className="ml-2 text-white" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

