"use client";

import React, { useState } from "react";
import {
  Search,
  Sparkles,
  Sliders,
  ShieldCheck,
  Radar,
  Clock,
  Compass,
} from "lucide-react";
import { InvestigationMode } from "@/types/investigation";

interface InvestigationLauncherProps {
  onLaunch: (query: string, mode: InvestigationMode, budget: number) => void;
  isLoading: boolean;
}

const MODES: Array<{
  id: InvestigationMode;
  label: string;
  icon: any;
  desc: string;
}> = [
  {
    id: "AUTO",
    label: "Auto Detect",
    icon: Sparkles,
    desc: "Swarm autonomously identifies intent & routes agents",
  },
  {
    id: "INTELLIGENCE",
    label: "War Room",
    icon: Radar,
    desc: "Competitive analysis & market radar",
  },
  {
    id: "VERIFY",
    label: "Truth Engine",
    icon: ShieldCheck,
    desc: "Empirical claim & fact verification",
  },
  {
    id: "TRACE",
    label: "Time Machine",
    icon: Clock,
    desc: "Timeline reconstruction & period compare",
  },
  {
    id: "MISSION",
    label: "Mission Control",
    icon: Compass,
    desc: "Real-world constraint & travel planning",
  },
];

const FEATURED_INVESTIGATIONS = [
  {
    title: "BYD vs Indian EV Automakers",
    query: "Is BYD becoming a serious threat to Indian EV manufacturers?",
    mode: "INTELLIGENCE" as InvestigationMode,
    badge: "War Room",
    badgeColor: "border-[rgba(198,169,107,0.4)] text-[#e0d2ad] bg-[rgba(198,169,107,0.08)]",
    desc: "Market share, 70-100% CBU tariffs, Blade Battery 2.0, Tata & Mahindra defense.",
    category: "MARKET RADAR",
  },
  {
    title: "1,000 km Battery Range Claim",
    query: "Is the claim that this new battery doubles EV range true?",
    mode: "VERIFY" as InvestigationMode,
    badge: "Truth Engine",
    badgeColor: "border-[rgba(163,200,121,0.4)] text-[#a3c879] bg-[rgba(163,200,121,0.08)]",
    desc: "PR claims vs real-world highway dyno tests vs Nature Energy scientific degradation.",
    category: "EMPIRICAL VERIFICATION",
  },
  {
    title: "Robotics Trip to Bengaluru Under ₹30,000",
    query: "Plan a 3-day robotics competition trip to Bengaluru for 4 students under ₹30,000",
    mode: "MISSION" as InvestigationMode,
    badge: "Mission Control",
    badgeColor: "border-[rgba(210,191,143,0.4)] text-[#d1c8b1] bg-[rgba(210,191,143,0.08)]",
    desc: "IISc venue constraints, train tickets, quad dorm lodging, and what-if budget drops.",
    category: "CONSTRAINT SOLVER",
  },
  {
    title: "Market Competitive Evolution 2023-2026",
    query: "How did this company's competitive position change from 2023 to 2026?",
    mode: "TRACE" as InvestigationMode,
    badge: "Time Machine",
    badgeColor: "border-[rgba(198,169,107,0.4)] text-[#c6a96b] bg-[rgba(198,169,107,0.08)]",
    desc: "Chronological milestones, ICE to born-EV skateboards, and 2024 vs 2026 diff.",
    category: "CHRONOLOGY",
  },
];

export default function InvestigationLauncher({
  onLaunch,
  isLoading,
}: InvestigationLauncherProps) {
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
    <div className="w-full max-w-5xl mx-auto space-y-3 sm:space-y-3.5">
      {/* Search Command Box */}
      <div className="rounded-sm border border-[rgba(210,191,143,0.25)] bg-[rgba(12,14,11,0.92)] p-3.5 sm:p-4 backdrop-blur-md shadow-[0_15px_40px_rgba(0,0,0,0.8)] relative">
        <div className="absolute top-0 left-6 -translate-y-1/2 px-2.5 py-0.5 bg-[#050605] border border-[rgba(210,191,143,0.3)] text-[8px] sm:text-[9px] font-mono tracking-[0.25em] text-[var(--gold)]">
          COMMAND QUERY
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-[var(--gold)]">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 opacity-80" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter an investigation query, claim, market rivalry, or mission..."
              disabled={isLoading}
              className="w-full pl-10 sm:pl-12 pr-32 sm:pr-36 py-3 sm:py-3.5 rounded-none bg-[rgba(5,6,5,0.7)] border-b border-[rgba(210,191,143,0.35)] focus:border-[var(--gold)] text-sm sm:text-base text-[#eee9da] font-serif placeholder:text-[#706f63] placeholder:font-sans outline-none transition"
            />
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="absolute right-2 px-4 sm:px-6 py-2 rounded-full border border-[rgba(198,169,107,0.7)] bg-[rgba(198,169,107,0.15)] hover:bg-[rgba(198,169,107,0.3)] text-[#f0e4c4] font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.18em] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 shadow-[0_0_15px_rgba(198,169,107,0.1)]"
            >
              {isLoading ? (
                <>
                  <span className="w-3 h-3 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
                  <span>DEPLOYING...</span>
                </>
              ) : (
                <>
                  <span>INVESTIGATE</span>
                  <span className="text-[var(--gold)]">→</span>
                </>
              )}
            </button>
          </div>

          {/* Mode Selector & Budget Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[rgba(210,191,143,0.12)]">
            {/* Mode Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[9px] font-mono text-[#898678] tracking-widest mr-1">
                MODE:
              </span>
              {MODES.map((mode) => {
                const Icon = mode.icon;
                const isSelected = selectedMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSelectedMode(mode.id)}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-mono tracking-wider transition ${
                      isSelected
                        ? "bg-[rgba(198,169,107,0.2)] border border-[var(--gold)] text-[#f0e4c4] shadow-[0_0_10px_rgba(198,169,107,0.2)] font-medium"
                        : "bg-[rgba(12,14,11,0.6)] border border-[rgba(210,191,143,0.15)] text-[#a6a193] hover:text-[#eee9da] hover:border-[rgba(210,191,143,0.35)]"
                    }`}
                    title={mode.desc}
                  >
                    <Icon className="w-3 h-3 text-[var(--gold)]" />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Budget */}
            <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-mono text-[#a6a193]">
              <Sliders className="w-3 h-3 text-[var(--gold)]" />
              <span>BUDGET:</span>
              <span className="text-[#f0e4c4] font-medium">{budget} QUERIES</span>
              <input
                type="range"
                min={10}
                max={30}
                step={5}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-16 sm:w-20 accent-[var(--gold)] cursor-pointer"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Featured Quick-Launch Investigations */}
      <div className="space-y-2.5 sm:space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-mono tracking-[0.2em] text-[#c6c0ad] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
            <span>FEATURED FIELD INVESTIGATIONS</span>
          </div>
          <span className="text-[8px] sm:text-[9px] font-mono tracking-wider text-[#898678]">
            1-CLICK MULTI-AGENT SWARM
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
          {FEATURED_INVESTIGATIONS.map((card, i) => (
            <div
              key={i}
              onClick={() => handleCardClick(card.query, card.mode)}
              className="group p-2.5 sm:p-3 rounded-sm border border-[rgba(210,191,143,0.2)] bg-[rgba(8,9,7,0.88)] backdrop-blur-sm hover:border-[rgba(198,169,107,0.6)] hover:bg-[rgba(12,14,11,0.95)] cursor-pointer transition-all duration-200 relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-1">
                <span
                  className={`text-[8px] sm:text-[9px] font-mono tracking-wider px-2 py-0.5 rounded-sm border ${card.badgeColor}`}
                >
                  {card.badge}
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-[#898678] group-hover:text-[var(--gold)] transition-colors flex items-center gap-1">
                  DISPATCH <span className="text-xs">↗</span>
                </span>
              </div>
              <h4 className="font-serif text-sm sm:text-base font-medium text-[#f0e4c4] group-hover:text-white transition-colors mb-0.5">
                {card.title}
              </h4>
              <p className="text-[11px] text-[#9d9a8d] line-clamp-1 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
