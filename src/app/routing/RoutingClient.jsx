"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import GraphView from "@/components/GraphView";
import DSAStepDemo from "@/components/DSAStepDemo";
import AppShell from "@/components/AppShell";
import { graph } from "@/lib/dsa/graph";
import { dijkstra, dijkstraSteps } from "@/lib/dsa/dijkstra";

const legTitle = {
  pickup: "Rider to pickup",
  drop: "Pickup to drop",
};

export default function RoutingClient() {
  const searchParams = useSearchParams();
  const [orderIdInput, setOrderIdInput] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }
    const initialFromUrl = new URLSearchParams(window.location.search).get("orderId");
    return initialFromUrl ?? localStorage.getItem("smart-delivery-latest-order") ?? "";
  });
  const [orderData, setOrderData] = useState({ order: null, riders: [] });
  const [activeLeg, setActiveLeg] = useState("pickup");
  const [demoOpen, setDemoOpen] = useState(true);

  const queryOrderId = searchParams.get("orderId") ?? "";
  const activeOrderId = queryOrderId || orderIdInput;

  useEffect(() => {
    if (!activeOrderId) {
      return;
    }

    const loadOrder = () => {
      fetch(`/api/orders?id=${encodeURIComponent(activeOrderId)}`)
        .then((response) => response.json())
        .then((payload) => setOrderData(payload));
    };

    loadOrder();
    const pollingId = setInterval(loadOrder, 4000);

    return () => {
      clearInterval(pollingId);
    };
  }, [activeOrderId]);

  const order = orderData.order;
  const assignedRider =
    order?.assignedRider ??
    orderData.riders.find((rider) => rider.id === order?.assignedRider?.id) ??
    null;

  const pickupLegResult =
    order && assignedRider
      ? dijkstra(graph, assignedRider.location, order.pickup)
      : null;
  const dropLegResult = order ? dijkstra(graph, order.pickup, order.drop) : null;

  const pickupSteps =
    order && assignedRider
      ? dijkstraSteps(graph, assignedRider.location, order.pickup)
      : [];
  const dropSteps = order ? dijkstraSteps(graph, order.pickup, order.drop) : [];
  const activeSteps = activeLeg === "pickup" ? pickupSteps : dropSteps;

  const routeDistance =
    order?.totalDistance ??
    (pickupLegResult?.distance ?? 0) + (dropLegResult?.distance ?? 0);
  const highlightPath = order?.route?.length
    ? order.route
    : pickupLegResult?.path
      ? [...pickupLegResult.path, ...(dropLegResult?.path ?? []).slice(1)]
      : [];
  const activeLegPath =
    activeLeg === "pickup"
      ? (pickupLegResult?.path ?? [])
      : (dropLegResult?.path ?? []);

  return (
    <AppShell
      eyebrow="Routing"
      title="Delivery path and Dijkstra demo"
      description="Load an assigned order to inspect the city graph, highlighted route, and algorithm iterations."
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setOrderIdInput(orderIdInput.trim());
        }}
        className="flex max-w-2xl flex-col gap-3 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center"
      >
        <input
          value={orderIdInput}
          onChange={(event) => setOrderIdInput(event.target.value)}
          placeholder="Order ID"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 font-mono text-sm text-foreground outline-none transition-colors focus:border-foreground"
        />
        <button
          type="submit"
          className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-secondary"
        >
          Load route
        </button>
      </form>

      {order ? (
        <section className="mt-6 grid gap-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-sm text-muted">Status</p>
              <p className="mt-2 text-xl font-medium text-foreground">{order.status}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-sm text-muted">Assigned rider</p>
              <p className="mt-2 text-xl font-medium text-foreground">
                {assignedRider?.name ?? "Not assigned"}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-sm text-muted">Total distance</p>
              <p className="mt-2 text-xl font-medium tabular text-foreground">
                {routeDistance}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted">Route steps</p>
                <p className="mt-2 text-base text-secondary">
                  Rider location → Pickup → Drop
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDemoOpen((value) => !value)}
                className="rounded-lg border border-border px-3 py-2 text-sm text-secondary transition-colors hover:bg-raised hover:text-foreground"
              >
                {demoOpen ? "Hide DSA demo" : "Show DSA demo"}
              </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg bg-raised p-4">
                <p className="text-sm text-muted">Rider</p>
                <p className="mt-2 font-mono text-lg font-medium text-foreground">
                  {assignedRider?.location ?? "Unknown"}
                </p>
              </div>
              <div className="rounded-lg bg-raised p-4">
                <p className="text-sm text-muted">Pickup</p>
                <p className="mt-2 font-mono text-lg font-medium text-foreground">
                  {order.pickup}
                </p>
              </div>
              <div className="rounded-lg bg-raised p-4">
                <p className="text-sm text-muted">Drop</p>
                <p className="mt-2 font-mono text-lg font-medium text-foreground">
                  {order.drop}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <GraphView
                graph={graph}
                highlightPath={highlightPath}
                currentNode={activeSteps[0]?.visited ?? ""}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveLeg("pickup")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeLeg === "pickup"
                  ? "bg-foreground text-surface"
                  : "border border-border text-secondary hover:bg-raised"
              }`}
            >
              {legTitle.pickup}
            </button>
            <button
              type="button"
              onClick={() => setActiveLeg("drop")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeLeg === "drop"
                  ? "bg-foreground text-surface"
                  : "border border-border text-secondary hover:bg-raised"
              }`}
            >
              {legTitle.drop}
            </button>
          </div>

          {demoOpen ? (
            <DSAStepDemo
              key={activeLeg}
              steps={activeSteps}
              title={legTitle[activeLeg]}
              shortestPath={activeLegPath}
            />
          ) : null}
        </section>
      ) : (
        <div className="mt-6 rounded-xl border border-border bg-surface px-5 py-6 text-sm text-secondary">
          Load an assigned order to inspect the route visualization
        </div>
      )}
    </AppShell>
  );
}
