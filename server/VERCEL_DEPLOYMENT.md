# 🚀 نشر Express API على Vercel (مجاناً)

## الخطوات:

### 1. افتح Vercel Dashboard
https://vercel.com/dashboard

### 2. أنشئ مشروع جديد
- اضغط **"Add New..."** → **"Project"**
- اختر repository الخاص بك من GitHub
- اضغط **"Import"**

### 3. إعدادات المشروع

#### **Root Directory:**
```
server
```
(مهم جداً! لأن Express موجود في مجلد `/server`)

#### **Framework Preset:**
```
Other
```

#### **Build Command:**
```
npm run build
```

#### **Output Directory:**
اتركه فارغاً

#### **Install Command:**
```
npm install
```

### 4. Environment Variables

أضف هذه المتغيرات:

```
DATABASE_URL=postgresql://postgres:wsjDmiydmSrKGhgENkHtbkYtUsDuAyMk@mainline.proxy.rlwy.net:12269/railway
NODE_ENV=production
```

### 5. اضغط Deploy

Vercel سيبني ويرفع Express API تلقائياً!

---

## 📝 بعد النشر:

### ستحصل على رابط مثل:
```
https://techify-api.vercel.app
```

### حدّث المتغير البيئي في مشروع Next.js:

في Vercel Dashboard للمشروع الرئيسي (techify-beta):
```
NEXT_PUBLIC_API_BASE_URL=https://techify-api.vercel.app
```

ثم أعد النشر.

---

## ✅ اختبار API:

افتح:
```
https://techify-api.vercel.app/health
```

يجب أن ترى:
```json
{
  "status": "OK",
  "timestamp": "2025-01-30T...",
  "rateLimiting": "enabled"
}
```

---

## 🎉 تم!

الآن المنتجات ستظهر على الموقع! 🚀