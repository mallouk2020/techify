// *********************
// Role of the component: Dynamic hero component on home page
// Name of the component: Hero.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 3.0 - Dynamic Hero
// Component call: <Hero />
// Input parameters: no input parameters
// Output: Dynamic hero component with data from database
// *********************

'use client';

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HeroData {
  badge: string;
  title: string;
  description: string;
  imageUrl: string;
  button1Text: string;
  button1Link: string;
  button2Text: string;
  button2Link: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
}

const Hero = () => {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/hero`);
        const data = await response.json();
        
        if (data.success) {
          setHeroData(data.data);
        }
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Show loading state or default content
  if (loading || !heroData) {
    return (
      <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
        <div className="border-t border-b border-blue-500/40 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-items-center px-4 sm:px-6 lg:px-8 gap-4 sm:gap-6 lg:gap-12 max-w-screen-2xl mx-auto min-h-[240px] sm:min-h-[320px] lg:min-h-[400px] py-4 sm:py-8 lg:py-12">
            <div className="flex items-center justify-center w-full h-full">
              <span className="loading loading-spinner loading-lg text-blue-400"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
      <div className="border-t border-b border-blue-500/40 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-items-center px-4 sm:px-6 lg:px-8 gap-4 sm:gap-6 lg:gap-12 max-w-screen-2xl mx-auto min-h-[240px] sm:min-h-[320px] lg:min-h-[400px] py-4 sm:py-8 lg:py-12">
          
          {/* Text Content */}
          <div className="flex flex-col gap-y-3 sm:gap-y-4 w-full order-2 lg:order-1 justify-center">
            <div className="space-y-2 sm:space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-400/30 w-fit">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                <span className="text-xs sm:text-sm text-blue-300 font-medium">{heroData.badge}</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-tight tracking-tight">
                {heroData.title.split(' ').slice(0, -1).join(' ')}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 text-transparent bg-clip-text"> {heroData.title.split(' ').slice(-1)}</span>
              </h1>
              
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-lg">
                {heroData.description}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6 w-full sm:w-auto">
              <Link href={heroData.button1Link}>
                <button className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  {heroData.button1Text}
                </button>
              </Link>
              
              <Link href={heroData.button2Link}>
                <button className="flex-1 sm:flex-none bg-transparent border-2 border-blue-400 text-blue-300 hover:text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base rounded-lg hover:bg-blue-400/10 transition-all duration-300">
                  {heroData.button2Text}
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-6 sm:gap-8 pt-6 sm:pt-8">
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold text-white">{heroData.stat1Value}</span>
                <span className="text-xs sm:text-sm text-gray-400">{heroData.stat1Label}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold text-white">{heroData.stat2Value}</span>
                <span className="text-xs sm:text-sm text-gray-400">{heroData.stat2Label}</span>
              </div>
            </div>
          </div>

          {/* Image Content */}
          <div className="relative w-full h-48 sm:h-64 lg:h-80 order-1 lg:order-2 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent rounded-2xl blur-3xl"></div>
            <Image
              src={heroData.imageUrl}
              width={350}
              height={350}
              alt={heroData.title}
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