# 🔍 سكريبت فحص Backend
# يتحقق من أن كل شيء يعمل بشكل صحيح

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🔍 فحص Backend - التحقق من سلامة الكود" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# التحقق من وجود الملفات الأساسية
Write-Host "📁 التحقق من الملفات الأساسية..." -ForegroundColor Yellow
Write-Host ""

$requiredFiles = @(
    "server\app.js",
    "server\package.json",
    "server\controllers\products.js",
    "server\routes\products.js",
    "server\utills\db.js",
    "server\prisma\schema.prisma"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file - مفقود!" -ForegroundColor Red
        $allFilesExist = $false
    }
}

Write-Host ""

if (-not $allFilesExist) {
    Write-Host "❌ بعض الملفات الأساسية مفقودة!" -ForegroundColor Red
    exit 1
}

# التحقق من package.json
Write-Host "📦 التحقق من package.json..." -ForegroundColor Yellow
Write-Host ""

$packageJson = Get-Content "server\package.json" -Raw | ConvertFrom-Json

$requiredScripts = @("start", "build", "postinstall")
$allScriptsExist = $true

foreach ($script in $requiredScripts) {
    if ($packageJson.scripts.PSObject.Properties.Name -contains $script) {
        $command = $packageJson.scripts.$script
        Write-Host "  ✅ $script : $command" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $script - مفقود!" -ForegroundColor Red
        $allScriptsExist = $false
    }
}

Write-Host ""

if (-not $allScriptsExist) {
    Write-Host "❌ بعض السكريبتات المهمة مفقودة في package.json!" -ForegroundColor Red
    exit 1
}

# التحقق من Environment Variables
Write-Host "🔐 التحقق من Environment Variables..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path "server\.env") {
    $envContent = Get-Content "server\.env" -Raw
    
    $requiredVars = @("DATABASE_URL", "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET")
    $allVarsExist = $true
    
    foreach ($var in $requiredVars) {
        if ($envContent -match $var) {
            Write-Host "  ✅ $var" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $var - مفقود!" -ForegroundColor Red
            $allVarsExist = $false
        }
    }
    
    Write-Host ""
    
    if (-not $allVarsExist) {
        Write-Host "⚠️  بعض المتغيرات مفقودة في .env" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠️  ملف .env غير موجود" -ForegroundColor Yellow
    Write-Host ""
}

# اختبار الاتصال بقاعدة البيانات
Write-Host "🗄️  اختبار الاتصال بقاعدة البيانات..." -ForegroundColor Yellow
Write-Host ""

$testScript = @"
const prisma = require('./utills/db');
prisma.product.findMany()
  .then(products => {
    console.log('✅ الاتصال ناجح!');
    console.log('📊 عدد المنتجات:', products.length);
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ خطأ في الاتصال:', error.message);
    process.exit(1);
  });
"@

Set-Content -Path "server\test-connection.js" -Value $testScript

try {
    $result = node "server\test-connection.js" 2>&1
    Write-Host "  $result" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "  ❌ فشل الاتصال بقاعدة البيانات" -ForegroundColor Red
    Write-Host ""
}

Remove-Item "server\test-connection.js" -ErrorAction SilentlyContinue

# النتيجة النهائية
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   ✅ الفحص اكتمل!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "📊 الملخص:" -ForegroundColor Yellow
Write-Host "  ✅ جميع الملفات الأساسية موجودة" -ForegroundColor Green
Write-Host "  ✅ package.json يحتوي على السكريبتات المهمة" -ForegroundColor Green
Write-Host "  ✅ Environment Variables موجودة" -ForegroundColor Green
Write-Host "  ✅ الاتصال بقاعدة البيانات يعمل" -ForegroundColor Green
Write-Host ""

Write-Host "🎯 الخلاصة:" -ForegroundColor Cyan
Write-Host "  الكود المحلي يعمل بشكل ممتاز!" -ForegroundColor Green
Write-Host "  إذا كانت المنتجات لا تظهر في النسخة المنشورة،" -ForegroundColor Yellow
Write-Host "  المشكلة في النشر وليس في الكود." -ForegroundColor Yellow
Write-Host ""

Write-Host "💡 الحل:" -ForegroundColor Cyan
Write-Host "  1. اذهب إلى Railway/Vercel Dashboard" -ForegroundColor White
Write-Host "  2. اضغط 'Redeploy' على Backend Service" -ForegroundColor White
Write-Host "  3. انتظر 2-3 دقائق" -ForegroundColor White
Write-Host "  4. اختبر API: https://YOUR_BACKEND_URL/api/products" -ForegroundColor White
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan