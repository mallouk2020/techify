# سكريبت تجهيز المشروع لـ GitHub
# Prepare Project for GitHub Script

Write-Host "🔧 تجهيز المشروع لـ GitHub..." -ForegroundColor Cyan
Write-Host ""

# 1. التحقق من Git
Write-Host "📋 الخطوة 1: التحقق من Git..." -ForegroundColor Yellow
if (Get-Command git -ErrorAction SilentlyContinue) {
    Write-Host "✅ Git مثبت" -ForegroundColor Green
} else {
    Write-Host "❌ Git غير مثبت! يرجى تثبيت Git أولاً" -ForegroundColor Red
    Write-Host "تحميل Git من: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# 2. تهيئة Git Repository
Write-Host "📦 الخطوة 2: تهيئة Git Repository..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "⚠️  Git repository موجود بالفعل" -ForegroundColor Yellow
} else {
    git init
    Write-Host "✅ تم تهيئة Git repository" -ForegroundColor Green
}

Write-Host ""

# 3. إضافة الملفات
Write-Host "📁 الخطوة 3: إضافة الملفات..." -ForegroundColor Yellow
git add .
Write-Host "✅ تم إضافة جميع الملفات" -ForegroundColor Green

Write-Host ""

# 4. إنشاء Commit
Write-Host "💾 الخطوة 4: إنشاء Commit..." -ForegroundColor Yellow
git commit -m "Initial commit - E-commerce with COD system ready for deployment"
Write-Host "✅ تم إنشاء Commit" -ForegroundColor Green

Write-Host ""

# 5. تعيين Branch الرئيسي
Write-Host "🌿 الخطوة 5: تعيين Branch الرئيسي..." -ForegroundColor Yellow
git branch -M main
Write-Host "✅ تم تعيين main كـ branch رئيسي" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 المشروع جاهز للرفع على GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "الخطوات التالية:" -ForegroundColor Cyan
Write-Host "1. أنشئ repository جديد على GitHub" -ForegroundColor White
Write-Host "2. انسخ رابط الـ repository" -ForegroundColor White
Write-Host "3. نفذ الأوامر التالية:" -ForegroundColor White
Write-Host ""
Write-Host "   git remote add origin YOUR_REPO_URL" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "بعد رفع المشروع، يمكنك نشره على Railway أو Vercel" -ForegroundColor Cyan
Write-Host "راجع ملف START_HERE.md للتفاصيل" -ForegroundColor Cyan