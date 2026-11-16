"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";

export default function DashboardPage() {
  const [data, setData] = useState({ orders: [], riders: [] });

  const refreshDashboard = () => {
    fetch("/api/orders")
      .then((response) => response.json())
      .then((payload) => setData(payload));
  };

  useEffect(() => {
    refreshDashboard();
    const pollingId = setInterval(refreshDashboard, 3000);

    return () => {
      clearInterval(pollingId);
    };
  }, []);

  const totalOrders = data.orders.length;
  const activeDeliveries = data.orders.filter((order) => order.status === "Assigned").length;
  const availableRiders = data.riders.filter((rider) => rider.status === "Available").length;
  const delivered = data.orders.filter((order) => order.status === "Delivered").length;

  return (
    <AppShell
      eyebrow="Admin"
      title="Dashboard"
      description="Live counts from the in-memory order and rider store. Values refresh every three seconds."
      actions={
        <Link
          href="/orders"
          className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-secondary transition-colors hover:bg-raised hover:text-foreground"
        >
          View all orders
        </Link>
      }
    >
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total orders", value: totalOrders },
          { label: "Active deliveries", value: activeDeliveries },
          { label: "Available riders", value: availableRiders },
          { label: "Delivered", value: delivered },
        ].map((card) => (
          <div
            key={card.label}
            className="card px-5 py-5"
          >
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-3 text-4xl font-medium tabular text-foreground">
              {card.value}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="card p-5">
          <p className="text-sm text-muted">Recent orders</p>
          <div className="mt-4 divide-y divide-border">
            {data.orders.length ? (
              data.orders.slice(0, 6).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-foreground">{order.customerName}</p>
                    <p className="mt-1 font-mono text-xs text-muted">
                      {order.pickup} → {order.drop}
                    </p>
                  </div>
                  <span className="rounded-md bg-raised px-2.5 py-1 text-xs text-secondary">
                    {order.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-6 text-sm text-secondary">No orders yet</p>
            )}
          </div>
        </div>

        <div className="card p-5">
          <p className="text-sm text-muted">Rider bench</p>
          <ul className="mt-4 space-y-3">
            {data.riders.map((rider) => (
              <li
                key={rider.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <div>
                  <p className="font-medium text-foreground">{rider.name}</p>
                  <p className="mt-1 font-mono text-xs text-muted">{rider.location}</p>
                </div>
                <span
                  className={`h-2 w-2 rounded-full ${
                    rider.status === "Available" ? "bg-success" : "bg-accent"
                  }`}
                  title={rider.status}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </AppShell>
  );
}
