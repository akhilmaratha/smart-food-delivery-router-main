"use client";

import { useState } from "react";
import Link from "next/link";
import { cityNodes } from "@/lib/dsa/graph";
import AppShell from "@/components/AppShell";

const defaultCustomerName = "Student Customer";

export default function PlaceOrderPage() {
  const [customerName, setCustomerName] = useState(() => {
    if (typeof window === "undefined") {
      return defaultCustomerName;
    }
    return localStorage.getItem("smart-delivery-customer-name") ?? defaultCustomerName;
  });
  const [pickup, setPickup] = useState(cityNodes[0]);
  const [drop, setDrop] = useState(cityNodes[1]);
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "", order: null });

  const submitOrder = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "", order: null });

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerName, pickup, drop, details }),
    });

    const payload = await response.json();

    if (!response.ok) {
      setStatus({
        loading: false,
        error: payload.error ?? "Unable to create order",
        order: null,
      });
      return;
    }

    localStorage.setItem("smart-delivery-customer-name", customerName);
    localStorage.setItem("smart-delivery-latest-order", payload.order.id);
    setStatus({ loading: false, error: "", order: payload.order });
    setDetails("");
  };

  return (
    <AppShell
      eyebrow="Customer"
      title="Place an order"
      description="Choose pickup and drop nodes from the city graph. The backend stores the request as a pending order."
      actions={
        <Link
          href="/track-order"
          className="rounded-lg border border-black bg-surface px-4 py-2.5 text-sm text-secondary transition-colors hover:bg-raised hover:text-foreground"
        >
          Track an order
        </Link>
      }
    >
      <form
        onSubmit={submitOrder}
        className="grid max-w-3xl gap-5 card p-6"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-secondary">
            Customer name
            <input
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              className="rounded-lg border border-black bg-background px-3 py-2.5 text-foreground outline-none transition-colors focus:border-foreground"
              placeholder="Your name"
            />
          </label>
          <label className="grid gap-2 text-sm text-secondary">
            Pickup location
            <select
              value={pickup}
              onChange={(event) => setPickup(event.target.value)}
              className="rounded-lg border border-black bg-background px-3 py-2.5 text-foreground outline-none transition-colors focus:border-foreground"
            >
              {cityNodes.map((node) => (
                <option key={node} value={node}>
                  {node}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm text-secondary">
            Drop location
            <select
              value={drop}
              onChange={(event) => setDrop(event.target.value)}
              className="rounded-lg border border-black bg-background px-3 py-2.5 text-foreground outline-none transition-colors focus:border-foreground"
            >
              {cityNodes.map((node) => (
                <option key={node} value={node}>
                  {node}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm text-secondary md:col-span-2">
            Order details
            <textarea
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              rows={4}
              className="rounded-lg border border-black bg-background px-3 py-2.5 text-foreground outline-none transition-colors focus:border-foreground"
              placeholder="Two biryani meals and one cold coffee"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={status.loading}
          className="inline-flex w-fit items-center justify-center rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-secondary disabled:opacity-50"
        >
          {status.loading ? "Creating order…" : "Place order"}
        </button>
      </form>

      {status.error ? (
        <div className="mt-4 max-w-3xl rounded-xl border border-black bg-danger-soft px-5 py-4 text-sm text-danger">
          {status.error}
        </div>
      ) : null}

      {status.order ? (
        <div className="mt-4 max-w-3xl rounded-xl border border-black bg-success-soft px-5 py-4">
          <p className="text-sm text-success">Order created</p>
          <p className="mt-2 text-base font-medium text-foreground">
            Waiting for a rider to accept this request
          </p>
          <p className="mt-2 font-mono text-sm text-secondary">
            Order ID: {status.order.id}
          </p>
          <Link
            href="/track-order"
            className="mt-4 inline-flex text-sm font-medium text-accent transition-colors hover:text-foreground"
          >
            Track this order
          </Link>
        </div>
      ) : null}
    </AppShell>
  );
}
