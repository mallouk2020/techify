// *********************
// Role of the component: Rating stars component that will display stars on the single product page 
// Name of the component: SingleProductRating.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <SingleProductRating rating={rating} />
// Input parameters: { rating: number }
// Output: full colored star icons and outlined star icons depending on the ratingArray element("empty star" or "full star")
// *********************

import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const SingleProductRating = ({ rating, ratingCount }: { rating: number; ratingCount?: number }) => {
  const ratingArray: Array<string> = [
    "empty star",
    "empty star",
    "empty star",
    "empty star",
    "empty star",
  ];

  // going through product rating and modifying rating state
  for (let i = 0; i < rating; i++) {
    ratingArray[i] = "full star";
  }
  return (
    <div className="flex items-center justify-start gap-2 sm:gap-2.5">
      <div className="flex items-center gap-1 text-custom-yellow">
        {ratingArray.map((singleRating, key: number) => (
          <div key={key + "rating"}>
            {singleRating === "full star" ? (
              <AiFillStar className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <AiOutlineStar className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 text-sm sm:text-lg font-semibold text-slate-700">
        <span>{rating || 0}/5</span>
        {typeof ratingCount === "number" && (
          <span className="text-xs sm:text-sm text-slate-400 font-normal">({ratingCount} reviews)</span>
        )}
      </div>
    </div>
  );
};

export default SingleProductRating;
