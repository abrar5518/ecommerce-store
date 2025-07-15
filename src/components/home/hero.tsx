import Image from 'next/image';
import React from 'react';

const HeroSection = () => {
  return (
    <section className="md:hidden hero-section bg-[#212844] text-white py-6 px-4 flex flex-col items-center rounded-lg shadow-lg">
      {/* Left Side: Text Content */}
      <div className="text-content text-center max-w-md mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">ISLAMIC CLOTHING COLLECTION</h1>
        <p className="text-lg mb-4">Best Deal Online on Islamic Apparel</p>
        <p className="text-lg font-semibold">UP to 70% OFF</p>
      </div>

      {/* Right Side: Image */}
      <div className="image-content mb-6">
        <Image
          src="/assets/images/pro2.png"  // Replace with your image URL
          alt="Islamic Clothing"
          height={200}
          width={200}
        //   className="max-w-sm mx-auto "
        />
      </div>
    </section>
  );
};

export default HeroSection;
