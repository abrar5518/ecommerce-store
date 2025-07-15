"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation"; // Correct import for App Router

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
  const [isClient, setIsClient] = useState(false); // State to check if it's client-side
  const router = useRouter();

  // UseEffect to set the default selected values based on available variations
  useEffect(() => {
    setIsClient(true); // Set to true once the component is mounted on the client

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
        size: selectedAttributes["Size"],
        color: selectedAttributes["Color"],
        image: productData.main_image || undefined,
      };

      addToCart(cartItem);

      // alert(
      //   `Added to cart: ${JSON.stringify(cartItem)}, Quantity: ${quantity}`
      // );
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
        size: selectedAttributes["Size"],
        color: selectedAttributes["Color"],
        image: productData.main_image || undefined,
      };

      addToCart(cartItem);

      // Only navigate if it's client-side
      if (isClient) {
        // Use URLSearchParams to pass data
        const searchParams = new URLSearchParams();
        searchParams.append("productId", String(productData.id));
        searchParams.append("quantity", String(quantity));
        searchParams.append("size", selectedAttributes["Size"] || "");
        searchParams.append("color", selectedAttributes["Color"] || "");
        searchParams.append("price", String(productData.price));

        router.push(`/cart`);
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
      {Object.keys(groupedAttributes).map((attribute) => (
        <div key={attribute} className="mb-6">
          <h3 className="font-semibold mb-2">Select {attribute}:</h3>
          <div className="flex gap-2">
            {groupedAttributes[attribute].map((value) => (
              <button
                key={value}
                onClick={() => handleAttributeSelect(attribute, value)}
                className={`px-4 py-2 rounded-full border transition 
                  ${
                    selectedAttributes[attribute] === value
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:border-black"
                  }`}
              >
                {value}
              </button>
            ))}
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

      {/* Add to Cart and Buy Now buttons */}
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
