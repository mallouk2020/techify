# 🚀 دليل نشر التطبيق - Deployment Guide

## 📋 المتطلبات الأساسية

- Node.js 18+ و npm
- قاعدة بيانات PostgreSQL
- حساب على منصة النشر (Vercel أو Railway)

---

## 🔧 الإعداد للنشر

### 1. تحديث قاعدة البيانات

```bash
npx prisma db push
npx prisma generate
```

### 2. بناء التطبيق

```bash
npm run build
```

---

## 🌐 النشر على Vercel

### Frontend (Next.js)

1. **تسجيل الدخول إلى Vercel:**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **نشر التطبيق:**
   ```bash
   vercel --prod
   ```

3. **إضافة متغيرات البيئة في Vercel Dashboard:**
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `NEXT_PUBLIC_API_BASE_URL`
   - `DATABASE_URL`

### Backend (Node.js)

1. **الانتقال لمجلد server:**
   ```bash
   cd server
   ```

2. **نشر Backend:**
   ```bash
   vercel --prod
   ```

3. **إضافة متغيرات البيئة:**
   - `DATABASE_URL`
   - `PORT`
   - `NODE_ENV=production`

---

## 🚂 النشر على Railway

### 1. إنشاء مشروع جديد

1. اذهب إلى [railway.app](https://railway.app)
2. اضغط "New Project"
3. اختر "Deploy from GitHub repo"

### 2. إعداد قاعدة البيانات

1. اضغط "New" → "Database" → "PostgreSQL"
2. انسخ `DATABASE_URL` من الإعدادات

### 3. إعداد Backend

1. أضف service جديد من GitHub repo
2. اختر مجلد `server` كـ Root Directory
3. أضف متغيرات البيئة:
   ```
   DATABASE_URL=postgresql://...
   PORT=3001
   NODE_ENV=production
   ```

### 4. إعداد Frontend

1. أضف service جديد من نفس الـ repo
2. اختر المجلد الرئيسي كـ Root Directory
3. أضف متغيرات البيئة:
   ```
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-domain.railway.app
   NEXT_PUBLIC_API_BASE_URL=https://your-backend.railway.app
   DATABASE_URL=postgresql://...
   ```

---

## ✅ التحقق من النشر

### اختبار Backend:
```bash
curl https://your-backend-url.com/api/health
```

### اختبار Frontend:
افتح المتصفح واذهب إلى:
```
https://your-frontend-url.com
```

---

## 🔐 الأمان

### قبل النشر تأكد من:

1. ✅ تغيير `NEXTAUTH_SECRET` إلى قيمة قوية
2. ✅ استخدام HTTPS في الإنتاج
3. ✅ تفعيل CORS بشكل صحيح
4. ✅ إخفاء جميع المفاتيح السرية
5. ✅ تفعيل Rate Limiting

---

## 📊 المراقبة

### Logs في Railway:
```bash
railway logs
```

### Logs في Vercel:
اذهب إلى Dashboard → Deployments → View Logs

---

## 🐛 حل المشاكل الشائعة

### مشكلة: Database connection failed
**الحل:** تحقق من `DATABASE_URL` في متغيرات البيئة

### مشكلة: 404 on API routes
**الحل:** تأكد من `NEXT_PUBLIC_API_BASE_URL` صحيح

### مشكلة: Build failed
**الحل:** 
```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من الـ logs
2. راجع متغيرات البيئة
3. تأكد من اتصال قاعدة البيانات

---

## 🎉 تم النشر بنجاح!

الآن تطبيقك متاح على الإنترنت ويمكن للعملاء استخدامه! 🚀