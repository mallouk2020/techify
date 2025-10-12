"use client";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import { convertCategoryNameToURLFriendly as convertSlugToURLFriendly } from "@/utils/categoryFormating";
import { sanitizeFormData } from "@/lib/form-sanitize";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

// تعريف نوع Category
type Category = {
  id: string;
  name: string;
};

const AddNewProduct = () => {
  const [product, setProduct] = useState<{
    title: string;
    price: number;
    oldPrice?: number;
    rating: number;
    ratingCount?: number;
    manufacturer: string;
    inStock: number;
    stock?: number;
    mainImage: string;
    description: string;
    slug: string;
    categoryId: string;
    colors?: string;
    sizes?: string;
    shippingCost?: number;
  }>({
    title: "",
    price: 0,
    oldPrice: undefined,
    rating: 0,
    ratingCount: undefined,
    manufacturer: "",
    inStock: 1,
    stock: undefined,
    mainImage: "",
    description: "",
    slug: "",
    categoryId: "",
    colors: "",
    sizes: "",
    shippingCost: undefined,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [productId, setProductId] = useState<string>("");
  const [uploadingImages, setUploadingImages] = useState(false);

  // ✅ دالة إضافة منتج
  const addProduct = async () => {
    if (
      product.title === "" ||
      product.manufacturer === "" ||
      product.description === "" ||
      product.slug === ""
    ) {
      toast.error("Please enter values in input fields");
      return;
    }

    try {
      const sanitizedProduct = sanitizeFormData(product);
      const response = await apiClient.post(`/api/products`, sanitizedProduct);
      
      if (response.ok) {
        const data = await response.json();
        toast.success("Product added successfully");
        setProductId(data.id); // حفظ معرف المنتج لرفع الصور الإضافية
        setProduct({
          title: "",
          price: 0,
          oldPrice: undefined,
          rating: 0,
          ratingCount: undefined,
          manufacturer: "",
          inStock: 1,
          stock: undefined,
          mainImage: "",
          description: "",
          slug: "",
          categoryId: categories[0]?.id || "",
          colors: "",
          sizes: "",
          shippingCost: undefined,
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Error adding product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product");
    }
  };

  // ✅ دالة رفع صورة رئيسية
  const uploadFile = async (file: File | null) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("uploadedFile", file);

    try {
      const response = await apiClient.upload("/api/main-image", formData);

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.filename) {
          setProduct(prev => ({ ...prev, mainImage: data.filename }));
          console.log("الصورة رُفعت باسم:", data.filename);
        } else {
          toast.error("فشل رفع الصورة");
          console.error("File upload unsuccessful:", data);
        }
      } else {
        toast.error("خطأ في رفع الصورة");
        console.error("File upload failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error happened while sending request:", error);
      toast.error("حدث خطأ أثناء رفع الصورة");
    }
  };

  // ✅ دالة رفع صور متعددة (بعد إضافة المنتج)
  const uploadMultipleImages = async (files: FileList) => {
    if (!files || files.length === 0) {
      toast.error("Please select images to upload");
      return;
    }

    if (!productId) {
      toast.error("Please add the product first before uploading additional images");
      return;
    }

    setUploadingImages(true);
    const formData = new FormData();
    
    formData.append("productID", productId);
    
    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/images/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`${data.images.length} images uploaded successfully`);
      } else {
        const errorData = await response.json();
        console.error("Upload error:", errorData);
        toast.error(errorData.message || "Failed to upload images");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Error uploading images");
    } finally {
      setUploadingImages(false);
    }
  };

  // ✅ دالة جلب الفئات
  const fetchCategories = async () => {
    try {
      const res = await apiClient.get(`/api/categories`);
      const data = await res.json();
      setCategories(data);
      if (data.length > 0) {
        setProduct(prev => ({ ...prev, categoryId: data[0].id }));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:ml-5 max-xl:px-5 w-full pb-10">
        <h1 className="text-3xl font-semibold">Add new product</h1>
        
        {/* Product Name */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Product name:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.title}
              onChange={(e) =>
                setProduct({ ...product, title: e.target.value })
              }
            />
          </label>
        </div>

        {/* Product Slug */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Product slug:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={convertSlugToURLFriendly(product?.slug)}
              onChange={(e) =>
                setProduct({
                  ...product,
                  slug: convertSlugToURLFriendly(e.target.value),
                })
              }
            />
          </label>
        </div>

        {/* Category */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Category:</span>
            </div>
            <select
              className="select select-bordered"
              value={product?.categoryId}
              onChange={(e) =>
                setProduct({ ...product, categoryId: e.target.value })
              }
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Price */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Product price (Current):</span>
            </div>
            <input
              type="number"
              className="input input-bordered w-full max-w-xs"
              value={product?.price || ""}
              onChange={(e) =>
                setProduct({ ...product, price: Number(e.target.value) })
              }
            />
          </label>
        </div>

        {/* Old Price (Optional) */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Old price (Optional - for discount display):</span>
            </div>
            <input
              type="number"
              className="input input-bordered w-full max-w-xs"
              value={product?.oldPrice || ""}
              placeholder="Leave empty if no discount"
              onChange={(e) =>
                setProduct({ ...product, oldPrice: e.target.value ? Number(e.target.value) : undefined })
              }
            />
          </label>
        </div>

        {/* Rating and Rating Count - Side by Side */}
        <div className="flex gap-x-2 max-sm:flex-col">
          {/* Rating */}
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Rating (0-5):</span>
              </div>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                className="input input-bordered w-full max-w-xs"
                value={product?.rating || 0}
                placeholder="e.g., 4.5"
                onChange={(e) =>
                  setProduct({ ...product, rating: Number(e.target.value) })
                }
              />
            </label>
          </div>

          {/* Rating Count */}
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Number of ratings:</span>
              </div>
              <input
                type="number"
                min="0"
                className="input input-bordered w-full max-w-xs"
                value={product?.ratingCount || ""}
                placeholder="e.g., 150"
                onChange={(e) =>
                  setProduct({ ...product, ratingCount: e.target.value ? Number(e.target.value) : undefined })
                }
              />
            </label>
          </div>
        </div>

        {/* Manufacturer */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Manufacturer:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.manufacturer}
              onChange={(e) =>
                setProduct({ ...product, manufacturer: e.target.value })
              }
            />
          </label>
        </div>

        {/* Colors (Optional) */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Available colors (Optional - comma separated):</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.colors || ""}
              placeholder="e.g., Red, Blue, Black"
              onChange={(e) =>
                setProduct({ ...product, colors: e.target.value })
              }
            />
            <div className="label">
              <span className="label-text-alt text-gray-500">Example: Red, Blue, Black, White</span>
            </div>
          </label>
        </div>

        {/* Sizes (Optional) */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Available sizes (Optional - comma separated):</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.sizes || ""}
              placeholder="e.g., S, M, L, XL"
              onChange={(e) =>
                setProduct({ ...product, sizes: e.target.value })
              }
            />
            <div className="label">
              <span className="label-text-alt text-gray-500">Example: S, M, L, XL or 32GB, 64GB, 128GB</span>
            </div>
          </label>
        </div>

        {/* Stock Quantity */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Stock quantity (Optional - number of items available):</span>
            </div>
            <input
              type="number"
              className="input input-bordered w-full max-w-xs"
              value={product?.stock || ""}
              placeholder="e.g., 50"
              onChange={(e) =>
                setProduct({ ...product, stock: e.target.value ? Number(e.target.value) : undefined })
              }
            />
            <div className="label">
              <span className="label-text-alt text-gray-500">Leave empty if you don&apos;t want to track quantity</span>
            </div>
          </label>
        </div>

        {/* Shipping Cost */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Shipping cost (Optional - leave empty for free shipping):</span>
            </div>
            <input
              type="number"
              className="input input-bordered w-full max-w-xs"
              value={product?.shippingCost || ""}
              placeholder="e.g., 10"
              onChange={(e) =>
                setProduct({ ...product, shippingCost: e.target.value ? Number(e.target.value) : undefined })
              }
            />
            <div className="label">
              <span className="label-text-alt text-gray-500">Leave empty for free shipping</span>
            </div>
          </label>
        </div>

        {/* In Stock */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Is product in stock?</span>
            </div>
            <select
              className="select select-bordered"
              value={product?.inStock}
              onChange={(e) =>
                setProduct({ ...product, inStock: Number(e.target.value) })
              }
            >
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
          </label>
        </div>

        {/* Main Image Upload */}
        <div>
          <label className="form-control w-full max-w-sm">
            <div className="label">
              <span className="label-text">Product main image:</span>
            </div>
            <input
              type="file"
              className="file-input file-input-bordered file-input-lg w-full max-w-sm"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) {
                  uploadFile(file);
                }
              }}
            />
            {product?.mainImage && (
              <div className="mt-2">
                <img
                  src={product.mainImage}
                  alt={product.title || "Product preview"}
                  width={100}
                  height={100}
                  className="object-cover rounded border"
                  onError={(e) => {
                    console.error("فشل تحميل الصورة:", e);
                    (e.target as HTMLImageElement).src = "/product_placeholder.jpg";
                  }}
                />
                <p className="text-xs text-green-600 mt-1">✓ Image uploaded successfully</p>
              </div>
            )}
          </label>
        </div>

        {/* Additional Images Upload (After Product Creation) */}
        {productId && (
          <div className="border-t pt-5">
            <label className="form-control w-full max-w-sm">
              <div className="label">
                <span className="label-text">Additional product images (Gallery):</span>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                className="file-input file-input-bordered file-input-lg w-full max-w-sm"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const files = e.target.files;
                  if (files) {
                    uploadMultipleImages(files);
                  }
                }}
                disabled={uploadingImages}
              />
              {uploadingImages && (
                <p className="text-blue-500 mt-2">Uploading images...</p>
              )}
              <div className="label">
                <span className="label-text-alt text-gray-500">You can upload multiple images at once</span>
              </div>
            </label>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Product description:</span>
            </div>
            <textarea
              className="textarea textarea-bordered h-24"
              value={product?.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            ></textarea>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex gap-x-2">
          <button
            onClick={addProduct}
            type="button"
            className="uppercase bg-blue-500 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2"
          >
            Add product
          </button>
        </div>

        {productId && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 font-medium">
              ✓ Product created successfully! You can now upload additional images above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddNewProduct;