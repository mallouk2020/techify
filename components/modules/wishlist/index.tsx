"use client"
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { useProductStore } from "@/app/_zustand/store";
import apiClient from "@/lib/api";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaHeart, FaCartShopping, FaXmark, FaCheck, FaClock } from "react-icons/fa6";
import { sanitize } from "@/lib/sanitize";

export const WishlistModule = () => {
  const { data: session, status } = useSession();
  const { wishlist, setWishlist } = useWishlistStore();
  const { addToCart } = useProductStore();

  const getWishlistByUserId = async (id: string) => {
    const response = await apiClient.get(`/api/wishlist/${id}`, {
      cache: "no-store",
    });
    const wishlist = await response.json();

    const productArray: {
      id: string;
      title: string;
      price: number;
      image: string;
      slug: string;
      stockAvailabillity: number;
    }[] = [];

    wishlist.map((item: any) => 
      productArray.push({ 
        id: item?.product?.id, 
        title: item?.product?.title, 
        price: item?.product?.price, 
        image: item?.product?.mainImage, 
        slug: item?.product?.slug, 
        stockAvailabillity: item?.product?.inStock 
      })
    );

    setWishlist(productArray);
  };

  const getUserByEmail = async () => {
    if (session?.user?.email) {
      apiClient.get(`/api/users/email/${session?.user?.email}`, {
        cache: "no-store",
      })
        .then((response) => response.json())
        .then((data) => {
          getWishlistByUserId(data?.id);
        });
    }
  };

  useEffect(() => {
    getUserByEmail();
  }, [session?.user?.email]);

  const handleRemoveItem = async (id: string) => {
    // Remove from local state
    const updatedWishlist = wishlist.filter(item => item.id !== id);
    setWishlist(updatedWishlist);
    
    // TODO: Call API to remove from database if needed
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      mainImage: product.image,
      amount: 1
    });
    toast.success("Added to cart");
  };

  const handleMoveToCart = (product: any) => {
    handleAddToCart(product);
    handleRemoveItem(product.id);
  };

  // Empty wishlist state
  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <FaHeart className="text-2xl sm:text-3xl text-slate-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">Your wishlist is empty</h3>
        <p className="text-slate-600 text-sm mb-6 text-center max-w-md">
          Start adding products you love to your wishlist
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm"
        >
          <FaHeart className="text-sm" />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Wishlist Stats */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <FaHeart className="text-base text-white" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-slate-800">{wishlist.length}</p>
              <p className="text-xs text-slate-600">Items saved</p>
            </div>
          </div>
          <button
            onClick={() => {
              wishlist.forEach(product => handleAddToCart(product));
              toast.success("All items added to cart");
            }}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 font-medium px-3 sm:px-4 py-2 rounded-lg border border-slate-200 hover:border-blue-300 transition-all text-xs sm:text-sm"
          >
            <FaCartShopping className="text-sm" />
            <span>Add All</span>
          </button>
        </div>
      </div>

      {/* Wishlist Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {wishlist.map((item) => (
          <div
            key={nanoid()}
            className="group bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden bg-slate-100">
              <Image
                src={item?.image || "/product_placeholder.jpg"}
                fill
                alt={sanitize(item.title)}
                className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Remove Button */}
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 backdrop-blur-sm hover:bg-red-50 text-slate-600 hover:text-red-500 flex items-center justify-center shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Remove from wishlist"
              >
                <FaXmark className="text-sm" />
              </button>

              {/* Stock Badge */}
              <div className="absolute top-2 left-2">
                {item.stockAvailabillity > 0 ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/95 backdrop-blur-sm text-white text-[10px] font-medium rounded-full">
                    <FaCheck className="text-[8px]" />
                    Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-500/95 backdrop-blur-sm text-white text-[10px] font-medium rounded-full">
                    <FaClock className="text-[8px]" />
                    Out
                  </span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-3 space-y-2">
              <div>
                <Link
                  href={`/products/${item.slug}`}
                  className="font-medium text-slate-800 hover:text-blue-600 transition-colors line-clamp-2 text-xs sm:text-sm leading-tight"
                >
                  {sanitize(item.title)}
                </Link>
                <p className="mt-1.5 text-base sm:text-lg font-bold text-blue-600">
                  ${item.price}
                </p>
              </div>

              {/* Actions */}
              <button
                onClick={() => handleMoveToCart(item)}
                disabled={item.stockAvailabillity <= 0}
                className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-medium px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-200 text-xs"
              >
                <FaCartShopping className="text-xs" />
                <span>Add</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg text-center">
        <h3 className="text-base sm:text-lg font-bold text-white mb-2">
          Looking for more?
        </h3>
        <p className="text-slate-300 text-xs sm:text-sm mb-4">
          Explore our full collection
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-medium px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all text-sm"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
};