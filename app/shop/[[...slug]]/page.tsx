export const dynamic = "force-dynamic";
export const revalidate = 0;

import {
  Breadcrumb,
  Filters,
  Pagination,
  Products,
  SortBy,
} from "@/components";
import React from "react";
import { sanitize } from "@/lib/sanitize";

// improve readabillity of category text, for example category text "smart-watches" will be "smart watches"
const improveCategoryText = (text: string): string => {
  if (text.indexOf("-") !== -1) {
    let textArray = text.split("-");

    return textArray.join(" ");
  } else {
    return text;
  }
};

const ShopPage = async ({ params, searchParams }: { params: Promise<{ slug?: string[] }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  // Await both params and searchParams
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;
  
  return (
    <div className="bg-gray-100 text-slate-900 min-h-screen py-10">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-12">
        <Breadcrumb />
        <div className="grid grid-cols-[260px_1fr] gap-10 xl:grid-cols-[240px_1fr] lg:grid-cols-[220px_1fr] max-lg:grid-cols-1">
          <aside className="bg-white rounded-xl shadow-sm border border-slate-200 sticky top-24 h-fit max-lg:static max-lg:p-0 max-lg:shadow-none max-lg:border-transparent">
            <div className="p-6 max-lg:p-0">
              <Filters />
            </div>
          </aside>
          <section className="flex flex-col gap-8">
            <header className="flex items-center justify-between gap-6 flex-wrap">
              <h2 className="text-3xl font-semibold text-slate-900 max-md:text-2xl max-sm:text-xl">
                {awaitedParams?.slug && awaitedParams?.slug[0]?.length > 0
                  ? sanitize(improveCategoryText(awaitedParams?.slug[0]))
                  : "All products"}
              </h2>
              <SortBy />
            </header>
            <Products params={awaitedParams} searchParams={awaitedSearchParams} />
            <div className="pt-4 border-t border-slate-200">
              <Pagination />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
