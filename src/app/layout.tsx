import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";

import type { Metadata } from "next";

import Topbar from "@/components/header/topbar";
import Header from "@/components/header/header";
import Navbar from "@/components/header/navbar";
import Footer from "@/components/footer/footer";
import MobileHeader from "@/components/header/mobile";
import { CartProvider } from "@/context/CartContext";


// ✅ Font setup
const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
});

// ✅ Metadata config
export const metadata: Metadata = {
  title: "Smart Wearable | Best Wearable Tech",
  description:
    "Discover the best smart wearable devices with cutting-edge technology.",
  keywords: ["wearable", "smart tech", "gadgets", "wearable devices"],
  robots: "index, follow",
  authors: [{ name: "Abrar Hussain" }],
  icons: {
    icon: "/favicon.png",
  },
  alternates: {
    canonical: "https://bestfashionllc.com/smart-wearable",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={hankenGrotesk.variable}>
      <body className="antialiased bg-white text-[#333]">
        <CartProvider>
          <Topbar />
          <Header />
          <Navbar />
          <MobileHeader />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
