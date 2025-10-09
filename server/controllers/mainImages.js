// server/controllers/mainImages.js
const cloudinary = require("../config/cloudinary");
const { v4: uuidv4 } = require("uuid");

const uploadMainImage = async (req, res) => {
  try {
    if (!req.files || !req.files.uploadedFile) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const file = req.files.uploadedFile;

    // التحقق من نوع الملف
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Only image files are allowed (jpg, png, webp)"
      });
    }

    // رفع الصورة إلى Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath || file.data, {
      folder: "techify/products", // مجلد في Cloudinary
      public_id: `product-${Date.now()}-${uuidv4()}`, // اسم فريد
      resource_type: "image",
      transformation: [
        { width: 1000, height: 1000, crop: "limit" }, // تصغير الصورة إذا كانت كبيرة
        { quality: "auto" } // ضغط تلقائي
      ]
    });

    // ✅ إرجاع رابط الصورة من Cloudinary
    res.status(200).json({
      success: true,
      filename: result.secure_url, // ← رابط الصورة الكامل من Cloudinary
      publicId: result.public_id, // ← معرف الصورة (للحذف لاحقاً)
      message: "File uploaded successfully"
    });

  } catch (error) {
    console.error("Unexpected error in uploadMainImage:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = { uploadMainImage };