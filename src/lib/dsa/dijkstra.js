// CONCEPT: Dijkstra's Shortest Path
// WHY USED: It finds the minimum-distance delivery route between two city nodes.
// TIME COMPLEXITY: O((V + E) log V) with a binary min-heap.
// WHERE SHOWN IN UI: routing page and DSA demo.

class MinPriorityQueue {
  constructor() {
    this.heap = [];
  }

  push(value, priority) {
    this.heap.push({ value, priority });
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) {
      return null;
    }

    const root = this.heap[0];
    const tail = this.heap.pop();

    if (this.heap.length > 0 && tail) {
      this.heap[0] = tail;
      this.bubbleDown(0);
    }

    return root;
  }

  bubbleUp(index) {
    let currentIndex = index;
    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2);
      if (this.heap[parentIndex].priority <= this.heap[currentIndex].priority) {
        break;
      }

      [this.heap[parentIndex], this.heap[currentIndex]] = [
        this.heap[currentIndex],
        this.heap[parentIndex],
      ];
      currentIndex = parentIndex;
    }
  }

  bubbleDown(index) {
    let currentIndex = index;

    while (true) {
      const left = currentIndex * 2 + 1;
      const right = currentIndex * 2 + 2;
      let smallest = currentIndex;

      if (left < this.heap.length && this.heap[left].priority < this.heap[smallest].priority) {
        smallest = left;
      }

      if (right < this.heap.length && this.heap[right].priority < this.heap[smallest].priority) {
        smallest = right;
      }

      if (smallest === currentIndex) {
        break;
      }

      [this.heap[currentIndex], this.heap[smallest]] = [this.heap[smallest], this.heap[currentIndex]];
      currentIndex = smallest;
    }
  }
}

const snapshot = (distances, previous) => ({
  distances: { ...distances },
  previous: { ...previous },
});

export function dijkstra(graph, startNode, endNode) {
  const distances = {};
  const previous = {};
  const visited = new Set();
  const queue = new MinPriorityQueue();

  for (const node of Object.keys(graph)) {
    distances[node] = Infinity;
    previous[node] = null;
  }

  distances[startNode] = 0;
  queue.push(startNode, 0);

  while (true) {
    const entry = queue.pop();
    if (!entry) {
      break;
    }

    const currentNode = entry.value;
    if (visited.has(currentNode)) {
      continue;
    }

    visited.add(currentNode);

    if (currentNode === endNode) {
      break;
    }

    for (const edge of graph[currentNode] ?? []) {
      const nextDistance = distances[currentNode] + edge.weight;
      if (nextDistance < distances[edge.node]) {
        distances[edge.node] = nextDistance;
        previous[edge.node] = currentNode;
        queue.push(edge.node, nextDistance);
      }
    }
  }

  const path = [];
  let cursor = endNode;

  if (Number.isFinite(distances[endNode])) {
    while (cursor) {
      path.unshift(cursor);
      cursor = previous[cursor];
    }
  }

  return { distance: distances[endNode], path };
}

export function dijkstraSteps(graph, startNode, endNode) {
  const distances = {};
  const previous = {};
  const visited = new Set();
  const queue = new MinPriorityQueue();
  const steps = [];

  for (const node of Object.keys(graph)) {
    distances[node] = Infinity;
    previous[node] = null;
  }

  distances[startNode] = 0;
  queue.push(startNode, 0);

  while (true) {
    const entry = queue.pop();
    if (!entry) {
      break;
    }

    const currentNode = entry.value;
    if (visited.has(currentNode)) {
      continue;
    }

    visited.add(currentNode);
    steps.push({ visited: currentNode, ...snapshot(distances, previous) });

    if (currentNode === endNode) {
      break;
    }

    for (const edge of graph[currentNode] ?? []) {
      const nextDistance = distances[currentNode] + edge.weight;
      if (nextDistance < distances[edge.node]) {
        distances[edge.node] = nextDistance;
        previous[edge.node] = currentNode;
        queue.push(edge.node, nextDistance);
      }
    }
  }

  return steps;
}