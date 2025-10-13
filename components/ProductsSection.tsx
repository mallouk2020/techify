"use client";
import React, { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import Heading from "./Heading";
import apiClient from "@/lib/api";

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient.get("/api/products");

        if (!data.ok) {
          console.error("Failed to fetch products:", data.status);
          setError(true);
          setLoading(false);
          return;
        }

        const productsData = await data.json();
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(true);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-white">
        <div className="mx-auto max-w-screen-2xl py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
          <Heading title="FEATURED PRODUCTS" />
          <div className="py-12 sm:py-16 text-center">
            <div className="flex justify-center items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
            <p className="text-slate-600 text-sm sm:text-base mt-4">Loading amazing products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="w-full bg-white">
        <div className="mx-auto max-w-screen-2xl py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
          <Heading title="FEATURED PRODUCTS" />
          <div className="py-12 sm:py-16 text-center">
            <div className="inline-flex flex-col items-center gap-3 p-6 sm:p-8 bg-slate-50 rounded-xl border border-slate-200">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-slate-600 font-medium">Products will be available soon</p>
              <p className="text-slate-500 text-sm">Please check back later for new items</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-screen-2xl mx-auto pt-12 sm:pt-16 lg:pt-20 pb-10 sm:pb-14 lg:pb-16 px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <Heading title="FEATURED PRODUCTS" />
          <p className="text-center text-slate-600 text-sm sm:text-base mt-4 max-w-2xl mx-auto">
            Explore our carefully curated selection of premium products designed for modern living
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 py-8 sm:py-12">
          {products.map((product: Product) => (
            <div key={product.id} className="h-full">
              <ProductItem product={product} color="black" />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center pt-8 sm:pt-12">
          <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-300 text-sm sm:text-base shadow-md hover:shadow-lg">
            View All Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;