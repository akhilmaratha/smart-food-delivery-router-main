"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [result, setResult] = useState({ loading: false, error: "", order: null });

  const findOrder = async (event) => {
    event.preventDefault();
    setResult({ loading: true, error: "", order: null });

    const response = await fetch(`/api/orders?id=${encodeURIComponent(orderId)}`);
    const payload = await response.json();

    if (!response.ok) {
      setResult({
        loading: false,
        error: payload.error ?? "Order not found",
        order: null,
      });
      return;
    }

    setResult({ loading: false, error: "", order: payload.order });
  };

  return (
    <AppShell
      eyebrow="Customer"
      title="Track your order"
      description="Look up a delivery by order ID to see status, assigned rider, ETA, and computed route."
    >
      <form
        onSubmit={findOrder}
        className="flex max-w-2xl flex-col gap-3 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center"
      >
        <input
          value={orderId}
          onChange={(event) => setOrderId(event.target.value)}
          placeholder="Order ID"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 font-mono text-sm text-foreground outline-none transition-colors focus:border-foreground"
        />
        <button
          type="submit"
          disabled={result.loading}
          className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-secondary disabled:opacity-50"
        >
          {result.loading ? "Looking up…" : "Track order"}
        </button>
      </form>

      {result.error ? (
        <div className="mt-4 max-w-2xl rounded-xl border border-danger/20 bg-danger-soft px-5 py-4 text-sm text-danger">
          {result.error}
        </div>
      ) : null}

      {result.order ? (
        <section className="mt-6 grid max-w-3xl gap-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-sm text-muted">Status</p>
              <p className="mt-2 text-xl font-medium text-foreground">
                {result.order.status}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-sm text-muted">Assigned rider</p>
              <p className="mt-2 text-xl font-medium text-foreground">
                {result.order.assignedRider?.name ?? "Not assigned"}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-sm text-muted">ETA</p>
              <p className="mt-2 text-xl font-medium tabular text-foreground">
                {result.order.eta ? `${result.order.eta} mins` : "Pending"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5 text-sm leading-7 text-secondary">
            <p>
              Pickup:{" "}
              <span className="font-mono text-foreground">{result.order.pickup}</span>
            </p>
            <p>
              Drop:{" "}
              <span className="font-mono text-foreground">{result.order.drop}</span>
            </p>
            <p className="mt-3">
              Route:{" "}
              {result.order.route?.length ? (
                <span className="font-mono text-foreground">
                  {result.order.route.join(" → ")}
                </span>
              ) : (
                "Waiting for assignment"
              )}
            </p>
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}
