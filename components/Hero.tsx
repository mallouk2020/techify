// *********************
// Role of the component: Classical hero component on home page
// Name of the component: Hero.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Hero />
// Input parameters: no input parameters
// Output: Classical hero component with two columns on desktop and one column on smaller devices
// *********************

import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <div className="h-[400px] w-full bg-gradient-to-r from-blue-600 to-blue-500 max-lg:h-[550px] max-md:h-[500px]">
      <div className="grid grid-cols-3 items-center justify-items-center px-10 gap-x-10 max-w-screen-2xl mx-auto h-full max-lg:grid-cols-1 max-lg:py-10 max-lg:gap-y-5">
        <div className="flex flex-col gap-y-4 max-lg:order-last col-span-2">
          <h1 className="text-5xl text-white font-bold mb-2 max-xl:text-4xl max-md:text-3xl max-sm:text-2xl">
            THE PRODUCT OF THE FUTURE
          </h1>
          <p className="text-white text-base max-sm:text-sm leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor modi
            iure laudantium necessitatibus ab, voluptates vitae ullam.
          </p>
          <div className="flex gap-x-3 max-lg:flex-col max-lg:gap-y-2 mt-2">
            <button className="bg-white text-blue-600 font-bold px-10 py-2.5 text-base max-sm:text-sm hover:bg-gray-100 rounded-md shadow-lg transition-all">
              BUY NOW
            </button>
            <button className="bg-transparent border-2 border-white text-white font-bold px-10 py-2.5 text-base max-sm:text-sm hover:bg-white hover:text-blue-600 rounded-md transition-all">
              LEARN MORE
            </button>
          </div>
        </div>
        <Image
          src="/watch for banner.png"
          width={300}
          height={300}
          alt="smart watch"
          className="max-md:w-[250px] max-md:h-[250px] max-sm:h-[200px] max-sm:w-[200px] w-auto h-auto"
        />
      </div>
    </div>
  );
};

export default Hero;
