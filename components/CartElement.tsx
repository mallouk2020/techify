// *********************
// Role of the component: Cart icon and quantity that will be located in the header
// Name of the component: CartElement.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CartElement />
// Input parameters: no input parameters
// Output: Cart icon and quantity
// *********************

"use client";
import Link from 'next/link'
import React from 'react'
import { FaCartShopping } from 'react-icons/fa6'
import { useProductStore } from "@/app/_zustand/store";

const CartElement = () => {
    const { allQuantity } = useProductStore();
  return (
    <div className="relative">
      <Link
        href="/cart"
        className="group flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border border-white/20 backdrop-blur transition-all duration-200 hover:bg-white/20 hover:border-white/40"
        aria-label="Cart"
      >
        <FaCartShopping className="text-sm text-white drop-shadow-[0_4px_12px_rgba(59,130,246,0.55)] transition-colors group-hover:text-blue-200" />
        <span className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-[8.5px] font-semibold text-white shadow-lg">
          { allQuantity }
        </span>
      </Link>
    </div>
  )
}

export default CartElement