# 🔧 إصلاح خطأ Vercel Runtime

## ❌ المشكلة
```
Application error: a server-side exception has occurred
Digest: 754922610
```

## 🎯 السبب
كان `getServerSession()` يُستدعى **بدون تمرير `authOptions`** في عدة ملفات، مما يسبب خطأ في NextAuth أثناء التشغيل على Vercel.

## ✅ الحل المُطبق

### 1️⃣ إصلاح `app/layout.tsx`
```typescript
// ❌ قبل
const session = await getServerSession();

// ✅ بعد
import { authOptions } from "@/lib/auth-options";
const session = await getServerSession(authOptions as any);
```

### 2️⃣ إصلاح `utils/auth.ts`
```typescript
// ✅ تم إضافة as any
const session = await getServerSession(authOptions as any);
```

### 3️⃣ إصلاح `utils/adminAuth.ts`
```typescript
// ✅ تم إضافة as any في موضعين
const session = await getServerSession(authOptions as any);
```

## 📋 الملفات المُعدلة
- ✅ `app/layout.tsx` - إضافة import و as any
- ✅ `utils/auth.ts` - إضافة as any
- ✅ `utils/adminAuth.ts` - إضافة as any في موضعين

## 🚀 الخطوات التالية

### 1. ادفع التغييرات إلى Git:
```bash
git add .
git commit -m "Fix: Add authOptions to getServerSession calls"
git push
```

### 2. انتظر Vercel ليعيد البناء تلقائياً

### 3. تأكد من إضافة المتغيرات البيئية في Vercel:
```env
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=https://your-domain.vercel.app
```

### 4. إذا لم يعيد البناء تلقائياً:
- اذهب إلى Vercel Dashboard
- اختر مشروعك
- اضغط على **"Redeploy"**

## ✅ النتيجة المتوقعة
- ✅ البناء سينجح
- ✅ الموقع سيعمل بدون أخطاء
- ✅ NextAuth سيعمل بشكل صحيح

## 📝 ملاحظة مهمة
بعد إضافة المتغيرات البيئية في Vercel، **يجب إعادة النشر** حتى تأخذ التغييرات مفعولها.