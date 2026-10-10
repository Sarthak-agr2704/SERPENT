"use client";

import React from "react";
import { CheckCircle2, Clock, AlertTriangle, Database, Globe, Network, FileText, Activity } from "lucide-react";
import { Investigation } from "@/types/investigation";

interface SwarmStatusProps {
  investigation: Investigation;
}

const ALL_AGENTS = [
  "Intent Analyzer",
  "Discovery Agent",
  "News Agent",
  "Research/Scholar Agent",
  "Market Intelligence Agent",
  "Verification Agent",
  "Detective Agent",
  "Timeline Agent",
  "Mission Planning Agent",
  "Synthesis Agent",
];

export default function SwarmStatus({ investigation }: SwarmStatusProps) {
  const isCompleted = investigation.status === "COMPLETED";

  return (
    <div className="w-full rounded-2xl border border-emerald-950/70 bg-[#0a0d14] p-5 shadow-xl space-y-4 font-mono">
      {/* Header Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
        <div className="flex items-center space-x-3">
          <span className="relative flex h-3 w-3">
            {!isCompleted ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
            )}
          </span>
          <span className="text-xs uppercase tracking-wider text-slate-300 font-bold">
            {isCompleted ? "INVESTIGATION COMPLETED" : "SWARM INVESTIGATION IN PROGRESS"}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
            Mode: {investigation.mode}
          </span>
        </div>

        {/* Telemetry Counters */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-white">{investigation.sources.length}</span>
            <span className="text-slate-500">sources</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-white">{investigation.claims.length}</span>
            <span className="text-slate-500">claims</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Network className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-semibold text-white">{investigation.entities.length}</span>
            <span className="text-slate-500">entities</span>
          </div>
          {investigation.contradictions.length > 0 && (
            <div className="flex items-center gap-1.5 text-amber-300 px-2 py-0.5 rounded-md bg-amber-950/40 border border-amber-500/30">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold">{investigation.contradictions.length}</span>
              <span className="text-amber-400/80">conflicts</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-white">{investigation.search_count}</span>
            <span className="text-slate-500">/ {investigation.search_budget} budget</span>
          </div>
        </div>
      </div>

      {/* Agents Swarm State Grid */}
      <div>
        <div className="text-[11px] text-slate-500 mb-2 font-medium">SPECIALIZED AGENT SWARM DEPLOYMENT:</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {ALL_AGENTS.map((agentName) => {
            const isActive = investigation.active_agents.includes(agentName);
            const isFinished = investigation.completed_agents.includes(agentName) || isCompleted;

            let badgeStyle = "border-slate-800/80 bg-slate-900/30 text-slate-600";
            let icon = <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>;

            if (isFinished && isActive) {
              badgeStyle = "border-emerald-500/30 bg-emerald-950/30 text-emerald-300 font-semibold";
              icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
            } else if (isActive) {
              badgeStyle = "border-emerald-500/60 bg-emerald-900/40 text-emerald-200 animate-pulse font-semibold";
              icon = <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>;
            }

            return (
              <div
                key={agentName}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[11px] transition ${badgeStyle}`}
              >
                {icon}
                <span className="truncate">{agentName}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Replay Event Ticker */}
      {investigation.replay.length > 0 && (
        <div className="pt-1 flex items-center gap-2 text-xs text-slate-400 bg-slate-950/70 p-2.5 rounded-lg border border-slate-900">
          <span className="text-emerald-400 font-semibold shrink-0">
            [{investigation.replay[investigation.replay.length - 1].time_label}]
          </span>
          <span className="text-slate-300 font-medium shrink-0">
            {investigation.replay[investigation.replay.length - 1].agent}:
          </span>
          <span className="text-slate-400 truncate">
            {investigation.replay[investigation.replay.length - 1].detail}
          </span>
        </div>
      )}
    </div>
  );
}
