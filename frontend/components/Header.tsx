"use client";

import React from "react";
import { Shield, Search, Key, Sparkles, Terminal, Activity } from "lucide-react";

interface HeaderProps {
  hasSerpApiKey: boolean;
  isDemoMode: boolean;
  onOpenSettings: () => void;
}

export default function Header({ hasSerpApiKey, isDemoMode, onOpenSettings }: HeaderProps) {
  return (
    <header className="border-b border-emerald-950/60 bg-[#090b10]/95 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-950/50 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="text-emerald-400 font-mono text-xl font-bold tracking-tighter">S</span>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-wider text-white font-mono">
                S.E.R.P.E.N.T.
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 font-mono border border-emerald-500/30 font-semibold tracking-wider">
                V1.0 INTELLIGENCE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <span className="text-emerald-400">"Follow the search. Find the truth."</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-500 hidden sm:inline">Every result is a clue, not an answer.</span>
            </p>
          </div>
        </div>

        {/* Right Status Actions */}
        <div className="flex items-center space-x-3">
          {/* Status Badge */}
          <div className="hidden md:flex items-center space-x-2 text-xs font-mono px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-400">Engine:</span>
            {hasSerpApiKey ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                SerpApi LIVE
              </span>
            ) : (
              <span className="text-amber-400 font-medium flex items-center gap-1" title="Using verified pre-indexed intelligence cache. Add SERPAPI_KEY in settings for live queries.">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Demo Mode Active
              </span>
            )}
          </div>

          {/* Settings / API Key Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-2 text-xs font-mono px-3.5 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/50 text-emerald-300 transition-all shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]"
          >
            <Key className="w-3.5 h-3.5 text-emerald-400" />
            <span>API Keys</span>
          </button>
        </div>
      </div>
    </header>
  );
}
