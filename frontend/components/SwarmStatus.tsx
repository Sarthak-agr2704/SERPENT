"use client";

import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Globe,
  Network,
  FileText,
  Activity,
} from "lucide-react";
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
    <div className="w-full rounded-sm border border-[rgba(210,191,143,0.22)] bg-[#0b0c09] p-6 shadow-2xl space-y-5 font-mono">
      {/* Header Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(210,191,143,0.15)] pb-4">
        <div className="flex items-center space-x-3">
          <span className="relative flex h-2.5 w-2.5">
            {!isCompleted ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--green-light)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--green)]" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--gold)]" />
            )}
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#f0e4c4] font-medium">
            {isCompleted
              ? "INVESTIGATION COMPLETED"
              : "SWARM INVESTIGATION IN PROGRESS"}
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[rgba(5,6,5,0.8)] border border-[rgba(210,191,143,0.2)] text-[#a6a193]">
            MODE: {investigation.mode}
          </span>
        </div>

        {/* Telemetry Counters */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-[#ded7c5]">
            <Globe className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span className="font-medium text-[#f0e4c4]">
              {investigation.sources.length}
            </span>
            <span className="text-[#898678]">sources</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#ded7c5]">
            <FileText className="w-3.5 h-3.5 text-[var(--green-light)]" />
            <span className="font-medium text-[#f0e4c4]">
              {investigation.claims.length}
            </span>
            <span className="text-[#898678]">claims</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#ded7c5]">
            <Network className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span className="font-medium text-[#f0e4c4]">
              {investigation.entities.length}
            </span>
            <span className="text-[#898678]">entities</span>
          </div>
          {investigation.contradictions.length > 0 && (
            <div className="flex items-center gap-1.5 text-[var(--gold)] px-2 py-0.5 rounded-sm bg-[rgba(198,169,107,0.1)] border border-[rgba(198,169,107,0.4)]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="font-medium">
                {investigation.contradictions.length}
              </span>
              <span className="text-[#a6a193]">conflicts</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[#ded7c5]">
            <Activity className="w-3.5 h-3.5 text-[var(--green-light)]" />
            <span className="font-medium text-[#f0e4c4]">
              {investigation.search_count}
            </span>
            <span className="text-[#898678]">
              / {investigation.search_budget} budget
            </span>
          </div>
        </div>
      </div>

      {/* Agents Swarm State Grid */}
      <div>
        <div className="text-[10px] text-[#898678] tracking-wider mb-2.5 font-medium uppercase">
          SPECIALIZED AGENT SWARM TELEMETRY:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {ALL_AGENTS.map((agentName) => {
            const isActive = investigation.active_agents.includes(agentName);
            const isFinished =
              investigation.completed_agents.includes(agentName) || isCompleted;

            let badgeStyle =
              "border-[rgba(210,191,143,0.1)] bg-[rgba(5,6,5,0.4)] text-[#706f63]";
            let icon = (
              <span className="w-1.5 h-1.5 rounded-full bg-[#36402a]" />
            );

            if (isFinished && isActive) {
              badgeStyle =
                "border-[rgba(163,200,121,0.3)] bg-[rgba(79,139,72,0.12)] text-[#a3c879] font-medium";
              icon = (
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--green-light)] shrink-0" />
              );
            } else if (isActive) {
              badgeStyle =
                "border-[rgba(198,169,107,0.6)] bg-[rgba(198,169,107,0.15)] text-[#f0e4c4] animate-pulse font-medium";
              icon = (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] shrink-0" />
              );
            }

            return (
              <div
                key={agentName}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-sm border text-[10px] transition ${badgeStyle}`}
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
        <div className="pt-1 flex items-center gap-2.5 text-[11px] text-[#a6a193] bg-[rgba(5,6,5,0.8)] p-3 rounded-sm border border-[rgba(210,191,143,0.12)]">
          <span className="text-[var(--gold)] font-medium shrink-0">
            [{investigation.replay[investigation.replay.length - 1].time_label}]
          </span>
          <span className="text-[#ded7c5] font-medium shrink-0">
            {investigation.replay[investigation.replay.length - 1].agent}:
          </span>
          <span className="text-[#898678] truncate">
            {investigation.replay[investigation.replay.length - 1].detail}
          </span>
        </div>
      )}
    </div>
  );
}
