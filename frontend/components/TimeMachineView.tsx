"use client";

import React, { useState } from "react";
import { TimelineEvent, PeriodComparison } from "@/types/investigation";
import { Clock, Calendar, ArrowRight, GitFork, HelpCircle, Check, AlertCircle } from "lucide-react";

interface TimeMachineViewProps {
  timeline: TimelineEvent[];
  comparison?: PeriodComparison;
  onWhyClick?: (eventTitle: string) => void;
}

export default function TimeMachineView({ timeline, comparison, onWhyClick }: TimeMachineViewProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<string>(
    timeline.length > 0 ? timeline[timeline.length - 1].id : "time-2026"
  );
  const [showCompare, setShowCompare] = useState<boolean>(true);

  return (
    <div className="w-full space-y-6 font-mono">
      {/* 1. Header & Milestone Slider */}
      <div className="rounded-2xl border border-emerald-950/80 bg-gradient-to-b from-[#0c1018] to-[#080b10] p-6 shadow-2xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Internet Time Machine • Chronological Evolution
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-semibold">
                PILLAR 5 ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Tracing market transformation from early FAME subsidies to 10-minute battery architectures.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCompare(!showCompare)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 transition"
            >
              {showCompare ? "Hide Period Diff" : "Compare 2024 vs 2026"}
            </button>
          </div>
        </div>

        {/* Milestone Buttons / Timeline Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {timeline.map((evt) => {
            const isSelected = selectedMilestone === evt.id;
            return (
              <button
                key={evt.id}
                onClick={() => setSelectedMilestone(evt.id)}
                className={`p-3 rounded-xl border text-left transition ${
                  isSelected
                    ? "bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                <div className="text-sm font-black tracking-tight">{evt.period}</div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">{evt.date_str}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Milestone Detail Card */}
        {(() => {
          const evt = timeline.find((t) => t.id === selectedMilestone) || timeline[0];
          if (!evt) return null;
          return (
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/90 space-y-3 mt-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-500/30">
                    {evt.period}
                  </span>
                  <h4 className="text-sm font-bold text-white font-mono">{evt.title}</h4>
                </div>
                {onWhyClick && (
                  <button
                    onClick={() => onWhyClick(evt.title)}
                    className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/40"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Why did this happen? →</span>
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">{evt.description}</p>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                <span className="text-emerald-400 font-semibold block text-[11px] mb-0.5 uppercase">
                  Structural Market Impact:
                </span>
                <span>{evt.impact}</span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* 2. Compare Periods (2024 vs 2026) Diff */}
      {showCompare && comparison && (
        <div className="rounded-2xl border border-slate-800 bg-[#0a0d14] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <GitFork className="w-4 h-4 text-emerald-400" />
              Comparative Period Diff: {comparison.period_a} vs {comparison.period_b}
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Structural Transition Analysis</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* What Changed */}
            <div className="p-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> What Changed:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                {comparison.what_changed.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-mono">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What Remained Unchanged */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400" /> What Remained Unchanged:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400 font-sans">
                {comparison.what_remained.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-slate-500 font-mono">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Movements */}
            <div className="p-4 rounded-xl border border-cyan-900/40 bg-cyan-950/20 space-y-2">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Price Movements & Parity:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                {comparison.price_movements.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-cyan-400 font-mono">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technological Shifts */}
            <div className="p-4 rounded-xl border border-purple-900/40 bg-purple-950/20 space-y-2">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Technological Skateboard Shifts:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                {comparison.technological_shifts.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-purple-400 font-mono">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
