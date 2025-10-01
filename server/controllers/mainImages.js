// server/controllers/mainImages.js
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid"); // نحتاج لتوليد أسماء فريدة

// تأكد من تثبيت uuid: npm install uuid

const uploadMainImage = (req, res) => {
  try {
    if (!req.files || !req.files.uploadedFile) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const file = req.files.uploadedFile;

    // التحقق من نوع الملف (اختياري لكن موصى به)
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Only image files are allowed (jpg, png, webp)"
      });
    }

    // إنشاء اسم فريد للملف
    const fileExtension = path.extname(file.name).toLowerCase();
    const uniqueFilename = `${Date.now()}-${uuidv4()}${fileExtension}`;
    
    // مسار الحفظ
    const uploadDir = path.join(__dirname, "..", "public", "uploads");
    
    // تأكد من وجود المجلد
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadPath = path.join(uploadDir, uniqueFilename);

    // حفظ الملف
    file.mv(uploadPath, (err) => {
      if (err) {
        console.error("File move error:", err);
        return res.status(500).json({
          success: false,
          message: "File upload failed",
          error: err.message
        });
      }

      // ✅ إرجاع الاستجابة بالشكل المتوقع في الواجهة
      res.status(200).json({
        success: true,
        filename: uniqueFilename, // ← الاسم الفعلي على السيرفر
        message: "File uploaded successfully"
      });
    });
  } catch (error) {
    console.error("Unexpected error in uploadMainImage:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = { uploadMainImage };