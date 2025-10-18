"use client"

import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";
import Image from "next/image"
import Link from "next/link";
import { FaCheck, FaCircleQuestion, FaClock, FaXmark, FaCartShopping, FaTruck, FaShieldHalved } from "react-icons/fa6";
import QuantityInputCart from "@/components/QuantityInputCart";
import { sanitize } from "@/lib/sanitize";

export const CartModule = () => {

  const { products, removeFromCart, calculateTotals, total } =
    useProductStore();

  // دالة حساب أعلى تكلفة شحن (نفس المنطق في صفحة الدفع)
  const calculateMaxShipping = () => {
    const shippingCosts = products
      .map((p) => p?.shippingCost || 0)
      .filter((cost) => cost > 0);

    return shippingCosts.length > 0 ? Math.max(...shippingCosts) : 0;
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    calculateTotals();
    toast.success("تم حذف المنتج من السلة");
  };

  // Empty cart state
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-24">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-slate-100 flex items-center justify-center mb-6">
          <FaCartShopping className="text-4xl sm:text-5xl text-slate-400" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">سلتك فارغة</h3>
        <p className="text-slate-600 mb-8 text-center max-w-md">
          يبدو أنك لم تضف أي منتجات لسلتك حتى الآن. ابدأ التسوق للعثور على منتجات مذهلة!
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <FaCartShopping className="text-lg" />
          متابعة التسوق
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-8">
      {/* Cart Items */}
      <section aria-labelledby="cart-heading" className="lg:col-span-7">
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="p-4 sm:p-6 flex gap-4 sm:gap-6">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <div className="relative w-20 h-20 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-slate-100">
                    <Image
                      src={product?.mainImage || "/product_placeholder.jpg"}
                      fill
                      alt={sanitize(product.title)}
                      className="object-cover object-center hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <Link
                        href={`#`}
                        className="font-semibold text-slate-800 hover:text-blue-600 transition-colors line-clamp-2 text-sm sm:text-base"
                      >
                        {sanitize(product.title)}
                      </Link>
                      <p className="mt-1 text-lg sm:text-xl font-bold text-blue-600">
                        {product.price} Dhs
                      </p>
                    </div>

                    {/* Remove Button - Desktop */}
                    <button
                      onClick={() => handleRemoveItem(product.id)}
                      type="button"
                      className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      aria-label="Remove item"
                    >
                      <FaXmark className="text-xl" />
                    </button>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center gap-3">
                    <QuantityInputCart product={product} />
                  </div>

                  {/* Stock Status & Remove for Mobile */}
                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-sm">
                      {(product.inStock ?? 0) > 0 ? (
                        <>
                          <FaCheck className="text-green-500 flex-shrink-0" />
                          <span className="text-green-600 font-medium">في المخزن</span>
                        </>
                      ) : (
                        <>
                          <FaClock className="text-slate-400 flex-shrink-0" />
                          <span className="text-slate-600">يتم التوصيل خلال 1-2 أيام</span>
                        </>
                      )}
                    </div>

                    {/* Remove Button - Mobile */}
                    <button
                      onClick={() => handleRemoveItem(product.id)}
                      type="button"
                      className="sm:hidden inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <FaXmark className="text-sm" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
          <div className="flex flex-col items-center text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
            <FaTruck className="text-2xl sm:text-3xl text-blue-600 mb-2" />
            <p className="text-xs sm:text-sm font-medium text-slate-700">شحن سريع</p>
          </div>
          <div className="flex flex-col items-center text-center p-3 sm:p-4 bg-green-50 rounded-lg">
            <FaShieldHalved className="text-2xl sm:text-3xl text-green-600 mb-2" />
            <p className="text-xs sm:text-sm font-medium text-slate-700">دفع عند الاستلام</p>
          </div>
          <div className="flex flex-col items-center text-center p-3 sm:p-4 bg-cyan-50 rounded-lg">
            <FaCheck className="text-2xl sm:text-3xl text-cyan-600 mb-2" />
            <p className="text-xs sm:text-sm font-medium text-slate-700">ضمان الجودة</p>
          </div>
        </div>
      </section>

      {/* Order Summary */}
      <section
        aria-labelledby="summary-heading"
        className="mt-8 lg:mt-0 lg:col-span-5"
      >
        <div className="sticky top-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-6 sm:p-8 shadow-lg">
          <h2
            id="summary-heading"
            className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-200"
          >
            ملخص الطلب
          </h2>

          <dl className="space-y-4">
            <div className="flex items-center justify-between text-base">
              <dt className="text-slate-600">المجموع الفرعي</dt>
              <dd className="font-semibold text-slate-800">
                {total.toFixed(2)} Dhs
              </dd>
            </div>

            <div className="flex items-center justify-between text-base pt-4 border-t border-slate-200">
              <dt className="flex items-center gap-2 text-slate-600">
                <span>الشحن</span>
                <button className="text-slate-400 hover:text-slate-600">
                  <FaCircleQuestion className="text-sm" />
                </button>
              </dt>
              <dd className="font-semibold text-green-600">
                {calculateMaxShipping() > 0 ? `${calculateMaxShipping()} Dhs` : "مجاني"}
              </dd>
            </div>

            <div className="flex items-center justify-between text-lg sm:text-xl font-bold pt-6 border-t-2 border-slate-300">
              <dt className="text-slate-800">الإجمالي</dt>
              <dd className="text-blue-600">
                {total === 0 ? 0 : (total + calculateMaxShipping()).toFixed(2)} Dhs
              </dd>
            </div>
          </dl>

          <div className="mt-8 space-y-3">
            <Link
              href="/checkout"
              className="block w-full text-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-6 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-base sm:text-lg"
            >
           تاكيدالطلب
            </Link>

            <Link
              href="/"
              className="block w-full text-center bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3 rounded-lg border-2 border-slate-200 hover:border-blue-300 transition-all duration-300 text-sm sm:text-base"
            >
              متابعة التسوق
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}