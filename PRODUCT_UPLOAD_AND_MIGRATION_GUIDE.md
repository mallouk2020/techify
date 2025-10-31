# 📦 دليل رفع المنتجات وتحديث قاعدة البيانات

## نظرة عامة
- **نطاق الدليل**: يشرح هذا الملف كيفية إعداد المخطط (Schema)، إدارة الهجرات (Migrations)، والتعامل مع واجهات الـ API المرتبطة برفع المنتجات تلقائيًا في مشروع Techify.
- **خلفية**: يجمع هذا الدليل المعلومات الموثوقة من `README.md` بعد مراجعتها وتحديثها لتتوافق مع البنية الحالية للمشروع.

## مخطط قاعدة البيانات (Prisma Schema)
### نموذج المنتج Product
- **المصدر**: `server/prisma/schema.prisma:11-31`
- **الحقول الأساسية**:
  - `id` (UUID تلقائي)
  - `slug` (فريد)
  - `title`
  - `mainImage`
  - `price` (افتراضي 0)
  - `description`
  - `manufacturer`
  - `categoryId`
- **حقول المخزون والتقييم**:
  - `inStock` (افتراضي 1)
  - `stock` (اختياري)
  - `rating` (افتراضي 0)
  - `ratingCount` (اختياري)
- **مجالات إضافية**:
  - `oldPrice`, `colors`, `sizes`, `shippingCost`
- **العلاقات**:
  - `category` → `Category`
  - `customerOrders` → `customer_order_product`
  - `Wishlist` → `Wishlist`

### نماذج مساندة مهمة
- **Category**: ربط المنتجات بالفئات مع حقل `name` الفريد `server/prisma/schema.prisma:88-92`.
- **Image**: لحفظ صور إضافية مرتبطة بالمنتج `server/prisma/schema.prisma:33-37`.
- **customer_order_product**: يتضمن الحقول `selectedColor` و`selectedSize` لتفاصيل الطلب `server/prisma/schema.prisma:77-86`.

## إدارة الهجرات (Migrations)
### أوامر Prisma القياسية
1. **توليد العميل**:
   ```bash
   cd server
   npx prisma generate
   ```
2. **إنشاء Migration جديد أثناء التطوير**:
   ```bash
   cd server
   npx prisma migrate dev --name "اسم-التعديل"
   ```
3. **تطبيق الهجرات الموجودة على بيئة الإنتاج**:
   ```bash
   cd server
   npx prisma migrate deploy
   ```
- **تحذير**: لا تستخدم `npx prisma db push` على قاعدة بيانات تحتوي بيانات منتجة (راجع `README.md:372-402`).

### سكربت الهجرة الخاص بـ Railway
- **المصدر**: `server/migrate-railway.js:10-188`.
- **المهام**:
  - إضافة الأعمدة `oldPrice`, `ratingCount`, `stock`, `colors`, `sizes`, `shippingCost` إلى جدول `Product` عند الحاجة.
  - إضافة `selectedColor`, `selectedSize` لجدول `customer_order_product`.
  - إنشاء جدول `HeroSection` وتعبئته ببيانات افتراضية إن كان فارغًا.
  - تحديث جدول `User` بحقوق `name`, `phone`, `address`, `createdAt`, `updatedAt`.
  - ربط `Customer_order` بالمستخدم عبر `userId` مع فهرس ومفتاح أجنبي.
- **التشغيل**: يتم استدعاء السكربت من `server/package.json` عبر سكربت `postinstall` لضمان التوافق مع بيئة Railway.

## واجهات الـ API الخاصة بالمنتجات
### المسارات الرئيسية
- **ملف الراوتر**: `server/routes/products.js:3-20`.
- **المسارات المتاحة**:
  1. `GET /api/products` → يدعم التصفية، الفرز، والصفحات. استخدم `mode=admin` للحصول على القائمة كاملة بدون قيود (`server/controllers/products.js:72-246`).
  2. `POST /api/products` → إنشاء منتج جديد (`server/controllers/products.js:262-306`).
  3. `GET /api/products/:id` → استرجاع منتج محدد مع بيانات الفئة (`server/controllers/products.js:432-452`).
  4. `PUT /api/products/:id` → تحديث منتج (`server/controllers/products.js:308-369`).
  5. `DELETE /api/products/:id` → حذف منتج مع تنظيف العلاقات (`server/controllers/products.js:372-399`).
  6. `GET /api/search?query=` → بحث نصي في العنوان والوصف (`server/controllers/products.js:405-429`).

### نموذج طلب إنشاء منتج
```json
{
  "slug": "unique-product-slug",
  "title": "Product Title",
  "mainImage": "https://...",
  "price": 350,
  "oldPrice": 420,
  "rating": 5,
  "ratingCount": 12,
  "description": "Detailed description",
  "manufacturer": "Brand",
  "categoryId": "existing-category-uuid",
  "inStock": 1,
  "stock": 50,
  "colors": "[\"black\", \"silver\"]",
  "sizes": "[\"128GB\", \"256GB\"]",
  "shippingCost": 25
}
```
- **حقول مطلوبة**: `slug`, `title`, `mainImage`, `price`, `categoryId`.
- **تنسيق الحقول المركبة**: يتم إرسال `colors` و`sizes` كسلاسل JSON نظرًا لتعريفها كسلاسل نصية في المخطط.
- **المخرجات**: يعيد النموذج كامل البيانات بما في ذلك المعرف UUID الجديد.

### اعتبارات أمنية ومحددات الواجهة
- **تصفية آمنة**: يتم التحقق من أنواع الفلاتر والمشغلين (`server/controllers/products.js:4-170`).
- **محددات الفرز**: مجموعة محددة مسبقًا (`defaultSort`, `titleAsc`, `titleDesc`, `lowPrice`, `highPrice`).
- **المحددات للمخزون**: استخدم `filters[inStock][equals]=1` أو `filters[outOfStock][equals]=1` لانتقاء النتائج.

## خطوات البوت لرفع منتج جديد
1. **الحصول على معرف الفئة**:
   - نداء `GET /api/categories`، ثم اختيار الفئة المناسبة.
2. **تحضير بيانات المنتج**:
   - تأكد من وجود صورة رئيسية (`mainImage`) على Cloudinary أو تم رفعها مسبقًا عبر `POST /api/main-image`.
   - قم بتحويل القوائم مثل الألوان والأحجام إلى JSON string.
3. **إرسال الطلب**:
   - استخدم `POST /api/products` بالحقول المطلوبة.
4. **التحقق**:
   - استدعِ `GET /api/products?mode=admin` أو `GET /api/products/:id` للتأكد من نجاح الإدخال.
5. **تحديثات لاحقة** (اختياري):
   - لتعديل حقل لاحقًا استخدم `PUT /api/products/:id` بنفس البنية.
6. **تنظيف العلاقات عند الحذف**:
   - استدعاء `DELETE /api/products/:id` سيحذف تلقائيًا السجلات المتعلقة بالطلبات والقوائم الأمنية حسب المنطق في `server/controllers/products.js:380-392`.

## تشغيل الهجرات في بيئات مختلفة
1. **البيئة المحلية**:
   - طبق `npx prisma migrate dev` بعد أي تعديل على `schema.prisma`.
   - استخدم `npx prisma studio` للتأكد من البيانات.
2. **بيئة الإنتاج (Railway)**:
   - تأكد من أن سكربت `migrate-railway.js` مُحدّث ويحتوي على التعديلات الجديدة.
   - عند النشر، يتم تنفيذ السكربت عبر `postinstall` ويضيف الأعمدة عند الحاجة.
   - يمكن تشغيله يدويًا عند الضرورة:
     ```bash
     cd server
     node migrate-railway.js
     ```
3. **التحقق بعد النشر**:
   - راقب سجلات Railway للتأكد من ظهور رسائل `✅ Migration completed successfully!`.
   - اختبر واجهة `GET /api/products` للتأكد من وجود الحقول الجديدة.

## المتغيرات البيئية الضرورية
- **`DATABASE_URL`**: مطلوب لتشغيل Prisma مع SSL (راجع `server/utills/db.js:4-33`).
- **عناوين الـ API العامة**: يجب أن يشير `NEXT_PUBLIC_API_BASE_URL` إلى خادم Railway النشط (`README.md:221-240`).

## قائمة تحقق للرفع الآلي
1. **تحقق من صحة البيانات المدخلة** (عدم تكرار `slug`, التأكد من `categoryId`).
2. **تأكد من تحديث المخطط محليًا وتشغيل الهجرات**.
3. **راقب تنفيذ سكربت الهجرة عند النشر**.
4. **اختبر نقطة النهاية `/api/products` بعد أي تعديل كبير**.
5. **احفظ سجل الطلبات الناجحة والفاشلة للبوت لتحليل المشاكل**.

## مصادر إضافية
- **التحقق من الاتصال**: استعمل `/health` لمراقبة حالة الخادم (`server/app.js:147-155`).
- **القيود الأمنية**: يتم تطبيق الـ Rate Limiting على `/api/products` من خلال `productLimiter` (`server/app.js:118-142`).
- **إدارة أخطاء الخادم**: جميع الأخطاء تمر عبر `handleServerError` لضمان رسائل واضحة (`server/app.js:180-183`).
