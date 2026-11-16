import { Suspense } from "react";
import RoutingClient from "./RoutingClient";

export default function RoutingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background px-6 py-8">
          <div className="mx-auto max-w-[1440px] card px-5 py-6 text-sm text-secondary">
            Loading routing view…
          </div>
        </div>
      }
    >
      <RoutingClient />
    </Suspense>
  );
}
