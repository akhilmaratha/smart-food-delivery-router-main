export default function RiderCard({ rider, highlighted = false, actionSlot }) {
  return (
    <article
      className={`rounded-xl border p-5 ${
        highlighted
          ? "border-accent bg-accent-soft"
          : "border-border bg-surface"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-muted">Rider {rider.id}</p>
          <h3 className="mt-2 text-lg font-medium text-foreground">{rider.name}</h3>
          <p className="mt-2 text-sm text-secondary">
            Location: <span className="font-mono">{rider.location}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-secondary">{rider.status}</p>
          <p className="mt-1 font-mono text-sm tabular text-muted">
            Workload {rider.workload}
          </p>
        </div>
      </div>
      {typeof rider.distanceToPickup === "number" ? (
        <div className="mt-4 rounded-lg bg-raised px-3 py-2 text-sm text-secondary">
          Distance to pickup:{" "}
          <span className="font-mono tabular text-foreground">
            {rider.distanceToPickup}
          </span>
        </div>
      ) : null}
      {actionSlot ? <div className="mt-4">{actionSlot}</div> : null}
    </article>
  );
}
