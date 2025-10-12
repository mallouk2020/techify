// *********************
// Role of the component: products section intended to be on the home page
// Name of the component: ProductsSection.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductsSection slug={slug} />
// Input parameters: no input parameters
// Output: products grid
// *********************

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
      <div className="bg-gray-100 border-t border-gray-200">
        <div className="mx-auto max-w-screen-2xl py-16">
          <Heading title="FEATURED PRODUCTS" />
          <div className="py-10 text-center text-slate-600">
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="bg-gray-100 border-t border-gray-200">
        <div className="mx-auto max-w-screen-2xl py-16">
          <Heading title="FEATURED PRODUCTS" />
          <div className="py-10 text-center text-slate-600">
            <p>Products will be available soon. Please check back later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-screen-2xl mx-auto pt-20 pb-10">
        <Heading title="FEATURED PRODUCTS" />
        <div className="grid grid-cols-2 gap-1.5 max-[420px]:gap-1 sm:gap-2 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 max-w-screen-2xl mx-auto py-10 px-10">
          {products.map((product: Product) => (
            <ProductItem key={product.id} product={product} color="black" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;
