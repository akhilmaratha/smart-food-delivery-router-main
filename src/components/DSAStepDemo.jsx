"use client";

import { useState } from "react";
import GraphView from "./GraphView";
import { graph } from "@/lib/dsa/graph";

const allNodes = Object.keys(graph);

const formatDistance = (value) => (Number.isFinite(value) ? value : "∞");

export default function DSAStepDemo({ steps = [], title = "Dijkstra Demo", shortestPath = [] }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [mode, setMode] = useState("route");
  const [routeIndex, setRouteIndex] = useState(0);

  if (!steps.length) {
    return (
      <div className="rounded-xl border border-border bg-surface p-5 text-sm text-secondary">
        No Dijkstra steps available yet
      </div>
    );
  }

  const step = steps[stepIndex];
  const finalizedNodes = steps.slice(0, stepIndex + 1).map((entry) => entry.visited);
  const hasRoute = shortestPath.length > 0;
  const isRouteMode = mode === "route" && hasRoute;
  const currentRouteNode = hasRoute ? shortestPath[routeIndex] : "";
  const headerStep = isRouteMode ? routeIndex + 1 : stepIndex + 1;
  const headerTotal = isRouteMode ? shortestPath.length : steps.length;

  const goPrev = () => {
    if (isRouteMode) {
      setRouteIndex((value) => Math.max(0, value - 1));
      return;
    }
    setStepIndex((value) => Math.max(0, value - 1));
  };

  const goNext = () => {
    if (isRouteMode) {
      setRouteIndex((value) => Math.min(shortestPath.length - 1, value + 1));
      return;
    }
    setStepIndex((value) => Math.min(steps.length - 1, value + 1));
  };

  const prevDisabled = headerStep === 1;
  const nextDisabled = headerStep === headerTotal;

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3">
        <div>
          <p className="text-sm text-muted">{title}</p>
          <h3 className="mt-1 text-lg font-medium text-foreground">
            {isRouteMode ? "Route hop" : "Iteration"} {headerStep} of {headerTotal}
          </h3>
          {shortestPath.length ? (
            <p className="mt-1 font-mono text-sm text-secondary">
              {shortestPath.join(" → ")}
            </p>
          ) : null}
          <p className="mt-1 text-xs text-muted">
            Dijkstra explored {steps.length} iterations for this leg
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hasRoute ? (
            <>
              <button
                type="button"
                onClick={() => setMode("route")}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                  isRouteMode
                    ? "bg-foreground text-surface"
                    : "border border-border text-secondary hover:bg-raised"
                }`}
              >
                Shortest hops
              </button>
              <button
                type="button"
                onClick={() => setMode("algorithm")}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                  !isRouteMode
                    ? "bg-foreground text-surface"
                    : "border border-border text-secondary hover:bg-raised"
                }`}
              >
                Dijkstra steps
              </button>
            </>
          ) : null}

          <button
            type="button"
            onClick={goPrev}
            disabled={prevDisabled}
            className="rounded-lg border border-border px-3 py-2 text-sm text-secondary transition-colors hover:bg-raised disabled:opacity-40"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={nextDisabled}
            className="rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-surface transition-colors hover:bg-secondary disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <GraphView
        graph={graph}
        currentNode={isRouteMode ? currentRouteNode : step.visited}
        highlightPath={shortestPath}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-muted">Currently visiting</p>
          <p className="mt-2 font-mono text-2xl font-medium text-foreground">
            {step.visited}
          </p>
          <p className="mt-4 text-sm text-muted">Finalized nodes</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {finalizedNodes.map((node) => (
              <span
                key={node}
                className="rounded-md bg-raised px-2.5 py-1 font-mono text-sm text-secondary"
              >
                {node}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-muted">Previous links</p>
          <div className="mt-3 space-y-2">
            {allNodes.map((node) => (
              <div
                key={node}
                className="flex items-center justify-between rounded-lg bg-raised px-3 py-2 text-sm"
              >
                <span className="font-mono text-foreground">{node}</span>
                <span className="font-mono text-muted">
                  {step.previous[node] ?? "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-raised text-secondary">
            <tr>
              <th className="px-4 py-3 font-medium">Node</th>
              <th className="px-4 py-3 font-medium">Distance</th>
              <th className="px-4 py-3 font-medium">Previous</th>
            </tr>
          </thead>
          <tbody>
            {allNodes.map((node) => (
              <tr
                key={node}
                className={
                  node === step.visited
                    ? "bg-accent-soft"
                    : "border-t border-border"
                }
              >
                <td className="px-4 py-3 font-mono text-foreground">{node}</td>
                <td className="px-4 py-3 font-mono tabular text-secondary">
                  {formatDistance(step.distances[node])}
                </td>
                <td className="px-4 py-3 font-mono text-muted">
                  {step.previous[node] ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
