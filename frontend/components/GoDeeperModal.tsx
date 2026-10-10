"use client";

import React, { useState, useEffect } from "react";
import { X, Search, Sparkles, ArrowRight, ShieldCheck, Compass, HelpCircle } from "lucide-react";
import { goDeeper } from "@/lib/api";

interface GoDeeperModalProps {
  isOpen: boolean;
  onClose: () => void;
  investigationId: string;
  entityName: string;
  onLaunchNewQuery?: (query: string) => void;
}

export default function GoDeeperModal({
  isOpen,
  onClose,
  investigationId,
  entityName,
  onLaunchNewQuery,
}: GoDeeperModalProps) {
  const [drilldownData, setDrilldownData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && entityName && investigationId) {
      setLoading(true);
      goDeeper(investigationId, entityName)
        .then((data) => setDrilldownData(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, entityName, investigationId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl border border-emerald-900/60 bg-[#0c0e14] p-6 shadow-2xl relative font-mono space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-semibold block">
              DIGITAL DETECTIVE • SECOND-ORDER DRILLDOWN
            </span>
            <h2 className="text-base font-bold text-white font-mono">
              Investigating "{entityName}"
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400 space-y-2">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>Tracing second-order relationships, patents, and supply chains...</p>
          </div>
        ) : drilldownData ? (
          <div className="space-y-4 text-xs">
            {/* Causal Analysis */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-emerald-400 font-semibold uppercase text-[11px] block">
                Evidence vs Inference Analysis:
              </span>
              <p className="text-slate-300 font-sans leading-relaxed">
                {drilldownData.causality_analysis}
              </p>
            </div>

            {/* Secondary Questions Uncovered */}
            <div className="space-y-2">
              <span className="text-slate-400 font-semibold block uppercase text-[11px]">
                Key Second-Order Trail Questions:
              </span>
              <div className="space-y-1.5">
                {drilldownData.secondary_questions?.map((q: string, i: number) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 flex items-start gap-2"
                  >
                    <span className="text-emerald-400 font-bold shrink-0">{i + 1}.</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Target Queries */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-slate-400 font-semibold block uppercase text-[11px]">
                Deploy Follow-Up Investigation:
              </span>
              <div className="space-y-1.5">
                {drilldownData.recommended_queries?.map((queryStr: string, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onLaunchNewQuery?.(queryStr);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-lg border border-emerald-900/50 hover:border-emerald-500/60 bg-emerald-950/20 hover:bg-emerald-900/40 text-emerald-300 text-xs transition flex items-center justify-between group"
                  >
                    <span>"{queryStr}"</span>
                    <span className="text-emerald-400 text-[11px] group-hover:translate-x-1 transition-transform">
                      Investigate →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-xs font-mono text-slate-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
