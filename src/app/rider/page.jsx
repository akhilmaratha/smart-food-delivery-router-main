"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { sortRidersByDistance } from "@/lib/dsa/sortRiders";
import RiderCard from "@/components/RiderCard";
import OrderCard from "@/components/OrderCard";
import AppShell from "@/components/AppShell";

export default function RiderPage() {
  const router = useRouter();
  const [data, setData] = useState({ orders: [], pendingOrders: [], riders: [] });
  const [selection, setSelection] = useState({ loading: false, error: "", response: null });

  const refreshData = () => {
    fetch("/api/orders")
      .then((response) => response.json())
      .then((payload) => setData(payload))
      .catch(() => setData({ orders: [], pendingOrders: [], riders: [] }));
  };

  const latestPendingOrder = useMemo(() => {
    return [...data.pendingOrders].sort((left, right) =>
      right.createdAt.localeCompare(left.createdAt),
    )[0] ?? null;
  }, [data.pendingOrders]);

  const availableRiders = useMemo(() => {
    return data.riders.filter((rider) => rider.status === "Available");
  }, [data.riders]);

  const busyRiders = useMemo(() => {
    return data.riders.filter((rider) => rider.status !== "Available");
  }, [data.riders]);

  const sortedRiders = useMemo(() => {
    if (!latestPendingOrder) {
      return [];
    }

    return sortRidersByDistance(availableRiders, latestPendingOrder.pickup);
  }, [availableRiders, latestPendingOrder]);

  const bestRiderId = sortedRiders[0]?.id;

  useEffect(() => {
    refreshData();
    const pollingId = setInterval(refreshData, 3000);

    return () => {
      clearInterval(pollingId);
    };
  }, []);

  const acceptOrder = async (riderId) => {
    if (!latestPendingOrder) {
      return;
    }

    setSelection({ loading: true, error: "", response: null });
    const response = await fetch("/api/routing/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ riderId, orderId: latestPendingOrder.id }),
    });
    const payload = await response.json();

    if (!response.ok) {
      setSelection({
        loading: false,
        error: payload.error ?? "Assignment failed",
        response: payload,
      });
      return;
    }

    localStorage.setItem("smart-delivery-latest-order", latestPendingOrder.id);
    setSelection({ loading: false, error: "", response: payload });
    setData((current) => ({
      ...current,
      riders: current.riders.map((rider) =>
        rider.id === payload.assignedRider.id ? { ...payload.assignedRider } : rider,
      ),
      pendingOrders: current.pendingOrders.filter(
        (order) => order.id !== latestPendingOrder.id,
      ),
      orders: current.orders.map((order) =>
        order.id === payload.order.id ? payload.order : order,
      ),
    }));
  };

  return (
    <AppShell
      eyebrow="Rider"
      title="Accept the best pending order"
      description="Riders are sorted by Dijkstra distance to pickup. Only the greedy-preferred rider can accept."
    >
      {latestPendingOrder ? (
        <OrderCard order={latestPendingOrder} />
      ) : (
        <div className="card px-5 py-6 text-sm text-secondary">
          No pending orders yet
        </div>
      )}

      <div className="mt-4 card px-4 py-3 text-sm text-secondary">
        Assignable riders:{" "}
        <span className="font-medium tabular text-foreground">
          {availableRiders.length}
        </span>
        {" / "}
        Total riders:{" "}
        <span className="font-medium tabular text-foreground">
          {data.riders.length}
        </span>
      </div>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        {sortedRiders.length ? (
          sortedRiders.map((rider) => (
            <RiderCard
              key={rider.id}
              rider={rider}
              highlighted={rider.id === bestRiderId}
              actionSlot={
                rider.id === bestRiderId ? (
                  <button
                    type="button"
                    onClick={() => acceptOrder(rider.id)}
                    disabled={selection.loading}
                    className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-secondary disabled:opacity-50"
                  >
                    {selection.loading ? "Assigning…" : "Accept order"}
                  </button>
                ) : (
                  <p className="rounded-lg border border-black px-3 py-2 text-xs text-muted">
                    Greedy check prefers {sortedRiders[0]?.name}
                  </p>
                )
              }
            />
          ))
        ) : (
          <div className="card px-5 py-6 text-sm text-secondary lg:col-span-3">
            Available riders will appear here once an order exists
          </div>
        )}
      </section>

      {busyRiders.length ? (
        <section className="mt-8 grid gap-4">
          <h2 className="text-lg font-medium text-foreground">Busy riders</h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {busyRiders.map((rider) => (
              <RiderCard key={rider.id} rider={rider} />
            ))}
          </div>
        </section>
      ) : null}

      {selection.error ? (
        <div className="mt-6 rounded-xl border border-danger/20 bg-danger-soft px-5 py-4 text-sm text-danger">
          <p>{selection.error}</p>
          {selection.response?.greedyLog ? (
            <ul className="mt-3 space-y-1 text-secondary">
              {selection.response.greedyLog.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {selection.response ? (
        <section className="mt-6 grid gap-4 card p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-black bg-raised p-4">
              <p className="text-sm text-muted">Assigned rider</p>
              <p className="mt-2 text-xl font-medium text-foreground">
                {selection.response.assignedRider.name}
              </p>
            </div>
            <div className="rounded-lg border border-black bg-raised p-4">
              <p className="text-sm text-muted">Total distance</p>
              <p className="mt-2 text-xl font-medium tabular text-foreground">
                {selection.response.totalDistance}
              </p>
            </div>
            <div className="rounded-lg border border-black bg-raised p-4">
              <p className="text-sm text-muted">ETA</p>
              <p className="mt-2 text-xl font-medium tabular text-foreground">
                {selection.response.eta} mins
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-black bg-raised p-4">
            <p className="text-sm text-muted">Greedy decision log</p>
            <ul className="mt-3 space-y-2 text-sm text-secondary">
              {selection.response.greedyLog.map((entry) => (
                <li key={entry} className="rounded-md border border-black bg-surface px-3 py-2">
                  {entry}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <button
              type="button"
              onClick={() =>
                router.push(`/routing?orderId=${selection.response.order.id}`)
              }
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-foreground"
            >
              Open routing view
            </button>
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}
