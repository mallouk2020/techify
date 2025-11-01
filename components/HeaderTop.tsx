// *********************
// Role of the component: Topbar of the header
// Name of the component: HeaderTop.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 2.0
// Component call: <HeaderTop />
// Input parameters: no input parameters
// Output: topbar with phone, email and login and register links
// *********************

"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { FaRegUser, FaArrowRightFromBracket, FaWhatsapp, FaEnvelope, FaInstagram } from "react-icons/fa6";

const HeaderTop = () => {
  const { data: session }: any = useSession();

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
    toast.success("Logout successful!");
  }

  return (
    <div className="h-auto bg-slate-900/95 backdrop-blur text-white shadow-lg sticky top-0 z-50">
      <div className="flex items-center justify-between gap-4 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        
        {/* Social Icons - Left Side */}
        <ul className="flex items-center gap-2 sm:gap-3">
          <li>
            <a
              href="https://wa.me/0764949633"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 hover:bg-green-500 flex items-center justify-center transition-all group"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="text-xs sm:text-sm text-slate-400 group-hover:text-white" />
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/techify.maroc?igsh=MTUzcTI1cGhwMTRtbQ=="
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 hover:bg-pink-500 flex items-center justify-center transition-all group"
              aria-label="Instagram"
            >
              <FaInstagram className="text-xs sm:text-sm text-slate-400 group-hover:text-white" />
            </a>
          </li>
          <li>
            <a
              href="mailto:support@techify.com"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 hover:bg-red-500 flex items-center justify-center transition-all group"
              aria-label="Email"
            >
              <FaEnvelope className="text-xs sm:text-sm text-slate-400 group-hover:text-white" />
            </a>
          </li>
          
        </ul>

        {/* Auth Links - Right Side */}
        <ul className="flex items-center gap-2 sm:gap-3 lg:gap-4 font-semibold text-[10px] sm:text-xs lg:text-sm">
          {!session ? (
            <>
              <li>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 hover:text-blue-400 transition-colors group"
                >
                  <FaRegUser className="text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0 text-xs sm:text-sm" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-md transition-all transform hover:scale-105"
                >
                  <FaRegUser className="flex-shrink-0 text-xs sm:text-sm" />
                  <span className="hidden sm:inline">Register</span>
                </Link>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={() => handleLogout()}
                className="flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-md transition-all"
              >
                <FaArrowRightFromBracket className="flex-shrink-0 text-xs sm:text-sm" />
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