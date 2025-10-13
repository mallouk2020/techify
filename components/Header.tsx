// *********************
// Role of the component: Header component
// Name of the component: Header.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 2.0
// Component call: <Header />
// Input parameters: no input parameters
// Output: Header component with improved floating icons
// *********************

"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import HeaderTop from "./HeaderTop";
import Image from "next/image";
import SearchInput from "./SearchInput";
import Link from "next/link";
import { FaBell } from "react-icons/fa6";

import CartElement from "./CartElement";
import HeartElement from "./HeartElement";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import apiClient from "@/lib/api";

const Header = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { wishlist, setWishlist, wishQuantity } = useWishlistStore();
  
  const headerTopRef = useRef<HTMLDivElement | null>(null);
  const mainHeaderRef = useRef<HTMLDivElement | null>(null);
  const floatingActionsRef = useRef<HTMLDivElement | null>(null);
  
  const [floatingTop, setFloatingTop] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const [headerTopHeight, setHeaderTopHeight] = useState(0);
  const [mainHeaderHeight, setMainHeaderHeight] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      if (!headerTopRef.current || !mainHeaderRef.current || !floatingActionsRef.current) return;

      const headerTopHeight = headerTopRef.current.offsetHeight;
      const mainHeaderHeight = mainHeaderRef.current.offsetHeight;
      const totalHeaderHeight = headerTopHeight + mainHeaderHeight;
      
      const scrollY = window.scrollY;
      
      // Calculate the position of floating actions
      // They start below the main header (Hero section)
      const initialTop = totalHeaderHeight;
      
      if (scrollY >= initialTop) {
        // When scrolled past the initial position, stick to bottom of HeaderTop
        setFloatingTop(headerTopHeight);
        setIsSticky(true);
      } else {
        // While scrolling, move smoothly
        setFloatingTop(initialTop - scrollY);
        setIsSticky(false);
      }
    };

    // Get initial heights
    if (headerTopRef.current && mainHeaderRef.current) {
      setHeaderTopHeight(headerTopRef.current.offsetHeight);
      setMainHeaderHeight(mainHeaderRef.current.offsetHeight);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
    toast.success("Logout successful!");
  };

  // getting all wishlist items by user id
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
    
    wishlist.map((item: any) => productArray.push({
      id: item?.product?.id,
      title: item?.product?.title,
      price: item?.product?.price,
      image: item?.product?.mainImage,
      slug: item?.product?.slug,
      stockAvailabillity: item?.product?.inStock
    }));
    
    setWishlist(productArray);
  };

  // getting user by email so I can get his user id
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
  }, [session?.user?.email, wishlist.length]);

  return (
    <>
      <div ref={headerTopRef} className="sticky top-0 z-50">
        <HeaderTop />
      </div>
      
      <header className="bg-transparent">
        {pathname.startsWith("/admin") === false && (
          <div ref={mainHeaderRef} className="relative h-auto bg-slate-100/80 backdrop-blur-sm border-b border-slate-200">
            <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-1 sm:py-1.5 gap-3 w-full">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0 h-8 sm:h-10 lg:h-12 flex items-center">
                <div className="flex items-center justify-center h-full">
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 text-transparent bg-clip-text">
                    Techify
                  </span>
                </div>
              </Link>

              {/* Search Input */}
              <div className="flex-1 max-w-[220px] sm:max-w-md lg:max-w-lg">
                <SearchInput />
              </div>

              {/* Actions */}
              <div className=" hidden md:flex gap-4 lg:gap-6 items-center flex-shrink-0">
                <div className="flex  items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/30 hover:border-blue-400/60 transition-all [&_svg]:text-blue-500 [&_svg]:hover:text-blue-600">
                  <HeartElement wishQuantity={wishQuantity} />
                  <CartElement />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Floating Actions */}
        {!pathname.startsWith("/admin") && !pathname.startsWith("/cart") && !pathname.startsWith("/checkout") && (
          <div className="md:hidden w-full fixed z-40">
            <div
              ref={floatingActionsRef}
              className={`fixed right-0 z-40 flex justify-end px-4 transition-all duration-200 ${
                isSticky ? "pt-2 pb-2" : "pt-3 pb-2"
              }`}
              style={{
                top: `${floatingTop}px`,
              }}
              aria-label="Mobile quick actions"
            >
              <div
                className={`flex items-center gap-1.5 rounded-full border backdrop-blur-md px-2 py-1 shadow-md ${
                  isSticky
                    ? "bg-slate-600/40 border-slate-600/80"
                    : "bg-slate-600/40 border-slate-600/60"
                }`}
              >
                <HeartElement wishQuantity={wishQuantity} />
                <CartElement />
              </div>
            </div>
          </div>
        )}

        {/* Admin Header */}
        {pathname.startsWith("/admin") === true && (
          <div className="flex justify-between h-auto bg-slate-800 items-center px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 max-w-screen-2xl mx-auto w-full gap-3 border-b border-blue-500/20">
            
            <Link href="/" className="flex-shrink-0 h-9 sm:h-10 lg:h-11 flex items-center">
              <span className="text-sm sm:text-base lg:text-lg font-bold text-white">
                Singitronic
              </span>
            </Link>

            <div className="flex gap-2 sm:gap-3 lg:gap-4 items-center ml-auto">
              <button className="p-1 sm:p-1.5 hover:bg-slate-700 rounded-lg transition-colors">
                <FaBell className="text-sm sm:text-base text-blue-300" />
              </button>

              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="w-7 sm:w-8 lg:w-9 h-7 sm:h-8 lg:h-9 hover:ring-2 ring-blue-500 rounded-full transition-all flex-shrink-0">
                  <Image
                    src="/randomuser.jpg"
                    alt="random profile photo"
                    width={40}
                    height={40}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>

                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-1.5 sm:p-2 shadow-lg bg-slate-800 rounded-lg w-40 sm:w-44 border border-slate-700 text-sm"
                >
                  <li>
                    <Link href="/admin" className="hover:bg-blue-500/20 text-white py-1.5">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <a className="hover:bg-blue-500/20 text-white py-1.5">Profile</a>
                  </li>
                  <li onClick={handleLogout}>
                    <a href="#" className="hover:bg-red-500/20 text-red-300 py-1.5">
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;