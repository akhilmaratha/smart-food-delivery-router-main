import { NextResponse } from "next/server";
import store from "@/lib/store";

export function GET(request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("id");

  if (orderId) {
    const order = store.orders.find((entry) => entry.id === orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order, riders: store.riders });
  }

  const orders = [...store.orders].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  const pendingOrders = orders.filter((order) => order.status === "Pending");

  return NextResponse.json({ orders, pendingOrders, riders: store.riders });
}

export async function POST(request) {
  const body = await request.json();
  const customerName = body.customerName?.trim();
  const pickup = body.pickup?.trim();
  const drop = body.drop?.trim();
  const details = body.details?.trim();

  if (!customerName || !pickup || !drop || !details) {
    return NextResponse.json({ error: "All order fields are required" }, { status: 400 });
  }

  const order = {
    id: String(Date.now()),
    customerName,
    pickup,
    drop,
    details,
    status: "Pending",
    assignedRider: null,
    route: [],
    totalDistance: 0,
    eta: 0,
    createdAt: new Date().toISOString(),
  };

  store.orders.unshift(order);
  return NextResponse.json({ order }, { status: 201 });
}

export async function PATCH(request) {
  const body = await request.json();
  const orderId = body.orderId?.toString();

  if (!orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  const order = store.orders.find((entry) => entry.id === orderId);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  order.status = "Delivered";

  if (order.assignedRider) {
    const rider = store.riders.find((entry) => entry.id === order.assignedRider.id);

    if (rider) {
      rider.status = "Available";
      rider.workload = Math.max(0, rider.workload - 1);
    }
  }

  return NextResponse.json({ order });
}