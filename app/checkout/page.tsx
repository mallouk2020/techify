"use client";
import { SectionTitle } from "@/components";
import { useProductStore } from "../_zustand/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";
import { useSession } from "next-auth/react";

const CheckoutPage = () => {
  const { data: session, update: refreshSession } = useSession();
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    phone: "",
    email: "",
    adress: "",
    orderNotice: "",
  });
  const [isDataAutoFilled, setIsDataAutoFilled] = useState(false);
  const [saveDataToProfile, setSaveDataToProfile] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { products, clearCart, removeFromCart } = useProductStore();
  const router = useRouter();

  // دالة حساب المجموع الفرعي
  const calculateSubtotal = () => {
    return products.reduce((sum, product) => {
      const currentPrice = product?.price || 0;
      const quantity = product?.amount || 1;
      return sum + currentPrice * quantity;
    }, 0);
  };

  // دالة حساب الخصم (للعرض فقط)
  const calculateDiscount = () => {
    return products.reduce((sum, product) => {
      const oldPrice = product?.oldPrice || 0;
      const currentPrice = product?.price || 0;
      const quantity = product?.amount || 1;
      return sum + Math.max(oldPrice - currentPrice, 0) * quantity;
    }, 0);
  };

  // دالة حساب أعلى تكلفة شحن
  const calculateMaxShipping = () => {
    const shippingCosts = products
      .map((p) => p?.shippingCost || 0)
      .filter((cost) => cost > 0);

    return shippingCosts.length > 0 ? Math.max(...shippingCosts) : 0;
  };

  // دالة حساب المجموع النهائي
  const calculateFinalTotal = () => {
    const subtotal = calculateSubtotal();
    const maxShipping = calculateMaxShipping();
    const finalTotal = subtotal + maxShipping;
    return Number.isFinite(finalTotal) && finalTotal > 0 ? finalTotal : 0;
  };

  // دالة حذف منتج من السلة
  const handleRemoveProduct = (productId: string) => {
    removeFromCart(productId);
    toast.success("تم حذف المنتج من السلة");
  };

  const getProductImage = (imagePath?: string) => {
    if (!imagePath) {
      return "/product_placeholder.jpg";
    }

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    return `/uploads/${imagePath.replace(/^\/+/, "")}`;
  };

  // --- Validation ---
  const validateForm = () => {
    const errors: string[] = [];
    if (!checkoutForm.name.trim() || checkoutForm.name.trim().length < 2) {
      errors.push("الاسم الكامل يجب أن يكون على الأقل حرفين");
    }
    const phoneDigits = checkoutForm.phone.replace(/[^0-9]/g, '');
    if (!checkoutForm.phone.trim() || phoneDigits.length < 10) {
      errors.push("رقم الهاتف يجب أن يحتوي على 10 أرقام على الأقل");
    }
    if (checkoutForm.email.trim()) {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegex.test(checkoutForm.email.trim())) {
        errors.push("البريد الإلكتروني غير صحيح");
      }
    }
    if (!checkoutForm.adress.trim() || checkoutForm.adress.trim().length < 5) {
      errors.push("العنوان يجب أن يكون على الأقل 5 أحرف");
    }
    return errors;
  };

  // --- Add Order Product ---
  const addOrderProduct = async (
    orderId: string,
    productId: string,
    productQuantity: number,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    try {
      const response = await apiClient.post("/api/order-product", {
        customerOrderId: orderId,
        productId,
        quantity: productQuantity,
        selectedColor: selectedColor || null,
        selectedSize: selectedSize || null,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Product order failed: ${response.status} - ${errorText}`);
      }

      await response.json();
    } catch (error) {
      console.error("💥 Error creating product order:", error);
      throw error;
    }
  };

  // --- Make Purchase ---
  const makePurchase = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    if (products.length === 0) {
      toast.error("سلة التسوق فارغة");
      return;
    }

    setIsSubmitting(true);

    try {
      const finalTotal = calculateFinalTotal();
      if (finalTotal <= 0) {
        toast.error("إجمالي الطلب غير صحيح");
        setIsSubmitting(false);
        return;
      }

      const orderData = {
        name: checkoutForm.name.trim(),
        phone: checkoutForm.phone.trim(),
        email: checkoutForm.email.trim() || "noemail@cod.order",
        adress: checkoutForm.adress.trim(),
        city: "", // حقل المدينة تم إزالته من النموذج
        orderNotice: checkoutForm.orderNotice.trim(),
        paymentMethod,
        status: "pending",
        total: finalTotal,
      };

      const response = await apiClient.post("/api/orders", orderData);

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.details && Array.isArray(errorData.details)) {
            errorData.details.forEach((detail: any) => {
              toast.error(`${detail.field}: ${detail.message}`);
            });
          } else {
            toast.error(errorData.error || "فشل التحقق من الطلب");
          }
        } catch {
          toast.error("فشل إنشاء الطلب. يرجى المحاولة لاحقًا.");
        }
        throw new Error("Order creation failed");
      }

      const data = await response.json();
      const orderId: string = data.id;

      if (!orderId) throw new Error("لم يتم استلام رقم الطلب");

      // Add each product to the order
      for (const product of products) {
        await addOrderProduct(
          orderId, 
          product.id, 
          product.amount,
          product.selectedColor,
          product.selectedSize
        );
      }

      // Save user data to profile if checkbox is checked
      if (session?.user && saveDataToProfile) {
        try {
          const updateResponse = await apiClient.put("/api/user/profile", {
            phone: checkoutForm.phone.trim(),
            address: checkoutForm.adress.trim(),
          });

          if (updateResponse.ok) {
            toast.success("تم حفظ بياناتك في ملفك الشخصي");
            if (typeof refreshSession === "function") {
              try {
                await refreshSession({
                  phone: checkoutForm.phone.trim(),
                  address: checkoutForm.adress.trim(),
                });
              } catch (refreshError) {
                console.error("Failed to refresh session after profile update:", refreshError);
              }
            }
          }
        } catch (error) {
          console.error("Error saving user profile:", error);
          // Don't show error to user as order was successful
        }
      }

      // Reset form and cart
      setCheckoutForm({
        name: "",
        phone: "",
        email: "",
        adress: "",
        orderNotice: "",
      });
      clearCart();

      toast.success("تم إنشاء الطلب بنجاح! سيتم التواصل معك للتأكيد والدفع عند الاستلام.");
      setTimeout(() => router.push("/"), 2000);
    } catch (error: any) {
      console.error("💥 Error in makePurchase:", error);
      if (error.response?.status === 409) {
        toast.error("تم اكتشاف طلب مكرر. يرجى الانتظار قبل إنشاء طلب جديد.");
      } else {
        toast.error("فشل إنشاء الطلب. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Auto-fill user data from session ---
  useEffect(() => {
    if (session?.user && !isDataAutoFilled) {
      const user = session.user as any;
      
      console.log("🔍 Session user data:", {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address
      });
      
      // تعبئة البيانات المتوفرة فقط
      const updatedForm: any = {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        adress: user.address || "",
        orderNotice: "",
      };
      
      // تحقق من وجود بيانات فعلية
      const hasData = !!(user.name || user.email || user.phone || user.address);
      
      if (hasData) {
        setCheckoutForm(updatedForm);
        setIsDataAutoFilled(true);
        toast.success("تم ملء بياناتك تلقائياً من ملفك الشخصي");
      } else {
        console.log("⚠️ No user data found in session. User may need to logout and login again.");
      }
    }
  }, [session, isDataAutoFilled]);

  // --- Redirect if cart is empty (with delay to allow data loading) ---
  useEffect(() => {
    // انتظر قليلاً للسماح بتحميل البيانات من localStorage
    const timer = setTimeout(() => {
      if (products.length === 0) {
        toast.error("سلة التسوق فارغة");
        router.push("/cart");
      }
    }, 500); // انتظر 500ms قبل التحقق

    return () => clearTimeout(timer);
  }, [products.length, router]);

  // --- JSX ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6">
      <SectionTitle title="تأكيد الطلب" path="الرئيسية | السلة | تأكيد الطلب" />

      <main className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>📋</span> معلومات الطلب
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  الاسم الكامل *
                </label>
                <input
                  value={checkoutForm.name}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                  type="text"
                  placeholder="أدخل اسمك الكامل"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  رقم الهاتف *
                </label>
                <input
                  value={checkoutForm.phone}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                  type="tel"
                  placeholder="مثال: 0501234567"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  البريد الإلكتروني (اختياري)
                </label>
                <input
                  value={checkoutForm.email}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                  type="email"
                  placeholder="example@email.com"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Payment */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">طريقة الدفع</h3>
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    paymentMethod === "cash_on_delivery"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => !isSubmitting && setPaymentMethod("cash_on_delivery")}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={paymentMethod === "cash_on_delivery"}
                      readOnly
                      className="h-4 w-4 text-green-600"
                    />
                    <div>
                      <p className="font-medium text-gray-800">الدفع عند الاستلام 💵</p>
                      <p className="text-sm text-gray-600">ادفع نقدًا عند استلام طلبك</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border-2 border-gray-200 bg-gray-50 opacity-70 cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <input type="radio" disabled className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-500">الدفع الإلكتروني 💳</p>
                      <p className="text-sm text-gray-500">غير متوفر حاليًا</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-green-700 text-sm font-medium flex items-start gap-2">
                  <span>✅</span>
                  سيتم التواصل معك لتأكيد الطلب. الدفع نقدًا عند الاستلام.
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="mt-8 space-y-5">
              <h3 className="text-lg font-bold text-gray-800">عنوان التوصيل</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  العنوان الكامل (المدينة، الحي، الشارع) *
                </label>
                <textarea
                  rows={3}
                  value={checkoutForm.adress}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, adress: e.target.value })}
                  placeholder="مثال: الرياض، حي النزهة، شارع الملك فهد، بجوار مركز التسوق"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  ملاحظات (اختياري)
                </label>
                <textarea
                  rows={3}
                  value={checkoutForm.orderNotice}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, orderNotice: e.target.value })}
                  placeholder="أي ملاحظات إضافية..."
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Save data checkbox for logged-in users */}
            {session?.user && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveDataToProfile}
                    onChange={(e) => setSaveDataToProfile(e.target.checked)}
                    disabled={isSubmitting}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      حفظ هذه البيانات في ملفي الشخصي
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      سيتم ملء البيانات تلقائياً في المرات القادمة
                    </p>
                  </div>
                </label>
              </div>
            )}

            <button
              type="button"
              onClick={makePurchase}
              disabled={isSubmitting}
              className={`mt-8 w-full py-4 rounded-xl font-bold text-lg transition ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg"
              }`}
            >
              {isSubmitting ? "جاري معالجة الطلب..." : "تأكيد الطلب 🛒"}
            </button>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>📦</span> ملخص الطلب
            </h2>
            <ul className="space-y-4">
              {products.map((product) => (
                <li key={product?.id} className="flex gap-4 relative group">
                  <Image
                    src={getProductImage(product?.mainImage)}
                    alt={product?.title || "صورة المنتج"}
                    width={70}
                    height={70}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{product?.title}</h3>
                    <p className="text-sm text-gray-600">الكمية: {product?.amount}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex flex-col items-end">
                      <p className="font-bold text-gray-900 text-lg">
                        ${Number(product?.price || 0).toFixed(2)}
                      </p>
                      {product?.oldPrice && product.oldPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">
                          ${Number(product.oldPrice).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveProduct(product?.id)}
                      disabled={isSubmitting}
                      className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="حذف المنتج"
                    >
                      ✕ حذف
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {calculateDiscount() > 0 && (
              <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
                تم توفير ${calculateDiscount().toFixed(2)}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>المجموع الفرعي</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>التوصيل</span>
                {calculateMaxShipping() > 0 ? (
                  <span>${calculateMaxShipping().toFixed(2)}</span>
                ) : (
                  <span className="text-green-600 font-semibold">مجاني</span>
                )}
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                <span>الإجمالي</span>
                <span>${calculateFinalTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
