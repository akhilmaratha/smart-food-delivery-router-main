// CONCEPT: Greedy Selection
// WHY USED: It chooses the best rider from the sorted candidate list using the smallest distance and workload.
// TIME COMPLEXITY: O(n)
// WHERE SHOWN IN UI: rider page and routing page.

export function greedyAssign(sortedRiders) {
  const log = [];

  if (!sortedRiders.length) {
    return { bestRider: null, log: ["No riders are available for assignment."] };
  }

  let bestRider = sortedRiders[0];
  log.push(`Start with ${bestRider.name} as the current best rider.`);

  for (let index = 1; index < sortedRiders.length; index += 1) {
    const candidate = sortedRiders[index];
    const bestDistance = bestRider.distanceToPickup;
    const candidateDistance = candidate.distanceToPickup;

    if (candidateDistance < bestDistance) {
      log.push(`${candidate.name} is closer than ${bestRider.name}, so the best rider changes.`);
      bestRider = candidate;
      continue;
    }

    if (candidateDistance === bestDistance && candidate.workload < bestRider.workload) {
      log.push(`${candidate.name} has the same distance but a lower workload, so they are preferred.`);
      bestRider = candidate;
      continue;
    }

    log.push(`${candidate.name} is skipped because ${bestRider.name} remains a better choice.`);
  }

  log.push(`Greedy choice complete: ${bestRider.name} is selected.`);
  return { bestRider, log };
}