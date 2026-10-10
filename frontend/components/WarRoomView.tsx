"use client";

import React from "react";
import { CompetitiveRadar } from "@/types/investigation";
import { Radar as RadarIcon, ShieldAlert, ArrowUpRight, TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip
} from "recharts";

interface WarRoomViewProps {
  radarData: CompetitiveRadar;
  onDrilldownEntity?: (entity: string) => void;
}

export default function WarRoomView({ radarData, onDrilldownEntity }: WarRoomViewProps) {
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
      <div className="rounded-2xl border border-emerald-950/80 bg-gradient-to-b from-[#0c1018] to-[#080b10] p-6 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <RadarIcon className="w-4 h-4 text-emerald-400" />
                War Room • Competitive Radar
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-semibold">
                PILLAR 4 INTELLIGENCE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-dimensional corporate benchmarking across market share, technology, and tariff moats.
            </p>
          </div>

          <div className="text-[11px] px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
            Strictly Strategic Intelligence • No Investment Advice
          </div>
        </div>

        {/* Radar Chart Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} outerRadius="75%">
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="dimension" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <PolarRadiusAxis stroke="#334155" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#020617", borderColor: "#334155", borderRadius: "8px" }}
                  itemStyle={{ fontSize: "12px", fontFamily: "monospace" }}
                />
                <Radar
                  name="BYD Auto"
                  dataKey="BYD Auto"
                  stroke="#38bdf8"
                  fill="#38bdf8"
                  fillOpacity={0.25}
                />
                <Radar
                  name="Tata Motors"
                  dataKey="Tata Motors"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.25}
                />
                <Radar
                  name="Mahindra & Mahindra"
                  dataKey="Mahindra & Mahindra"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.25}
                />
                <Legend wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Benchmarking Highlights */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Strategic Entity Posture:
            </h4>

            <div className="p-3.5 rounded-xl border border-emerald-900/40 bg-emerald-950/20 text-xs space-y-1">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span>Tata Motors</span>
                <span>Fortress Moat</span>
              </div>
              <p className="text-slate-300 text-[11px] font-sans">
                Controls ~68% of mass market with sub-₹15L vehicles and 500+ service touchpoints.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-cyan-900/40 bg-cyan-950/20 text-xs space-y-1">
              <div className="flex items-center justify-between text-cyan-400 font-bold">
                <span>BYD Auto</span>
                <span>Technology Benchmark</span>
              </div>
              <p className="text-slate-300 text-[11px] font-sans">
                Dominates cell chemistry (Blade 2.0 sub-10 min charge) but constrained to &gt;₹25L by 70-100% tariffs.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-900/40 bg-amber-950/20 text-xs space-y-1">
              <div className="flex items-center justify-between text-amber-400 font-bold">
                <span>Mahindra & Mahindra</span>
                <span>Native Born-EV Flank</span>
              </div>
              <p className="text-slate-300 text-[11px] font-sans">
                Deploying INGLO native skateboards (BE 6e, XEV 9e) directly contesting the ₹18L-₹24L crossover space.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Head-to-Head Comparison Matrix */}
      <div className="rounded-2xl border border-slate-800 bg-[#0a0d14] p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Head-to-Head Architectural Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Strategic Vector</th>
                <th className="py-2.5 px-3 font-semibold text-cyan-400">BYD Auto</th>
                <th className="py-2.5 px-3 font-semibold text-emerald-400">Tata Motors</th>
                <th className="py-2.5 px-3 font-semibold text-amber-400">Mahindra & Mahindra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {radarData.comparison_table.map((row, i) => (
                <tr key={i} className="hover:bg-slate-900/40 transition">
                  <td className="py-3 px-3 font-mono font-semibold text-slate-300">{row.metric}</td>
                  <td className="py-3 px-3 text-slate-300">{row.byd}</td>
                  <td className="py-3 px-3 text-slate-300">{row.tata}</td>
                  <td className="py-3 px-3 text-slate-300">{row.mahindra}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. "What Changed?" Chronological Diff */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          "What Changed?" Market Narrative & Policy Shifts
        </h3>
        <p className="text-xs text-slate-400">
          Empirical shifts detected between recent periods:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {radarData.what_changed.map((change, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 text-xs text-slate-300 font-sans flex items-start gap-2.5"
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{change}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
