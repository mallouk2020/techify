# دليل النشر على Vercel

## التغييرات المُنفذة لإصلاح مشاكل البناء

### 1. إصلاح مشكلة TypeScript في NextAuth
- تم إضافة `as const` إلى `strategy: "jwt"` في `lib/auth-options.ts`
- تم استخدام `any` للمعاملات في callbacks لتجنب مشاكل التوافق

### 2. إصلاح مشكلة Prisma أثناء البناء
- تم تحويل استيراد Prisma إلى dynamic import في `lib/auth-options.ts`
- تم إضافة `export const dynamic = 'force-dynamic'` في API routes
- تم تبسيط `utils/db.ts` لإزالة التحققات التي تُنفذ أثناء البناء

### 3. تحديث Build Scripts
- تم إضافة `postinstall` script لتوليد Prisma Client تلقائياً
- تم تحديث `build` script ليشمل `prisma generate`

## خطوات النشر على Vercel

### 1. تأكد من إعداد المتغيرات البيئية في Vercel:
```
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=https://your-domain.vercel.app
```

### 2. تأكد من أن قاعدة البيانات متاحة من Vercel
- إذا كنت تستخدم قاعدة بيانات محلية، ستحتاج إلى استخدام خدمة سحابية مثل:
  - PlanetScale
  - Railway
  - Supabase
  - Neon
  - AWS RDS

### 3. قم بدفع التغييرات إلى Git:
```bash
git add .
git commit -m "Fix Vercel deployment issues"
git push
```

### 4. Vercel سيقوم تلقائياً بـ:
- تشغيل `yarn install` (الذي سيُشغل `postinstall` script)
- تشغيل `yarn build` (الذي سيُشغل `prisma generate && next build`)
- نشر التطبيق

## ملاحظات مهمة

### Dynamic Imports
تم استخدام dynamic import لـ Prisma في `authorize` function:
```typescript
const prisma = (await import("@/utils/db")).default;
```
هذا يضمن أن Prisma لا يتم تحميله أثناء وقت البناء، بل فقط عند الحاجة في runtime.

### Force Dynamic Routes
تم إضافة هذه الإعدادات في API routes:
```typescript
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
```
هذا يمنع Next.js من محاولة تنفيذ الكود أثناء البناء.

## استكشاف الأخطاء

### إذا واجهت خطأ "Prisma Client not initialized":
- تأكد من أن `postinstall` script موجود في `package.json`
- تأكد من أن Vercel يُشغل `prisma generate` أثناء البناء

### إذا واجهت خطأ في الاتصال بقاعدة البيانات:
- تأكد من أن `DATABASE_URL` مُعرّف في متغيرات البيئة في Vercel
- تأكد من أن قاعدة البيانات متاحة من خوادم Vercel
- تحقق من إعدادات SSL في connection string

### إذا واجهت أخطاء TypeScript:
- تأكد من أن جميع الملفات المُعدّلة تم دفعها إلى Git
- تحقق من أن `tsconfig.json` صحيح