"use client";

import { useEffect, useState } from "react";
import OrderCard from "@/components/OrderCard";
import AppShell from "@/components/AppShell";

export default function OrdersPage() {
  const [data, setData] = useState({ orders: [] });
  const [busyOrderId, setBusyOrderId] = useState("");

  const refreshOrders = () => {
    fetch("/api/orders")
      .then((response) => response.json())
      .then((payload) => setData(payload));
  };

  useEffect(() => {
    refreshOrders();
    const pollingId = setInterval(refreshOrders, 3000);

    return () => {
      clearInterval(pollingId);
    };
  }, []);

  const markDelivered = async (orderId) => {
    setBusyOrderId(orderId);
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    refreshOrders();
    setBusyOrderId("");
  };

  return (
    <AppShell
      eyebrow="Admin"
      title="All orders"
      description="Every order in the in-memory store. Mark an assigned delivery as complete to free the rider."
    >
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-raised text-secondary">
              <tr>
                <th className="px-4 py-3 font-medium">Order ID</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Pickup</th>
                <th className="px-4 py-3 font-medium">Drop</th>
                <th className="px-4 py-3 font-medium">Rider</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.orders.length ? (
                data.orders.map((order) => (
                  <tr key={order.id} className="border-t border-border text-foreground">
                    <td className="px-4 py-3 font-mono text-xs">{order.id}</td>
                    <td className="px-4 py-3">{order.customerName}</td>
                    <td className="px-4 py-3 font-mono text-xs">{order.pickup}</td>
                    <td className="px-4 py-3 font-mono text-xs">{order.drop}</td>
                    <td className="px-4 py-3">{order.assignedRider?.name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-raised px-2 py-1 text-xs text-secondary">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        disabled={busyOrderId === order.id || order.status === "Delivered"}
                        onClick={() => markDelivered(order.id)}
                        className="rounded-lg bg-foreground px-3 py-2 text-xs font-medium text-surface transition-colors hover:bg-secondary disabled:opacity-40"
                      >
                        Mark delivered
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-secondary">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {data.orders.length ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {data.orders.slice(0, 2).map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              actionSlot={
                <span className="text-sm text-muted">
                  Route length:{" "}
                  <span className="font-mono tabular text-foreground">
                    {order.route?.length ?? 0}
                  </span>{" "}
                  nodes
                </span>
              }
            />
          ))}
        </div>
      ) : null}
    </AppShell>
  );
}
