import { NextResponse } from "next/server";
import store from "@/lib/store";
import { dijkstra, dijkstraSteps } from "@/lib/dsa/dijkstra";
import { greedyAssign } from "@/lib/dsa/greedyAssign";
import { graph } from "@/lib/dsa/graph";
import { sortRidersByDistance } from "@/lib/dsa/sortRiders";

export async function POST(request) {
  const body = await request.json();
  const orderId = body.orderId?.toString();
  const riderId = body.riderId?.toString();

  if (!orderId || !riderId) {
    return NextResponse.json({ error: "orderId and riderId are required" }, { status: 400 });
  }

  const order = store.orders.find((entry) => entry.id === orderId);
  const requestedRider = store.riders.find((entry) => entry.id === riderId);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (!requestedRider) {
    return NextResponse.json({ error: "Rider not found" }, { status: 404 });
  }

  if (order.status !== "Pending") {
    return NextResponse.json({ error: "Order is already assigned or delivered" }, { status: 409 });
  }

  const availableRiders = store.riders.filter((rider) => rider.status === "Available");

  if (!availableRiders.length) {
    return NextResponse.json({ error: "No available riders" }, { status: 409 });
  }

  const sortedRiders = sortRidersByDistance(availableRiders, order.pickup);
  const { bestRider, log } = greedyAssign(sortedRiders);

  if (!bestRider) {
    return NextResponse.json({ error: "Unable to select a rider" }, { status: 409 });
  }

  if (bestRider.id !== requestedRider.id) {
    return NextResponse.json(
      {
        error: "Greedy selection chose a different rider",
        bestRider,
        greedyLog: log,
        sortedRiders,
      },
      { status: 409 },
    );
  }

  const pickupLeg = dijkstra(graph, requestedRider.location, order.pickup);
  const dropLeg = dijkstra(graph, order.pickup, order.drop);

  const route = [...pickupLeg.path, ...dropLeg.path.slice(1)];
  const totalDistance = (Number.isFinite(pickupLeg.distance) ? pickupLeg.distance : 0) +
    (Number.isFinite(dropLeg.distance) ? dropLeg.distance : 0);
  const eta = totalDistance * 3;

  order.status = "Assigned";
  order.assignedRider = {
    id: requestedRider.id,
    name: requestedRider.name,
    location: requestedRider.location,
  };
  order.route = route;
  order.totalDistance = totalDistance;
  order.eta = eta;

  requestedRider.status = "Busy";
  requestedRider.workload += 1;

  return NextResponse.json({
    order,
    assignedRider: requestedRider,
    route,
    totalDistance,
    eta,
    greedyLog: log,
    sortedRiders,
    dijkstraStepsPickup: dijkstraSteps(graph, requestedRider.location, order.pickup),
    dijkstraStepsDrop: dijkstraSteps(graph, order.pickup, order.drop),
  });
}