const ridersSeed = [
  { id: "R1", name: "Amit", location: "Restaurant", status: "Available", workload: 0 },
  { id: "R2", name: "Ravi", location: "ISBT", status: "Available", workload: 0 },
  { id: "R3", name: "Suresh", location: "Ballupur", status: "Available", workload: 0 },
  { id: "R4", name: "Neeraj", location: "ClockTower", status: "Available", workload: 0 },
  { id: "R5", name: "Deepak", location: "Dalanwala", status: "Available", workload: 0 },
];

const createStore = () => ({
  orders: [],
  riders: ridersSeed.map((rider) => ({ ...rider })),
});

const globalStoreKey = "__smartFoodDeliveryStore__";

const store = globalThis[globalStoreKey] ?? createStore();

if (!globalThis[globalStoreKey]) {
  globalThis[globalStoreKey] = store;
}

export default store;