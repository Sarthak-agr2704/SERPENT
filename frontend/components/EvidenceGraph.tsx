"use client";

import React, { useState } from "react";
import { Entity, Claim, Source, EntityRelationship, EvidenceItem } from "@/types/investigation";
import { Network, Filter, ZoomIn, ZoomOut, Info, Shield, Layers, ExternalLink } from "lucide-react";

interface EvidenceGraphProps {
  entities: Entity[];
  claims: Claim[];
  sources: Source[];
  relationships: EntityRelationship[];
  evidenceItems: EvidenceItem[];
  onSelectEntity?: (entityName: string) => void;
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
  const [selectedNode, setSelectedNode] = useState<{
    id: string;
    type: "ENTITY" | "CLAIM" | "SOURCE";
    title: string;
    category?: string;
    details?: any;
  } | null>(null);

  // Position generation for nodes
  const entityNodes = entities.map((ent, idx) => ({
    id: ent.id,
    type: "ENTITY" as const,
    title: ent.name,
    category: ent.category,
    color:
      ent.category === "COMPANY"
        ? "#10b981"
        : ent.category === "PRODUCT"
        ? "#06b6d4"
        : ent.category === "POLICY"
        ? "#f59e0b"
        : ent.category === "TECHNOLOGY"
        ? "#8b5cf6"
        : "#3b82f6",
    x: 180 + (idx % 3) * 230,
    y: 110 + Math.floor(idx / 3) * 160,
    raw: ent,
  }));

  const claimNodes = claims.map((clm, idx) => ({
    id: clm.id,
    type: "CLAIM" as const,
    title: `[${clm.property}] ${clm.value}`,
    category: clm.status,
    color:
      clm.status === "SUPPORTS"
        ? "#10b981"
        : clm.status === "CONTRADICTS"
        ? "#ef4444"
        : "#f59e0b",
    x: 620 + (idx % 2) * 240,
    y: 120 + Math.floor(idx / 2) * 180,
    raw: clm,
  }));

  const displayNodes =
    filter === "ENTITIES"
      ? entityNodes
      : filter === "CLAIMS"
      ? claimNodes
      : [...entityNodes, ...claimNodes];

  return (
    <div className="w-full rounded-2xl border border-emerald-950/70 bg-[#080b11] p-6 shadow-xl space-y-4 font-mono">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Network className="w-4 h-4 text-emerald-400" />
            Interactive Evidence & Entity Network Graph
          </h3>
          <p className="text-xs text-slate-400">
            Click any node to inspect evidence lineage, verified claims, and corporate linkages.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 mr-1 text-[11px]">Filter:</span>
          {(["ALL", "ENTITIES", "CLAIMS"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-2.5 py-1 rounded-md text-[11px] transition ${
                filter === mode
                  ? "bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-semibold"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative w-full h-[520px] rounded-xl bg-slate-950 border border-slate-900 overflow-hidden flex">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>

        <svg className="w-full h-full cursor-crosshair">
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
            </marker>
          </defs>

          {/* Render Relationships / Edges */}
          {relationships.map((rel, i) => {
            const srcNode = entityNodes.find((n) => n.id === rel.source_entity_id);
            const tgtNode = entityNodes.find((n) => n.id === rel.target_entity_id);
            if (!srcNode || !tgtNode) return null;

            return (
              <g key={i}>
                <line
                  x1={srcNode.x}
                  y1={srcNode.y}
                  x2={tgtNode.x}
                  y2={tgtNode.y}
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeOpacity="0.4"
                  strokeDasharray="4,4"
                />
                <text
                  x={(srcNode.x + tgtNode.x) / 2}
                  y={(srcNode.y + tgtNode.y) / 2 - 6}
                  fill="#6ee7b7"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {rel.relationship_type.replace("_", " ")}
                </text>
              </g>
            );
          })}

          {/* Render Cross-Link Edges (Entity to Claim) */}
          {filter === "ALL" &&
            entityNodes.slice(0, 3).map((ent, i) => {
              const claim = claimNodes[i % claimNodes.length];
              if (!claim) return null;
              return (
                <line
                  key={`cross-${i}`}
                  x1={ent.x + 80}
                  y1={ent.y}
                  x2={claim.x - 80}
                  y2={claim.y}
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeOpacity="0.3"
                />
              );
            })}

          {/* Render Nodes */}
          {displayNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() =>
                  setSelectedNode({
                    id: node.id,
                    type: node.type,
                    title: node.title,
                    category: node.category,
                    details: node.raw,
                  })
                }
                className="cursor-pointer group"
              >
                {/* Node Ring */}
                <circle
                  r={node.type === "ENTITY" ? 34 : 40}
                  fill="#0f172a"
                  stroke={node.color}
                  strokeWidth={isSelected ? 3.5 : 2}
                  className="transition-all group-hover:stroke-white duration-200"
                />
                <circle
                  r={node.type === "ENTITY" ? 28 : 34}
                  fill={node.color}
                  fillOpacity="0.15"
                />

                {/* Node Icon / Label */}
                <text
                  y="-4"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="pointer-events-none select-none"
                >
                  {node.title.length > 15 ? `${node.title.slice(0, 13)}..` : node.title}
                </text>
                <text
                  y="12"
                  fill={node.color}
                  fontSize="8"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="pointer-events-none select-none uppercase"
                >
                  {node.category}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute right-4 top-4 bottom-4 w-80 rounded-xl border border-emerald-500/40 bg-slate-950/95 backdrop-blur-md p-4 text-xs font-mono shadow-2xl overflow-y-auto space-y-3 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] text-emerald-400 uppercase font-semibold">
                {selectedNode.type} INSPECTOR
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white font-mono">{selectedNode.title}</h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 mt-1 inline-block">
                Category: {selectedNode.category}
              </span>
            </div>

            {selectedNode.type === "CLAIM" && (
              <div className="space-y-2 pt-2 border-t border-slate-900">
                <span className="text-slate-400 font-semibold block">Full Statement:</span>
                <p className="text-slate-300 text-xs font-sans leading-relaxed">
                  {selectedNode.details.text}
                </p>
                <div className="p-2 rounded bg-slate-900/60 border border-slate-800 space-y-1 text-[11px]">
                  <div><span className="text-slate-500">Subject:</span> {selectedNode.details.subject}</div>
                  <div><span className="text-slate-500">Property:</span> {selectedNode.details.property}</div>
                  <div><span className="text-slate-500">Value:</span> {selectedNode.details.value}</div>
                  <div><span className="text-slate-500">Status:</span> {selectedNode.details.status}</div>
                </div>
              </div>
            )}

            {selectedNode.type === "ENTITY" && (
              <div className="space-y-2 pt-2 border-t border-slate-900">
                <span className="text-slate-400 font-semibold block">Discovered Attributes:</span>
                <pre className="text-[10px] text-emerald-300 bg-slate-900 p-2 rounded overflow-x-auto">
                  {JSON.stringify(selectedNode.details.attributes, null, 2)}
                </pre>
                {onSelectEntity && (
                  <button
                    onClick={() => onSelectEntity(selectedNode.title)}
                    className="w-full mt-2 py-2 rounded-lg bg-emerald-950/80 border border-emerald-500/50 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold transition"
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
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
        <span className="text-slate-500 text-[11px]">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
          <span>Company / Supported</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span>
          <span>Contradiction</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
          <span>Policy / Partial</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]"></span>
          <span>Technology</span>
        </div>
      </div>
    </div>
  );
}
