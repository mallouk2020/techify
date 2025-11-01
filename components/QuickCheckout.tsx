import { useState } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import apiClient from '@/lib/api';

interface Product {
  id?: string;
  title?: string;
  price?: number;
  mainImage?: string;
  shippingCost?: number;
  oldPrice?: number;
}

interface NotificationMessage {
  type: 'success' | 'error' | '';
  text: string;
  visible: boolean;
}

interface QuickCheckoutProps {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export default function QuickCheckout({ product, quantity, selectedColor, selectedSize }: QuickCheckoutProps) {
  const [showMessage, setShowMessage] = useState<NotificationMessage>({ type: '', text: '', visible: false });
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // دالة لعرض الرسائل
  const showNotification = (type: 'success' | 'error', text: string) => {
    setShowMessage({ type, text, visible: true });
    setTimeout(() => {
      setShowMessage({ type: '', text: '', visible: false });
    }, 4000);
  };

  // معالجة تغيير المدخلات
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // التحقق من صحة البيانات
  const validateForm = () => {
    const errors = [];
    
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.push('الاسم الكامل يجب أن يكون على الأقل حرفين');
    }
    
    const phoneDigits = formData.phone.replace(/[^0-9]/g, '');
    if (!formData.phone.trim() || phoneDigits.length < 10) {
      errors.push('رقم الهاتف يجب أن يحتوي على 10 أرقام على الأقل');
    }
    
    if (!formData.address.trim() || formData.address.trim().length < 5) {
      errors.push('العنوان يجب أن يكون على الأقل 5 أحرف');
    }
    
    return errors;
  };

  // حساب الإجمالي
  const subtotal = (product?.price || 0) * quantity;
  const shipping = product?.shippingCost || 0;
  const total = subtotal + shipping;

  // إرسال الطلب
  const handleSubmitOrder = async () => {
    const errors = validateForm();
    
    if (errors.length > 0) {
      errors.forEach(error => showNotification('error', error));
      return;
    }

    setIsSubmitting(true);

    try {
      // إنشاء بيانات الطلب
      const orderData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: 'noemail@quickorder.order',
        adress: formData.address.trim(),
        orderNotice: '',
        paymentMethod: 'cash_on_delivery',
        status: 'pending',
        total: total,
      };

      // إرسال الطلب إلى API
      const response = await apiClient.post('/api/orders', orderData);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل إنشاء الطلب');
      }

      const data = await response.json();
      const orderId = data.id;

      if (!orderId) throw new Error('لم يتم استلام رقم الطلب');

      // إضافة المنتج إلى الطلب
      const productResponse = await apiClient.post('/api/order-product', {
        customerOrderId: orderId,
        productId: product.id,
        quantity: quantity,
        selectedColor: selectedColor || null,
        selectedSize: selectedSize || null,
      });

      if (!productResponse.ok) {
        throw new Error('فشل إضافة المنتج للطلب');
      }

      showNotification('success', 'تم إنشاء الطلب بنجاح! سيتم التواصل معك للتأكيد والدفع عند الاستلام.');
      
      // إعادة تعيين الفورم
      setTimeout(() => {
        setFormData({
          name: '',
          phone: '',
          address: '',
        });
      }, 2000);
    } catch (error: any) {
      console.error('Error:', error);
      showNotification('error', error.message || 'حدث خطأ في إنشاء الطلب. يرجى المحاولة لاحقاً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-5 border-2 border-dashed border-blue-300 mt-6">
      {/* عرض الرسائل */}
      {showMessage.visible && (
        <div className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
          showMessage.type === 'error' 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-green-50 border border-green-200'
        }`}>
          {showMessage.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          )}
          <p className={`text-sm font-medium ${
            showMessage.type === 'error' 
              ? 'text-red-700' 
              : 'text-green-700'
          }`}>
            {showMessage.text}
          </p>
        </div>
      )}

      {/* العنوان */}
      <div className="mb-3">
        <h3 className="text-base font-bold text-slate-900">
          الطلب السريع ⚡
        </h3>
        <p className="text-xs text-slate-600 mt-0.5">اطلب الآن من صفحة المنتج مباشرة</p>
      </div>

      {/* الفورم مباشرة */}
      <div className="space-y-3">
        {/* الاسم */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            الاسم الكامل *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="أدخل اسمك الكامل"
            disabled={isSubmitting}
            className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition disabled:bg-gray-100 outline-none text-sm"
          />
        </div>

        {/* رقم الهاتف */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            رقم الهاتف *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="مثال: 0661234567"
            disabled={isSubmitting}
            className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition disabled:bg-gray-100 outline-none text-sm"
          />
        </div>

        {/* العنوان */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            عنوان التوصيل *
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="المدينة، الحي، الشارع..."
            rows={2}
            disabled={isSubmitting}
            className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition disabled:bg-gray-100 outline-none resize-none text-sm"
          />
        </div>

        {/* ملخص الطلب */}
        <div className="bg-white rounded-lg p-3 border border-slate-200">
          <p className="text-xs text-slate-600 mb-2 font-semibold">📦 ملخص الطلب:</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">السعر:</span>
              <span className="font-semibold text-slate-900">{product?.price} Dhs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">الكمية:</span>
              <span className="font-semibold text-slate-900">{quantity}</span>
            </div>
            {selectedColor && (
              <div className="flex justify-between">
                <span className="text-slate-600">اللون:</span>
                <span className="font-semibold text-slate-900">{selectedColor}</span>
              </div>
            )}
            {selectedSize && (
              <div className="flex justify-between">
                <span className="text-slate-600">الحجم:</span>
                <span className="font-semibold text-slate-900">{selectedSize}</span>
              </div>
            )}
            {shipping > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600">الشحن:</span>
                <span className="font-semibold text-slate-900">{shipping} Dhs</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-1.5 mt-1.5 font-bold text-slate-900">
              <span>الإجمالي:</span>
              <span className="text-green-600 text-sm">{total} Dhs</span>
            </div>
          </div>
        </div>

        {/* معلومة الدفع */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
          <p className="text-xs text-blue-700">
            ℹ️ الدفع عند الاستلام - سيتم التواصل معك للتأكيد
          </p>
        </div>

        {/* زر الطلب */}
        <button
          onClick={handleSubmitOrder}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2.5 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
        >
          {isSubmitting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              جاري معالجة...
            </>
          ) : (
            'تأكيد الطلب'
          )}
        </button>
      </div>
    </div>
  );
}