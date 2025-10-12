"use client";

// *********************
// Role of the component: Component that displays all orders on admin dashboard page
// Name of the component: AdminOrders.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <AdminOrders />
// Input parameters: No input parameters
// Output: Table with all orders
// *********************

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import apiClient from "@/lib/api";

interface OrderWithProducts extends Order {
  orderProducts?: Array<{
    product: {
      mainImage: string;
      title: string;
    };
  }>;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<OrderWithProducts[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await apiClient.get("/api/orders");
      const data = await response.json();
      
      // Fetch first product image for each order
      const ordersWithImages = await Promise.all(
        data?.orders?.map(async (order: Order) => {
          try {
            const productsResponse = await apiClient.get(`/api/order-product/${order.id}`);
            const products = await productsResponse.json();
            return {
              ...order,
              orderProducts: products
            };
          } catch (error) {
            return order;
          }
        }) || []
      );
      
      setOrders(ordersWithImages);
    };
    fetchOrders();
  }, []);

  return (
    <div className="xl:ml-5 w-full max-xl:mt-5 ">
      <h1 className="text-3xl font-semibold text-center mb-5">All orders</h1>
      <div className="overflow-x-auto">
        <table className="table table-md table-pin-cols">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Product</th>
              <th>Name and country</th>
              <th>Status</th>
              <th>Subtotal</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {orders && orders.length > 0 &&
              orders.map((order) => (
                <tr key={order?.id} className="hover:bg-gray-50">
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>

                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-16 h-16 bg-gray-100 flex items-center justify-center">
                          {order?.orderProducts && order.orderProducts.length > 0 ? (
                            <Image
                              src={order.orderProducts[0]?.product?.mainImage || "/product_placeholder.jpg"}
                              alt={order.orderProducts[0]?.product?.title || "Product"}
                              width={64}
                              height={64}
                              className="object-contain w-full h-full p-1"
                            />
                          ) : (
                            <Image
                              src="/product_placeholder.jpg"
                              alt="No product"
                              width={64}
                              height={64}
                              className="object-contain w-full h-full p-1"
                            />
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Order ID</div>
                        <div className="font-semibold text-sm">#{order?.id.substring(0, 8)}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="flex items-center gap-5">
                      <div>
                        <div className="font-bold">{order?.name}</div>
                        <div className="text-sm opacity-50">{order?.city}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className={`badge badge-sm text-white ${
                      order?.status === 'delivered' ? 'badge-success' :
                      order?.status === 'canceled' ? 'badge-error' :
                      'badge-warning'
                    }`}>
                      {order?.status}
                    </span>
                  </td>

                  <td>
                    <p className="font-semibold">${order?.total}</p>
                  </td>

                  <td className="text-sm">{ order?.createdAt ? new Date(Date.parse(order.createdAt)).toDateString() : 'N/A' }</td>
                  <th>
                    <Link
                      href={`/admin/orders/${order?.id}`}
                      className="btn btn-ghost btn-xs hover:btn-primary"
                    >
                      details
                    </Link>
                  </th>
                </tr>
              ))}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th></th>
              <th>Product</th>
              <th>Name and country</th>
              <th>Status</th>
              <th>Subtotal</th>
              <th>Date</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
