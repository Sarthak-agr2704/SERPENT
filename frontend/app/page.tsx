"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import SettingsModal from "@/components/SettingsModal";
import InvestigationLauncher from "@/components/InvestigationLauncher";
import SwarmStatus from "@/components/SwarmStatus";
import SerpentTrail from "@/components/SerpentTrail";
import ExecutiveReport from "@/components/ExecutiveReport";
import EvidenceGraph from "@/components/EvidenceGraph";
import WarRoomView from "@/components/WarRoomView";
import TimeMachineView from "@/components/TimeMachineView";
import MissionControlView from "@/components/MissionControlView";
import GoDeeperModal from "@/components/GoDeeperModal";
import { Investigation, InvestigationMode } from "@/types/investigation";
import { startInvestigation, checkHealth } from "@/lib/api";
import {
  FileText,
  GitCommit,
  Network,
  Radar,
  Clock,
  Compass,
  AlertCircle,
  Sparkles,
  ArrowRight
} from "lucide-react";

type TabType = "REPORT" | "TRAIL" | "GRAPH" | "WAR_ROOM" | "TIME_MACHINE" | "MISSION";

export default function Home() {
  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("REPORT");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [goDeeperEntity, setGoDeeperEntity] = useState<string | null>(null);
  const [hasSerpApiKey, setHasSerpApiKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check health and settings on mount
  useEffect(() => {
    checkHealth()
      .then((data) => setHasSerpApiKey(Boolean(data.serpapi_configured)))
      .catch(() => {});
  }, []);

  const handleLaunchInvestigation = async (
    query: string,
    mode: InvestigationMode = "AUTO",
    budget: number = 20
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const inv = await startInvestigation({
        query,
        mode,
        budget,
      });
      setInvestigation(inv);

      // Auto-switch to most relevant tab based on mode
      if (inv.mode === "INTELLIGENCE") {
        setActiveTab("WAR_ROOM");
      } else if (inv.mode === "MISSION") {
        setActiveTab("MISSION");
      } else if (inv.mode === "TRACE") {
        setActiveTab("TIME_MACHINE");
      } else {
        setActiveTab("REPORT");
      }
    } catch (err: any) {
      setError(err.message || "Failed to start investigation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* 1. Header */}
      <Header
        hasSerpApiKey={hasSerpApiKey}
        isDemoMode={investigation ? investigation.is_demo_mode : !hasSerpApiKey}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Error Alert if any */}
        {error && (
          <div className="p-4 rounded-xl border border-red-500/50 bg-red-950/40 text-red-300 font-mono text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-white">✕</button>
          </div>
        )}

        {/* 2. Investigation Launcher Bar & Featured Cards */}
        <InvestigationLauncher
          onLaunch={handleLaunchInvestigation}
          isLoading={isLoading}
        />

        {/* 3. Live Investigation Swarm & Pillar Workspace */}
        {investigation && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-300">
            {/* Swarm Telemetry & Agent State */}
            <SwarmStatus investigation={investigation} />

            {/* Pillar Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-2.5 font-mono text-xs">
              <button
                onClick={() => setActiveTab("REPORT")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                  activeTab === "REPORT"
                    ? "bg-emerald-950 border border-emerald-500/60 text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Executive Report</span>
              </button>

              <button
                onClick={() => setActiveTab("TRAIL")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                  activeTab === "TRAIL"
                    ? "bg-emerald-950 border border-emerald-500/60 text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <GitCommit className="w-3.5 h-3.5 text-emerald-400" />
                <span>The Serpent Trail ({investigation.trail.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("GRAPH")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                  activeTab === "GRAPH"
                    ? "bg-emerald-950 border border-emerald-500/60 text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <Network className="w-3.5 h-3.5 text-cyan-400" />
                <span>Evidence Graph</span>
              </button>

              {investigation.competitive_radar && (
                <button
                  onClick={() => setActiveTab("WAR_ROOM")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                    activeTab === "WAR_ROOM"
                      ? "bg-emerald-950 border border-emerald-500/60 text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  <Radar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>War Room Radar</span>
                </button>
              )}

              {investigation.timeline.length > 0 && (
                <button
                  onClick={() => setActiveTab("TIME_MACHINE")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                    activeTab === "TIME_MACHINE"
                      ? "bg-emerald-950 border border-emerald-500/60 text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Time Machine</span>
                </button>
              )}

              {investigation.mission_plan && (
                <button
                  onClick={() => setActiveTab("MISSION")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                    activeTab === "MISSION"
                      ? "bg-emerald-950 border border-emerald-500/60 text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-purple-400" />
                  <span>Mission Control</span>
                </button>
              )}
            </div>

            {/* Active Tab View Body */}
            <div className="pt-2">
              {activeTab === "REPORT" && investigation.report && (
                <ExecutiveReport
                  report={investigation.report}
                  lineages={investigation.lineages}
                  sources={investigation.sources}
                  claims={investigation.claims}
                  onDrilldownEntity={(ent) => setGoDeeperEntity(ent)}
                />
              )}

              {activeTab === "TRAIL" && (
                <SerpentTrail
                  trail={investigation.trail}
                  replay={investigation.replay}
                  onEntityClick={(ent) => setGoDeeperEntity(ent)}
                />
              )}

              {activeTab === "GRAPH" && (
                <EvidenceGraph
                  entities={investigation.entities}
                  claims={investigation.claims}
                  sources={investigation.sources}
                  relationships={investigation.relationships}
                  evidenceItems={investigation.evidence_items}
                  onSelectEntity={(ent) => setGoDeeperEntity(ent)}
                />
              )}

              {activeTab === "WAR_ROOM" && investigation.competitive_radar && (
                <WarRoomView
                  radarData={investigation.competitive_radar}
                  onDrilldownEntity={(ent) => setGoDeeperEntity(ent)}
                />
              )}

              {activeTab === "TIME_MACHINE" && (
                <TimeMachineView
                  timeline={investigation.timeline}
                  comparison={investigation.period_comparison}
                  onWhyClick={(title) => setGoDeeperEntity(title)}
                />
              )}

              {activeTab === "MISSION" && investigation.mission_plan && (
                <MissionControlView
                  missionPlan={investigation.mission_plan}
                  investigationId={investigation.id}
                  initialScenarios={investigation.scenarios}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#06080d] py-6 px-4 text-center text-xs font-mono text-slate-500 space-y-2 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">S.E.R.P.E.N.T.</span>
            <span>• Search Evidence & Research Platform for Exploration, Networked Thinking</span>
          </div>
          <div className="text-slate-400">
            Perception Layer: <span className="text-emerald-400 font-semibold">SerpApi Multi-Engine Search</span>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaved={() => {
          checkHealth()
            .then((data) => setHasSerpApiKey(Boolean(data.serpapi_configured)))
            .catch(() => {});
        }}
      />

      {/* Digital Detective Go Deeper Modal */}
      {investigation && goDeeperEntity && (
        <GoDeeperModal
          isOpen={Boolean(goDeeperEntity)}
          onClose={() => setGoDeeperEntity(null)}
          investigationId={investigation.id}
          entityName={goDeeperEntity}
          onLaunchNewQuery={(newQ) => handleLaunchInvestigation(newQ, "AUTO")}
        />
      )}
    </div>
  );
}
