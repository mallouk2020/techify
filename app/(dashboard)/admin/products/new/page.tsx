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
    manufacturer: string;
    inStock: number;
    mainImage: string; // اسم الملف على السيرفر
    description: string;
    slug: string;
    categoryId: string;
  }>({
    title: "",
    price: 0,
    manufacturer: "",
    inStock: 1,
    mainImage: "",
    description: "",
    slug: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);

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
        toast.success("Product added successfully");
        setProduct({
          title: "",
          price: 0,
          manufacturer: "",
          inStock: 1,
          mainImage: "",
          description: "",
          slug: "",
          categoryId: categories[0]?.id || "",
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

  // ✅ دالة رفع صورة
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
      <div className="flex flex-col gap-y-7 xl:ml-5 max-xl:px-5 w-full">
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
              <span className="label-text">Product price:</span>
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

        {/* Image Upload */}
        <div>
          <label className="form-control w-full max-w-sm">
            <div className="label">
              <span className="label-text">Product image:</span>
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
      </div>
    </div>
  );
};

export default AddNewProduct;