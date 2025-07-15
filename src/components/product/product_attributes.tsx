"use client";
import React, { useState } from "react";

type ProductAttributesProps = {
    sizes: string[];
    colors: { name: string; className: string }[];
    onAddToCart?: (size: string, color: string, quantity: number) => void;
    onBuyNow?: (size: string, color: string, quantity: number) => void;
};

const ProductAttributes: React.FC<ProductAttributesProps> = ({
    sizes,
    colors,
    onAddToCart,
    onBuyNow,
}) => {
    const [selectedSize, setSelectedSize] = useState(sizes[0] || "");
    const [selectedColor, setSelectedColor] = useState(colors[0]?.name || "");
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        onAddToCart?.(selectedSize, selectedColor, quantity);
    };

    const handleBuyNow = () => {
        onBuyNow?.(selectedSize, selectedColor, quantity);
    };

    return (
        <div>
            {/* Size Selector */}
            <div>
                <label className="block mb-1 font-medium">Size</label>
                <select
                    className="border rounded px-3 py-2 w-full"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                >
                    {sizes.map((size) => (
                        <option key={size}>{size}</option>
                    ))}
                </select>
            </div>
            {/* Color & Quantity Selector in same row */}
            <div className="flex items-end space-x-4 mt-4">
                {/* Color Selector */}
                <div>
                    <label className="block mb-1 font-medium">Color</label>
                    <div className="flex space-x-2">
                        {colors.map((color) => (
                            <button
                                key={color.name}
                                type="button"
                                className={`w-8 h-8 rounded-full border-2 ${
                                    selectedColor === color.name
                                        ? "border-primary ring-2 ring-primary"
                                        : "border-gray-300"
                                } ${color.className}`}
                                aria-label={color.name}
                                onClick={() => setSelectedColor(color.name)}
                            />
                        ))}
                    </div>
                </div>
                {/* Quantity Selector */}
                <div>
                    <label className="block mb-1 font-medium">Quantity</label>
                    <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="border rounded px-3 py-2 w-24"
                    />
                </div>
            </div>
            {/* Action Buttons */}
            <div className="flex space-x-4 mt-4">
                <button
                    className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition"
                    onClick={handleAddToCart}
                >
                    Add to Cart
                </button>
                <button
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                    onClick={handleBuyNow}
                >
                    Buy Now
                </button>
            </div>
        </div>
    );
};

export default ProductAttributes;