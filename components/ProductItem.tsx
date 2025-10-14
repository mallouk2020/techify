// *********************
// Role of the component: Product item component 
// Name of the component: ProductItem.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductItem product={product} color={color} />
// Input parameters: { product: Product; color: string; }
// Output: Product item component that contains product image, title, link to the single product page, price, button...
// *********************

import Image from "next/image";
import React from "react";
import Link from "next/link";
import ProductItemRating from "./ProductItemRating";
import { sanitize } from "@/lib/sanitize";
import { FaHeart, FaCartShopping } from "react-icons/fa6";

const ProductItem = ({
  product,
  color,
}: {
  product: Product;
  color: string;
}) => {
  // Calculate discount percentage
  const discountPercentage = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 ease-out">
      
      {/* Image Container */}
      <Link
        href={`/product/${product.slug}`}
        className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
      >
        {/* Discount Badge - Only show if there's a discount */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-red-500 text-white shadow-md">
              -{discountPercentage}%
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50">
          <FaHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 hover:text-red-500 transition-colors" />
        </button>

        {/* Stock Badge - Three States */}
        {product?.inStock === 1 ? (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-green-500/90 text-white text-[10px] sm:text-xs font-semibold rounded-lg">
            In Stock
          </div>
        ) : product?.inStock === 2 ? (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-orange-500/90 text-white text-[10px] sm:text-xs font-semibold rounded-lg">
            Available on Order
          </div>
        ) : (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-red-500/90 text-white text-[10px] sm:text-xs font-semibold rounded-lg">
            Out of Stock
          </div>
        )}

        {/* Image */}
        <Image
          src={product?.mainImage || "/product_placeholder.jpg"}
          width={280}
          height={280}
          className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-110"
          alt={sanitize(product?.title) || "Product image"}
          priority
        />
      </Link>

      {/* Content Container */}
      <div className="flex flex-grow flex-col gap-1 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-3">
        
        {/* Category - Dynamic */}
        <span className="text-[10px] sm:text-xs font-medium text-blue-600 uppercase tracking-wider">
          {product.category?.name || 'Electronics'}
        </span>

        {/* Title */}
        <Link
          href={`/product/${product.slug}`}
          className={`text-xs sm:text-sm font-bold leading-tight line-clamp-2 min-h-[2rem] transition-colors duration-200 break-words hover:text-blue-600 ${
            color === "black"
              ? "text-slate-900 group-hover:text-blue-600"
              : "text-white"
          }`}
        >
          {sanitize(product.title)}
        </Link>

        {/* Rating & Reviews - Dynamic - Compact */}
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="flex items-center gap-0 sm:gap-1.5">
            <div className="scale-[0.65] sm:scale-100 origin-left -mr-5 sm:mr-0">
              <ProductItemRating productRating={product?.rating} />
            </div>
            <span className="font-semibold text-slate-700 text-[10px] sm:text-xs whitespace-nowrap">
              {product?.rating ?? 0}/5
            </span>
          </div>
          <span className="text-[10px] sm:text-xs text-slate-400 whitespace-nowrap">
            ({product?.ratingCount || 0})
          </span>
        </div>

        {/* Price Section - Dynamic */}
        <div className="flex items-baseline gap-1.5 py-0.5 sm:py-1.5 flex-wrap">
          <p className={`text-base sm:text-lg font-bold ${
            color === "black" ? "text-slate-900" : "text-white"
          }`}>
            ${product.price}
          </p>
          {product.oldPrice && product.oldPrice > product.price && (
            <>
              <p className="text-xs sm:text-sm text-slate-500 line-through">
                ${product.oldPrice}
              </p>
              <span className="ml-auto text-[10px] sm:text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded whitespace-nowrap">
                -{discountPercentage}%
              </span>
            </>
          )}
        </div>

        {/* Add to Cart Button */}
        <Link
          href={`/product/${product?.slug}`}
          className="w-full mt-auto rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-3 py-2.5 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <FaCartShopping className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Quick View</span>
        </Link>
      </div>
    </div>
  );
};

export default ProductItem;