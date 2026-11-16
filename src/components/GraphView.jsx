"use client";

const positions = {
  Restaurant: { x: 120, y: 150 },
  ClockTower: { x: 260, y: 120 },
  RajpurRoad: { x: 430, y: 90 },
  Jakhan: { x: 580, y: 150 },
  ISBT: { x: 170, y: 300 },
  Ballupur: { x: 390, y: 270 },
  PremNagar: { x: 610, y: 320 },
  Dalanwala: { x: 310, y: 210 },
};

const edgeKey = (left, right) => [left, right].sort().join("::");

export default function GraphView({ graph, highlightPath = [], currentNode = "" }) {
  const nodes = Object.keys(graph);
  const highlightEdges = new Set();

  for (let index = 0; index < highlightPath.length - 1; index += 1) {
    highlightEdges.add(edgeKey(highlightPath[index], highlightPath[index + 1]));
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-raised p-4">
      <svg viewBox="0 0 740 420" className="h-auto w-full">
        {nodes.flatMap((node) =>
          (graph[node] ?? []).map((edge) => {
            if (node > edge.node) {
              return null;
            }

            const start = positions[node];
            const end = positions[edge.node];
            const active = highlightEdges.has(edgeKey(node, edge.node));

            return (
              <g key={`${node}-${edge.node}`}>
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={active ? "#c2410c" : "rgba(23, 23, 23, 0.16)"}
                  strokeWidth={active ? 3.5 : 1.5}
                  strokeLinecap="round"
                  strokeDasharray={active ? "0" : undefined}
                />
                <text
                  x={(start.x + end.x) / 2}
                  y={(start.y + end.y) / 2 - 8}
                  fill="#737373"
                  fontSize="12"
                  fontFamily="var(--font-plex-mono), monospace"
                  textAnchor="middle"
                >
                  {edge.weight}
                </text>
              </g>
            );
          }),
        )}

        {nodes.map((node) => {
          const position = positions[node];
          const isCurrent = currentNode === node;
          const isHighlighted = highlightPath.includes(node);

          return (
            <g key={node} transform={`translate(${position.x}, ${position.y})`}>
              <circle
                r={isCurrent ? 20 : isHighlighted ? 17 : 15}
                fill={isCurrent ? "#c2410c" : isHighlighted ? "#171717" : "#ffffff"}
                stroke={isCurrent || isHighlighted ? "transparent" : "rgba(23, 23, 23, 0.16)"}
                strokeWidth={1.5}
              />
              <text
                y={4}
                textAnchor="middle"
                fill={isCurrent || isHighlighted ? "#ffffff" : "#171717"}
                fontSize="10"
                fontWeight="500"
                fontFamily="var(--font-space-grotesk), sans-serif"
              >
                {node.length > 10 ? `${node.slice(0, 8)}…` : node}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
