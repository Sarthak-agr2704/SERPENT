"use client";

import React from "react";
import { Activity, Key, Search, ArrowLeft } from "lucide-react";

interface HeaderProps {
  hasSerpApiKey: boolean;
  isDemoMode: boolean;
  onOpenSettings: () => void;
  isInvestigationActive?: boolean;
  onNewSearch?: () => void;
}

export default function Header({
  hasSerpApiKey,
  isDemoMode,
  onOpenSettings,
  isInvestigationActive,
  onNewSearch,
}: HeaderProps) {
  return (
    <header className="w-full border-b border-[rgba(210,191,143,0.18)] bg-[rgba(5,6,5,0.95)] backdrop-blur-md sticky top-0 z-40 px-6 sm:px-10 py-2.5 sm:py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Wordmark */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-sm bg-[rgba(198,169,107,0.1)] border border-[rgba(198,169,107,0.35)] shadow-[0_0_15px_rgba(198,169,107,0.15)]">
            <span className="text-[var(--gold)] font-mono text-base font-bold tracking-tighter">
              S
            </span>
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--green-light)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--green)]" />
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-serif font-medium tracking-[0.2em] text-[#f0e4c4]">
                S.E.R.P.E.N.T.
              </h1>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-[rgba(198,169,107,0.12)] text-[#f0e4c4] font-mono border border-[rgba(198,169,107,0.3)] tracking-wider">
                V1.0
              </span>
            </div>
            <p className="text-[11px] text-[#898678] font-mono hidden sm:flex items-center gap-1.5">
              <span className="text-[var(--gold)]">
                "Follow the search. Find the truth."
              </span>
              <span className="text-[#444]">•</span>
              <span className="text-[#706f63]">Every result is a clue, not an answer.</span>
            </p>
          </div>
        </div>

        {/* Right Status Actions */}
        <div className="flex items-center space-x-3">
          {/* New Search Button (When Investigation is active) */}
          {isInvestigationActive && (
            <button
              onClick={onNewSearch}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(210,191,143,0.25)] bg-[rgba(12,14,11,0.8)] hover:bg-[rgba(198,169,107,0.15)] text-[#ded7c5] text-[10px] font-mono tracking-wider transition"
            >
              <ArrowLeft className="w-3 h-3 text-[var(--gold)]" />
              <span>NEW SEARCH</span>
            </button>
          )}

          {/* Engine Status Badge */}
          <div
            className="flex items-center space-x-2 text-[10px] font-mono px-3 py-1.5 rounded-full border border-[rgba(210,191,143,0.18)] bg-[rgba(12,14,11,0.7)]"
            title={
              hasSerpApiKey
                ? "SerpApi connection active"
                : "Demo Mode active. Configure SERPAPI_KEY in API Keys settings."
            }
          >
            <Activity
              className={`w-3 h-3 ${
                hasSerpApiKey
                  ? "text-[var(--green-light)] animate-pulse"
                  : "text-[var(--gold)]"
              }`}
            />
            <span className="text-[#898678]">ENGINE:</span>
            {hasSerpApiKey ? (
              <span className="text-[var(--green-light)] font-medium">LIVE</span>
            ) : (
              <span className="text-[var(--gold)] font-medium">DEMO</span>
            )}
          </div>

          {/* Settings / API Key Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-1.5 text-[10px] font-mono px-3.5 py-1.5 rounded-full border border-[rgba(198,169,107,0.4)] bg-[rgba(198,169,107,0.1)] hover:bg-[rgba(198,169,107,0.22)] text-[#f0e4c4] transition"
          >
            <Key className="w-3 h-3 text-[var(--gold)]" />
            <span>API KEYS</span>
          </button>
        </div>
      </div>
    </header>
  );
}
