"use client";

import React, { useState } from "react";
import { MissionPlan, WhatIfScenario } from "@/types/investigation";
import { Compass, CheckCircle2, XCircle, Sparkles, Sliders, Calendar, IndianRupee, MapPin, Users } from "lucide-react";
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
      <div className="rounded-2xl border border-emerald-950/80 bg-gradient-to-b from-[#0c1018] to-[#080b10] p-6 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                Mission Control • Real-World Constraint Planning
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-semibold">
                PILLAR 6 OPTIMIZER
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Objective: {missionPlan.objective}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{missionPlan.location}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>{missionPlan.people_count} Students</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300 font-bold">
              <span>Budget: ₹{missionPlan.budget.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Selected Plan Summary Banner */}
        <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center justify-between font-bold text-emerald-400">
            <span>RECOMMENDED FEASIBLE OPTION: PLAN ALPHA</span>
            <span className="text-sm">TOTAL: ₹{missionPlan.options[0]?.total_cost.toLocaleString()} (₹8,500 BUFFER)</span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {missionPlan.explanation}
          </p>
        </div>
      </div>

      {/* 2. Candidate Options & Hard/Soft Constraint Verification */}
      <div className="rounded-2xl border border-slate-800 bg-[#0a0d14] p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Candidate Option Comparison & Constraint Solving
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {missionPlan.options.map((opt) => (
            <div
              key={opt.id}
              className={`p-5 rounded-xl border space-y-4 transition ${
                opt.is_feasible
                  ? "border-emerald-500/50 bg-emerald-950/15 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "border-red-500/40 bg-red-950/10 opacity-80"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      opt.is_feasible
                        ? "bg-emerald-950 border border-emerald-500/50 text-emerald-300"
                        : "bg-red-950 border border-red-500/50 text-red-300"
                    }`}
                  >
                    {opt.is_feasible ? "FEASIBLE • RECOMMENDED" : "INFEASIBLE • CONSTRAINT FAILED"}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1.5 font-mono">{opt.name}</h4>
                  <span className="text-xs text-slate-400">{opt.category} • {opt.distance_km} km to venue</span>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-white font-mono">
                    ₹{opt.total_cost.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-slate-500">Rating: {opt.rating}/5.0</span>
                </div>
              </div>

              {/* Constraint Evaluation Table */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold block">Constraint Evaluations:</span>
                {opt.constraint_evaluations.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded bg-slate-900/60 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {c.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      )}
                      <span className="text-slate-300">{c.name} ({c.target_value})</span>
                    </div>
                    <span className={c.passed ? "text-emerald-400 font-semibold" : "text-red-400 font-bold"}>
                      {c.actual_value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Budget Breakdown */}
              <div className="space-y-1 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold block mb-1">Cost Breakdown:</span>
                {Object.entries(opt.breakdown).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span>{k}:</span>
                    <span className="text-slate-200">₹{v.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Actionable 3-Day Itinerary */}
      <div className="rounded-2xl border border-slate-800 bg-[#0a0d14] p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          Actionable 3-Day Execution Itinerary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {missionPlan.itinerary.map((day, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-3">
              <span className="text-xs font-bold text-emerald-400 block border-b border-slate-900 pb-1.5">
                {day.day}
              </span>
              <div className="space-y-2 text-xs text-slate-300 font-sans">
                <div>
                  <span className="text-[10px] text-emerald-400/80 uppercase font-mono block">Morning:</span>
                  <p>{day.morning}</p>
                </div>
                <div>
                  <span className="text-[10px] text-cyan-400/80 uppercase font-mono block">Afternoon:</span>
                  <p>{day.afternoon}</p>
                </div>
                <div>
                  <span className="text-[10px] text-purple-400/80 uppercase font-mono block">Evening:</span>
                  <p>{day.evening}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Interactive What-If Scenario Simulator */}
      <div className="rounded-2xl border border-purple-950/80 bg-[#0c0a14] p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-950/60 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                What-If Scenario Simulator Engine
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate dynamic constraints, price shocks, and headcount changes without altering baseline evidence.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-purple-950 text-purple-300 border border-purple-500/30">
            SCENARIO / SIMULATION ONLY
          </span>
        </div>

        {/* Quick Simulation Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 mr-1">Quick Scenarios:</span>
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
              className="px-3 py-1.5 rounded-lg border border-purple-900/50 bg-purple-950/30 hover:bg-purple-900/50 text-purple-300 text-xs font-mono transition"
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
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs text-white font-mono placeholder:text-slate-600 outline-none"
          />
          <button
            type="button"
            disabled={!customPrompt.trim() || isRunningScenario}
            onClick={() => handleRunScenario(customPrompt)}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs font-mono transition disabled:opacity-40"
          >
            {isRunningScenario ? "Simulating..." : "Run Simulation"}
          </button>
        </div>

        {/* Recalculated Scenarios Output List */}
        {scenarios.length > 0 && (
          <div className="space-y-3 pt-3">
            <span className="text-xs text-purple-300 font-semibold uppercase block">
              Recalculated Simulation Results:
            </span>
            {scenarios.map((sc) => (
              <div
                key={sc.id}
                className="p-4 rounded-xl border border-purple-900/60 bg-slate-950/80 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">{sc.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40">
                    {sc.strategic_verdict}
                  </span>
                </div>
                <p className="text-slate-300 font-sans">{sc.impact_summary}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-2 border-t border-slate-900">
                  {Object.entries(sc.recalculated_metrics).map(([k, v]) => (
                    <div key={k} className="p-2 rounded bg-slate-900/60 border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block">{k}:</span>
                      <span className="text-emerald-400 font-semibold">{v}</span>
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
