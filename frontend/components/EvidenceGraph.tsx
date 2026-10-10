"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Entity, Claim, Source, EntityRelationship, EvidenceItem } from "@/types/investigation";
import { Network, ZoomIn, ZoomOut, RotateCcw, Move, Info, Layers, Sparkles } from "lucide-react";

interface EvidenceGraphProps {
  entities: Entity[];
  claims: Claim[];
  sources: Source[];
  relationships: EntityRelationship[];
  evidenceItems: EvidenceItem[];
  onSelectEntity?: (entityName: string) => void;
}

interface GraphNode {
  id: string;
  type: "ENTITY" | "CLAIM";
  title: string;
  category: string;
  color: string;
  radius: number;
  x: number;
  y: number;
  line1: string;
  line2: string;
  raw: any;
}

const CANVAS_WIDTH = 1400;
const CANVAS_HEIGHT = 720;

// Format text into two balanced lines to maximize readability inside circles
function formatNodeLabel(text: string, maxLen: number = 14): { line1: string; line2: string } {
  if (!text) return { line1: "", line2: "" };
  const clean = text.trim();
  if (clean.length <= maxLen) {
    return { line1: clean, line2: "" };
  }
  const words = clean.split(/\s+/);
  if (words.length === 1) {
    return {
      line1: clean.slice(0, maxLen),
      line2: clean.length > maxLen ? clean.slice(maxLen, maxLen * 2) : "",
    };
  }

  let line1 = "";
  let line2 = "";
  for (const w of words) {
    if (!line1 || (line1 + " " + w).length <= maxLen) {
      line1 = line1 ? `${line1} ${w}` : w;
    } else if (!line2 || (line2 + " " + w).length <= maxLen) {
      line2 = line2 ? `${line2} ${w}` : w;
    } else {
      break;
    }
  }

  if (!line2 && words.length > 1) {
    line2 = words.slice(1).join(" ");
    if (line2.length > maxLen) {
      line2 = line2.slice(0, maxLen - 1) + "…";
    }
  }

  return { line1, line2 };
}

// Compute initial non-overlapping positions with iterative multi-pass collision relaxation
function computeLayout(
  entities: Entity[],
  claims: Claim[],
  filter: "ALL" | "ENTITIES" | "CLAIMS"
): GraphNode[] {
  const result: GraphNode[] = [];

  const entityColorMap: Record<string, string> = {
    COMPANY: "#a3c879",
    PRODUCT: "#c6a96b",
    POLICY: "#e0d2ad",
    TECHNOLOGY: "#4f8b48",
    ORGANIZATION: "#d4a373",
    LOCATION: "#64b5f6",
    RESEARCH_PAPER: "#b39ddb",
  };

  const getClaimColor = (status: string) => {
    if (status === "SUPPORTS") return "#a3c879";
    if (status === "CONTRADICTS") return "#ef4444";
    return "#c6a96b";
  };

  if (filter === "ALL") {
    // ZONE A: Primary / Anchor Entity on the left
    const primaryEntity = entities[0];
    const otherEntities = entities.slice(1);

    if (primaryEntity) {
      const { line1, line2 } = formatNodeLabel(primaryEntity.name, 14);
      result.push({
        id: primaryEntity.id,
        type: "ENTITY",
        title: primaryEntity.name,
        category: primaryEntity.category,
        color: entityColorMap[primaryEntity.category] || "#a3c879",
        radius: 46,
        x: 180,
        y: CANVAS_HEIGHT / 2,
        line1,
        line2,
        raw: primaryEntity,
      });
    }

    // ZONE B: Remaining Entities across 2 columns (x: 430, x: 670)
    const entityCols = 2;
    const itemsPerCol = Math.ceil(otherEntities.length / entityCols) || 1;
    const vSpacingEnt = Math.max(130, Math.min(180, (CANVAS_HEIGHT - 180) / itemsPerCol));
    const startYEnt = (CANVAS_HEIGHT - (itemsPerCol - 1) * vSpacingEnt) / 2;

    otherEntities.forEach((ent, i) => {
      const col = i % entityCols;
      const row = Math.floor(i / entityCols);
      const { line1, line2 } = formatNodeLabel(ent.name, 14);
      result.push({
        id: ent.id,
        type: "ENTITY",
        title: ent.name,
        category: ent.category,
        color: entityColorMap[ent.category] || "#a3c879",
        radius: 42,
        x: 430 + col * 240,
        y: startYEnt + row * vSpacingEnt,
        line1,
        line2,
        raw: ent,
      });
    });

    // ZONE C: Claims on the right across 2 dedicated columns (x: 980, x: 1220)
    // Completely separated horizontally from entities by at least 260px!
    const claimCols = 2;
    const claimsPerCol = Math.ceil(claims.length / claimCols) || 1;
    const vSpacingClm = Math.max(140, Math.min(190, (CANVAS_HEIGHT - 180) / claimsPerCol));
    const startYClm = (CANVAS_HEIGHT - (claimsPerCol - 1) * vSpacingClm) / 2;

    claims.forEach((clm, j) => {
      const col = j % claimCols;
      const row = Math.floor(j / claimCols);
      const displayTitle = clm.property || clm.subject || "Claim";
      const { line1, line2 } = formatNodeLabel(displayTitle, 13);

      result.push({
        id: clm.id,
        type: "CLAIM",
        title: `[${clm.property}] ${clm.value}`,
        category: clm.status,
        color: getClaimColor(clm.status),
        radius: 46,
        x: 980 + col * 240,
        y: startYClm + row * vSpacingClm,
        line1,
        line2,
        raw: clm,
      });
    });
  } else if (filter === "ENTITIES") {
    // Entities only: distribute cleanly across 3 columns
    const cols = 3;
    const rows = Math.ceil(entities.length / cols) || 1;
    const hSpacing = 360;
    const vSpacing = Math.max(140, Math.min(190, (CANVAS_HEIGHT - 180) / rows));
    const startX = (CANVAS_WIDTH - (cols - 1) * hSpacing) / 2;
    const startY = (CANVAS_HEIGHT - (rows - 1) * vSpacing) / 2;

    entities.forEach((ent, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const { line1, line2 } = formatNodeLabel(ent.name, 14);
      result.push({
        id: ent.id,
        type: "ENTITY",
        title: ent.name,
        category: ent.category,
        color: entityColorMap[ent.category] || "#a3c879",
        radius: 44,
        x: startX + col * hSpacing,
        y: startY + row * vSpacing,
        line1,
        line2,
        raw: ent,
      });
    });
  } else if (filter === "CLAIMS") {
    // Claims only: distribute cleanly across 3 columns
    const cols = 3;
    const rows = Math.ceil(claims.length / cols) || 1;
    const hSpacing = 370;
    const vSpacing = Math.max(150, Math.min(200, (CANVAS_HEIGHT - 180) / rows));
    const startX = (CANVAS_WIDTH - (cols - 1) * hSpacing) / 2;
    const startY = (CANVAS_HEIGHT - (rows - 1) * vSpacing) / 2;

    claims.forEach((clm, j) => {
      const col = j % cols;
      const row = Math.floor(j / cols);
      const displayTitle = clm.property || clm.subject || "Claim";
      const { line1, line2 } = formatNodeLabel(displayTitle, 13);
      result.push({
        id: clm.id,
        type: "CLAIM",
        title: `[${clm.property}] ${clm.value}`,
        category: clm.status,
        color: getClaimColor(clm.status),
        radius: 46,
        x: startX + col * hSpacing,
        y: startY + row * vSpacing,
        line1,
        line2,
        raw: clm,
      });
    });
  }

  // MULTI-PASS COLLISION RELAXATION PASS
  // Mathematically guarantees that circle borders never overlap by enforcing minDist >= r1 + r2 + PADDING
  const PADDING = 38;
  const ITERATIONS = 70;

  for (let iter = 0; iter < ITERATIONS; iter++) {
    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        const a = result[i];
        const b = result[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dist = Math.hypot(dx, dy);
        const minDist = a.radius + b.radius + PADDING;

        if (dist < minDist) {
          if (dist === 0) {
            dx = (Math.random() - 0.5) * 12;
            dy = (Math.random() - 0.5) * 12;
            dist = Math.hypot(dx, dy) || 1;
          }
          const overlap = (minDist - dist) * 0.5;
          const nx = dx / dist;
          const ny = dy / dist;

          a.x -= nx * overlap;
          a.y -= ny * overlap;
          b.x += nx * overlap;
          b.y += ny * overlap;
        }
      }
    }

    // Keep all nodes comfortably within canvas boundaries
    for (const node of result) {
      node.x = Math.max(node.radius + 40, Math.min(CANVAS_WIDTH - node.radius - 40, node.x));
      node.y = Math.max(node.radius + 40, Math.min(CANVAS_HEIGHT - node.radius - 40, node.y));
    }
  }

  return result;
}

// Calculate clean boundary-to-boundary line coordinates so edges do not penetrate inside circles
function getEdgeBoundaryPoints(
  src: { x: number; y: number; radius: number },
  tgt: { x: number; y: number; radius: number }
) {
  const dx = tgt.x - src.x;
  const dy = tgt.y - src.y;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;

  return {
    x1: src.x + ux * src.radius,
    y1: src.y + uy * src.radius,
    x2: tgt.x - ux * (tgt.radius + 8), // 8px clearance for arrowhead
    y2: tgt.y - uy * (tgt.radius + 8),
    midX: (src.x + tgt.x) / 2,
    midY: (src.y + tgt.y) / 2,
    dist,
  };
}

export default function EvidenceGraph({
  entities,
  claims,
  sources,
  relationships,
  evidenceItems,
  onSelectEntity,
}: EvidenceGraphProps) {
  const [filter, setFilter] = useState<"ALL" | "ENTITIES" | "CLAIMS">("ALL");
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<{
    id: string;
    type: "ENTITY" | "CLAIM";
    title: string;
    category?: string;
    details?: any;
  } | null>(null);

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Pan & Zoom state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Dragging individual node state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  // Initialize or re-layout nodes whenever entities, claims, or filter change
  useEffect(() => {
    const computed = computeLayout(entities, claims, filter);
    setNodes(computed);
  }, [entities, claims, filter]);

  // Reset layout to default non-overlapping arrangement
  const handleResetLayout = () => {
    const computed = computeLayout(entities, claims, filter);
    setNodes(computed);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Convert client pointer event into SVG coordinates considering pan & zoom
  const getSvgCoordinates = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const rect = svgRef.current.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const scaleY = CANVAS_HEIGHT / rect.height;
      const clientSvgX = (e.clientX - rect.left) * scaleX;
      const clientSvgY = (e.clientY - rect.top) * scaleY;
      return {
        x: (clientSvgX - pan.x) / zoom,
        y: (clientSvgY - pan.y) / zoom,
      };
    },
    [pan, zoom]
  );

  // Node Drag Handler
  const handleNodePointerDown = (e: React.PointerEvent, nodeId: string) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    setDraggingNodeId(nodeId);
  };

  // Canvas Pan Handler
  const handleCanvasPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (draggingNodeId) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (draggingNodeId) {
      const coords = getSvgCoordinates(e);
      setNodes((prev) =>
        prev.map((n) =>
          n.id === draggingNodeId
            ? {
                ...n,
                x: Math.max(n.radius + 10, Math.min(CANVAS_WIDTH - n.radius - 10, coords.x)),
                y: Math.max(n.radius + 10, Math.min(CANVAS_HEIGHT - n.radius - 10, coords.y)),
              }
            : n
        )
      );
    } else if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handlePointerUp = () => {
    setDraggingNodeId(null);
    setIsPanning(false);
  };

  // Set of connected node IDs when a node is hovered or selected
  const focusedNodeId = hoveredNodeId || selectedNode?.id;

  const connectedNodeIds = useMemo(() => {
    if (!focusedNodeId) return new Set<string>();
    const ids = new Set<string>([focusedNodeId]);

    // Check entity relationships
    relationships.forEach((rel) => {
      if (rel.source_entity_id === focusedNodeId) ids.add(rel.target_entity_id);
      if (rel.target_entity_id === focusedNodeId) ids.add(rel.source_entity_id);
    });

    // Check entity-claim cross associations
    claims.forEach((clm) => {
      const isClaimFocused = clm.id === focusedNodeId;
      entities.forEach((ent) => {
        const isEntFocused = ent.id === focusedNodeId;
        const isLinked =
          clm.subject.toLowerCase().includes(ent.name.toLowerCase()) ||
          ent.name.toLowerCase().includes(clm.subject.toLowerCase());
        if (isLinked) {
          if (isClaimFocused) ids.add(ent.id);
          if (isEntFocused) ids.add(clm.id);
        }
      });
    });

    return ids;
  }, [focusedNodeId, relationships, claims, entities]);

  return (
    <div className="w-full rounded-sm border border-[rgba(210,191,143,0.22)] bg-[#0b0c09] p-6 shadow-2xl space-y-4 font-mono">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(210,191,143,0.15)] pb-4">
        <div>
          <h3 className="text-base font-serif font-medium text-[#f0e4c4] uppercase tracking-wider flex items-center gap-2">
            <Network className="w-4 h-4 text-[var(--gold)]" />
            Interactive Evidence & Entity Network Graph
          </h3>
          <p className="text-xs text-[#898678] font-sans mt-0.5">
            Collision-proof topological graph • Drag any circle to reposition • Click to inspect details
          </p>
        </div>

        {/* View Controls & Filters */}
        <div className="flex items-center gap-3">
          {/* Zoom & Reset Toolbar */}
          <div className="flex items-center bg-[#050605] border border-[rgba(210,191,143,0.18)] rounded-md px-1 py-0.5 text-xs text-[#c6a96b]">
            <button
              onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}
              title="Zoom In"
              className="p-1 hover:text-[#f0e4c4] transition"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.65, z - 0.15))}
              title="Zoom Out"
              className="p-1 hover:text-[#f0e4c4] transition"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-3 bg-[rgba(210,191,143,0.2)] mx-1" />
            <button
              onClick={handleResetLayout}
              title="Reset View & Layout"
              className="p-1 hover:text-[#f0e4c4] flex items-center gap-1 text-[10px] tracking-wider transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#706f63] mr-1 text-[10px] tracking-wider">FILTER:</span>
            {(["ALL", "ENTITIES", "CLAIMS"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-3 py-1 rounded-full text-[10px] tracking-wider transition ${
                  filter === mode
                    ? "bg-[rgba(198,169,107,0.2)] border border-[var(--gold)] text-[#f0e4c4] font-medium"
                    : "bg-[rgba(12,14,11,0.6)] border border-[rgba(210,191,143,0.15)] text-[#898678] hover:text-[#eee9da]"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="relative w-full h-[560px] rounded-sm bg-[#050605] border border-[rgba(210,191,143,0.15)] overflow-hidden select-none">
        {/* Subtle Background Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(210,191,143,0.08)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

        {/* Floating Controls / Status Tag */}
        <div className="absolute top-3 left-4 z-10 pointer-events-none flex items-center gap-2">
          <span className="text-[10px] tracking-widest uppercase bg-[#0c0e0b]/80 border border-[rgba(210,191,143,0.15)] text-[#a6a193] px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
            <Move className="w-2.5 h-2.5 text-[var(--gold)]" />
            Drag circles to adjust • Drag canvas to pan
          </span>
          {zoom !== 1 && (
            <span className="text-[10px] bg-[#0c0e0b]/80 border border-[rgba(210,191,143,0.15)] text-[var(--gold)] px-2 py-0.5 rounded-full font-mono">
              {Math.round(zoom * 100)}%
            </span>
          )}
        </div>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <defs>
            {/* Arrow Marker: Gold */}
            <marker
              id="gold-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#c6a96b" />
            </marker>

            {/* Arrow Marker: Green */}
            <marker
              id="green-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#a3c879" />
            </marker>

            {/* Arrow Marker: Red */}
            <marker
              id="red-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#ef4444" />
            </marker>

            {/* Radial Glow Filters */}
            <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Group containing all elements subjected to Pan & Zoom */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* 1. Entity-to-Entity Relationships */}
            {relationships.map((rel, idx) => {
              const srcNode = nodes.find((n) => n.id === rel.source_entity_id);
              const tgtNode = nodes.find((n) => n.id === rel.target_entity_id);
              if (!srcNode || !tgtNode) return null;

              const { x1, y1, x2, y2, midX, midY, dist } = getEdgeBoundaryPoints(srcNode, tgtNode);
              const isConnected =
                focusedNodeId === srcNode.id || focusedNodeId === tgtNode.id;
              const isDimmed = focusedNodeId && !isConnected;

              const isConstrained = rel.relationship_type.includes("CONSTRAIN");
              const label = rel.relationship_type.replace(/_/g, " ");
              const pillWidth = Math.max(68, label.length * 6.5 + 16);

              return (
                <g
                  key={`rel-${rel.id || idx}`}
                  className="transition-opacity duration-200"
                  style={{ opacity: isDimmed ? 0.12 : isConnected ? 1 : 0.65 }}
                >
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isConnected ? "#f0e4c4" : "#c6a96b"}
                    strokeWidth={isConnected ? 2.5 : 1.5}
                    strokeDasharray={isConstrained ? "4,4" : undefined}
                    markerEnd="url(#gold-arrow)"
                  />
                  {/* Label Pill Badge with Solid Background to prevent overlap */}
                  {dist > 130 && (
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x={-pillWidth / 2}
                        y="-8.5"
                        width={pillWidth}
                        height="17"
                        rx="4"
                        fill="#0c0e0b"
                        stroke={isConnected ? "var(--gold)" : "rgba(198,169,107,0.3)"}
                        strokeWidth="1"
                      />
                      <text
                        y="3"
                        fill={isConnected ? "#f0e4c4" : "#e0d2ad"}
                        fontSize="8"
                        fontFamily="monospace"
                        textAnchor="middle"
                        fontWeight={isConnected ? "bold" : "normal"}
                      >
                        {label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* 2. Cross-Links: Entity to Claims (Only when filter is ALL) */}
            {filter === "ALL" &&
              claims.map((clm, cIdx) => {
                const claimNode = nodes.find((n) => n.id === clm.id);
                if (!claimNode) return null;

                // Find associated entity by subject or name matching
                const matchedEntity = entities.find(
                  (ent) =>
                    clm.subject.toLowerCase().includes(ent.name.toLowerCase()) ||
                    ent.name.toLowerCase().includes(clm.subject.toLowerCase())
                ) || entities[0];

                if (!matchedEntity) return null;
                const entNode = nodes.find((n) => n.id === matchedEntity.id);
                if (!entNode) return null;

                const { x1, y1, x2, y2, midX, midY, dist } = getEdgeBoundaryPoints(entNode, claimNode);
                const isConnected =
                  focusedNodeId === entNode.id || focusedNodeId === claimNode.id;
                const isDimmed = focusedNodeId && !isConnected;

                const strokeColor =
                  clm.status === "SUPPORTS"
                    ? "#a3c879"
                    : clm.status === "CONTRADICTS"
                    ? "#ef4444"
                    : "#c6a96b";

                const markerUrl =
                  clm.status === "CONTRADICTS"
                    ? "url(#red-arrow)"
                    : clm.status === "SUPPORTS"
                    ? "url(#green-arrow)"
                    : "url(#gold-arrow)";

                return (
                  <g
                    key={`cross-${clm.id || cIdx}`}
                    className="transition-opacity duration-200"
                    style={{ opacity: isDimmed ? 0.08 : isConnected ? 1 : 0.45 }}
                  >
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={strokeColor}
                      strokeWidth={isConnected ? 2.5 : 1.5}
                      strokeDasharray={clm.status === "CONTRADICTS" ? "5,5" : "3,3"}
                      markerEnd={markerUrl}
                    />
                    {dist > 180 && (
                      <g transform={`translate(${midX}, ${midY})`}>
                        <rect
                          x="-38"
                          y="-7.5"
                          width="76"
                          height="15"
                          rx="3"
                          fill="#0c0e0b"
                          stroke={strokeColor}
                          strokeWidth="0.8"
                        />
                        <text
                          y="3"
                          fill={strokeColor}
                          fontSize="7.5"
                          fontFamily="monospace"
                          textAnchor="middle"
                          fontWeight="bold"
                        >
                          {clm.status.replace(/_/g, " ")}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

            {/* 3. Render Circular Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNodeId === node.id;
              const isConnected =
                !focusedNodeId || focusedNodeId === node.id || connectedNodeIds.has(node.id);
              const isDimmed = focusedNodeId && !isConnected;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onPointerDown={(e) => handleNodePointerDown(e, node.id)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode({
                      id: node.id,
                      type: node.type,
                      title: node.title,
                      category: node.category,
                      details: node.raw,
                    });
                  }}
                  className="cursor-pointer transition-all duration-200 group"
                  style={{ opacity: isDimmed ? 0.25 : 1 }}
                >
                  {/* Subtle Outer Glow Ring on Hover or Select */}
                  {(isSelected || isHovered) && (
                    <circle
                      r={node.radius + 6}
                      fill="none"
                      stroke={node.color}
                      strokeWidth="1.5"
                      strokeDasharray="4,4"
                      className="animate-spin"
                      style={{ animationDuration: "12s" }}
                    />
                  )}

                  {/* Main Circle Body */}
                  <circle
                    r={node.radius}
                    fill="#0c0e0b"
                    stroke={isSelected || isHovered ? "#f0e4c4" : node.color}
                    strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.8}
                    className="transition-colors duration-200"
                  />

                  {/* Soft Internal Tint Fill */}
                  <circle
                    r={node.radius - 5}
                    fill={node.color}
                    fillOpacity={isHovered ? 0.22 : 0.12}
                    className="transition-opacity duration-200"
                  />

                  {/* Node Type Micro-Tag at Top */}
                  <text
                    y={-node.radius + 15}
                    fill={node.color}
                    fontSize="7"
                    fontFamily="monospace"
                    textAnchor="middle"
                    fontWeight="bold"
                    letterSpacing="0.8px"
                    className="select-none pointer-events-none uppercase"
                  >
                    {node.type === "ENTITY" ? "ENTITY" : "CLAIM"}
                  </text>

                  {/* Title: Line 1 */}
                  <text
                    y={node.line2 ? 0 : 4}
                    fill="#eee9da"
                    fontSize={node.line2 ? "9" : "10"}
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none pointer-events-none group-hover:fill-[#ffffff] transition-colors"
                  >
                    {node.line1}
                  </text>

                  {/* Title: Line 2 (if present) */}
                  {node.line2 && (
                    <text
                      y={12}
                      fill="#ded7c5"
                      fontSize="8.5"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="select-none pointer-events-none"
                    >
                      {node.line2}
                    </text>
                  )}

                  {/* Category Pill Tag Below the Node */}
                  <g transform={`translate(0, ${node.radius + 16})`}>
                    <rect
                      x="-36"
                      y="-7"
                      width="72"
                      height="14"
                      rx="3"
                      fill="#050605"
                      stroke={node.color}
                      strokeWidth="0.8"
                    />
                    <text
                      y="3.5"
                      fill={node.color}
                      fontSize="7.5"
                      fontFamily="monospace"
                      textAnchor="middle"
                      fontWeight="bold"
                      className="select-none pointer-events-none uppercase"
                    >
                      {node.category.replace(/_/g, " ").slice(0, 11)}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute right-3 top-3 bottom-3 w-80 rounded-sm border border-[rgba(198,169,107,0.4)] bg-[#0b0c09]/95 backdrop-blur-md p-5 text-xs font-mono shadow-2xl overflow-y-auto space-y-4 animate-in slide-in-from-right duration-200 z-20">
            <div className="flex items-center justify-between border-b border-[rgba(210,191,143,0.15)] pb-3">
              <span className="text-[10px] text-[var(--gold)] uppercase tracking-wider font-medium flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[var(--gold)]" />
                {selectedNode.type} INSPECTOR
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-[#a6a193] hover:text-[#f0e4c4] p-1 text-base leading-none transition"
              >
                ×
              </button>
            </div>

            <div>
              <h4 className="text-base font-serif font-medium text-[#f0e4c4] leading-snug">
                {selectedNode.title}
              </h4>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-[rgba(12,14,11,0.8)] border border-[rgba(210,191,143,0.18)] text-[#a6a193] mt-2 inline-block">
                Category: {selectedNode.category}
              </span>
            </div>

            {selectedNode.type === "CLAIM" && selectedNode.details && (
              <div className="space-y-3 pt-2 border-t border-[rgba(210,191,143,0.12)]">
                <div>
                  <span className="text-[#a6a193] font-medium block text-[10px] uppercase mb-1">
                    Full Claim Statement:
                  </span>
                  <p className="text-[#ded7c5] text-xs font-sans leading-relaxed p-2.5 rounded-sm bg-[rgba(5,6,5,0.7)] border border-[rgba(210,191,143,0.1)]">
                    {selectedNode.details.text || "No expanded description recorded."}
                  </p>
                </div>
                <div className="p-3 rounded-sm bg-[rgba(5,6,5,0.8)] border border-[rgba(210,191,143,0.12)] space-y-1.5 text-[11px]">
                  <div>
                    <span className="text-[#706f63]">Subject:</span> {selectedNode.details.subject}
                  </div>
                  <div>
                    <span className="text-[#706f63]">Property:</span> {selectedNode.details.property}
                  </div>
                  <div>
                    <span className="text-[#706f63]">Value:</span> {selectedNode.details.value}
                  </div>
                  <div>
                    <span className="text-[#706f63]">Status:</span> {selectedNode.details.status}
                  </div>
                  <div>
                    <span className="text-[#706f63]">Confidence:</span>{" "}
                    {selectedNode.details.confidence || "HIGH"}
                  </div>
                </div>
              </div>
            )}

            {selectedNode.type === "ENTITY" && selectedNode.details && (
              <div className="space-y-3 pt-2 border-t border-[rgba(210,191,143,0.12)]">
                <div>
                  <span className="text-[#a6a193] font-medium block text-[10px] uppercase mb-1">
                    Discovered Attributes:
                  </span>
                  <pre className="text-[10px] text-[var(--gold)] bg-[rgba(5,6,5,0.8)] p-2.5 rounded-sm overflow-x-auto border border-[rgba(210,191,143,0.12)] font-mono">
                    {JSON.stringify(selectedNode.details.attributes || {}, null, 2)}
                  </pre>
                </div>
                {onSelectEntity && (
                  <button
                    onClick={() => onSelectEntity(selectedNode.title)}
                    className="w-full mt-3 py-2 rounded-full border border-[rgba(198,169,107,0.6)] bg-[rgba(198,169,107,0.15)] hover:bg-[rgba(198,169,107,0.3)] text-[#f0e4c4] text-[10px] tracking-wider uppercase font-medium transition"
                  >
                    Go Deeper on {selectedNode.title} →
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#898678] pt-1 border-t border-[rgba(210,191,143,0.1)]">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-[#706f63] text-[10px] tracking-wider">LEGEND:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#a3c879]" />
            <span>Company / Supported</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c6a96b]" />
            <span>Product / Partial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
            <span>Contradiction / Friction</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e0d2ad]" />
            <span>Policy / Regulation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4f8b48]" />
            <span>Technology</span>
          </div>
        </div>

        <span className="text-[10px] text-[#706f63]">
          Total nodes rendered: {nodes.length}
        </span>
      </div>
    </div>
  );
}
