const { PrismaClient } = require("@prisma/client");
const cloudinary = require("../config/cloudinary");
const crypto = require("crypto");
const prisma = new PrismaClient();

// دالة بديلة لتوليد UUID
const generateUUID = () => {
  return crypto.randomBytes(16).toString('hex');
};

async function getSingleProductImages(request, response) {
  const { id } = request.params;
  const images = await prisma.image.findMany({
    where: { productID: id },
  });
  if (!images) {
    return response.json({ error: "Images not found" }, { status: 404 });
  }
  return response.json(images);
}

async function createImage(request, response) {
  try {
    const { productID, image } = request.body;
    const createImage = await prisma.image.create({
      data: {
        productID,
        image,
      },
    });
    return response.status(201).json(createImage);
  } catch (error) {
    console.error("Error creating image:", error);
    return response.status(500).json({ error: "Error creating image" });
  }
}

async function updateImage(request, response) {
  try {
    const { id } = request.params; // Getting product id from params
    const { productID, image } = request.body;

    // Checking whether photo exists for the given product id
    const existingImage = await prisma.image.findFirst({
      where: {
        productID: id, // Finding photo with a product id
      },
    });

    // if photo doesn't exist, return coresponding status code
    if (!existingImage) {
      return response
        .status(404)
        .json({ error: "Image not found for the provided productID" });
    }

    // Updating photo using coresponding imageID
    const updatedImage = await prisma.image.update({
      where: {
        imageID: existingImage.imageID, // Using imageID of the found existing image
      },
      data: {
        productID: productID,
        image: image,
      },
    });

    return response.json(updatedImage);
  } catch (error) {
    console.error("Error updating image:", error);
    return response.status(500).json({ error: "Error updating image" });
  }
}

async function deleteImage(request, response) {
  try {
    const { id } = request.params;
    await prisma.image.deleteMany({
      where: {
        productID: String(id), // Converting id to string
      },
    });
    return response.status(204).send();
  } catch (error) {
    console.error("Error deleting image:", error);
    return response.status(500).json({ error: "Error deleting image" });
  }
}

// دالة جديدة لرفع صور متعددة للمنتج
async function uploadProductImages(request, response) {
  try {
    const { productID } = request.body;

    if (!productID) {
      return response.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    // التحقق من وجود الملفات
    if (!request.files || !request.files.images) {
      return response.status(400).json({
        success: false,
        message: "No images uploaded"
      });
    }

    // تحويل الملفات إلى مصفوفة (في حالة رفع ملف واحد أو عدة ملفات)
    const files = Array.isArray(request.files.images) 
      ? request.files.images 
      : [request.files.images];

    console.log(`📁 Uploading ${files.length} images for product ${productID}`);

    const uploadedImages = [];
    const errors = [];

    // رفع كل صورة إلى Cloudinary وحفظها في قاعدة البيانات
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        // التحقق من نوع الملف
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
        if (!allowedTypes.includes(file.mimetype)) {
          errors.push({
            file: file.name,
            error: "Invalid file type. Only jpg, png, webp allowed"
          });
          continue;
        }

        // رفع الصورة إلى Cloudinary
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "techify/products/gallery",
          public_id: `product-${productID}-${Date.now()}-${generateUUID()}`,
          resource_type: "image",
          transformation: [
            { width: 1000, height: 1000, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" }
          ]
        });

        console.log(`✅ Image ${i + 1} uploaded: ${result.secure_url}`);

        // حفظ الصورة في قاعدة البيانات
        const savedImage = await prisma.image.create({
          data: {
            productID: productID,
            image: result.secure_url,
          },
        });

        uploadedImages.push({
          imageID: savedImage.imageID,
          url: result.secure_url,
          publicId: result.public_id
        });

      } catch (error) {
        console.error(`❌ Error uploading image ${file.name}:`, error);
        errors.push({
          file: file.name,
          error: error.message
        });
      }
    }

    // إرجاع النتيجة
    return response.status(201).json({
      success: true,
      message: `${uploadedImages.length} images uploaded successfully`,
      images: uploadedImages,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error("❌ Error in uploadProductImages:", error);
    return response.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}

// دالة لحذف صورة واحدة بناءً على imageID
async function deleteSingleImage(request, response) {
  try {
    const { imageID } = request.params;

    // البحث عن الصورة
    const image = await prisma.image.findUnique({
      where: { imageID: imageID }
    });

    if (!image) {
      return response.status(404).json({
        success: false,
        message: "Image not found"
      });
    }

    // حذف الصورة من قاعدة البيانات
    await prisma.image.delete({
      where: { imageID: imageID }
    });

    console.log(`✅ Image ${imageID} deleted successfully`);

    return response.status(200).json({
      success: true,
      message: "Image deleted successfully"
    });

  } catch (error) {
    console.error("❌ Error deleting single image:", error);
    return response.status(500).json({
      success: false,
      message: "Error deleting image",
      error: error.message
    });
  }
}

module.exports = {
  getSingleProductImages,
  createImage,
  updateImage,
  deleteImage,
  uploadProductImages,
  deleteSingleImage,
};
