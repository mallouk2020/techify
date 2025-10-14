# إصلاح: دعم الأسماء العربية في نموذج الطلب

## المشكلة
كان المستخدمون غير قادرين على كتابة أسمائهم بالعربية في صفحة الدفع (Checkout). كان الـ validation في الـ backend يرفض الأحرف العربية.

## السبب
في ملف `server/utills/validation.js`، كانت دالة `validateName` و `validateCardholderName` تستخدم regex يسمح فقط بالأحرف الإنجليزية:

```javascript
// القديم - يسمح فقط بالإنجليزية
if (!/^[a-zA-Z\s\-']+$/.test(trimmedName)) {
  throw new ValidationError(`${fieldName} contains invalid characters`, fieldName);
}
```

## الحل
تم تحديث الـ regex ليشمل الأحرف العربية باستخدام Unicode range:

```javascript
// الجديد - يدعم العربية والإنجليزية
if (!/^[a-zA-Z\u0600-\u06FF\s\-']+$/.test(trimmedName)) {
  throw new ValidationError(`${fieldName} contains invalid characters`, fieldName);
}
```

### Unicode Range للأحرف العربية
- `\u0600-\u06FF`: يشمل جميع الأحرف العربية الأساسية
- يتضمن: أ-ي، الهمزات، التشكيل، الأرقام العربية

## الملفات المعدلة

### 1. `server/utills/validation.js`

#### التعديل الأول: دالة `validateName` (السطر 170-192)
```javascript
validateName: (name, fieldName = 'name') => {
  // ... validation logic ...
  
  // Allow letters (including Arabic), spaces, hyphens, and apostrophes
  // Arabic Unicode range: \u0600-\u06FF
  if (!/^[a-zA-Z\u0600-\u06FF\s\-']+$/.test(trimmedName)) {
    throw new ValidationError(`${fieldName} contains invalid characters`, fieldName);
  }
  
  return trimmedName;
}
```

#### التعديل الثاني: دالة `validateCardholderName` (السطر 110-132)
```javascript
validateCardholderName: (name) => {
  // ... validation logic ...
  
  // Allow letters (including Arabic), spaces, hyphens, and apostrophes
  // Arabic Unicode range: \u0600-\u06FF
  if (!/^[a-zA-Z\u0600-\u06FF\s\-']+$/.test(trimmedName)) {
    throw new ValidationError('Cardholder name contains invalid characters', 'cardholderName');
  }
  
  return trimmedName;
}
```

## الحقول المتأثرة

### في صفحة Checkout
1. **الاسم الكامل** (`name`) - ✅ يدعم العربية الآن
2. **اسم العائلة** (`lastname`) - ✅ يدعم العربية الآن (للدفع الإلكتروني)

### في الدفع الإلكتروني (مستقبلاً)
3. **اسم حامل البطاقة** (`cardholderName`) - ✅ يدعم العربية الآن

### الحقول الأخرى
- **العنوان** (`address`) - كان يدعم العربية بالفعل ✅
- **المدينة** (`city`) - كان يدعم العربية بالفعل ✅
- **ملاحظات الطلب** (`orderNotice`) - كان يدعم العربية بالفعل ✅

## الأحرف المسموحة الآن

### للأسماء (name, lastname, cardholderName):
- ✅ الأحرف الإنجليزية: `A-Z`, `a-z`
- ✅ الأحرف العربية: `أ-ي` وجميع الأحرف العربية
- ✅ المسافات
- ✅ الشرطة: `-`
- ✅ الفاصلة العليا: `'`

### أمثلة على أسماء صحيحة:
- `محمد أحمد`
- `فاطمة الزهراء`
- `عبد الله`
- `Sarah Ahmed`
- `محمد-علي`
- `O'Connor`

## الأمان
- ✅ لا يزال الـ validation يحمي من XSS attacks
- ✅ يتحقق من طول الاسم (2-50 حرف)
- ✅ يمنع الأحرف الخاصة الخطرة
- ✅ يسمح فقط بالأحرف الآمنة

## الاختبار

### خطوات الاختبار:
1. ✅ افتح صفحة Checkout
2. ✅ أدخل اسماً عربياً في حقل "الاسم الكامل"
3. ✅ املأ باقي الحقول المطلوبة
4. ✅ اضغط على "تأكيد الطلب"
5. ✅ يجب أن يتم إنشاء الطلب بنجاح

### حالات الاختبار:
- [x] اسم عربي فقط: "محمد أحمد"
- [x] اسم إنجليزي فقط: "John Smith"
- [x] اسم مختلط: "محمد Ahmed"
- [x] اسم بشرطة: "عبد-الله"
- [x] اسم قصير (حرفين): "علي"
- [x] اسم طويل (50 حرف)

## التوافق مع الأنظمة الأخرى

### قاعدة البيانات
- ✅ PostgreSQL يدعم UTF-8 بشكل كامل
- ✅ حقول `TEXT` و `VARCHAR` تدعم Unicode

### Frontend
- ✅ React يدعم Unicode بشكل افتراضي
- ✅ لا حاجة لتغييرات في الـ frontend

### API
- ✅ Express.js يدعم UTF-8 في JSON
- ✅ لا حاجة لتغييرات في الـ middleware

## ملاحظات إضافية

### Unicode Ranges الأخرى (للمستقبل)
إذا احتجت لدعم لغات أخرى:
- **العربية الممتدة**: `\u0750-\u077F`
- **الفارسية**: `\u0600-\u06FF` (نفس العربية)
- **الأردية**: `\u0600-\u06FF` (نفس العربية)
- **الفرنسية**: `\u00C0-\u00FF` (Latin Extended)
- **الإسبانية**: `\u00C0-\u00FF` (Latin Extended)

### الأداء
- ✅ لا تأثير على الأداء
- ✅ Regex validation سريع جداً
- ✅ لا حاجة لـ caching

## التاريخ
- **التاريخ**: 2 فبراير 2025
- **النسخة**: v2.2.0
- **الحالة**: ✅ مكتمل ومختبر

## الملفات ذات الصلة
- `server/utills/validation.js` - ملف الـ validation الرئيسي
- `server/controllers/customer_orders.js` - يستخدم الـ validation
- `app/checkout/page.tsx` - صفحة الـ checkout