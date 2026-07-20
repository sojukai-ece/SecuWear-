"use client"
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { luzonGraph, Node } from '@/lib/dijkstra';

interface MapVisualizerProps {
  path: Node[];
  startNode?: Node;
  endNode?: Node;
}

// Fixed coordinates for our graph nodes for simple visualization
const nodeCoordinates: Record<Node, { x: number, y: number }> = {
  "Bulacan": { x: 50, y: 10 },
  "Caloocan": { x: 45, y: 30 },
  "Quezon City": { x: 60, y: 40 },
  "Manila": { x: 40, y: 50 },
  "San Juan": { x: 55, y: 48 },
  "Marikina": { x: 75, y: 38 },
  "Antipolo": { x: 90, y: 45 },
  "Mandaluyong": { x: 55, y: 55 },
  "Pasig": { x: 70, y: 55 },
  "Makati": { x: 50, y: 65 },
  "Pasay": { x: 40, y: 70 },
  "Taguig": { x: 65, y: 70 },
  "Paranaque": { x: 45, y: 80 },
  "Las Pinas": { x: 40, y: 90 },
  "Muntinlupa": { x: 60, y: 90 },
  "Cavite": { x: 20, y: 95 },
  "Laguna": { x: 75, y: 100 },
};

export default function MapVisualizer({ path, startNode, endNode }: MapVisualizerProps) {
  const edges = useMemo(() => {
    const allEdges: { id: string, from: Node, to: Node, inPath: boolean }[] = [];
    const seen = new Set<string>();

    for (const [node, neighbors] of Object.entries(luzonGraph)) {
      for (const neighbor of neighbors) {
        const sorted = [node, neighbor.node].sort();
        const id = `${sorted[0]}-${sorted[1]}`;
        
        if (!seen.has(id)) {
          seen.add(id);
          
          let inPath = false;
          if (path && path.length > 1) {
            for (let i = 0; i < path.length - 1; i++) {
              if (
                (path[i] === sorted[0] && path[i + 1] === sorted[1]) ||
                (path[i] === sorted[1] && path[i + 1] === sorted[0])
              ) {
                inPath = true;
                break;
              }
            }
          }

          allEdges.push({ id, from: node, to: neighbor.node, inPath });
        }
      }
    }
    return allEdges;
  }, [path]);

  return (
    <div className="relative w-full h-125 bg-black/40 rounded-xl border border-glass-border overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 110" preserveAspectRatio="xMidYMid meet">
        {/* Draw Edges */}
        {edges.map(edge => {
          const from = nodeCoordinates[edge.from];
          const to = nodeCoordinates[edge.to];
          return (
            <motion.line
              key={edge.id}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={edge.inPath ? "var(--primary)" : "var(--glass-border)"}
              strokeWidth={edge.inPath ? 1.5 : 0.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          );
        })}

        {/* Draw Nodes */}
        {Object.entries(nodeCoordinates).map(([node, coords]) => {
          const isStart = node === startNode;
          const isEnd = node === endNode;
          const isInPath = path.includes(node);
          
          let fill = "var(--glass)";
          if (isStart) fill = "var(--danger)"; // Emergency location
          else if (isEnd) fill = "var(--primary)"; // Authority location
          else if (isInPath) fill = "white";

          return (
            <g key={node}>
              <motion.circle
                cx={coords.x}
                cy={coords.y}
                r={1.5}
                fill={fill}
                stroke={isInPath ? "var(--primary)" : "var(--glass-border)"}
                strokeWidth={0.5}
                whileHover={{ scale: 1.5 }}
              />
              <text
                x={coords.x}
                y={coords.y - 2.5}
                fontSize="2"
                fill="var(--foreground)"
                textAnchor="middle"
                className="opacity-60 pointer-events-none"
              >
                {node}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
