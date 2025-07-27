"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

interface Variation {
  attribute: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
  value: {
    id: number;
    attribute_id: number;
    name: string;
    image: string | null;
    color: string | null;
    created_at: string;
    updated_at: string;
  };
}

interface ProductData {
  id: number;
  name: string;
  price: number;
  main_image: string | null;
  variations: Variation[];
  description: string;
  short_description: string;
  gallery_images: string[];
}

interface ProductContentProps {
  variations: Variation[];
  productData: ProductData;
}

const Productcontent: React.FC<ProductContentProps> = ({
  variations,
  productData,
}) => {
  const { addToCart } = useCart();
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string | undefined;
  }>({});
  const [quantity, setQuantity] = useState<number>(1);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    const defaultSelections: { [key: string]: string | undefined } = {};
    variations.forEach((variation) => {
      if (!defaultSelections[variation.attribute.name]) {
        defaultSelections[variation.attribute.name] = variation.value.name;
      }
    });
    setSelectedAttributes(defaultSelections);
  }, [variations]);
  

  const handleAttributeSelect = (attribute: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attribute]: value,
    }));
  };
  const filteredAttributes: { [key: string]: string } = Object.entries(selectedAttributes).reduce(
  (acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  },
  {} as { [key: string]: string }
);

  const handleAddToCart = () => {
    const missingAttributes = Object.values(selectedAttributes).some(
      (value) => value === undefined
    );
    if (missingAttributes) {
      alert("Please select all attributes.");
    } else {
      const cartItem = {
  id: productData.id,
  name: productData.name,
  price: productData.price,
  quantity,
  image: productData.main_image || undefined,
  attributes: filteredAttributes,
};

      addToCart(cartItem);
    }
  };

  const handleBuyNow = () => {
    const missingAttributes = Object.values(selectedAttributes).some(
      (value) => value === undefined
    );
    if (missingAttributes) {
      alert("Please select all attributes.");
    } else {
     const cartItem = {
  id: productData.id,
  name: productData.name,
  price: productData.price,
  quantity,
  image: productData.main_image || undefined,
  attributes: filteredAttributes,
};

      addToCart(cartItem);

      if (isClient) {
        const searchParams = new URLSearchParams();
        searchParams.append("productId", String(productData.id));
        searchParams.append("quantity", String(quantity));
        searchParams.append("price", String(productData.price));
        Object.entries(selectedAttributes).forEach(([key, value]) => {
          searchParams.append(key, value || "");
        });

        router.push(`/cart?${searchParams.toString()}`);
      }
    }
  };

  const groupedAttributes = variations.reduce(
    (acc: { [key: string]: string[] }, variation) => {
      const attributeName = variation.attribute.name;
      if (!acc[attributeName]) {
        acc[attributeName] = [];
      }
      acc[attributeName].push(variation.value.name);
      return acc;
    },
    {}
  );

  return (
    <div>
      {/* Dynamically render each attribute */}
      {Object.entries(groupedAttributes).map(([attribute]) => (
  <div key={attribute} className="mb-4">
    <h3 className="font-semibold mb-2">{attribute}:</h3>
    <div className="flex flex-wrap gap-2">
      {variations
        .filter((variation) => variation.attribute.name === attribute)
        .map(({ value }) => {
          const isSelected = selectedAttributes[attribute] === value.name;
          const hasColor = !!value.color;
          const hasImage = !!value.image;
          const style = isSelected
            ? "border-2 border-black"
            : "border border-gray-300 hover:border-black";

          return (
            <button
              key={value.id}
              onClick={() => handleAttributeSelect(attribute, value.name)}
              className={`w-10 h-10 rounded-full transition flex items-center justify-center ${style}`}
              style={{
                backgroundColor: hasColor ? value.color! : undefined,
                backgroundImage:
                  !hasColor && hasImage ? `url(${value.image})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {hasColor || hasImage ? (
                isSelected && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )
              ) : (
                <span className="text-sm text-black">{value.name}</span>
              )}
            </button>
          );
        })}
    </div>
  </div>
))}


      {/* Quantity input */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Quantity:</h3>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border rounded px-3 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center space-x-6 mt-2">
        <button
          onClick={handleAddToCart}
          className="flex justify-center items-center bg-black text-white px-4 py-2 rounded-full hover:bg-transparent border-2 border-black hover:text-black transition"
        >
          Add to Cart
          <Icon icon="akar-icons:cart" className="ml-2" />
        </button>
        <button
          onClick={handleBuyNow}
          className="flex justify-center items-center bg-primary text-white px-4 py-2 rounded-full hover:bg-transparent border-2 border-primary hover:text-primary transition"
        >
          Buy Now
          <Icon icon="mdi:credit-card-outline" className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Productcontent;
