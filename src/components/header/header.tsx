"use client";
import { Icon } from "@iconify/react";
// import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Searchbar from "@/components/header/searchbar";
import Image from "next/image";

export default function Header() {
  const { cart } = useCart();
  // const [searchTerm, setSearchTerm] = useState<string>(""); // Explicitly typing searchTerm as a string

  // Handle the search submission
  // const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   // Perform the search logic here, such as navigating to a results page
  //   console.log("Search for:", searchTerm);
  // };

  return (
    <div className="bg-white border-b-2 custom_container py-5 hidden md:block">
      {/* Container to align everything */}
      <div className="flex justify-between items-center gap-14">
        {/* Logo */}
        <Link href={"/"} className="flex items-center space-x-4">
        <Image
        src={'/assets/images/logo.png'}
        alt="logo"
        width={120}
        height={65}
        />
          {/* <Icon
            icon="mdi:menu"
            width={30}
            height={30}
            className="text-primary"
          />
          <p className="text-primary font-semibold text-lg">MegaMart</p> */}
        </Link>

        {/* Middle Section: Search Bar */}
        <div className="flex-grow mx-4">  {/* Centered and takes up remaining space */}
          <Searchbar />
        </div>

        {/* Right Section: Sign Up/Sign In & Cart */}
        <div className="flex items-center space-x-6 text-b_text text-sm font-bold">
          {/* User Icon and Sign Up/Sign In */}
          <div className="flex items-center space-x-2 border-r-2 pr-4">
            <Icon
              icon="mdi:user-outline"
              width={20}
              height={20}
              className="text-primary"
            />
            <Link href="/signup" className="hover:text-accent">
              Sign Up/Sign In
            </Link>
          </div>

          {/* Cart Icon */}
          <Link href="/cart" className="flex items-center space-x-2">
            <Icon
              icon="mdi:cart-outline"
              width={20}
              height={20}
              className="text-primary"
            />
            <span className="hover:text-accent"> Cart ({cart.length})</span>
          </Link>
        </div>
      </div>
    </div>

  );
}
