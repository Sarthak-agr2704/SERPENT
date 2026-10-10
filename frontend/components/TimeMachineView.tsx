"use client";

import React, { useState } from "react";
import { TimelineEvent, PeriodComparison } from "@/types/investigation";
import { Clock, GitFork, HelpCircle, Check, AlertCircle } from "lucide-react";

interface TimeMachineViewProps {
  timeline: TimelineEvent[];
  comparison?: PeriodComparison;
  onWhyClick?: (eventTitle: string) => void;
}

export default function TimeMachineView({
  timeline,
  comparison,
  onWhyClick,
}: TimeMachineViewProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<string>(
    timeline.length > 0 ? timeline[timeline.length - 1].id : "time-2026"
  );
  const [showCompare, setShowCompare] = useState<boolean>(true);

  return (
    <div className="w-full space-y-6 font-mono">
      {/* 1. Header & Milestone Slider */}
      <div className="rounded-sm border border-[rgba(210,191,143,0.22)] bg-[#0b0c09] p-8 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(210,191,143,0.15)] pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-serif font-medium text-[#f0e4c4] uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--gold)]" />
                Internet Time Machine • Chronological Evolution
              </h3>
              <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-[rgba(198,169,107,0.15)] text-[#f0e4c4] border border-[rgba(198,169,107,0.35)] font-medium">
                PILLAR 5 ENGINE
              </span>
            </div>
            <p className="text-xs text-[#898678] font-sans mt-1">
              Tracing market transformation from early subsidies to 10-minute battery architectures.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCompare(!showCompare)}
              className="text-[10px] px-3.5 py-1.5 rounded-full border border-[rgba(210,191,143,0.2)] bg-[rgba(12,14,11,0.6)] hover:bg-[rgba(198,169,107,0.15)] text-[#ded7c5] transition"
            >
              {showCompare ? "Hide Period Diff" : "Compare 2024 vs 2026"}
            </button>
          </div>
        </div>

        {/* Milestone Buttons / Timeline Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {timeline.map((evt) => {
            const isSelected = selectedMilestone === evt.id;
            return (
              <button
                key={evt.id}
                onClick={() => setSelectedMilestone(evt.id)}
                className={`p-3.5 rounded-sm border text-left transition ${
                  isSelected
                    ? "bg-[rgba(198,169,107,0.18)] border-[var(--gold)] text-[#f0e4c4] shadow-[0_0_12px_rgba(198,169,107,0.2)]"
                    : "bg-[rgba(5,6,5,0.7)] border-[rgba(210,191,143,0.15)] text-[#898678] hover:text-[#eee9da] hover:border-[rgba(210,191,143,0.35)]"
                }`}
              >
                <div className="text-sm font-serif font-medium">{evt.period}</div>
                <div className="text-[10px] text-[#706f63] truncate mt-0.5">{evt.date_str}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Milestone Detail Card */}
        {(() => {
          const evt = timeline.find((t) => t.id === selectedMilestone) || timeline[0];
          if (!evt) return null;
          return (
            <div className="p-6 rounded-sm border border-[rgba(210,191,143,0.18)] bg-[rgba(5,6,5,0.8)] space-y-3 mt-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[rgba(210,191,143,0.1)] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[rgba(198,169,107,0.15)] text-[var(--gold)] font-medium border border-[rgba(198,169,107,0.35)]">
                    {evt.period}
                  </span>
                  <h4 className="text-base font-serif font-medium text-[#f0e4c4]">{evt.title}</h4>
                </div>
                {onWhyClick && (
                  <button
                    onClick={() => onWhyClick(evt.title)}
                    className="flex items-center gap-1.5 text-[10px] text-[var(--gold)] hover:text-[#f0e4c4] px-3 py-1 rounded-full bg-[rgba(198,169,107,0.1)] border border-[rgba(198,169,107,0.35)] transition"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Why did this happen? →</span>
                  </button>
                )}
              </div>

              <p className="text-xs text-[#ded7c5] font-sans leading-relaxed">{evt.description}</p>

              <div className="p-3.5 rounded-sm bg-[rgba(12,14,11,0.7)] border border-[rgba(210,191,143,0.12)] text-xs text-[#a6a193]">
                <span className="text-[var(--gold)] font-medium block text-[10px] mb-1 uppercase tracking-wider">
                  Structural Market Impact:
                </span>
                <span className="font-sans text-xs">{evt.impact}</span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* 2. Compare Periods (2024 vs 2026) Diff */}
      {showCompare && comparison && (
        <div className="rounded-sm border border-[rgba(210,191,143,0.2)] bg-[#080907] p-7 space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(210,191,143,0.15)] pb-3">
            <h3 className="text-xs font-medium text-[#f0e4c4] uppercase tracking-[0.2em] flex items-center gap-2">
              <GitFork className="w-4 h-4 text-[var(--gold)]" />
              Comparative Period Diff: {comparison.period_a} vs {comparison.period_b}
            </h3>
            <span className="text-[10px] text-[#706f63] font-mono">Structural Transition Analysis</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* What Changed */}
            <div className="p-4 rounded-sm border border-[rgba(163,200,121,0.25)] bg-[rgba(16,22,14,0.6)] space-y-2">
              <h4 className="text-[10px] font-medium text-[#a3c879] uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[var(--green-light)]" /> What Changed:
              </h4>
              <ul className="space-y-1.5 text-xs text-[#ded7c5] font-sans">
                {comparison.what_changed.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[var(--green-light)] font-mono">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What Remained Unchanged */}
            <div className="p-4 rounded-sm border border-[rgba(210,191,143,0.15)] bg-[rgba(12,14,11,0.6)] space-y-2">
              <h4 className="text-[10px] font-medium text-[#a6a193] uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#898678]" /> What Remained Unchanged:
              </h4>
              <ul className="space-y-1.5 text-xs text-[#898678] font-sans">
                {comparison.what_remained.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#706f63] font-mono">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Movements */}
            <div className="p-4 rounded-sm border border-[rgba(198,169,107,0.25)] bg-[rgba(20,18,12,0.6)] space-y-2">
              <h4 className="text-[10px] font-medium text-[var(--gold)] uppercase tracking-wider">
                Price Movements & Parity:
              </h4>
              <ul className="space-y-1.5 text-xs text-[#ded7c5] font-sans">
                {comparison.price_movements.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[var(--gold)] font-mono">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technological Shifts */}
            <div className="p-4 rounded-sm border border-[rgba(210,191,143,0.2)] bg-[rgba(12,14,11,0.6)] space-y-2">
              <h4 className="text-[10px] font-medium text-[#f0e4c4] uppercase tracking-wider">
                Technological Skateboard Shifts:
              </h4>
              <ul className="space-y-1.5 text-xs text-[#ded7c5] font-sans">
                {comparison.technological_shifts.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#c6a96b] font-mono">•</span>
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
