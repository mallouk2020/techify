// migrate-images-to-cloudinary.js
// سكريبت لرفع الصور المحلية إلى Cloudinary وتحديث قاعدة البيانات

require('dotenv').config();
const cloudinary = require('./config/cloudinary');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function migrateImages() {
  console.log('🚀 بدء عملية نقل الصور إلى Cloudinary...\n');

  try {
    // 1. جلب جميع المنتجات من قاعدة البيانات
    const products = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        mainImage: true
      }
    });

    console.log(`📊 تم العثور على ${products.length} منتج\n`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    // 2. معالجة كل منتج
    for (const product of products) {
      console.log(`\n📦 معالجة: ${product.title}`);
      console.log(`   الصورة الحالية: ${product.mainImage}`);

      // تخطي إذا كانت الصورة فارغة
      if (!product.mainImage) {
        console.log('   ⏭️  تخطي: لا توجد صورة');
        skipCount++;
        continue;
      }

      // تخطي إذا كانت الصورة بالفعل على Cloudinary
      if (product.mainImage.includes('cloudinary.com')) {
        console.log('   ✅ تخطي: الصورة بالفعل على Cloudinary');
        skipCount++;
        continue;
      }

      // تخطي إذا كانت الصورة placeholder
      if (product.mainImage.includes('placeholder')) {
        console.log('   ⏭️  تخطي: صورة placeholder');
        skipCount++;
        continue;
      }

      try {
        // 3. بناء مسار الملف المحلي
        const localImagePath = path.join(__dirname, 'public', 'uploads', product.mainImage);

        // التحقق من وجود الملف
        if (!fs.existsSync(localImagePath)) {
          console.log(`   ❌ خطأ: الملف غير موجود في ${localImagePath}`);
          errorCount++;
          continue;
        }

        console.log(`   📤 رفع الصورة إلى Cloudinary...`);

        // 4. رفع الصورة إلى Cloudinary
        const result = await cloudinary.uploader.upload(localImagePath, {
          folder: 'techify/products',
          public_id: `product-${product.id}-${Date.now()}`,
          resource_type: 'image',
          transformation: [
            { width: 1000, height: 1000, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        });

        console.log(`   ✅ تم الرفع: ${result.secure_url}`);

        // 5. تحديث قاعدة البيانات
        await prisma.product.update({
          where: { id: product.id },
          data: { mainImage: result.secure_url }
        });

        console.log(`   ✅ تم تحديث قاعدة البيانات`);
        successCount++;

      } catch (error) {
        console.log(`   ❌ خطأ في معالجة الصورة: ${error.message}`);
        errorCount++;
      }
    }

    // 6. عرض الملخص
    console.log('\n\n' + '='.repeat(50));
    console.log('📊 ملخص العملية:');
    console.log('='.repeat(50));
    console.log(`✅ نجح: ${successCount} صورة`);
    console.log(`⏭️  تم التخطي: ${skipCount} صورة`);
    console.log(`❌ فشل: ${errorCount} صورة`);
    console.log(`📦 الإجمالي: ${products.length} منتج`);
    console.log('='.repeat(50));

    if (successCount > 0) {
      console.log('\n✅ تم نقل الصور بنجاح!');
      console.log('💡 يمكنك الآن حذف مجلد server/public/uploads إذا أردت');
    }

  } catch (error) {
    console.error('\n❌ خطأ عام:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// تشغيل السكريبت
migrateImages();