"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
// import Searchbar from "@/components/header/searchbar";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Category, CategoryResponse } from "@/types/categories"; // Correct import
import { Fetch } from "@/utils/Fetch"; // Assuming Fetch is your fetch utility function

export default function HeaderNavbar() {
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]); // State to hold categories
  const [loading, setLoading] = useState<boolean>(true); // State for loading indicator

  // Toggle the mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Close the mobile menu when a menu item is clicked
  const closeMenu = () => setIsMenuOpen(false);

  // Fetch categories on mount using useEffect
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch data from the API and extract the `data` field
        const response: CategoryResponse = await Fetch("categories");
        setCategories(response.data); // Update the categories state with the 'data' array
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false); // Stop loading once the data is fetched
      }
    };

    fetchCategories(); // Call the async function
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <div className="bg-white border-b-2 custom_container py-5 md:hidden">
      {/* Desktop & Mobile Header Container */}
      <div className="flex justify-between items-center">
        {/* Logo on the left side */}
        <Link href={"/"} className="flex items-center space-x-4">
          <Image
            src={'/assets/images/logo.png'}
            alt="logo"
            width={120}
            height={65}
          />
        </Link>

        {/* Hamburger Icon (Mobile) on the right side */}
        <div className="md:hidden flex items-center justify-end space-x-4">
          <Icon
            icon="mdi:menu"
            width={40}
            height={40}
            className="text-white p-2 rounded-full bg-primary hover:bg-secondary cursor-pointer transition-colors"
            onClick={toggleMenu}
          />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="absolute top-0 left-0 w-full bg-white shadow-lg md:hidden z-10 p-5">
          {/* Close button */}
          <div className="flex justify-between items-center">
            <Icon
              icon="mdi:close"
              width={30}
              height={30}
              className="text-primary cursor-pointer"
              onClick={closeMenu}
            />
            <Link href={"/"} className="text-primary font-semibold text-lg" onClick={closeMenu}>
              MegaMart
            </Link>
          </div>

          <div className="mt-4 flex flex-col items-start space-y-6">
            <Link href="/shop" className="text-primary text-lg" onClick={closeMenu}>
              Shop
            </Link>
            <Link href="/all-categories" className="text-primary text-lg" onClick={closeMenu}>
              Categories
            </Link>
            <Link href="/cart" className="text-primary text-lg" onClick={closeMenu}>
              Cart ({cart.length})
            </Link>
            <Link href="/signup" className="text-primary text-lg" onClick={closeMenu}>
              Sign Up/Sign In
            </Link>

            {loading ? (
              <p className="text-primary">Loading categories...</p>
            ) : (
              categories.map((category) => (
                <Link
                  href={`/${category.slug}`}
                  key={category.id}
                  className="text-primary text-lg"
                  onClick={closeMenu}
                >
                  {category.name}
                </Link>
              ))
            )}
          </div>
        </div>
      )}

      {/* Desktop Navigation Menu */}
      <div className="hidden md:flex justify-center items-center py-4 space-x-6 text-sm text-black">
        <div className="relative">
          <Link href={'/'} className="bg-primary text-white font-semibold px-4 py-2 rounded-full hover:bg-secondary hover:text-black focus:outline-none">
            Home
          </Link>
        </div>
        <Link
          href={`/shop`} className="bg-secondary px-4 py-2 rounded-full hover:bg-primary hover:text-white focus:outline-none">
          Shop
        </Link>
        <Link
          href={`/all-categories`} className="bg-secondary px-4 py-2 rounded-full hover:bg-primary hover:text-white focus:outline-none">
          Categories
        </Link>

        {loading ? (
          <p>Loading categories...</p>
        ) : (
          categories.map((category) => (
            <Link
              href={`/${category.slug}`}
              key={category.id}
              className="bg-secondary px-4 py-2 rounded-full hover:bg-primary hover:text-white focus:outline-none"
            >
              {category.name}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
