// CONCEPT: Weighted Graph
// WHY USED: It models city connections so delivery routes can be computed with shortest-path algorithms.
// TIME COMPLEXITY: O(V + E) storage for the adjacency list.
// WHERE SHOWN IN UI: routing page and Dijkstra demo.

export const graph = {
  Restaurant: [
    { node: "ClockTower", weight: 2 },
    { node: "Dalanwala", weight: 3 },
  ],
  ClockTower: [
    { node: "Restaurant", weight: 2 },
    { node: "RajpurRoad", weight: 3 },
    { node: "Dalanwala", weight: 2 },
    { node: "ISBT", weight: 5 },
  ],
  RajpurRoad: [{ node: "ClockTower", weight: 3 }, { node: "Jakhan", weight: 2 }],
  Jakhan: [{ node: "RajpurRoad", weight: 2 }, { node: "Ballupur", weight: 3 }],
  ISBT: [{ node: "ClockTower", weight: 5 }, { node: "PremNagar", weight: 3 }],
  Ballupur: [{ node: "Jakhan", weight: 3 }, { node: "PremNagar", weight: 4 }, { node: "Dalanwala", weight: 4 }],
  PremNagar: [{ node: "Ballupur", weight: 4 }, { node: "ISBT", weight: 3 }],
  Dalanwala: [
    { node: "ClockTower", weight: 2 },
    { node: "Ballupur", weight: 4 },
    { node: "Restaurant", weight: 3 },
  ],
};

export const cityNodes = Object.keys(graph);