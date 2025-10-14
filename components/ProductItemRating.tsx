// *********************
// Role of the component: Showing stars for the given rating number
// Name of the component: ProductItemRating.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductItemRating productRating={productRating} />
// Input parameters: { productRating: number }
// Output: full colored or outlined star icon depending on the element of the rating array("empty star" or "full star") 
// *********************

"use client";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { AiOutlineStar } from "react-icons/ai";

const ProductItemRating = ({ productRating }: { productRating: number }) => {
  // setting rating with all empty stars by default
  const rating: Array<string> = [
    "empty star",
    "empty star",
    "empty star",
    "empty star",
    "empty star",
  ];

  // going through product rating and modifying rating state
  for (let i = 0; i < productRating; i++) {
    rating[i] = "full star";
  }
  return (
    <div className="flex items-center gap-0.5 text-yellow-400">
      {rating?.map((singleRating) => (
        <div key={nanoid()}>
          {singleRating === "full star" ? (
            <AiFillStar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          ) : (
            <AiOutlineStar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductItemRating;
