import { Hanken_Grotesk } from "next/font/google";
import { MetadataType } from "../types/metadata";
import Head from "next/head";
import Topbar from "@/components/header/topbar";
import "./globals.css";
import Header from "@/components/header/header";
import Navbar from "@/components/header/navbar";
import Footer from "@/components/footer/footer";
import { CartProvider } from "@/context/CartContext";
import MobileHeader from "@/components/header/mobile"

// Apply Hanken Grotesk font
const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
});

// Default metadata
const defaultMetadata = {
  title: "Smart Wearable | Best Wearable Tech",
  description:
    "Discover the best smart wearable devices with cutting-edge technology.",
  keywords: "wearable, smart tech, gadgets, wearable devices",
  robots: "index, follow",
  author: "Abrar Hussain",
  alternates: {
    canonical: "https://yourwebsite.com/smart-wearable",
  },
};

export async function generateMetadata(): Promise<MetadataType> {
  return defaultMetadata;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const metaData = await generateMetadata();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
        <Head>
          <meta
            name="google-site-verification"
            content="YOUR_GOOGLE_VERIFICATION_CODE"
          />
          <title>{metaData.title}</title>
          <meta name="description" content={metaData.description} />
          <meta name="keywords" content={metaData.keywords} />
          <meta name="robots" content={metaData.robots} />
          <meta name="author" content={metaData.author} />

          <meta property="og:title" content={metaData.title} />
          <meta property="og:description" content={metaData.description} />
          <meta property="og:url" content={metaData.alternates.canonical} />
        </Head>
      </head>
      <body
        className={`${hankenGrotesk.variable} antialiased`}
        style={{
          backgroundColor: "#FFFFFF",
          color: "#333333",
        }}
      >
        <CartProvider>
          <Topbar />
          <Header />
          <Navbar />
          <MobileHeader/>
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
