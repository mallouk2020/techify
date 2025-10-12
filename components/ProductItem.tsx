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

const ProductItem = ({
  product,
  color,
}: {
  product: Product;
  color: string;
}) => {
  return (
    <div className="group flex h-full min-h-[240px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg max-[500px]:min-h-[180px]">
      {/* Image Container */}
      <Link
        href={`/product/${product.slug}`}
        className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-white"
      >
        <Image
          src={product?.mainImage || "/product_placeholder.jpg"}
          width={240}
          height={240}
          className="h-full w-full object-contain p-2.5 transition-transform duration-300 group-hover:scale-105 max-[500px]:p-1.5"
          alt={sanitize(product?.title) || "Product image"}
        />
      </Link>

      {/* Content Container */}
      <div className="flex flex-grow flex-col gap-y-1.5 px-3 pb-3 pt-2.5 max-[500px]:gap-y-1 max-[500px]:px-2 max-[500px]:pb-2 max-[500px]:pt-1.5">
        {/* Title */}
        <Link
          href={`/product/${product.slug}`}
          className={`text-sm font-semibold leading-snug line-clamp-2 min-h-[2.2rem] transition-colors duration-200 break-words max-[500px]:text-xs max-[500px]:min-h-[1.8rem] max-[500px]:leading-tight ${
            color === "black"
              ? "text-gray-900 group-hover:text-emerald-600"
              : "text-white"
          }`}
        >
          {sanitize(product.title)}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 max-[500px]:gap-1 max-[500px]:text-[10px]">
          <ProductItemRating productRating={product?.rating} />
          <span className="font-medium text-slate-600">{product?.rating ?? 0}/5</span>
        </div>

        {/* Price */}
        <p
          className={`text-sm font-semibold max-[500px]:text-xs ${
            color === "black" ? "text-gray-900" : "text-white"
          }`}
        >
          ${product.price}
        </p>

        {/* Button */}
        <Link
          href={`/product/${product?.slug}`}
          className="mt-auto w-full rounded-md bg-emerald-600 px-2 py-1.5 text-center text-[10px] font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-emerald-700 max-[500px]:px-1.5 max-[500px]:py-1 max-[500px]:text-[8px]"
        >
          View Product
        </Link>
      </div>
    </div>
  );
};

export default ProductItem;
