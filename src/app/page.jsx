"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const roleRoutes = {
  Customer: {
    href: "/place-order",
    summary: "Place an order on the city graph and track delivery status",
  },
  Rider: {
    href: "/rider",
    summary: "Accept the nearest pending order using greedy selection",
  },
  Admin: {
    href: "/dashboard",
    summary: "Watch live order counts, riders, and delivery progress",
  },
};

const routePreview = [
  "Restaurant",
  "ClockTower",
  "Dalanwala",
  "Ballupur",
];

export default function HomePage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return localStorage.getItem("smart-delivery-role") ?? "";
  });

  const chooseRole = (role) => {
    localStorage.setItem("smart-delivery-role", role);
    setSelectedRole(role);
    router.push(roleRoutes[role].href);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span aria-hidden className="inline-block h-2 w-8 rounded-sm bg-accent" />
            <span className="text-[15px] font-medium tracking-tight">
              Smart Food Delivery Router
            </span>
          </div>
          <Link
            href="/routing"
            className="rounded-lg border border-border px-3 py-2 text-sm text-secondary transition-colors hover:bg-raised hover:text-foreground"
          >
            Open routing view
          </Link>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-56px)] max-w-[1440px] lg:grid-cols-[1fr_1fr]">
        <section className="flex flex-col justify-center border-b border-border px-6 py-16 lg:border-b-0 lg:border-r lg:px-8 lg:py-20">
          <p className="text-sm text-muted">Delivery dispatch simulation</p>
          <h1 className="mt-4 max-w-xl text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            Route food orders with graphs, Dijkstra, and greedy rider choice
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-secondary">
            Pick a role to place orders, assign riders by shortest pickup distance,
            and inspect the step-by-step path across Dehradun city nodes.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {Object.entries(roleRoutes).map(([role, meta]) => {
              const active = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => chooseRole(role)}
                  className={`rounded-xl border px-4 py-4 text-left transition-colors ${
                    active
                      ? "border-accent bg-accent-soft"
                      : "border-border bg-surface hover:bg-raised"
                  }`}
                >
                  <span className="block text-sm text-muted">Continue as</span>
                  <span className="mt-2 block text-lg font-medium text-foreground">
                    {role}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-secondary">
                    {meta.summary}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="flex flex-col justify-center bg-surface px-6 py-16 lg:px-8 lg:py-20">
          <div className="rounded-xl border border-border bg-background p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted">Signature route</p>
                <p className="mt-1 text-lg font-medium text-foreground">
                  Rider to pickup to drop
                </p>
              </div>
              <span className="font-mono text-sm tabular text-muted">4 hops</span>
            </div>

            <div className="mt-8 space-y-0">
              {routePreview.map((node, index) => (
                <div key={node} className="flex gap-4">
                  <div className="flex w-4 flex-col items-center">
                    <span
                      className={`mt-1 h-3 w-3 rounded-full ${
                        index === 0 || index === routePreview.length - 1
                          ? "bg-accent"
                          : "bg-foreground"
                      }`}
                    />
                    {index < routePreview.length - 1 ? (
                      <span className="my-1 w-px flex-1 bg-border" />
                    ) : null}
                  </div>
                  <div className={`pb-6 ${index === routePreview.length - 1 ? "pb-0" : ""}`}>
                    <p className="font-mono text-sm text-foreground">{node}</p>
                    <p className="mt-1 text-sm text-muted">
                      {index === 0
                        ? "Restaurant pickup"
                        : index === routePreview.length - 1
                          ? "Customer drop"
                          : "Transit node"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-background px-4 py-4">
              <dt className="text-sm text-muted">DSA modules</dt>
              <dd className="mt-2 text-3xl font-medium tabular text-foreground">5</dd>
            </div>
            <div className="rounded-xl border border-border bg-background px-4 py-4">
              <dt className="text-sm text-muted">City nodes</dt>
              <dd className="mt-2 text-3xl font-medium tabular text-foreground">8</dd>
            </div>
          </dl>

          <ul className="mt-6 space-y-3 text-sm leading-6 text-secondary">
            <li>Weighted graph models the city roads</li>
            <li>Dijkstra finds the shortest delivery legs</li>
            <li>Bubble sort ranks riders by pickup distance</li>
            <li>Greedy choice picks the best available rider</li>
          </ul>
        </aside>
      </main>
    </div>
  );
}
