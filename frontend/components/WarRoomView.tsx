"use client";

import React from "react";
import { CompetitiveRadar } from "@/types/investigation";
import { Radar as RadarIcon, ArrowUpRight, TrendingUp } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface WarRoomViewProps {
  radarData: CompetitiveRadar;
  onDrilldownEntity?: (entity: string) => void;
}

export default function WarRoomView({
  radarData,
  onDrilldownEntity,
}: WarRoomViewProps) {
  // Format data for Recharts Radar
  const chartData = radarData.dimensions.map((dim) => {
    const entry: Record<string, any> = { dimension: dim };
    radarData.entities.forEach((ent) => {
      entry[ent] = radarData.scores[ent]?.[dim] || 50;
    });
    return entry;
  });

  return (
    <div className="w-full space-y-6 font-mono">
      {/* 1. Header & Radar Visualizer */}
      <div className="rounded-sm border border-[rgba(210,191,143,0.22)] bg-[#0b0c09] p-8 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(210,191,143,0.15)] pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-serif font-medium text-[#f0e4c4] uppercase tracking-wider flex items-center gap-2">
                <RadarIcon className="w-4 h-4 text-[var(--gold)]" />
                War Room • Competitive Radar
              </h3>
              <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-[rgba(198,169,107,0.15)] text-[#f0e4c4] border border-[rgba(198,169,107,0.35)] font-medium">
                PILLAR 4 INTELLIGENCE
              </span>
            </div>
            <p className="text-xs text-[#898678] font-sans mt-1">
              Multi-dimensional corporate benchmarking across market share, technology, and tariff moats.
            </p>
          </div>

          <div className="text-[10px] px-3 py-1 rounded-full bg-[rgba(12,14,11,0.8)] border border-[rgba(210,191,143,0.18)] text-[#a6a193]">
            Strictly Strategic Intelligence • No Investment Advice
          </div>
        </div>

        {/* Radar Chart Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} outerRadius="75%">
                <PolarGrid stroke="rgba(210,191,143,0.15)" />
                <PolarAngleAxis
                  dataKey="dimension"
                  stroke="#a6a193"
                  tick={{ fill: "#a6a193", fontSize: 11 }}
                />
                <PolarRadiusAxis stroke="rgba(210,191,143,0.2)" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b0c09",
                    borderColor: "rgba(198,169,107,0.4)",
                    borderRadius: "4px",
                    color: "#eee9da",
                  }}
                  itemStyle={{ fontSize: "11px", fontFamily: "monospace" }}
                />
                <Radar
                  name="BYD Auto"
                  dataKey="BYD Auto"
                  stroke="#c6a96b"
                  fill="#c6a96b"
                  fillOpacity={0.25}
                />
                <Radar
                  name="Tata Motors"
                  dataKey="Tata Motors"
                  stroke="#a3c879"
                  fill="#a3c879"
                  fillOpacity={0.25}
                />
                <Radar
                  name="Mahindra & Mahindra"
                  dataKey="Mahindra & Mahindra"
                  stroke="#e0d2ad"
                  fill="#e0d2ad"
                  fillOpacity={0.2}
                />
                <Legend wrapperStyle={{ paddingTop: "14px", fontSize: "11px", fontFamily: "monospace" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Benchmarking Highlights */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-[10px] font-medium text-[#c6c0ad] uppercase tracking-wider mb-2">
              Strategic Entity Posture:
            </h4>

            <div className="p-4 rounded-sm border border-[rgba(163,200,121,0.25)] bg-[rgba(16,22,14,0.6)] text-xs space-y-1">
              <div className="flex items-center justify-between text-[#a3c879] font-medium">
                <span>Tata Motors</span>
                <span className="text-[10px]">Fortress Moat</span>
              </div>
              <p className="text-[#a6a193] text-xs font-sans">
                Controls ~68% of mass market with sub-₹15L vehicles and 500+ service touchpoints.
              </p>
            </div>

            <div className="p-4 rounded-sm border border-[rgba(198,169,107,0.3)] bg-[rgba(20,18,12,0.6)] text-xs space-y-1">
              <div className="flex items-center justify-between text-[var(--gold)] font-medium">
                <span>BYD Auto</span>
                <span className="text-[10px]">Technology Benchmark</span>
              </div>
              <p className="text-[#a6a193] text-xs font-sans">
                Dominates cell chemistry (Blade 2.0 sub-10 min charge) but constrained to &gt;₹25L by 70-100% tariffs.
              </p>
            </div>

            <div className="p-4 rounded-sm border border-[rgba(210,191,143,0.2)] bg-[rgba(12,14,11,0.6)] text-xs space-y-1">
              <div className="flex items-center justify-between text-[#ded7c5] font-medium">
                <span>Mahindra & Mahindra</span>
                <span className="text-[10px]">Native Born-EV Flank</span>
              </div>
              <p className="text-[#a6a193] text-xs font-sans">
                Deploying INGLO native skateboards (BE 6e, XEV 9e) directly contesting the ₹18L-₹24L crossover space.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Head-to-Head Comparison Matrix */}
      <div className="rounded-sm border border-[rgba(210,191,143,0.2)] bg-[#080907] p-7 space-y-4">
        <h3 className="text-xs font-medium text-[#f0e4c4] uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
          Head-to-Head Architectural Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[rgba(210,191,143,0.15)] text-[#898678]">
                <th className="py-3 px-3 font-medium uppercase tracking-wider text-[10px]">Strategic Vector</th>
                <th className="py-3 px-3 font-medium text-[var(--gold)] uppercase tracking-wider text-[10px]">BYD Auto</th>
                <th className="py-3 px-3 font-medium text-[var(--green-light)] uppercase tracking-wider text-[10px]">Tata Motors</th>
                <th className="py-3 px-3 font-medium text-[#e0d2ad] uppercase tracking-wider text-[10px]">Mahindra & Mahindra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(210,191,143,0.1)] font-sans">
              {radarData.comparison_table.map((row, i) => (
                <tr key={i} className="hover:bg-[rgba(12,14,11,0.6)] transition">
                  <td className="py-3.5 px-3 font-mono font-medium text-[#ded7c5]">{row.metric}</td>
                  <td className="py-3.5 px-3 text-[#a6a193]">{row.byd}</td>
                  <td className="py-3.5 px-3 text-[#a6a193]">{row.tata}</td>
                  <td className="py-3.5 px-3 text-[#a6a193]">{row.mahindra}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. "What Changed?" Chronological Diff */}
      <div className="rounded-sm border border-[rgba(210,191,143,0.2)] bg-[#080907] p-7 space-y-4">
        <h3 className="text-xs font-medium text-[#f0e4c4] uppercase tracking-[0.2em] flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[var(--gold)]" />
          "What Changed?" Market Narrative & Policy Shifts
        </h3>
        <p className="text-xs text-[#898678] font-sans">
          Empirical shifts detected between recent periods:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {radarData.what_changed.map((change, idx) => (
            <div
              key={idx}
              className="p-4 rounded-sm border border-[rgba(210,191,143,0.12)] bg-[rgba(12,14,11,0.6)] text-xs text-[#ded7c5] font-sans flex items-start gap-3"
            >
              <ArrowUpRight className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5" />
              <span>{change}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
