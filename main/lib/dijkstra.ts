// lib/dijkstra.ts

export type Node = string;

export interface Edge {
  node: Node;
  weight: number; // distance in some unit (e.g. kilometers or time)
}

export type Graph = Record<Node, Edge[]>;

// A simplified graph of major cities/areas in and around Metro Manila (Luzon)
export const luzonGraph: Graph = {
  "Manila": [
    { node: "Quezon City", weight: 8 },
    { node: "Makati", weight: 6 },
    { node: "Pasay", weight: 5 },
    { node: "Caloocan", weight: 9 },
    { node: "San Juan", weight: 7 }
  ],
  "Quezon City": [
    { node: "Manila", weight: 8 },
    { node: "Caloocan", weight: 10 },
    { node: "San Juan", weight: 6 },
    { node: "Marikina", weight: 11 },
    { node: "Pasig", weight: 10 },
    { node: "Bulacan", weight: 25 }
  ],
  "Makati": [
    { node: "Manila", weight: 6 },
    { node: "Pasay", weight: 4 },
    { node: "Mandaluyong", weight: 3 },
    { node: "Taguig", weight: 5 },
    { node: "San Juan", weight: 7 }
  ],
  "Taguig": [
    { node: "Makati", weight: 5 },
    { node: "Pasig", weight: 6 },
    { node: "Paranaque", weight: 8 },
    { node: "Muntinlupa", weight: 12 }
  ],
  "Pasig": [
    { node: "Quezon City", weight: 10 },
    { node: "Mandaluyong", weight: 4 },
    { node: "Marikina", weight: 7 },
    { node: "Taguig", weight: 6 },
    { node: "Antipolo", weight: 15 }
  ],
  "Mandaluyong": [
    { node: "Makati", weight: 3 },
    { node: "San Juan", weight: 4 },
    { node: "Pasig", weight: 4 }
  ],
  "San Juan": [
    { node: "Manila", weight: 7 },
    { node: "Quezon City", weight: 6 },
    { node: "Mandaluyong", weight: 4 }
  ],
  "Caloocan": [
    { node: "Manila", weight: 9 },
    { node: "Quezon City", weight: 10 },
    { node: "Bulacan", weight: 18 }
  ],
  "Marikina": [
    { node: "Quezon City", weight: 11 },
    { node: "Pasig", weight: 7 },
    { node: "Antipolo", weight: 12 }
  ],
  "Pasay": [
    { node: "Manila", weight: 5 },
    { node: "Makati", weight: 4 },
    { node: "Paranaque", weight: 6 }
  ],
  "Paranaque": [
    { node: "Pasay", weight: 6 },
    { node: "Taguig", weight: 8 },
    { node: "Las Pinas", weight: 7 }
  ],
  "Las Pinas": [
    { node: "Paranaque", weight: 7 },
    { node: "Muntinlupa", weight: 8 },
    { node: "Cavite", weight: 15 }
  ],
  "Muntinlupa": [
    { node: "Taguig", weight: 12 },
    { node: "Las Pinas", weight: 8 },
    { node: "Laguna", weight: 18 }
  ],
  "Antipolo": [
    { node: "Marikina", weight: 12 },
    { node: "Pasig", weight: 15 }
  ],
  "Bulacan": [
    { node: "Caloocan", weight: 18 },
    { node: "Quezon City", weight: 25 }
  ],
  "Cavite": [
    { node: "Las Pinas", weight: 15 }
  ],
  "Laguna": [
    { node: "Muntinlupa", weight: 18 }
  ]
};

export interface PathResult {
  path: Node[];
  distance: number;
}

export function findShortestPath(graph: Graph, startNode: Node, endNode: Node): PathResult {
  let distances: Record<Node, number> = {};
  let previous: Record<Node, Node | null> = {};
  let unvisited = new Set<Node>();

  for (let node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
    unvisited.add(node);
  }

  distances[startNode] = 0;

  while (unvisited.size > 0) {
    let currNode: Node | null = null;
    let minDistance = Infinity;

    for (let node of unvisited) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        currNode = node;
      }
    }

    if (currNode === null || currNode === endNode) {
      break;
    }

    unvisited.delete(currNode);

    for (let neighbor of graph[currNode]) {
      let alt = distances[currNode] + neighbor.weight;
      if (alt < distances[neighbor.node]) {
        distances[neighbor.node] = alt;
        previous[neighbor.node] = currNode;
      }
    }
  }

  let path: Node[] = [];
  let curr: Node | null = endNode;
  
  if (distances[endNode] === Infinity) {
    return { path: [], distance: Infinity };
  }

  while (curr !== null) {
    path.unshift(curr);
    curr = previous[curr];
  }

  return { path, distance: distances[endNode] };
}
