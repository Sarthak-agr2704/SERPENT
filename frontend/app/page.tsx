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
  ArrowLeft,
  Search,
} from "lucide-react";

type TabType =
  | "REPORT"
  | "TRAIL"
  | "GRAPH"
  | "WAR_ROOM"
  | "TIME_MACHINE"
  | "MISSION";

export default function Home() {
  const [investigation, setInvestigation] = useState<Investigation | null>(
    null
  );
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
      if (inv.mode === "MISSION") {
        setActiveTab("MISSION");
      } else if (inv.mode === "TRACE") {
        setActiveTab("TIME_MACHINE");
      } else {
        setActiveTab("REPORT");
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message || "Failed to start investigation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSearch = () => {
    setInvestigation(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 1. FIRST WEBPAGE (Landing Page before investigation):
  // Single-screen layout (h-screen overflow-hidden), zero scrolling, snake design in the background.
  if (!investigation && !isLoading) {
    return (
      <div className="h-screen max-h-screen overflow-hidden flex flex-col justify-between relative bg-[#050605] text-[#eee9da] font-sans selection:bg-[#c6a96b] selection:text-black">
        {/* Snake Design in Background */}
        <div className="hero-image pointer-events-none" aria-hidden="true" />
        <div className="hero-shade pointer-events-none" aria-hidden="true" />
        <div className="film-grain pointer-events-none" aria-hidden="true" />

        {/* Header */}
        <div className="relative z-20">
          <Header
            hasSerpApiKey={hasSerpApiKey}
            isDemoMode={!hasSerpApiKey}
            onOpenSettings={() => setIsSettingsOpen(true)}
            isInvestigationActive={false}
            onNewSearch={handleResetSearch}
          />
        </div>

        {/* Main Content: Hero Title + Command Query + Featured Scenarios (strictly fits within viewport) */}
        <main className="relative z-10 flex-1 flex flex-col justify-center items-center w-full max-w-5xl mx-auto px-4 sm:px-6 py-2 sm:py-3">
          {/* Error Alert if any */}
          {error && (
            <div className="w-full mb-3 p-3 rounded-sm border border-red-500/40 bg-red-950/40 text-red-300 font-mono text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          {/* Project Hero Header */}
          <div className="text-center space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full border border-[rgba(210,191,143,0.22)] bg-[rgba(12,14,11,0.7)] text-[8px] sm:text-[9px] font-mono tracking-[0.25em] text-[var(--gold)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
              AUTONOMOUS MULTI-AGENT INTELLIGENCE PLATFORM
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#f0e4c4] drop-shadow-md">
              Search Evidence & Research Platform
            </h1>
            <p className="text-xs sm:text-sm text-[#a6a193] max-w-2xl mx-auto font-sans leading-relaxed">
              Empirical investigation engine with real-time perception across
              Google, Scholar, News, Maps, and YouTube.
            </p>
          </div>

          {/* Search Box & Featured Scenarios */}
          <InvestigationLauncher
            onLaunch={handleLaunchInvestigation}
            isLoading={isLoading}
          />
        </main>

        {/* Compact Footer */}
        <footer className="relative z-20 border-t border-[rgba(210,191,143,0.12)] bg-[rgba(3,4,3,0.85)] backdrop-blur-sm py-2 sm:py-2.5 px-6 text-center text-[10px] font-mono text-[#706f63]">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#ded7c5]">S.E.R.P.E.N.T.</span>
              <span>
                • Search Evidence & Research Platform for Exploration, Networked
                Thinking
              </span>
            </div>
            <div>
              Perception Layer:{" "}
              <span className="text-[var(--gold)] font-medium">
                SerpApi Multi-Engine Search
              </span>
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
      </div>
    );
  }

  // 2. LOADING STATE: Swarm Deployment (Single-screen with snake backdrop)
  if (isLoading) {
    return (
      <div className="h-screen max-h-screen overflow-hidden flex flex-col justify-between relative bg-[#050605] text-[#eee9da] font-sans selection:bg-[#c6a96b] selection:text-black">
        <div className="hero-image pointer-events-none" aria-hidden="true" />
        <div className="hero-shade pointer-events-none" aria-hidden="true" />
        <div className="film-grain pointer-events-none" aria-hidden="true" />

        <div className="relative z-20">
          <Header
            hasSerpApiKey={hasSerpApiKey}
            isDemoMode={!hasSerpApiKey}
            onOpenSettings={() => setIsSettingsOpen(true)}
            isInvestigationActive={false}
            onNewSearch={handleResetSearch}
          />
        </div>

        <main className="relative z-10 flex-1 flex flex-col justify-center items-center p-6 text-center animate-in fade-in duration-300">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-[rgba(198,169,107,0.2)] animate-ping" />
            <div className="w-16 h-16 rounded-full border-2 border-[var(--gold)] border-t-transparent animate-spin" />
            <Search className="w-6 h-6 text-[var(--gold)] absolute" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-3xl font-medium text-[#f0e4c4]">
              Deploying Autonomous Agent Swarm...
            </h2>
            <p className="text-xs font-mono text-[#898678] max-w-md mx-auto">
              Harvesting multi-engine search vectors via SerpApi across Google,
              Scholar, News, and Video. Synthesizing citations with zero
              hallucinations.
            </p>
          </div>
        </main>

        <footer className="relative z-20 border-t border-[rgba(210,191,143,0.12)] bg-[rgba(3,4,3,0.85)] backdrop-blur-sm py-2 sm:py-2.5 px-6 text-center text-[10px] font-mono text-[#706f63]">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#ded7c5]">S.E.R.P.E.N.T.</span>
              <span>
                • Search Evidence & Research Platform for Exploration, Networked
                Thinking
              </span>
            </div>
            <div>
              Perception Layer:{" "}
              <span className="text-[var(--gold)] font-medium">
                SerpApi Multi-Engine Search
              </span>
            </div>
          </div>
        </footer>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSaved={() => {
            checkHealth()
              .then((data) => setHasSerpApiKey(Boolean(data.serpapi_configured)))
              .catch(() => {});
          }}
        />
      </div>
    );
  }

  // 3. INVESTIGATION WORKSPACE (After user submits query and investigates):
  // Full vertical scrolling (min-h-screen overflow-y-auto) to review all findings, evidence, tabs and logs.
  return (
    <div className="min-h-screen overflow-y-auto bg-[#050605] text-[#eee9da] flex flex-col font-sans selection:bg-[#c6a96b] selection:text-black relative">
      <div className="film-grain pointer-events-none" aria-hidden="true" />

      {/* 1. Header (Sticky) */}
      <Header
        hasSerpApiKey={hasSerpApiKey}
        isDemoMode={investigation ? investigation.is_demo_mode : !hasSerpApiKey}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isInvestigationActive={Boolean(investigation)}
        onNewSearch={handleResetSearch}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Error Alert if any */}
        {error && (
          <div className="mb-6 p-4 rounded-sm border border-red-500/40 bg-red-950/30 text-red-300 font-mono text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* INVESTIGATION WORKSPACE */}
        {investigation && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Investigation Bar with Back Button */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-sm border border-[rgba(210,191,143,0.22)] bg-[#0b0c09]">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetSearch}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(210,191,143,0.25)] hover:border-[var(--gold)] bg-[rgba(12,14,11,0.8)] text-[#f0e4c4] text-[10px] font-mono tracking-wider transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>NEW SEARCH</span>
                </button>
                <div>
                  <span className="text-[9px] font-mono text-[var(--gold)] uppercase tracking-widest block">
                    ACTIVE INVESTIGATION QUERY:
                  </span>
                  <h2 className="text-base font-serif font-medium text-[#f0e4c4] truncate max-w-2xl">
                    "{investigation.query}"
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-[#a6a193]">
                <span className="px-2.5 py-1 rounded-full border border-[rgba(210,191,143,0.18)] bg-[rgba(5,6,5,0.7)] text-[10px]">
                  MODE: {investigation.mode}
                </span>
                <span className="px-2.5 py-1 rounded-full border border-[rgba(210,191,143,0.18)] bg-[rgba(5,6,5,0.7)] text-[10px]">
                  {investigation.sources.length} SOURCES
                </span>
              </div>
            </div>

            {/* Swarm Telemetry & Agent States */}
            <SwarmStatus investigation={investigation} />

            {/* Pillar Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[rgba(210,191,143,0.18)] pb-3 font-mono text-xs">
              <button
                onClick={() => setActiveTab("REPORT")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition ${
                  activeTab === "REPORT"
                    ? "bg-[rgba(198,169,107,0.2)] border border-[var(--gold)] text-[#f0e4c4] font-medium shadow-[0_0_12px_rgba(198,169,107,0.15)]"
                    : "border border-[rgba(210,191,143,0.15)] bg-[rgba(12,14,11,0.6)] text-[#898678] hover:text-[#eee9da] hover:border-[rgba(210,191,143,0.35)]"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>Executive Report</span>
              </button>

              <button
                onClick={() => setActiveTab("TRAIL")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition ${
                  activeTab === "TRAIL"
                    ? "bg-[rgba(198,169,107,0.2)] border border-[var(--gold)] text-[#f0e4c4] font-medium shadow-[0_0_12px_rgba(198,169,107,0.15)]"
                    : "border border-[rgba(210,191,143,0.15)] bg-[rgba(12,14,11,0.6)] text-[#898678] hover:text-[#eee9da] hover:border-[rgba(210,191,143,0.35)]"
                }`}
              >
                <GitCommit className="w-3.5 h-3.5 text-[var(--green-light)]" />
                <span>The Serpent Trail ({investigation.trail.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("GRAPH")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition ${
                  activeTab === "GRAPH"
                    ? "bg-[rgba(198,169,107,0.2)] border border-[var(--gold)] text-[#f0e4c4] font-medium shadow-[0_0_12px_rgba(198,169,107,0.15)]"
                    : "border border-[rgba(210,191,143,0.15)] bg-[rgba(12,14,11,0.6)] text-[#898678] hover:text-[#eee9da] hover:border-[rgba(210,191,143,0.35)]"
                }`}
              >
                <Network className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>Evidence Graph</span>
              </button>

              {investigation.competitive_radar && (
                <button
                  onClick={() => setActiveTab("WAR_ROOM")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition ${
                    activeTab === "WAR_ROOM"
                      ? "bg-[rgba(198,169,107,0.2)] border border-[var(--gold)] text-[#f0e4c4] font-medium shadow-[0_0_12px_rgba(198,169,107,0.15)]"
                      : "border border-[rgba(210,191,143,0.15)] bg-[rgba(12,14,11,0.6)] text-[#898678] hover:text-[#eee9da] hover:border-[rgba(210,191,143,0.35)]"
                  }`}
                >
                  <Radar className="w-3.5 h-3.5 text-[var(--green-light)]" />
                  <span>War Room Radar</span>
                </button>
              )}

              {investigation.timeline.length > 0 && (
                <button
                  onClick={() => setActiveTab("TIME_MACHINE")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition ${
                    activeTab === "TIME_MACHINE"
                      ? "bg-[rgba(198,169,107,0.2)] border border-[var(--gold)] text-[#f0e4c4] font-medium shadow-[0_0_12px_rgba(198,169,107,0.15)]"
                    : "border border-[rgba(210,191,143,0.15)] bg-[rgba(12,14,11,0.6)] text-[#898678] hover:text-[#eee9da] hover:border-[rgba(210,191,143,0.35)]"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>Time Machine</span>
                </button>
              )}

              {investigation.mission_plan && (
                <button
                  onClick={() => setActiveTab("MISSION")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition ${
                    activeTab === "MISSION"
                      ? "bg-[rgba(198,169,107,0.2)] border border-[var(--gold)] text-[#f0e4c4] font-medium shadow-[0_0_12px_rgba(198,169,107,0.15)]"
                      : "border border-[rgba(210,191,143,0.15)] bg-[rgba(12,14,11,0.6)] text-[#898678] hover:text-[#eee9da] hover:border-[rgba(210,191,143,0.35)]"
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-[var(--green-light)]" />
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

              {activeTab === "WAR_ROOM" &&
                investigation.competitive_radar && (
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

      {/* Footer (Full) */}
      <footer className="border-t border-[rgba(210,191,143,0.15)] bg-[#030403] py-6 px-6 text-center text-xs font-mono text-[#706f63] space-y-2 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#ded7c5]">S.E.R.P.E.N.T.</span>
            <span>
              • Search Evidence & Research Platform for Exploration, Networked
              Thinking
            </span>
          </div>
          <div>
            Perception Layer:{" "}
            <span className="text-[var(--gold)] font-medium">
              SerpApi Multi-Engine Search
            </span>
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
