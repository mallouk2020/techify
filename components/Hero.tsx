// *********************
// Role of the component: Classical hero component on home page
// Name of the component: Hero.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 2.0
// Component call: <Hero />
// Input parameters: no input parameters
// Output: Classical hero component with shadow and borders
// *********************

import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
      <div className="border-t border-b  border-blue-500/40 overflow-hidden">
        <div className="grid grid-cols-1  shadow-blue-500/30 lg:grid-cols-2 items-center justify-items-center px-4 sm:px-6 lg:px-8 gap-4 sm:gap-6 lg:gap-12 max-w-screen-2xl mx-auto min-h-[240px] sm:min-h-[320px] lg:min-h-[400px] py-4 sm:py-8 lg:py-12">
          
          {/* Text Content */}
          <div className="flex flex-col gap-y-3 sm:gap-y-4 w-full order-2 lg:order-1 justify-center">
            <div className="space-y-2 sm:space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-400/30 w-fit">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                <span className="text-xs sm:text-sm text-blue-300 font-medium">FEATURED PRODUCT</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-tight tracking-tight">
                THE PRODUCT OF THE 
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 text-transparent bg-clip-text"> FUTURE</span>
              </h1>
              
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-lg">
                Experience cutting-edge technology combined with sleek design. Discover innovation at your fingertips with features that redefine your daily routine.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                BUY NOW
              </button>
              
              <button className="flex-1 sm:flex-none bg-transparent border-2 border-blue-400 text-blue-300 hover:text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base rounded-lg hover:bg-blue-400/10 transition-all duration-300">
                LEARN MORE
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-6 sm:gap-8 pt-6 sm:pt-8">
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold text-white">50K+</span>
                <span className="text-xs sm:text-sm text-gray-400">Happy Customers</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold text-white">4.9★</span>
                <span className="text-xs sm:text-sm text-gray-400">Rating</span>
              </div>
            </div>
          </div>

          {/* Image Content */}
          <div className="relative w-full h-48 sm:h-64 lg:h-80 order-1 lg:order-2 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent rounded-2xl blur-3xl"></div>
            <Image
              src="/watch for banner.png"
              width={350}
              height={350}
              alt="smart watch"
              className="relative w-48 sm:w-64 lg:w-80 h-auto object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;