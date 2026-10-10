"use client";

import React, { useState } from "react";
import { MissionPlan, WhatIfScenario } from "@/types/investigation";
import { Compass, CheckCircle2, XCircle, Sparkles, Calendar, MapPin, Users } from "lucide-react";
import { runWhatIfScenario } from "@/lib/api";

interface MissionControlViewProps {
  missionPlan: MissionPlan;
  investigationId: string;
  initialScenarios?: WhatIfScenario[];
}

export default function MissionControlView({
  missionPlan,
  investigationId,
  initialScenarios = [],
}: MissionControlViewProps) {
  const [scenarios, setScenarios] = useState<WhatIfScenario[]>(initialScenarios);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isRunningScenario, setIsRunningScenario] = useState(false);

  const handleRunScenario = async (promptText: string) => {
    if (!promptText.trim() || isRunningScenario) return;
    setIsRunningScenario(true);
    try {
      const scenario = await runWhatIfScenario(investigationId, promptText.trim());
      setScenarios((prev) => [scenario, ...prev]);
      setCustomPrompt("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunningScenario(false);
    }
  };

  return (
    <div className="w-full space-y-6 font-mono">
      {/* 1. Mission Overview Header */}
      <div className="rounded-sm border border-[rgba(210,191,143,0.22)] bg-[#0b0c09] p-8 shadow-2xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(210,191,143,0.15)] pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-serif font-medium text-[#f0e4c4] uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-[var(--gold)]" />
                Mission Control • Real-World Constraint Planning
              </h3>
              <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-[rgba(198,169,107,0.15)] text-[#f0e4c4] border border-[rgba(198,169,107,0.35)] font-medium">
                PILLAR 6 OPTIMIZER
              </span>
            </div>
            <p className="text-xs text-[#898678] font-sans mt-1">
              Objective: {missionPlan.objective}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(12,14,11,0.8)] border border-[rgba(210,191,143,0.18)] text-[#ded7c5]">
              <MapPin className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>{missionPlan.location}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(12,14,11,0.8)] border border-[rgba(210,191,143,0.18)] text-[#ded7c5]">
              <Users className="w-3.5 h-3.5 text-[var(--green-light)]" />
              <span>{missionPlan.people_count} Students</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[rgba(198,169,107,0.15)] border border-[rgba(198,169,107,0.35)] text-[#f0e4c4] font-medium">
              <span>Budget: ₹{missionPlan.budget.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Selected Plan Summary Banner */}
        <div className="p-4 rounded-sm border border-[rgba(163,200,121,0.3)] bg-[rgba(16,22,14,0.7)] text-xs text-[#ded7c5] space-y-1.5">
          <div className="flex items-center justify-between font-medium text-[#a3c879]">
            <span>RECOMMENDED FEASIBLE OPTION: PLAN ALPHA</span>
            <span className="text-xs">TOTAL: ₹{missionPlan.options[0]?.total_cost.toLocaleString()} (₹8,500 BUFFER)</span>
          </div>
          <p className="text-xs text-[#ded7c5] font-sans leading-relaxed">
            {missionPlan.explanation}
          </p>
        </div>
      </div>

      {/* 2. Candidate Options & Constraint Verification */}
      <div className="rounded-sm border border-[rgba(210,191,143,0.2)] bg-[#080907] p-7 space-y-4">
        <h3 className="text-xs font-medium text-[#f0e4c4] uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
          Candidate Option Comparison & Constraint Solving
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {missionPlan.options.map((opt) => (
            <div
              key={opt.id}
              className={`p-5 rounded-sm border space-y-4 transition ${
                opt.is_feasible
                  ? "border-[rgba(163,200,121,0.35)] bg-[rgba(16,22,14,0.6)] shadow-[0_0_15px_rgba(163,200,121,0.08)]"
                  : "border-[rgba(198,169,107,0.2)] bg-[rgba(12,14,11,0.4)] opacity-75"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-medium tracking-wider uppercase ${
                      opt.is_feasible
                        ? "bg-[rgba(79,139,72,0.2)] border border-[var(--green-light)] text-[#a3c879]"
                        : "bg-[rgba(198,169,107,0.1)] border border-[rgba(198,169,107,0.3)] text-[#c6a96b]"
                    }`}
                  >
                    {opt.is_feasible ? "FEASIBLE • RECOMMENDED" : "INFEASIBLE • CONSTRAINT FAILED"}
                  </span>
                  <h4 className="text-base font-serif font-medium text-[#f0e4c4] mt-2">{opt.name}</h4>
                  <span className="text-[11px] text-[#898678] font-sans">{opt.category} • {opt.distance_km} km to venue</span>
                </div>
                <div className="text-right">
                  <div className="text-base font-serif font-medium text-[#f0e4c4]">
                    ₹{opt.total_cost.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-[#706f63]">Rating: {opt.rating}/5.0</span>
                </div>
              </div>

              {/* Constraint Evaluation Table */}
              <div className="space-y-1.5 pt-2 border-t border-[rgba(210,191,143,0.12)]">
                <span className="text-[10px] text-[#a6a193] font-medium uppercase tracking-wider block">Constraint Evaluations:</span>
                {opt.constraint_evaluations.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-sm bg-[rgba(5,6,5,0.7)] text-xs border border-[rgba(210,191,143,0.08)]"
                  >
                    <div className="flex items-center gap-2">
                      {c.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--green-light)] shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                      )}
                      <span className="text-[#ded7c5] font-sans text-xs">{c.name} ({c.target_value})</span>
                    </div>
                    <span className={c.passed ? "text-[#a3c879] font-medium" : "text-[#c6a96b] font-medium"}>
                      {c.actual_value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Budget Breakdown */}
              <div className="space-y-1 pt-2 border-t border-[rgba(210,191,143,0.12)] text-[11px] text-[#898678]">
                <span className="font-medium text-[10px] text-[#a6a193] uppercase tracking-wider block mb-1">Cost Breakdown:</span>
                {Object.entries(opt.breakdown).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span>{k}:</span>
                    <span className="text-[#eee9da]">₹{v.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Actionable 3-Day Itinerary */}
      <div className="rounded-sm border border-[rgba(210,191,143,0.2)] bg-[#080907] p-7 space-y-4">
        <h3 className="text-xs font-medium text-[#f0e4c4] uppercase tracking-[0.2em] flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[var(--gold)]" />
          Actionable 3-Day Execution Itinerary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {missionPlan.itinerary.map((day, i) => (
            <div key={i} className="p-4 rounded-sm border border-[rgba(210,191,143,0.12)] bg-[rgba(12,14,11,0.6)] space-y-3">
              <span className="text-xs font-serif font-medium text-[var(--gold)] block border-b border-[rgba(210,191,143,0.12)] pb-2">
                {day.day}
              </span>
              <div className="space-y-2.5 text-xs text-[#a6a193] font-sans">
                <div>
                  <span className="text-[9px] text-[var(--gold)] uppercase font-mono block">Morning:</span>
                  <p>{day.morning}</p>
                </div>
                <div>
                  <span className="text-[9px] text-[var(--green-light)] uppercase font-mono block">Afternoon:</span>
                  <p>{day.afternoon}</p>
                </div>
                <div>
                  <span className="text-[9px] text-[#ded7c5] uppercase font-mono block">Evening:</span>
                  <p>{day.evening}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Interactive What-If Scenario Simulator */}
      <div className="rounded-sm border border-[rgba(198,169,107,0.25)] bg-[#0b0c09] p-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(210,191,143,0.15)] pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[var(--gold)]" />
              <h3 className="text-sm font-serif font-medium text-[#f0e4c4] uppercase tracking-wider">
                What-If Scenario Simulator Engine
              </h3>
            </div>
            <p className="text-xs text-[#898678] font-sans mt-0.5">
              Simulate dynamic constraints, price shocks, and headcount changes without altering baseline evidence.
            </p>
          </div>
          <span className="text-[9px] font-mono px-3 py-1 rounded-full bg-[rgba(198,169,107,0.12)] text-[#f0e4c4] border border-[rgba(198,169,107,0.3)]">
            SCENARIO SIMULATION
          </span>
        </div>

        {/* Quick Simulation Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-[#898678] mr-1 uppercase tracking-wider">Quick Scenarios:</span>
          {[
            "What if the budget drops to ₹25,000?",
            "What if two more students join (6 pax)?",
            "What if prices fall 15%?",
          ].map((prompt, i) => (
            <button
              key={i}
              type="button"
              disabled={isRunningScenario}
              onClick={() => handleRunScenario(prompt)}
              className="px-3 py-1 rounded-full border border-[rgba(210,191,143,0.18)] bg-[rgba(12,14,11,0.6)] hover:bg-[rgba(198,169,107,0.15)] text-[#ded7c5] text-[10px] font-mono transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Custom Scenario Input */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Type a custom what-if scenario (e.g., 'What if train tickets increase by 20%?')..."
            className="flex-1 px-4 py-2.5 rounded-none bg-[rgba(5,6,5,0.8)] border-b border-[rgba(210,191,143,0.25)] focus:border-[var(--gold)] text-xs text-[#eee9da] font-mono placeholder:text-[#706f63] outline-none"
          />
          <button
            type="button"
            disabled={!customPrompt.trim() || isRunningScenario}
            onClick={() => handleRunScenario(customPrompt)}
            className="px-5 py-2.5 rounded-full border border-[rgba(198,169,107,0.6)] bg-[rgba(198,169,107,0.2)] hover:bg-[rgba(198,169,107,0.35)] text-[#f0e4c4] text-[10px] tracking-wider uppercase font-mono transition disabled:opacity-40"
          >
            {isRunningScenario ? "SIMULATING..." : "RUN SIMULATION"}
          </button>
        </div>

        {/* Recalculated Scenarios Output List */}
        {scenarios.length > 0 && (
          <div className="space-y-3 pt-3">
            <span className="text-[10px] text-[var(--gold)] font-medium uppercase tracking-wider block">
              Recalculated Simulation Results:
            </span>
            {scenarios.map((sc) => (
              <div
                key={sc.id}
                className="p-4 rounded-sm border border-[rgba(210,191,143,0.18)] bg-[rgba(5,6,5,0.8)] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#f0e4c4] font-medium">{sc.name}</span>
                  <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-[rgba(198,169,107,0.15)] text-[#f0e4c4] border border-[rgba(198,169,107,0.35)]">
                    {sc.strategic_verdict}
                  </span>
                </div>
                <p className="text-[#ded7c5] font-sans">{sc.impact_summary}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-2 border-t border-[rgba(210,191,143,0.1)]">
                  {Object.entries(sc.recalculated_metrics).map(([k, v]) => (
                    <div key={k} className="p-2 rounded-sm bg-[rgba(12,14,11,0.6)] border border-[rgba(210,191,143,0.08)]">
                      <span className="text-[10px] text-[#706f63] block">{k}:</span>
                      <span className="text-[#a3c879] font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
