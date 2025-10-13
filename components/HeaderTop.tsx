// *********************
// Role of the component: Topbar of the header
// Name of the component: HeaderTop.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <HeaderTop />
// Input parameters: no input parameters
// Output: topbar with phone, email and login and register links
// *********************

"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { FaHeadphones, FaRegUser, FaCircleUser, FaArrowRightFromBracket } from "react-icons/fa6";

const HeaderTop = () => {
  const { data: session }: any = useSession();

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
    toast.success("Logout successful!");
  }

  return (
    <div className="h-auto bg-slate-900/95 backdrop-blur text-white shadow-lg sticky top-0 z-50">
      <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-y-2 gap-x-4 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
        
        {/* Contact Info */}
        <ul className="flex items-center gap-2 sm:gap-3 lg:gap-4 text-[10px] sm:text-xs lg:text-sm font-medium">
          <li className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
            <FaHeadphones className="text-blue-400 flex-shrink-0 text-base sm:text-lg" />
            <span>+381 61 123 321</span>
          </li>
          <li className="flex items-center gap-1.5 text-gray-200/90">
            <span className="hidden xs:inline">support@techify.com</span>
            <span className="xs:hidden inline">support@site.com</span>
          </li>
          <li className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
            <button
              type="button"
              className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-800/60 text-blue-300 hover:text-blue-200 transition"
              aria-label={session?.user?.email ? session.user.email : "حسابي"}
            >
              <FaCircleUser className="text-sm sm:text-base" />
            </button>
          </li>
        </ul>

        {/* Auth Links */}
        <ul className="flex items-center gap-2 sm:gap-3 lg:gap-4 font-semibold text-[10px] sm:text-xs lg:text-sm ml-auto">
          {!session ? (
            <>
              <li>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 hover:text-blue-400 transition-colors group"
                >
                  <FaRegUser className="text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0 text-sm sm:text-base" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-2 py-1 bg-blue-500 hover:bg-blue-600 rounded-md transition-all transform hover:scale-105"
                >
                  <FaRegUser className="flex-shrink-0 text-sm sm:text-base" />
                  <span className="hidden sm:inline">Register</span>
                </Link>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={() => handleLogout()}
                className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-white rounded-md transition-all"
              >
                <FaArrowRightFromBracket className="flex-shrink-0 text-sm sm:text-base" />
                <span className="hidden sm:inline">تسجيل الخروج</span>
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HeaderTop;