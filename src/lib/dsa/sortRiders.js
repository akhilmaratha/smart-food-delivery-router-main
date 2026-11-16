// CONCEPT: Bubble Sort
// WHY USED: It demonstrates a simple comparison-based sort while ordering riders by pickup distance.
// TIME COMPLEXITY: O(n^2)
// WHERE SHOWN IN UI: rider page.

import { dijkstra } from "./dijkstra";
import { graph } from "./graph";

export function sortRidersByDistance(riders, pickup) {
  const comparedRiders = riders.map((rider) => {
    const { distance } = dijkstra(graph, rider.location, pickup);
    return {
      ...rider,
      distanceToPickup: Number.isFinite(distance) ? distance : Infinity,
    };
  });

  const comparisons = [];

  for (let outer = 0; outer < comparedRiders.length - 1; outer += 1) {
    for (let inner = 0; inner < comparedRiders.length - outer - 1; inner += 1) {
      const left = comparedRiders[inner];
      const right = comparedRiders[inner + 1];
      const shouldSwap = left.distanceToPickup > right.distanceToPickup;

      comparisons.push({
        left: left.name,
        right: right.name,
        leftDistance: left.distanceToPickup,
        rightDistance: right.distanceToPickup,
        swapped: shouldSwap,
      });

      if (shouldSwap) {
        [comparedRiders[inner], comparedRiders[inner + 1]] = [right, left];
      }
    }
  }

  comparedRiders.comparisons = comparisons;
  return comparedRiders;
}