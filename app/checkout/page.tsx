"use client";
import { SectionTitle } from "@/components";
import { useProductStore } from "../_zustand/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";

const CheckoutPage = () => {
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    phone: "",
    email: "",
    adress: "",
    city: "",
    orderNotice: "",
  });
  
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { products, total, clearCart } = useProductStore();
  const router = useRouter();

  // Simplified validation for COD orders
  const validateForm = () => {
    const errors: string[] = [];
    
    // Name validation (full name)
    if (!checkoutForm.name.trim() || checkoutForm.name.trim().length < 2) {
      errors.push("الاسم الكامل يجب أن يكون على الأقل حرفين");
    }
    
    // Phone validation (must be at least 10 digits)
    const phoneDigits = checkoutForm.phone.replace(/[^0-9]/g, '');
    if (!checkoutForm.phone.trim() || phoneDigits.length < 10) {
      errors.push("رقم الهاتف يجب أن يحتوي على 10 أرقام على الأقل");
    }
    
    // Email validation (optional - only validate if provided)
    if (checkoutForm.email.trim()) {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegex.test(checkoutForm.email.trim())) {
        errors.push("البريد الإلكتروني غير صحيح");
      }
    }
    
    // Address validation
    if (!checkoutForm.adress.trim() || checkoutForm.adress.trim().length < 5) {
      errors.push("العنوان يجب أن يكون على الأقل 5 أحرف");
    }
    
    // City validation
    if (!checkoutForm.city.trim() || checkoutForm.city.trim().length < 2) {
      errors.push("المدينة يجب أن تكون على الأقل حرفين");
    }
    
    return errors;
  };

  const makePurchase = async () => {
    // Client-side validation first
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => {
        toast.error(error);
      });
      return;
    }

    if (products.length === 0) {
      toast.error("سلة التسوق فارغة");
      return;
    }

    if (total <= 0) {
      toast.error("إجمالي الطلب غير صحيح");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("🚀 Starting order creation...");
      
      // Prepare the simplified order data for COD
      const orderData = {
        name: checkoutForm.name.trim(),
        phone: checkoutForm.phone.trim(),
        email: checkoutForm.email.trim() || "noemail@cod.order", // Default email for COD orders
        adress: checkoutForm.adress.trim(),
        city: checkoutForm.city.trim(),
        orderNotice: checkoutForm.orderNotice.trim(),
        paymentMethod: paymentMethod,
        status: "pending",
        total: total,
      };

      console.log("📋 Order data being sent:", orderData);

      // Send order data to server for validation and processing
      const response = await apiClient.post("/api/orders", orderData);

      console.log("📡 API Response received:");
      console.log("  Status:", response.status);
      console.log("  Status Text:", response.statusText);
      console.log("  Response OK:", response.ok);
      
      // Check if response is ok before parsing
      if (!response.ok) {
        console.error("❌ Response not OK:", response.status, response.statusText);
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        
        // Try to parse as JSON to get detailed error info
        try {
          const errorData = JSON.parse(errorText);
          console.error("Parsed error data:", errorData);
          
          // Show specific validation errors
          if (errorData.details && Array.isArray(errorData.details)) {
            errorData.details.forEach((detail: any) => {
              toast.error(`${detail.field}: ${detail.message}`);
            });
          } else {
            toast.error(errorData.error || "Validation failed");
          }
        } catch (parseError) {
          console.error("Could not parse error as JSON:", parseError);
          toast.error("Validation failed");
        }
        
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Parsed response data:", data);
      
      const orderId: string = data.id;
      console.log("🆔 Extracted order ID:", orderId);

      if (!orderId) {
        console.error("❌ Order ID is missing or falsy!");
        console.error("Full response data:", JSON.stringify(data, null, 2));
        throw new Error("Order ID not received from server");
      }

      console.log("✅ Order ID validation passed, proceeding with product addition...");

      // Add products to order
      for (let i = 0; i < products.length; i++) {
        console.log(`🛍️ Adding product ${i + 1}/${products.length}:`, {
          orderId,
          productId: products[i].id,
          quantity: products[i].amount
        });
        
        await addOrderProduct(orderId, products[i].id, products[i].amount);
        console.log(`✅ Product ${i + 1} added successfully`);
      }

      console.log(" All products added successfully!");

      // Clear form and cart
      setCheckoutForm({
        name: "",
        phone: "",
        email: "",
        adress: "",
        city: "",
        orderNotice: "",
      });
      clearCart();
      
      toast.success("تم إنشاء الطلب بنجاح! سيتم التواصل معك للتأكيد والدفع عند الاستلام.");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      console.error("💥 Error in makePurchase:", error);
      
      // Handle server validation errors
      if (error.response?.status === 400) {
        console.log(" Handling 400 error...");
        try {
          const errorData = await error.response.json();
          console.log("Error data:", errorData);
          if (errorData.details && Array.isArray(errorData.details)) {
            // Show specific validation errors
            errorData.details.forEach((detail: any) => {
              toast.error(`${detail.field}: ${detail.message}`);
            });
          } else {
            toast.error(errorData.error || "Validation failed");
          }
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
          toast.error("Validation failed");
        }
      } else if (error.response?.status === 409) {
        toast.error("Duplicate order detected. Please wait before creating another order.");
      } else {
        console.log("🔍 Handling generic error...");
        toast.error("Failed to create order. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const addOrderProduct = async (
    orderId: string,
    productId: string,
    productQuantity: number
  ) => {
    try {
      console.log("️ Adding product to order:", {
        customerOrderId: orderId,
        productId,
        quantity: productQuantity
      });
      
      const response = await apiClient.post("/api/order-product", {
        customerOrderId: orderId,
        productId: productId,
        quantity: productQuantity,
      });

      console.log("📡 Product order response:", response);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Product order failed:", response.status, errorText);
        throw new Error(`Product order failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Product order successful:", data);
      
    } catch (error) {
      console.error("💥 Error creating product order:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (products.length === 0) {
      toast.error("You don't have items in your cart");
      router.push("/cart");
    }
  }, []);

  return (
    <div className="bg-white">
      <SectionTitle title="Checkout" path="Home | Cart | Checkout" />
      
      <div className="hidden h-full w-1/2 bg-white lg:block" aria-hidden="true" />
      <div className="hidden h-full w-1/2 bg-gray-50 lg:block" aria-hidden="true" />

      <main className="relative mx-auto grid max-w-screen-2xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48">
        <h1 className="sr-only">Order information</h1>

        {/* Order Summary */}
        <section
          aria-labelledby="summary-heading"
          className="bg-gray-50 px-4 pb-10 pt-16 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16"
        >
          <div className="mx-auto max-w-lg lg:max-w-none">
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
              Order summary
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 text-sm font-medium text-gray-900"
            >
              {products.map((product) => (
                <li key={product?.id} className="flex items-start space-x-4 py-6">
                  <Image
                    src={product?.mainImage || "/product_placeholder.jpg"}
                    alt={product?.title}
                    width={80}
                    height={80}
                    className="h-20 w-20 flex-none rounded-md object-cover object-center"
                  />
                  <div className="flex-auto space-y-1">
                    <h3>{product?.title}</h3>
                    <p className="text-gray-500">x{product?.amount}</p>
                  </div>
                  <p className="flex-none text-base font-medium">
                    ${product?.price}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="hidden space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-900 lg:block">
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd>${total}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Shipping</dt>
                <dd>$5</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Taxes</dt>
                <dd>${total / 5}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <dt className="text-base">Total</dt>
                <dd className="text-base">
                  ${total === 0 ? 0 : Math.round(total + total / 5 + 5)}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <form className="px-4 pt-16 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0">
          <div className="mx-auto max-w-lg lg:max-w-none">
            {/* Contact Information */}
            <section aria-labelledby="contact-info-heading">
              <h2
                id="contact-info-heading"
                className="text-lg font-medium text-gray-900"
              >
                معلومات الاتصال
              </h2>

              <div className="mt-6">
                <label
                  htmlFor="name-input"
                  className="block text-sm font-medium text-gray-700"
                >
                  الاسم الكامل *
                </label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.name}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        name: e.target.value,
                      })
                    }
                    type="text"
                    id="name-input"
                    name="name-input"
                    autoComplete="name"
                    required
                    disabled={isSubmitting}
                    placeholder="أدخل اسمك الكامل"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="phone-input"
                  className="block text-sm font-medium text-gray-700"
                >
                  رقم الهاتف *
                </label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.phone}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        phone: e.target.value,
                      })
                    }
                    type="tel"
                    id="phone-input"
                    name="phone-input"
                    autoComplete="tel"
                    required
                    disabled={isSubmitting}
                    placeholder="مثال: 0501234567"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-700"
                >
                  البريد الإلكتروني (اختياري)
                </label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.email}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        email: e.target.value,
                      })
                    }
                    type="email"
                    id="email-address"
                    name="email-address"
                    autoComplete="email"
                    disabled={isSubmitting}
                    placeholder="example@email.com"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="mt-10">
              <h2 className="text-lg font-medium text-gray-900">
                طريقة الدفع
              </h2>
              
              <div className="mt-6 space-y-4">
                {/* Cash on Delivery - Active */}
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="cash-on-delivery"
                      name="payment-method"
                      type="radio"
                      checked={paymentMethod === "cash_on_delivery"}
                      onChange={() => setPaymentMethod("cash_on_delivery")}
                      disabled={isSubmitting}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label htmlFor="cash-on-delivery" className="font-medium text-gray-900">
                      الدفع عند الاستلام 💵
                    </label>
                    <p className="text-gray-500">ادفع نقداً عند استلام طلبك</p>
                  </div>
                </div>

                {/* Online Payment - Disabled */}
                <div className="relative flex items-start opacity-50">
                  <div className="flex h-6 items-center">
                    <input
                      id="online-payment"
                      name="payment-method"
                      type="radio"
                      disabled={true}
                      className="h-4 w-4 border-gray-300 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label htmlFor="online-payment" className="font-medium text-gray-400 cursor-not-allowed">
                      الدفع الإلكتروني 💳
                    </label>
                    <p className="text-gray-400">غير متوفر حالياً</p>
                  </div>
                </div>
              </div>

              {/* COD Notice */}
              <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      الدفع عند الاستلام
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>سيتم التواصل معك لتأكيد الطلب. الدفع نقداً عند استلام المنتجات.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section aria-labelledby="shipping-heading" className="mt-10">
              <h2
                id="shipping-heading"
                className="text-lg font-medium text-gray-900"
              >
                عنوان التوصيل
              </h2>

              <div className="mt-6 space-y-6">
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    العنوان *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      autoComplete="street-address"
                      required
                      disabled={isSubmitting}
                      placeholder="مثال: شارع الملك فهد، حي النزهة"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={checkoutForm.adress}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          adress: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    المدينة *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      autoComplete="address-level2"
                      required
                      disabled={isSubmitting}
                      placeholder="مثال: الرياض، جدة، الدمام"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={checkoutForm.city}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          city: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="order-notice"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ملاحظات (اختياري)
                  </label>
                  <div className="mt-1">
                    <textarea
                      rows={4}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      id="order-notice"
                      name="order-notice"
                      disabled={isSubmitting}
                      placeholder="أي ملاحظات إضافية حول طلبك..."
                      value={checkoutForm.orderNotice}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          orderNotice: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                </div>
              </div>
            </section>

            <div className="mt-10 border-t border-gray-200 pt-6 ml-0">
              <button
                type="button"
                onClick={makePurchase}
                disabled={isSubmitting}
                className="w-full rounded-md border border-transparent bg-green-600 px-20 py-3 text-lg font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "جاري معالجة الطلب..." : "تأكيد الطلب 🛒"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CheckoutPage;
