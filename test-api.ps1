# Test API Script - اختبار API محلياً
# ====================================

Write-Host "================================" -ForegroundColor Cyan
Write-Host "   اختبار Backend API محلياً" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if server is running
Write-Host "[1/4] فحص السيرفر..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -Method GET -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ السيرفر يعمل بشكل صحيح" -ForegroundColor Green
        $healthData = $response.Content | ConvertFrom-Json
        Write-Host "   Status: $($healthData.status)" -ForegroundColor Gray
        Write-Host "   Timestamp: $($healthData.timestamp)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ السيرفر لا يعمل!" -ForegroundColor Red
    Write-Host "   تأكد من تشغيل السيرفر بالأمر: cd server; npm start" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Test 2: Check products endpoint
Write-Host "[2/4] فحص endpoint المنتجات..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/products" -Method GET -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Products API يعمل بشكل صحيح" -ForegroundColor Green
        $productsData = $response.Content | ConvertFrom-Json
        Write-Host "   عدد المنتجات: $($productsData.products.Count)" -ForegroundColor Gray
        Write-Host "   الصفحات: $($productsData.totalPages)" -ForegroundColor Gray
        
        if ($productsData.products.Count -gt 0) {
            Write-Host "   أول منتج: $($productsData.products[0].title)" -ForegroundColor Gray
        } else {
            Write-Host "⚠️  لا توجد منتجات في قاعدة البيانات" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "❌ فشل الاتصال بـ Products API" -ForegroundColor Red
    Write-Host "   الخطأ: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 3: Check categories endpoint
Write-Host "[3/4] فحص endpoint الفئات..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/categories" -Method GET -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Categories API يعمل بشكل صحيح" -ForegroundColor Green
        $categoriesData = $response.Content | ConvertFrom-Json
        Write-Host "   عدد الفئات: $($categoriesData.Count)" -ForegroundColor Gray
    }
} catch {
    Write-Host "⚠️  فشل الاتصال بـ Categories API" -ForegroundColor Yellow
    Write-Host "   الخطأ: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""

# Test 4: Check rate limiting info
Write-Host "[4/4] فحص معلومات Rate Limiting..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/rate-limit-info" -Method GET -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Rate Limiting مفعّل" -ForegroundColor Green
        $rateLimitData = $response.Content | ConvertFrom-Json
        Write-Host "   General: $($rateLimitData.general)" -ForegroundColor Gray
        Write-Host "   Products: $($rateLimitData.products)" -ForegroundColor Gray
    }
} catch {
    Write-Host "⚠️  فشل الاتصال بـ Rate Limit Info" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "   ✅ الاختبار انتهى بنجاح!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 الخطوة التالية:" -ForegroundColor Yellow
Write-Host "   إذا كان كل شيء يعمل محلياً، المشكلة في Vercel فقط" -ForegroundColor White
Write-Host "   اتبع التعليمات في ملف: VERCEL_FIX.md" -ForegroundColor Cyan
Write-Host ""