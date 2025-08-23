"use client"
import { useState } from 'react';
import Image from 'next/image'; // For optimized images in Next.js

export default function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = [
    {
      title: "Best Deal on Islamic Apparel",
      subtitle: "ISLAMIC CLOTHING COLLECTION",
      discription: "UP to 70% OFF",
      image: "/assets/images/pro3.png", // Product image
      background: "/assets/images/slider-bg.png", // Background image
    },
    {
      title: "Exclusive Offers on Hijabs & Scarves",
      subtitle: "MODERN ISLAMIC WEAR",
      discription: "UP to 60% OFF",
      image: "/assets/images/product-2.png", // Product image
      background: "/assets/images/slider-bg.png", // Background image
    },
    {
      title: "Amazing Discounts on Fragrances",
      subtitle: "PREMIUM ISLAMIC PERFUMES",
      discription: "UP to 50% OFF",
      image: "/assets/images/pro2.png", // Product image
      background: "/assets/images/slider-bg.png", // Background image
    },
  ];

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative bg-[#212844] rounded-2xl hidden md:block">
      {/* Slider content */}
      <div className="flex overflow-hidden rounded-lg">
        {/* Slide Content */}
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full flex-shrink-0 flex">
              {/* Left Column (Text) */}
              <div className="w-[60%] relative flex flex-col justify-center px-8 text-white z-20 pl-20">
                <h2 className="text-3xl">{slide.title}</h2>
                <h3 className="text-[63px] leading-[63px] mt-2">{slide.subtitle}</h3>
                <p className="text-3xl text-white">{slide.discription}</p>
              </div>

              {/* Right Column (Background + Product Image) */}
              <div className="w-[40%] bg-cover bg-center rounded-lg py-[22px]" style={{ backgroundImage: `url(${slide.background})` }}>
                <Image
                  src={slide.image}
                  alt={slide.title}
                  width={270}
                  height={270}
                  className="object-cover rounded-lg z-10" // Centering the product image
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${currentIndex === index ? 'bg-primary' : 'bg-white'}`}
          ></div>
        ))}
      </div>

      {/* Left and Right Arrows */}
      <button
        className="absolute top-1/2 left-[-40px] transform -translate-y-1/2"
        onClick={goToPrevSlide}
      >
       <Image
       src={'/assets/icons/slider-arrow-l.svg'}
       width={86}
       height={86}
       alt='arrow l'
       />
      </button>
      <button
        className="absolute top-1/2 right-[-40px] transform -translate-y-1/2"
        onClick={goToNextSlide}
      >
       <Image
       src={'/assets/icons/slider-arrow-r.svg'}
       width={86}
       height={86}
       alt='arrow l'
       />
      </button>
    </div>
  );
}
