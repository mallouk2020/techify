"use client";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import { isValidEmailAddressFormat, isValidNameOrLastname } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface OrderProduct {
  mainImage: any;
  id: string;
  customerOrderId: string;
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  product: {
    id: string;
    slug: string;
    title: string;
    mainImage: string;
    price: number;
    rating: number;
    description: string;
    manufacturer: string;
    inStock: number;
    categoryId: string;
  };
}

const AdminSingleOrder = () => {
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>();
  const [order, setOrder] = useState<Order>({
    id: "",
    adress: "",
    email: "",
    name: "",
    phone: "",
    city: "",
    orderNotice: "",
    status: "processing",
    total: 0,
    paymentMethod: "",
  });
  const params = useParams<{ id: string }>();

  const router = useRouter();

  useEffect(() => {
    const fetchOrderData = async () => {
      const response = await apiClient.get(
        `/api/orders/${params?.id}`
      );
      const data: Order = await response.json();
      setOrder(data);
    };

    const fetchOrderProducts = async () => {
      const response = await apiClient.get(
        `/api/order-product/${params?.id}`
      );
      const data: OrderProduct[] = await response.json();
      setOrderProducts(data);
    };

    fetchOrderData();
    fetchOrderProducts();
  }, [params?.id]);

  const updateOrder = async () => {
    if (
      order?.name.length > 0 &&
      order?.phone.length > 0 &&
      order?.email.length > 0 &&
      order?.adress.length > 0 &&
      order?.city.length > 0
    ) {
      if (!isValidNameOrLastname(order?.name)) {
        toast.error("You entered invalid name format");
        return;
      }

      if (!isValidEmailAddressFormat(order?.email)) {
        toast.error("You entered invalid email format");
        return;
      }

      apiClient.put(`/api/orders/${order?.id}`, order)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Order updated successfuly");
          } else {
            throw Error("There was an error while updating a order");
          }
        })
        .catch((error) =>
          toast.error("There was an error while updating a order")
        );
    } else {
      toast.error("Please fill all required fields");
    }
  };

  const deleteOrder = async () => {
    apiClient.delete(
      `/api/order-product/${order?.id}`
    ).then((response) => {
      apiClient.delete(
        `/api/orders/${order?.id}`
      ).then((response) => {
        toast.success("Order deleted successfully");
        router.push("/admin/orders");
      });
    });
  };

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:ml-5 w-full max-xl:px-5">
        <h1 className="text-3xl font-semibold">Order details</h1>
        <div className="mt-5">
          <label className="w-full">
            <div>
              <span className="text-xl font-bold">Order ID:</span>
              <span className="text-base"> {order?.id}</span>
            </div>
          </label>
        </div>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Full Name:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={order?.name}
              onChange={(e) => setOrder({ ...order, name: e.target.value })}
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Phone number:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={order?.phone}
              onChange={(e) => setOrder({ ...order, phone: e.target.value })}
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Email address:</span>
            </div>
            <input
              type="email"
              className="input input-bordered w-full max-w-xs"
              value={order?.email}
              onChange={(e) => setOrder({ ...order, email: e.target.value })}
            />
          </label>
        </div>

        <div className="flex gap-x-2 max-sm:flex-col">
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Address:</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.adress}
                onChange={(e) => setOrder({ ...order, adress: e.target.value })}
              />
            </label>
          </div>

          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">City:</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.city}
                onChange={(e) => setOrder({ ...order, city: e.target.value })}
              />
            </label>
          </div>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Payment Method:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={order?.paymentMethod}
              onChange={(e) => setOrder({ ...order, paymentMethod: e.target.value })}
              disabled
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Order status</span>
            </div>
            <select
              className="select select-bordered"
              value={order?.status}
              onChange={(e) =>
                setOrder({
                  ...order,
                  status: e.target.value as
                    | "processing"
                    | "delivered"
                    | "canceled",
                })
              }
            >
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
            </select>
          </label>
        </div>
        <div>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Order notice:</span>
            </div>
            <textarea
              className="textarea textarea-bordered h-24"
              value={order?.orderNotice || ""}
              onChange={(e) =>
                setOrder({ ...order, orderNotice: e.target.value })
              }
            ></textarea>
          </label>
        </div>
        <div>
          {orderProducts?.map((product) => (
            <div className="flex items-center gap-x-4" key={product?.id}>
              <Image
                src={product?.product?.mainImage || "/product_placeholder.jpg"}
                alt={product?.product?.title}
                width={50}
                height={50}
                className="w-auto h-auto"
              />
              <div>
                <Link href={`/product/${product?.product?.slug}`}>
                  {product?.product?.title}
                </Link>
                <p>
                  ${product?.product?.price} * {product?.quantity} items
                </p>
                {(product?.selectedColor || product?.selectedSize) && (
                  <div className="flex gap-x-3 mt-1 text-sm text-gray-600">
                    {product?.selectedColor && (
                      <span className="flex items-center gap-x-1">
                        <span className="font-medium">Color:</span>
                        <span>{product.selectedColor}</span>
                      </span>
                    )}
                    {product?.selectedSize && (
                      <span className="flex items-center gap-x-1">
                        <span className="font-medium">Size:</span>
                        <span>{product.selectedSize}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-y-2 mt-10">
            <p className="text-2xl font-semibold">
              Order Total: Dhs{order?.total}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              * Total includes all discounts and shipping costs calculated at checkout
            </p>
          </div>
          <div className="flex gap-x-2 max-sm:flex-col mt-5">
            <button
              type="button"
              className="uppercase bg-blue-500 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2"
              onClick={updateOrder}
            >
              Update order
            </button>
            <button
              type="button"
              className="uppercase bg-red-600 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2"
              onClick={deleteOrder}
            >
              Delete order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSingleOrder;
