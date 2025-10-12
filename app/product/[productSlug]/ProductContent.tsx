'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";
import Image from "next/image";
import { 
  Share2, 
  ShoppingCart, 
  Check, 
  Truck, 
  Shield, 
  RefreshCw 
} from 'lucide-react';
import {
  SingleProductRating,
  ProductTabs,
  AddToWishlistBtn,
} from "@/components";
import { sanitize } from "@/lib/sanitize";

interface ImageItem {
  imageID: string;
  productID: string;
  image: string;
}

interface ProductContentProps {
  product: any;
  images: ImageItem[];
  slug: string;
}

export default function ProductContent({ product, images, slug }: ProductContentProps) {
  const router = useRouter();
  const { addToCart, calculateTotals } = useProductStore();
  
  const mainImage = product?.mainImage || "/product_placeholder.jpg";
  const [selectedImage, setSelectedImage] = useState(mainImage);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  
  // تحويل الألوان والأحجام من نص إلى مصفوفة
  const colors = product?.colors ? product.colors.split(',').map((c: string) => c.trim()).filter(Boolean) : [];
  const sizes = product?.sizes ? product.sizes.split(',').map((s: string) => s.trim()).filter(Boolean) : [];

  useEffect(() => {
    setSelectedImage(mainImage);
  }, [mainImage]);

  // دمج الصورة الرئيسية مع الصور الإضافية
  const allImages = [mainImage, ...images?.map(item => item.image).filter(Boolean)];
  
  // دالة إضافة المنتج للسلة
  const handleAddToCart = () => {
    addToCart({
      id: product?.id.toString(),
      title: product?.title,
      price: product?.price,
      amount: quantity,
      mainImage: product?.mainImage
    });
    calculateTotals();
    toast.success("تم إضافة المنتج إلى السلة");
  };

  // دالة الشراء الآن
  const handleBuyNow = () => {
    addToCart({
      id: product?.id.toString(),
      title: product?.title,
      price: product?.price,
      mainImage: product?.mainImage || "/placeholder.jpg",
      amount: quantity,
    });
    calculateTotals();
    toast.success("تم إضافة المنتج إلى السلة");
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">

          {/* قسم الصور */}
          <div className="w-full space-y-3">
            <div className="relative bg-white rounded-3xl p-3 sm:p-6 shadow-xl border border-slate-200 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative aspect-square w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden">
                <Image
                  src={selectedImage}
                  alt={sanitize(product?.title) || "Product image"}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* زر المشاركة */}
              <button className="absolute top-5 sm:top-8 left-5 sm:left-8 w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 z-10">
                <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
              </button>

              {/* شارة التوفر */}
              {product?.inStock && (
                <div className="absolute bottom-5 sm:bottom-8 left-5 sm:left-8 bg-emerald-500 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg flex items-center gap-2 z-10">
                  <Check className="w-4 h-4" />
                  متوفر في المخزون
                </div>
              )}
            </div>

            {/* الصور المصغرة - دمج الصورة الرئيسية مع الصور الإضافية */}
            {allImages.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 active:scale-95 ${
                      selectedImage === image
                        ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`صورة ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* قسم المعلومات */}
          <div className="space-y-4 sm:space-y-5">
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-200">
              <SingleProductRating rating={product?.rating} />

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                {sanitize(product?.title)}
              </h1>

              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  ${product?.price}
                </span>
                {product?.oldPrice && product.oldPrice > product.price && (
                  <>
                    <span className="text-xl sm:text-2xl font-semibold text-slate-400 line-through">
                      ${product.oldPrice}
                    </span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {/* الألوان المتاحة */}
              {colors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">اللون</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color: string) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                          selectedColor === color
                            ? 'bg-blue-600 text-white shadow-lg scale-105'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* الأحجام المتاحة */}
              {sizes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">الحجم</label>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                          selectedSize === size
                            ? 'bg-blue-600 text-white shadow-lg scale-105'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* الكمية */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">الكمية</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700 transition-all active:scale-95"
                  >
                    −
                  </button>
                  <div className="flex-1 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-bold text-lg text-slate-900 border-2 border-slate-200">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(Math.min(product?.stock || 999, quantity + 1))}
                    className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700 transition-all active:scale-95"
                  >
                    +
                  </button>
                  <span className="text-sm text-slate-500 mr-2">
                    ({product?.stock || 'غير معروف'} متاح)
                  </span>
                </div>
              </div>

              {/* أزرار الشراء */}
              {Boolean(product.inStock) ? (
                <div className="space-y-3">
                  <button 
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 sm:py-5 rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-base sm:text-lg">أضف إلى السلة</span>
                  </button>

                  <button 
                    onClick={handleBuyNow}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 sm:py-5 rounded-2xl shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="text-base sm:text-lg">اشترِ الآن</span>
                  </button>
                </div>
              ) : (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-center">
                  <p className="text-red-600 font-bold text-lg">المنتج غير متوفر حالياً</p>
                </div>
              )}

              {/* رمز المنتج والمفضلة */}
              <div className="mt-5 pt-5 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">رمز المنتج (SKU):</span>
                  <span className="font-mono font-semibold text-slate-900">{product?.sku || product?.id}</span>
                </div>
                
                {/* زر المفضلة مع المنطق الفعلي */}
                <div className="pt-3 border-t border-slate-100">
                  <AddToWishlistBtn product={product} slug={slug} />
                </div>
              </div>
            </div>

            {/* مميزات إضافية (شحن، ضمان، إرجاع) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1 text-sm">شحن مجاني</h3>
                <p className="text-xs text-slate-500">للطلبات فوق $50</p>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1 text-sm">ضمان سنتين</h3>
                <p className="text-xs text-slate-500">حماية كاملة</p>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-3">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1 text-sm">إرجاع سهل</h3>
                <p className="text-xs text-slate-500">خلال 30 يوم</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs من الكود الأصلي */}
        <div className="mt-10">
          <ProductTabs product={product} />
        </div>
      </div>
    </div>
  );
}