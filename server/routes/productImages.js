const express = require('express')
const router = express.Router()
const {
  getSingleProductImages,
  createImage,
  updateImage,
  deleteImage,
  uploadProductImages,
  deleteSingleImage
} = require('../controllers/productImages')

// جلب صور منتج معين
router.route('/:id').get(getSingleProductImages); 

// إنشاء صورة واحدة (الطريقة القديمة)
router.route('/').post(createImage);

// رفع صور متعددة للمنتج (الطريقة الجديدة)
router.route('/upload').post(uploadProductImages);

// تحديث صورة
router.route('/:id').put(updateImage);

// حذف جميع صور منتج معين
router.route('/:id').delete(deleteImage);

// حذف صورة واحدة بناءً على imageID
router.route('/single/:imageID').delete(deleteSingleImage);

module.exports = router
