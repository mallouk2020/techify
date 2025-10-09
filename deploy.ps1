# سكريبت النشر السريع - Quick Deployment Script
# هذا السكريبت يساعدك على نشر التطبيق بسرعة

Write-Host "🚀 بدء عملية النشر - Starting Deployment Process" -ForegroundColor Green
Write-Host ""

# 1. تحديث قاعدة البيانات
Write-Host "📊 الخطوة 1: تحديث قاعدة البيانات..." -ForegroundColor Yellow
npx prisma generate
npx prisma db push

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ فشل تحديث قاعدة البيانات!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ تم تحديث قاعدة البيانات بنجاح" -ForegroundColor Green
Write-Host ""

# 2. بناء التطبيق
Write-Host "🔨 الخطوة 2: بناء التطبيق..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ فشل بناء التطبيق!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ تم بناء التطبيق بنجاح" -ForegroundColor Green
Write-Host ""

# 3. اختبار البناء
Write-Host "🧪 الخطوة 3: اختبار البناء..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Write-Host "✅ مجلد .next موجود" -ForegroundColor Green
} else {
    Write-Host "❌ مجلد .next غير موجود!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 التطبيق جاهز للنشر!" -ForegroundColor Green
Write-Host ""
Write-Host "الخطوات التالية:" -ForegroundColor Cyan
Write-Host "1. تأكد من إعداد متغيرات البيئة في منصة النشر" -ForegroundColor White
Write-Host "2. ارفع الكود إلى GitHub" -ForegroundColor White
Write-Host "3. اربط المشروع مع Vercel أو Railway" -ForegroundColor White
Write-Host ""
Write-Host "للمزيد من التفاصيل، راجع ملف DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow