// Facebook Pixel Events Tracker
// استخدم هذا الملف لتتبع جميع أحداث الموقع

// التأكد من أن Facebook Pixel محمل
declare global {
  interface Window {
    fbq: any;
  }
}

// تتبع مشاهدة الصفحة
export const trackPageView = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

// تتبع عرض منتج
export const trackViewContent = (productId: string, productName: string, price: number) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_ids: [productId],
      content_name: productName,
      content_type: 'product',
      value: price,
      currency: 'MAD', // غيّره حسب عملتك
    });
  }
};

// تتبع إضافة منتج للسلة
export const trackAddToCart = (productId: string, productName: string, price: number, quantity: number = 1) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_ids: [productId],
      content_name: productName,
      content_type: 'product',
      value: price * quantity,
      currency: 'MAD',
      quantity: quantity,
    });
  }
};

// تتبع بدء عملية الشراء
export const trackInitiateCheckout = (cartValue: number, cartItemCount: number) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      value: cartValue,
      currency: 'MAD',
      num_items: cartItemCount,
    });
  }
};

// تتبع إتمام عملية شراء (الأهم!)
export const trackPurchase = (orderId: string, totalPrice: number, itemCount: number, productIds: string[] = []) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      value: totalPrice,
      currency: 'MAD',
      content_ids: productIds,
      content_type: 'product',
      num_items: itemCount,
      transaction_id: orderId,
    });
  }
};

// تتبع البحث عن منتج
export const trackSearch = (searchQuery: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Search', {
      search_string: searchQuery,
    });
  }
};

// تتبع إضافة المعلومات (الاشتراك في النيوزلتر)
export const trackAddPaymentInfo = (value: number) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddPaymentInfo', {
      value: value,
      currency: 'MAD',
    });
  }
};

// تتبع الاشتراك (Lead)
export const trackLead = (email: string, phone?: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      value: 0,
      currency: 'MAD',
    });
  }
};

// تتبع الاتصال (Contact)
export const trackContact = (phone: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Contact', {
      value: 0,
      currency: 'MAD',
    });
  }
};

// تتبع حدث مخصص
export const trackCustomEvent = (eventName: string, data: any = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, data);
  }
};