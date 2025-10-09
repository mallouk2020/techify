# 🚀 انشر التطبيق الآن - Deploy Now

## خيار سريع: النشر على Railway في 5 دقائق

### الخطوة 1️⃣: رفع المشروع على GitHub

```powershell
# نفذ هذا السكريبت
.\prepare-for-github.ps1
```

أو يدوياً:
```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

---

### الخطوة 2️⃣: النشر على Railway

1. **اذهب إلى:** https://railway.app
2. **سجل دخول** بحساب GitHub
3. **اضغط "New Project"**
4. **اختر "Deploy from GitHub repo"**
5. **اختر المشروع** من القائمة

---

### الخطوة 3️⃣: إضافة قاعدة البيانات

1. في نفس المشروع، اضغط **"New"**
2. اختر **"Database"** → **"PostgreSQL"**
3. انتظر حتى يتم إنشاء القاعدة
4. انسخ **DATABASE_URL** من تبويب "Variables"

---

### الخطوة 4️⃣: إعداد Backend

1. اضغط على service الـ Backend
2. اذهب إلى **"Variables"**
3. أضف المتغيرات التالية:

```env
DATABASE_URL=postgresql://... (انسخه من قاعدة البيانات)
NODE_ENV=production
PORT=3001
CLOUDINARY_CLOUD_NAME=dkfsmireh
CLOUDINARY_API_KEY=892838395419967
CLOUDINARY_API_SECRET=VisYWzfcfg6YU04i7jMYTdJJr50
```

4. في **"Settings"** → **"Root Directory"** → اكتب: `server`
5. اضغط **"Deploy"**

---

### الخطوة 5️⃣: إعداد Frontend

1. اضغط **"New"** → **"GitHub Repo"** (نفس الـ repo)
2. اذهب إلى **"Variables"**
3. أضف المتغيرات التالية:

```env
DATABASE_URL=postgresql://... (نفس الرابط)
NEXTAUTH_SECRET=12D16C923BA17672F89B18C1DB22A
NEXTAUTH_URL=https://YOUR-FRONTEND-URL.railway.app
NEXT_PUBLIC_API_BASE_URL=https://YOUR-BACKEND-URL.railway.app
```

4. **Root Directory** اتركه فارغ (المجلد الرئيسي)
5. اضغط **"Deploy"**

---

### الخطوة 6️⃣: الحصول على الروابط

1. **Backend URL:**
   - اذهب لـ Backend service
   - تبويب "Settings" → "Networking"
   - اضغط "Generate Domain"
   - انسخ الرابط (مثل: `https://backend-production-xxxx.railway.app`)

2. **Frontend URL:**
   - اذهب لـ Frontend service
   - تبويب "Settings" → "Networking"
   - اضغط "Generate Domain"
   - انسخ الرابط (مثل: `https://frontend-production-xxxx.railway.app`)

3. **حدّث المتغيرات:**
   - ارجع لـ Frontend Variables
   - حدّث `NEXTAUTH_URL` بـ Frontend URL
   - حدّث `NEXT_PUBLIC_API_BASE_URL` بـ Backend URL
   - اضغط "Redeploy"

---

## ✅ تم النشر!

الآن تطبيقك متاح على الإنترنت! 🎉

### اختبر التطبيق:
- افتح Frontend URL في المتصفح
- جرب إضافة منتج للسلة
- اذهب لصفحة الدفع
- أكمل طلب COD

---

## 🔧 حل المشاكل

### مشكلة: Build Failed
**الحل:** تحقق من الـ logs في Railway Dashboard

### مشكلة: Database Connection Error
**الحل:** تأكد من `DATABASE_URL` صحيح في كل من Frontend و Backend

### مشكلة: API Not Working
**الحل:** تأكد من `NEXT_PUBLIC_API_BASE_URL` يشير لـ Backend URL الصحيح

---

## 📊 المراقبة

### عرض Logs:
1. اذهب للـ service في Railway
2. تبويب "Deployments"
3. اضغط على آخر deployment
4. شاهد الـ logs

---

## 💰 التكلفة

Railway يوفر:
- ✅ **$5 رصيد مجاني شهرياً**
- ✅ كافي لتطبيق صغير-متوسط
- ✅ بدون بطاقة ائتمان للبداية

---

## 🎯 الخطوات التالية

بعد النشر الناجح:
1. ✅ اختبر جميع الميزات
2. ✅ أضف domain مخصص (اختياري)
3. ✅ فعّل SSL (تلقائي في Railway)
4. ✅ راقب الأداء والـ logs

---

**🚀 ابدأ الآن! النشر يستغرق 5 دقائق فقط!**