export default function OrderCard({ order, actionSlot }) {
  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-muted">Order {order.id}</p>
          <h3 className="mt-2 text-lg font-medium text-foreground">
            {order.customerName}
          </h3>
          <p className="mt-2 text-sm text-secondary">
            <span className="font-mono">{order.pickup}</span>
            <span className="mx-2 text-muted">→</span>
            <span className="font-mono">{order.drop}</span>
          </p>
        </div>
        <span className="rounded-md border border-border bg-raised px-2.5 py-1 text-xs font-medium text-secondary">
          {order.status}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-secondary">{order.details}</p>
      {actionSlot ? <div className="mt-4">{actionSlot}</div> : null}
    </article>
  );
}
