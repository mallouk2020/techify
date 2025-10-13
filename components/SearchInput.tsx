// *********************
// Role of the component: Search input element located in the header but it can be used anywhere in your application
// Name of the component: SearchInput.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <SearchInput />
// Input parameters: no input parameters
// Output: form with search input and button
// *********************

"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { sanitize } from "@/lib/sanitize";

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const router = useRouter();

  // function for modifying URL for searching products
  const searchProducts = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Sanitize the search input before using it in URL
    const sanitizedSearch = sanitize(searchInput);
    router.push(`/search?search=${encodeURIComponent(sanitizedSearch)}`);
    setSearchInput("");
  };

  return (
    <form className="flex w-full justify-center rounded-full overflow-hidden shadow-sm border border-slate-200 bg-white/90 min-h-[38px]" onSubmit={searchProducts}>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="ابحث عن المنتجات"
        className="bg-transparent px-3 py-1.5 w-full text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
      />
      <button type="submit" className="px-4 py-1.5 bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors">
        بحث
      </button>
    </form>
  );
};

export default SearchInput;
