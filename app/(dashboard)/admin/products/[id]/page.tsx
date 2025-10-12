"use client";
import { CustomButton, DashboardSidebar, SectionTitle } from "@/components";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import {
  convertCategoryNameToURLFriendly as convertSlugToURLFriendly,
  formatCategoryName,
} from "../../../../../utils/categoryFormating";
import { nanoid } from "nanoid";
import apiClient from "@/lib/api";

interface DashboardProductDetailsProps {
  params: Promise<{ id: string }>;
}

const DashboardProductDetails = ({
  params,
}: DashboardProductDetailsProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const [product, setProduct] = useState<Product>();
  const [categories, setCategories] = useState<Category[]>();
  const [otherImages, setOtherImages] = useState<OtherImages[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const router = useRouter();

  // functionality for deleting product
  const deleteProduct = async () => {
    apiClient.delete(`/api/products/${id}`)
      .then((response) => {
        if (response.status !== 204) {
          if (response.status === 400) {
            toast.error(
              "Cannot delete the product because of foreign key constraint"
            );
          } else {
            throw Error("There was an error while deleting product");
          }
        } else {
          toast.success("Product deleted successfully");
          router.push("/admin/products");
        }
      })
      .catch((error) => {
        toast.error("There was an error while deleting product");
      });
  };

  // functionality for updating product
  const updateProduct = async () => {
    if (
      product?.title === "" ||
      product?.slug === "" ||
      product?.price.toString() === "" ||
      product?.manufacturer === "" ||
      product?.description === ""
    ) {
      toast.error("You need to enter values in input fields");
      return;
    }

    apiClient.put(`/api/products/${id}`, product)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw Error("There was an error while updating product");
        }
      })
      .then((data) => toast.success("Product successfully updated"))
      .catch((error) => {
        toast.error("There was an error while updating product");
      });
  };

  // functionality for uploading main image file
  const uploadFile = async (file: any) => {
    const formData = new FormData();
    formData.append("uploadedFile", file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/main-image`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // ✅ حفظ رابط Cloudinary في الـ state
        if (data.filename) {
          setProduct({ ...product!, mainImage: data.filename });
          toast.success("Image uploaded successfully");
        }
      } else {
        const errorData = await response.json();
        console.error("Upload error:", errorData);
        toast.error(errorData.message || "File upload unsuccessful.");
      }
    } catch (error) {
      console.error("There was an error while during request sending:", error);
      toast.error("There was an error during request sending");
    }
  };

  // fetching main product data including other product images
  const fetchProductData = async () => {
    apiClient.get(`/api/products/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setProduct(data);
      });

    const imagesData = await apiClient.get(`/api/images/${id}`, {
      cache: "no-store",
    });
    const images = await imagesData.json();
    setOtherImages((currentImages) => images);
  };

  // fetching all product categories. It will be used for displaying categories in select category input
  const fetchCategories = async () => {
    apiClient.get(`/api/categories`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCategories(data);
      });
  };

  // دالة رفع صور متعددة
  const uploadMultipleImages = async (files: FileList) => {
    if (!files || files.length === 0) {
      toast.error("Please select images to upload");
      return;
    }

    setUploadingImages(true);
    const formData = new FormData();
    
    // إضافة معرف المنتج
    formData.append("productID", id);
    
    // إضافة جميع الصور
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
        
        // إعادة تحميل الصور
        fetchProductData();
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

  // دالة حذف صورة واحدة
  const deleteSingleImage = async (imageID: string | number) => {
    try {
      const response = await apiClient.delete(`/api/images/single/${imageID}`);
      
      if (response.ok) {
        toast.success("Image deleted successfully");
        // إعادة تحميل الصور
        fetchProductData();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Error deleting image");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProductData();
  }, [id]);

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:ml-5 w-full max-xl:px-5">
        <h1 className="text-3xl font-semibold">Product details</h1>
        {/* Product name input div - start */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Product name:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.title || ""}
              onChange={(e) =>
                setProduct({ ...product!, title: e.target.value })
              }
            />
          </label>
        </div>
        {/* Product name input div - end */}
        {/* Product price input div - start */}

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Product price (Current):</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.price || ""}
              onChange={(e) =>
                setProduct({ ...product!, price: Number(e.target.value) })
              }
            />
          </label>
        </div>
        {/* Product price input div - end */}
        
        {/* Old Price input div - start */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Old price (Optional - for discount):</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.oldPrice || ""}
              placeholder="Leave empty if no discount"
              onChange={(e) =>
                setProduct({ ...product!, oldPrice: e.target.value ? Number(e.target.value) : undefined })
              }
            />
          </label>
        </div>
        {/* Old Price input div - end */}
        
        {/* Rating and Rating Count - Side by Side */}
        <div className="flex gap-x-2 max-sm:flex-col">
          {/* Rating input div - start */}
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
                  setProduct({ ...product!, rating: Number(e.target.value) })
                }
              />
            </label>
          </div>
          {/* Rating input div - end */}

          {/* Rating Count input div - start */}
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
                  setProduct({ ...product!, ratingCount: e.target.value ? Number(e.target.value) : undefined })
                }
              />
            </label>
          </div>
          {/* Rating Count input div - end */}
        </div>
        
        {/* Product manufacturer input div - start */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Manufacturer:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.manufacturer || ""}
              onChange={(e) =>
                setProduct({ ...product!, manufacturer: e.target.value })
              }
            />
          </label>
        </div>
        {/* Product manufacturer input div - end */}
        {/* Product slug input div - start */}

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Slug:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.slug ? convertSlugToURLFriendly(product?.slug) : ""}
              onChange={(e) =>
                setProduct({
                  ...product!,
                  slug: convertSlugToURLFriendly(e.target.value),
                })
              }
            />
          </label>
        </div>
        {/* Product slug input div - end */}
        {/* Product inStock select input div - start */}

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Is product in stock?</span>
            </div>
            <select
              className="select select-bordered"
              value={product?.inStock ?? 1}
              onChange={(e) => {
                setProduct({ ...product!, inStock: Number(e.target.value) });
              }}
            >
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
          </label>
        </div>
        {/* Product inStock select input div - end */}
        
        {/* Colors input div - start */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Available colors (Optional):</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.colors || ""}
              placeholder="e.g., Red, Blue, Black"
              onChange={(e) =>
                setProduct({ ...product!, colors: e.target.value })
              }
            />
            <div className="label">
              <span className="label-text-alt text-gray-500">Comma separated: Red, Blue, Black</span>
            </div>
          </label>
        </div>
        {/* Colors input div - end */}
        
        {/* Sizes input div - start */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Available sizes (Optional):</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.sizes || ""}
              placeholder="e.g., S, M, L, XL"
              onChange={(e) =>
                setProduct({ ...product!, sizes: e.target.value })
              }
            />
            <div className="label">
              <span className="label-text-alt text-gray-500">Comma separated: S, M, L, XL</span>
            </div>
          </label>
        </div>
        {/* Sizes input div - end */}
        
        {/* Stock Quantity input div - start */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Stock quantity (Optional):</span>
            </div>
            <input
              type="number"
              className="input input-bordered w-full max-w-xs"
              value={product?.stock || ""}
              placeholder="e.g., 50"
              onChange={(e) =>
                setProduct({ ...product!, stock: e.target.value ? Number(e.target.value) : undefined })
              }
            />
            <div className="label">
              <span className="label-text-alt text-gray-500">Number of items available</span>
            </div>
          </label>
        </div>
        {/* Stock Quantity input div - end */}
        
        {/* Shipping Cost input div - start */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Shipping cost (Optional):</span>
            </div>
            <input
              type="number"
              className="input input-bordered w-full max-w-xs"
              value={product?.shippingCost || ""}
              placeholder="Leave empty for free shipping"
              onChange={(e) =>
                setProduct({ ...product!, shippingCost: e.target.value ? Number(e.target.value) : undefined })
              }
            />
            <div className="label">
              <span className="label-text-alt text-gray-500">Leave empty for free shipping</span>
            </div>
          </label>
        </div>
        {/* Shipping Cost input div - end */}
        {/* Product category select input div - start */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Category:</span>
            </div>
            <select
              className="select select-bordered"
              value={product?.categoryId || ""}
              onChange={(e) =>
                setProduct({
                  ...product!,
                  categoryId: e.target.value,
                })
              }
            >
              {categories &&
                categories.map((category: Category) => (
                  <option key={category?.id} value={category?.id}>
                    {formatCategoryName(category?.name)}
                  </option>
                ))}
            </select>
          </label>
        </div>
        {/* Product category select input div - end */}

        {/* Main image file upload div - start */}
        <div>
          <label className="block text-sm font-semibold mb-2">Main Product Image:</label>
          <input
            type="file"
            className="file-input file-input-bordered file-input-lg w-full max-w-sm"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                uploadFile(file);
              }
            }}
          />
          {product?.mainImage && (
            <div className="mt-3">
              <Image
                src={product?.mainImage || "/product_placeholder.jpg"}
                alt={product?.title}
                className="w-auto h-auto rounded-lg border-2 border-gray-200"
                width={150}
                height={150}
              />
            </div>
          )}
        </div>
        {/* Main image file upload div - end */}

        {/* Multiple images upload div - start */}
        <div className="border-t pt-5">
          <label className="block text-sm font-semibold mb-2">
            Additional Product Images (Gallery):
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            className="file-input file-input-bordered file-input-lg w-full max-w-sm"
            onChange={(e) => {
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
          
          {/* عرض الصور الإضافية */}
          {otherImages && otherImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold mb-3">Current Gallery Images:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {otherImages.map((image) => (
                  <div key={image.imageID} className="relative group">
                    <Image
                      src={image.image}
                      alt="product gallery image"
                      width={150}
                      height={150}
                      className="w-full h-auto rounded-lg border-2 border-gray-200 object-cover"
                    />
                    <button
                      onClick={() => deleteSingleImage(image.imageID)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      title="Delete image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Multiple images upload div - end */}
        {/* Product description div - start */}
        <div>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Product description:</span>
            </div>
            <textarea
              className="textarea textarea-bordered h-24"
              value={product?.description || ""}
              onChange={(e) =>
                setProduct({ ...product!, description: e.target.value })
              }
            ></textarea>
          </label>
        </div>
        {/* Product description div - end */}
        {/* Action buttons div - start */}
        <div className="flex gap-x-2 max-sm:flex-col">
          <button
            type="button"
            onClick={updateProduct}
            className="uppercase bg-blue-500 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2"
          >
            Update product
          </button>
          <button
            type="button"
            className="uppercase bg-red-600 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2"
            onClick={deleteProduct}
          >
            Delete product
          </button>
        </div>
        {/* Action buttons div - end */}
        <p className="text-xl max-sm:text-lg text-error">
          To delete the product you first need to delete all its records in
          orders (customer_order_product table).
        </p>
      </div>
    </div>
  );
};

export default DashboardProductDetails;
