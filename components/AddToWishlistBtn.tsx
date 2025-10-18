"use client";

// *********************
// Role of the component: Button for adding and removing product to the wishlist on the single product page
// Name of the component: AddToWishlistBtn.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <AddToWishlistBtn product={product} slug={slug}  />
// Input parameters: AddToWishlistBtnProps interface
// Output: Two buttons with adding and removing from the wishlist functionality
// *********************

import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import apiClient from "@/lib/api";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaHeartCrack } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";

interface AddToWishlistBtnProps {
  product: Product;
  slug: string;
}

const AddToWishlistBtn = ({ product, slug }: AddToWishlistBtnProps) => {
  const { data: session, status } = useSession();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlistStore();
  const [isProductInWishlist, setIsProductInWishlist] = useState<boolean>();

  const userId =
    (session?.user as { id?: string | null | undefined })?.id ?? undefined;

  const addToWishlistFun = useCallback(async () => {
    if (!userId) {
      toast.error("You need to be logged in to add a product to the wishlist");
      return;
    }

    try {
      const wishlistResponse = await apiClient.post("/api/wishlist", {
        productId: product?.id,
        userId,
      });

      if (wishlistResponse.ok) {
        addToWishlist({
          id: product?.id,
          title: product?.title,
          price: product?.price,
          image: product?.mainImage,
          slug: product?.slug,
          stockAvailabillity: product?.inStock,
        });
        toast.success("Product added to the wishlist");
      } else {
        const errorData = await wishlistResponse.json();
        toast.error(errorData.message || "Failed to add product to wishlist");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add product to wishlist");
    }
  }, [userId, product, addToWishlist]);

  const removeFromWishlistFun = useCallback(async () => {
    if (!userId) return;

    try {
      const deleteResponse = await apiClient.delete(
        `/api/wishlist/${userId}/${product?.id}`
      );

      if (deleteResponse.ok) {
        removeFromWishlist(product?.id);
        toast.success("Product removed from the wishlist");
      } else {
        const errorData = await deleteResponse.json();
        toast.error(errorData.message || "Failed to remove product from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove product from wishlist");
    }
  }, [userId, product?.id, removeFromWishlist]);

  const isInWishlist = useCallback(async () => {
    if (!userId) {
      setIsProductInWishlist(false);
      return;
    }

    try {
      const wishlistResponse = await apiClient.get(
        `/api/wishlist/${userId}/${product?.id}`
      );
      const wishlistData = await wishlistResponse.json();

      if (wishlistData[0]?.id) {
        setIsProductInWishlist(true);
      } else {
        setIsProductInWishlist(false);
      }
    } catch (error) {
      console.error("Error checking wishlist status:", error);
      setIsProductInWishlist(false);
    }
  }, [userId, product?.id]);

  useEffect(() => {
    isInWishlist();
  }, [isInWishlist, wishlist]);

  return (
    <>
      {isProductInWishlist ? (
        <button
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-2 border-red-200"
          onClick={removeFromWishlistFun}
        >
          <FaHeartCrack className="text-xl" />
          <span className="text-sm sm:text-base">إزالة من المفضلة</span>
        </button>
      ) : (
        <button
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-pink-50 hover:bg-pink-100 text-pink-600 font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-2 border-pink-200"
          onClick={addToWishlistFun}
        >
          <FaHeart className="text-xl" />
          <span className="text-sm sm:text-base">أضف إلى المفضلة</span>
        </button>
      )}
    </>
  );
};

export default AddToWishlistBtn;
