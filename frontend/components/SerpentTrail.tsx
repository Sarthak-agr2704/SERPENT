"use client";

import React, { useState } from "react";
import { SerpentTrailStep, ReplayEvent } from "@/types/investigation";
import { GitCommit, ArrowRight, AlertTriangle, Search, CheckCircle, Shield, Lightbulb, Play, Pause } from "lucide-react";

interface SerpentTrailProps {
  trail: SerpentTrailStep[];
  replay: ReplayEvent[];
  onEntityClick?: (entity: string) => void;
}

export default function SerpentTrail({ trail, replay, onEntityClick }: SerpentTrailProps) {
  const [activeStep, setActiveStep] = useState<number>(trail.length > 0 ? trail.length : 1);
  const [viewMode, setViewMode] = useState<"trail" | "replay">("trail");

  return (
    <div className="w-full rounded-2xl border border-emerald-950/70 bg-[#090c12] p-6 shadow-xl space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-emerald-400">~</span> The SERPENT Trail
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-semibold">
              SIGNATURE CAUSAL PATH
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Every search result is a clue. Tracing second-order jumps, discovered tensions, and resolution.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode("trail")}
            className={`px-3 py-1 rounded-md transition ${
              viewMode === "trail"
                ? "bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Causal Trail
          </button>
          <button
            onClick={() => setViewMode("replay")}
            className={`px-3 py-1 rounded-md transition ${
              viewMode === "replay"
                ? "bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Investigation Replay ({replay.length})
          </button>
        </div>
      </div>

      {viewMode === "trail" ? (
        /* The Causal Snake / Trail Path */
        <div className="space-y-4">
          <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-cyan-500 before:to-emerald-400">
            {trail.map((step, idx) => {
              const isSelected = activeStep === step.step_num;
              const isContradiction = step.contradiction_found;

              return (
                <div
                  key={step.step_num}
                  onClick={() => setActiveStep(step.step_num)}
                  className={`relative cursor-pointer group transition-all duration-200 rounded-xl p-4 border ${
                    isSelected
                      ? isContradiction
                        ? "bg-amber-950/20 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                        : "bg-emerald-950/20 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                      : "bg-slate-950/50 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  {/* Step Node Marker on Trail Line */}
                  <div
                    className={`absolute -left-[31px] top-4.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${
                      isContradiction
                        ? "bg-amber-500 border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                        : "bg-emerald-500 border-emerald-200 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>
                  </div>

                  {/* Step Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-semibold">
                        STEP {step.step_num} • {step.timestamp_rel}
                      </span>
                      <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                        {step.title}
                      </span>
                    </div>

                    {isContradiction && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400" /> FACTUAL TENSION
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mb-3">{step.description}</p>

                  {/* Clue Box */}
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/90 text-xs text-slate-300 flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-emerald-400 font-semibold uppercase text-[10px] block">
                        Discovered Clue:
                      </span>
                      <span>{step.clue}</span>
                    </div>
                  </div>

                  {/* Discovered Entities */}
                  {step.new_entities.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-900">
                      <span className="text-[11px] text-slate-500">Entities discovered:</span>
                      {step.new_entities.map((ent, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEntityClick?.(ent);
                          }}
                          className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] hover:bg-emerald-900 transition"
                        >
                          {ent} →
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* The High-Resolution Investigation Replay View */
        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 mb-3">
            Chronological audit of multi-agent events, tool executions, and source extractions.
          </div>
          <div className="divide-y divide-slate-800/60 max-h-96 overflow-y-auto pr-2">
            {replay.map((evt, idx) => (
              <div key={idx} className="py-2.5 flex items-start justify-between gap-4 text-xs">
                <div className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold shrink-0">{evt.time_label}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-200 font-semibold">{evt.agent}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-500 border border-slate-800">
                        {evt.action}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs mt-0.5">{evt.detail}</p>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 shrink-0 font-mono">
                  {evt.count_summary.sources || 0} src • {evt.count_summary.claims || 0} clm
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
