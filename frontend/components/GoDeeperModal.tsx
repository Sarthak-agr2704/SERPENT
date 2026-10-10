"use client";

import React, { useState, useEffect } from "react";
import { X, Search, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-sm border border-[rgba(198,169,107,0.35)] bg-[#0b0c09] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#ddd3bb] hover:text-[var(--gold)] text-2xl font-light leading-none p-1 transition"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 rounded-sm bg-[rgba(198,169,107,0.12)] border border-[rgba(198,169,107,0.3)] text-[var(--gold)]">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-[0.2em] text-[var(--gold)] uppercase block">
              DIGITAL DETECTIVE • SECOND-ORDER DRILLDOWN
            </span>
            <h2 className="text-2xl font-serif font-medium text-[#f0e4c4]">
              Investigating "{entityName}"
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-[#898678] space-y-3">
            <div className="w-6 h-6 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Tracing second-order relationships, patents, and supply chains...</p>
          </div>
        ) : drilldownData ? (
          <div className="space-y-4 text-xs font-mono">
            {/* Causal Analysis */}
            <div className="p-4 rounded-sm bg-[rgba(5,6,5,0.8)] border border-[rgba(210,191,143,0.18)] space-y-2">
              <span className="text-[var(--gold)] font-medium uppercase text-[10px] tracking-wider block">
                Evidence vs Inference Analysis:
              </span>
              <p className="text-[#ded7c5] font-sans text-xs leading-relaxed">
                {drilldownData.causality_analysis}
              </p>
            </div>

            {/* Secondary Questions Uncovered */}
            <div className="space-y-2">
              <span className="text-[#a6a193] font-medium block uppercase text-[10px] tracking-wider">
                Key Second-Order Trail Questions:
              </span>
              <div className="space-y-2">
                {drilldownData.secondary_questions?.map((q: string, i: number) => (
                  <div
                    key={i}
                    className="p-3 rounded-sm bg-[rgba(12,14,11,0.6)] border border-[rgba(210,191,143,0.12)] text-[#ded7c5] flex items-start gap-2.5"
                  >
                    <span className="text-[var(--gold)] font-bold shrink-0">{i + 1}.</span>
                    <span className="font-sans text-xs">{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Target Queries */}
            <div className="space-y-2 pt-2 border-t border-[rgba(210,191,143,0.12)]">
              <span className="text-[#a6a193] font-medium block uppercase text-[10px] tracking-wider">
                Deploy Follow-Up Investigation:
              </span>
              <div className="space-y-2">
                {drilldownData.recommended_queries?.map((queryStr: string, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onLaunchNewQuery?.(queryStr);
                      onClose();
                    }}
                    className="w-full text-left p-3 rounded-sm border border-[rgba(198,169,107,0.25)] hover:border-[var(--gold)] bg-[rgba(198,169,107,0.06)] hover:bg-[rgba(198,169,107,0.15)] text-[#f0e4c4] text-xs transition flex items-center justify-between group"
                  >
                    <span className="font-serif">"{queryStr}"</span>
                    <span className="text-[var(--gold)] text-[10px] font-mono tracking-wider group-hover:translate-x-1 transition-transform">
                      INVESTIGATE →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex justify-end pt-3 border-t border-[rgba(210,191,143,0.12)]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full border border-[rgba(210,191,143,0.2)] hover:border-[rgba(210,191,143,0.4)] text-[10px] font-mono tracking-wider text-[#a6a193] transition"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
