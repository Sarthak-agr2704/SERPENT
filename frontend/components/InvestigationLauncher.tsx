"use client";

import React, { useState } from "react";
import { Search, Sparkles, Sliders, ShieldCheck, Radar, Clock, Compass, AlertCircle } from "lucide-react";
import { InvestigationMode } from "@/types/investigation";

interface InvestigationLauncherProps {
  onLaunch: (query: string, mode: InvestigationMode, budget: number) => void;
  isLoading: boolean;
}

const MODES: Array<{ id: InvestigationMode; label: string; icon: any; desc: string }> = [
  { id: "AUTO", label: "Auto Detect", icon: Sparkles, desc: "Swarm autonomously identifies intent & routes agents" },
  { id: "INTELLIGENCE", label: "War Room", icon: Radar, desc: "Competitive analysis & market radar" },
  { id: "VERIFY", label: "Truth Engine", icon: ShieldCheck, desc: "Empirical claim & fact verification" },
  { id: "TRACE", label: "Time Machine", icon: Clock, desc: "Timeline reconstruction & period compare" },
  { id: "MISSION", label: "Mission Control", icon: Compass, desc: "Real-world constraint & travel planning" },
];

const FEATURED_INVESTIGATIONS = [
  {
    title: "BYD vs Indian EV Automakers",
    query: "Is BYD becoming a serious threat to Indian EV manufacturers?",
    mode: "INTELLIGENCE" as InvestigationMode,
    badge: "War Room",
    badgeColor: "border-emerald-500/40 text-emerald-300 bg-emerald-950/40",
    desc: "Market share, 70-100% CBU tariffs, Blade Battery 2.0, Tata & Mahindra defense.",
  },
  {
    title: "1,000 km Battery Range Claim",
    query: "Is the claim that this new battery doubles EV range true?",
    mode: "VERIFY" as InvestigationMode,
    badge: "Truth Engine",
    badgeColor: "border-cyan-500/40 text-cyan-300 bg-cyan-950/40",
    desc: "PR claims vs real-world highway dyno tests vs Nature Energy scientific degradation.",
  },
  {
    title: "Robotics Trip to Bengaluru Under ₹30,000",
    query: "Plan a 3-day robotics competition trip to Bengaluru for 4 students under ₹30,000",
    mode: "MISSION" as InvestigationMode,
    badge: "Mission Control",
    badgeColor: "border-purple-500/40 text-purple-300 bg-purple-950/40",
    desc: "IISc venue constraints, train tickets, quad dorm lodging, and what-if budget drops.",
  },
  {
    title: "Market Competitive Evolution 2023-2026",
    query: "How did this company's competitive position change from 2023 to 2026?",
    mode: "TRACE" as InvestigationMode,
    badge: "Time Machine",
    badgeColor: "border-amber-500/40 text-amber-300 bg-amber-950/40",
    desc: "Chronological milestones, ICE to born-EV skateboards, and 2024 vs 2026 diff.",
  },
];

export default function InvestigationLauncher({ onLaunch, isLoading }: InvestigationLauncherProps) {
  const [query, setQuery] = useState("");
  const [selectedMode, setSelectedMode] = useState<InvestigationMode>("AUTO");
  const [budget, setBudget] = useState(20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    onLaunch(query.trim(), selectedMode, budget);
  };

  const handleCardClick = (cardQuery: string, cardMode: InvestigationMode) => {
    setQuery(cardQuery);
    setSelectedMode(cardMode);
    onLaunch(cardQuery, cardMode, budget);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Search Command Box */}
      <div className="rounded-2xl border border-emerald-950/80 bg-gradient-to-b from-[#0c0f17] to-[#080a0f] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative flex items-center">
            <div className="absolute left-4.5 text-emerald-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to investigate? (Claim, market rivalry, mission plan, timeline...)"
              disabled={isLoading}
              className="w-full pl-12 pr-36 py-4 rounded-xl bg-slate-950/90 border border-emerald-900/40 focus:border-emerald-500/70 text-base text-white font-mono placeholder:text-slate-500 outline-none transition shadow-inner"
            />
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="absolute right-2 px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:pointer-events-none shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  Deploying...
                </>
              ) : (
                <>
                  Investigate
                  <span className="text-emerald-950 font-black">→</span>
                </>
              )}
            </button>
          </div>

          {/* Mode Selector & Budget Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {/* Mode Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {MODES.map((mode) => {
                const Icon = mode.icon;
                const isSelected = selectedMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSelectedMode(mode.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                      isSelected
                        ? "bg-emerald-950/80 border border-emerald-500/70 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)] font-semibold"
                        : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    }`}
                    title={mode.desc}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Budget */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Budget:</span>
              <span className="text-emerald-300 font-semibold">{budget} queries</span>
              <input
                type="range"
                min={10}
                max={30}
                step={5}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-20 accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Featured Quick-Launch Investigations */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Featured Hackathon Demo Scenarios
          </h3>
          <span className="text-[11px] font-mono text-slate-500">1-Click Full Swarm Execution</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {FEATURED_INVESTIGATIONS.map((card, i) => (
            <div
              key={i}
              onClick={() => handleCardClick(card.query, card.mode)}
              className="group p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:bg-slate-900/80 hover:border-emerald-500/50 cursor-pointer transition-all duration-200 relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold ${card.badgeColor}`}>
                  {card.badge}
                </span>
                <span className="text-xs font-mono text-slate-500 group-hover:text-emerald-400 transition-colors">
                  Run Investigation →
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white font-mono group-hover:text-emerald-300 transition-colors mb-1">
                {card.title}
              </h4>
              <p className="text-xs text-slate-400 font-sans line-clamp-2">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
