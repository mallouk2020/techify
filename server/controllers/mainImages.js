// server/controllers/mainImages.js
const cloudinary = require("../config/cloudinary");
const { v4: uuidv4 } = require("uuid");

const uploadMainImage = async (req, res) => {
  try {
    // التحقق من وجود الملف
    if (!req.files || !req.files.uploadedFile) {
      console.error("❌ No file uploaded");
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const file = req.files.uploadedFile;
    console.log("📁 File received:", {
      name: file.name,
      size: file.size,
      mimetype: file.mimetype,
      tempFilePath: file.tempFilePath
    });

    // التحقق من نوع الملف
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      console.error("❌ Invalid file type:", file.mimetype);
      return res.status(400).json({
        success: false,
        message: "Only image files are allowed (jpg, png, webp)"
      });
    }

    // التحقق من وجود tempFilePath
    if (!file.tempFilePath) {
      console.error("❌ No tempFilePath found");
      return res.status(500).json({
        success: false,
        message: "File upload configuration error"
      });
    }

    console.log("☁️ Uploading to Cloudinary...");

    // رفع الصورة إلى Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "techify/products",
      public_id: `product-${Date.now()}-${uuidv4()}`,
      resource_type: "image",
      transformation: [
        { width: 1000, height: 1000, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" }
      ]
    });

    console.log("✅ Upload successful:", result.secure_url);

    // ✅ إرجاع رابط الصورة من Cloudinary
    res.status(200).json({
      success: true,
      filename: result.secure_url,
      publicId: result.public_id,
      message: "File uploaded successfully"
    });

  } catch (error) {
    console.error("❌ Unexpected error in uploadMainImage:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = { uploadMainImage };