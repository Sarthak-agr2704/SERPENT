"use client";

import React, { useState } from "react";
import { SerpentTrailStep, ReplayEvent } from "@/types/investigation";
import { GitCommit, AlertTriangle, Lightbulb } from "lucide-react";

interface SerpentTrailProps {
  trail: SerpentTrailStep[];
  replay: ReplayEvent[];
  onEntityClick?: (entity: string) => void;
}

export default function SerpentTrail({
  trail,
  replay,
  onEntityClick,
}: SerpentTrailProps) {
  const [activeStep, setActiveStep] = useState<number>(
    trail.length > 0 ? trail.length : 1
  );
  const [viewMode, setViewMode] = useState<"trail" | "replay">("trail");

  return (
    <div className="w-full rounded-sm border border-[rgba(210,191,143,0.22)] bg-[#0b0c09] p-8 shadow-2xl space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(210,191,143,0.15)] pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-serif font-medium text-[#f0e4c4] uppercase tracking-wider flex items-center gap-2">
              <span className="text-[var(--gold)]">~</span> The SERPENTES Trail
            </h3>
            <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-[rgba(198,169,107,0.15)] text-[#f0e4c4] border border-[rgba(198,169,107,0.35)] font-medium">
              SIGNATURE CAUSAL PATH
            </span>
          </div>
          <p className="text-xs text-[#898678] mt-1 font-sans">
            Every search result is a clue. Tracing second-order jumps, discovered tensions, and resolution.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[rgba(5,6,5,0.8)] border border-[rgba(210,191,143,0.18)] text-[10px]">
          <button
            onClick={() => setViewMode("trail")}
            className={`px-3.5 py-1 rounded-full transition ${
              viewMode === "trail"
                ? "bg-[rgba(198,169,107,0.2)] border border-[var(--gold)] text-[#f0e4c4] font-medium"
                : "text-[#898678] hover:text-[#eee9da]"
            }`}
          >
            Causal Trail
          </button>
          <button
            onClick={() => setViewMode("replay")}
            className={`px-3.5 py-1 rounded-full transition ${
              viewMode === "replay"
                ? "bg-[rgba(198,169,107,0.2)] border border-[var(--gold)] text-[#f0e4c4] font-medium"
                : "text-[#898678] hover:text-[#eee9da]"
            }`}
          >
            Investigation Replay ({replay.length})
          </button>
        </div>
      </div>

      {viewMode === "trail" ? (
        /* The Causal Snake / Trail Path */
        <div className="space-y-4">
          <div className="relative pl-7 space-y-6 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[var(--gold)] before:via-[var(--green-light)] before:to-[var(--gold)]">
            {trail.map((step) => {
              const isSelected = activeStep === step.step_num;
              const isContradiction = step.contradiction_found;

              return (
                <div
                  key={step.step_num}
                  onClick={() => setActiveStep(step.step_num)}
                  className={`relative cursor-pointer group transition-all duration-200 rounded-sm p-5 border ${
                    isSelected
                      ? isContradiction
                        ? "bg-[rgba(198,169,107,0.1)] border-[var(--gold)] shadow-[0_0_15px_rgba(198,169,107,0.15)]"
                        : "bg-[rgba(79,139,72,0.1)] border-[var(--green-light)] shadow-[0_0_15px_rgba(163,200,121,0.15)]"
                      : "bg-[rgba(5,6,5,0.7)] border-[rgba(210,191,143,0.15)] hover:border-[rgba(210,191,143,0.35)]"
                  }`}
                >
                  {/* Step Node Marker on Trail Line */}
                  <div
                    className={`absolute -left-[32px] top-5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${
                      isContradiction
                        ? "bg-[var(--gold)] border-[#f0e4c4] shadow-[0_0_8px_rgba(198,169,107,0.7)]"
                        : "bg-[var(--green-light)] border-[#f0e4c4] shadow-[0_0_8px_rgba(163,200,121,0.7)]"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#050605]" />
                  </div>

                  {/* Step Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(12,14,11,0.8)] text-[#a6a193] border border-[rgba(210,191,143,0.18)]">
                        STEP {step.step_num} • {step.timestamp_rel}
                      </span>
                      <span className="text-xs font-serif font-medium text-[#f0e4c4] group-hover:text-white transition">
                        {step.title}
                      </span>
                    </div>

                    {isContradiction && (
                      <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-[rgba(198,169,107,0.15)] border border-[var(--gold)] text-[#f0e4c4] font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-[var(--gold)]" /> FACTUAL TENSION
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#a6a193] font-sans mb-3 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Clue Box */}
                  <div className="p-3.5 rounded-sm bg-[rgba(12,14,11,0.8)] border border-[rgba(210,191,143,0.12)] text-xs text-[#ded7c5] flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[var(--gold)] font-medium uppercase text-[10px] block">
                        Discovered Clue:
                      </span>
                      <span className="font-sans text-xs">{step.clue}</span>
                    </div>
                  </div>

                  {/* Discovered Entities */}
                  {step.new_entities.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-[rgba(210,191,143,0.1)]">
                      <span className="text-[10px] text-[#706f63]">Entities discovered:</span>
                      {step.new_entities.map((ent, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEntityClick?.(ent);
                          }}
                          className="px-2.5 py-0.5 rounded-full bg-[rgba(198,169,107,0.1)] border border-[rgba(198,169,107,0.3)] text-[#e0d2ad] text-[10px] hover:bg-[rgba(198,169,107,0.25)] transition"
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
        <div className="space-y-3">
          <div className="p-3.5 rounded-sm bg-[rgba(5,6,5,0.7)] border border-[rgba(210,191,143,0.15)] text-xs text-[#898678]">
            Chronological audit of multi-agent events, tool executions, and source extractions.
          </div>
          <div className="divide-y divide-[rgba(210,191,143,0.1)] max-h-96 overflow-y-auto pr-2">
            {replay.map((evt, idx) => (
              <div key={idx} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div className="flex items-start gap-3">
                  <span className="text-[var(--gold)] font-medium shrink-0">
                    {evt.time_label}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#eee9da] font-medium">{evt.agent}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-[rgba(12,14,11,0.8)] text-[#898678] border border-[rgba(210,191,143,0.12)]">
                        {evt.action}
                      </span>
                    </div>
                    <p className="text-[#a6a193] text-xs font-sans mt-0.5">{evt.detail}</p>
                  </div>
                </div>
                <div className="text-[10px] text-[#706f63] shrink-0 font-mono">
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
