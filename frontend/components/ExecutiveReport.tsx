"use client";

import React from "react";
import {
  IntelligenceReport,
  SourceLineage,
  Source,
  Claim,
  ConfidenceLevel
} from "@/types/investigation";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  Layers,
  ArrowRight,
  Sparkles,
  Compass
} from "lucide-react";

interface ExecutiveReportProps {
  report: IntelligenceReport;
  lineages: SourceLineage[];
  sources: Source[];
  claims: Claim[];
  onDrilldownEntity?: (entity: string) => void;
}

export default function ExecutiveReport({
  report,
  lineages,
  sources,
  claims,
  onDrilldownEntity,
}: ExecutiveReportProps) {
  const getConfidenceBadge = (level: ConfidenceLevel) => {
    switch (level) {
      case "HIGH":
        return {
          bg: "bg-emerald-950/80 border-emerald-500/60 text-emerald-300",
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
        };
      case "MEDIUM":
        return {
          bg: "bg-cyan-950/80 border-cyan-500/60 text-cyan-300",
          icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
        };
      case "LOW":
        return {
          bg: "bg-amber-950/80 border-amber-500/60 text-amber-300",
          icon: <ShieldAlert className="w-4 h-4 text-amber-400" />,
        };
      default:
        return {
          bg: "bg-slate-900 border-slate-700 text-slate-300",
          icon: <HelpCircle className="w-4 h-4 text-slate-400" />,
        };
    }
  };

  const confBadge = getConfidenceBadge(report.confidence_level);

  return (
    <div className="w-full space-y-6 font-mono">
      {/* 1. Verdict & Executive Summary Banner */}
      <div className="rounded-2xl border border-emerald-950/80 bg-gradient-to-b from-[#0c1018] to-[#080b10] p-6 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold block">
              FINAL INVESTIGATIVE ASSESSMENT
            </span>
            <h2 className="text-lg md:text-xl font-black text-white tracking-wide mt-1">
              {report.verdict}
            </h2>
          </div>

          {/* Evidence Confidence Meter */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold ${confBadge.bg}`}>
              {confBadge.icon}
              <span>CONFIDENCE: {report.confidence_level}</span>
            </div>
          </div>
        </div>

        {/* Executive Summary Paragraph */}
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans font-normal">
          {report.executive_summary}
        </p>

        {/* Explainable Confidence Breakdown */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs text-slate-400 leading-relaxed whitespace-pre-line">
          {report.confidence_explanation}
        </div>
      </div>

      {/* 2. Source Lineage Warning (Syndicated PR & Wire Clustering) */}
      {lineages.length > 0 && (
        <div className="rounded-2xl border border-cyan-950/80 bg-cyan-950/20 p-5 space-y-3">
          <div className="flex items-center space-x-2 text-cyan-300 text-xs font-bold">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>SOURCE LINEAGE IDENTIFIED ({lineages.length} INDEPENDENT EVIDENCE CHAINS)</span>
          </div>
          <p className="text-xs text-slate-400">
            SERPENT detects when multiple media outlets echo the same corporate press release or wire feed,
            preventing repeated citations from falsely inflating independent verification scores:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {lineages.map((lin) => (
              <div key={lin.id} className="p-3 rounded-xl bg-slate-950/90 border border-cyan-900/40 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-cyan-400 font-semibold text-[11px]">{lin.root_origin}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{lin.articles_count} publications clustered</span>
                </div>
                <p className="text-slate-300 text-[11px] mb-1 font-sans line-clamp-2">"{lin.repeated_claim}"</p>
                <span className="text-[10px] text-slate-500 block">{lin.explanation}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Key Findings Cards */}
      <div className="rounded-2xl border border-slate-800/80 bg-[#0a0d14] p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Key Intelligence Findings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {report.key_findings.map((finding, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 text-xs text-slate-300 font-sans leading-relaxed flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{finding}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Supporting vs Contradicting Evidence Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Supporting Evidence */}
        <div className="rounded-2xl border border-emerald-950/80 bg-[#090d14] p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-950 pb-2.5">
            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Supporting Evidence ({report.supporting_evidence.length})
            </h4>
            <span className="text-[10px] text-emerald-400/80">Corroborated</span>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {report.supporting_evidence.map((ev, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-emerald-900/30 text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-semibold">{ev.domain}</span>
                  <span className="text-slate-500">{ev.source_type}</span>
                </div>
                <p className="text-slate-300 text-xs font-sans">"{ev.quote}"</p>
                {ev.url && (
                  <a
                    href={ev.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-slate-500 hover:text-emerald-400 flex items-center gap-1 pt-1"
                  >
                    Inspect citation <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contradicting / Tension Evidence */}
        <div className="rounded-2xl border border-red-950/80 bg-[#0f0a0d] p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-red-950 pb-2.5">
            <h4 className="text-xs font-bold text-red-300 uppercase tracking-wider flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" /> Contradicting / Friction Evidence ({report.contradicting_evidence.length})
            </h4>
            <span className="text-[10px] text-red-400/80">Empirical & Regulatory Limits</span>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {report.contradicting_evidence.length > 0 ? (
              report.contradicting_evidence.map((ev, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-red-900/30 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-red-400 font-semibold">{ev.domain}</span>
                    <span className="text-slate-500">{ev.source_type}</span>
                  </div>
                  <p className="text-slate-300 text-xs font-sans">"{ev.quote}"</p>
                  {ev.url && (
                    <a
                      href={ev.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-slate-500 hover:text-red-400 flex items-center gap-1 pt-1"
                    >
                      Inspect citation <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-900 text-xs text-slate-500">
                No direct contradictory evidence discovered in indexed sources.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. What Remains Uncertain & Recommended Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* What Remains Uncertain */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" /> What Remains Uncertain (Scientific Humility)
          </h4>
          <ul className="space-y-2 text-xs text-slate-400 font-sans">
            {report.what_remains_uncertain.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-mono mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Next Investigation */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
          <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" /> Recommended Follow-Up Investigations
          </h4>
          <ul className="space-y-2 text-xs text-slate-400 font-sans">
            {report.recommended_next_investigation.map((step, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono mt-0.5">→</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 6. Sources Reference List */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Verified Citations & Sources Indexed ({sources.length})
          </h4>
          <span className="text-[11px] text-slate-500">Zero Fabrications Policy</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
          {sources.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-lg border border-slate-800 hover:border-emerald-500/40 bg-slate-900/40 hover:bg-slate-900/80 transition flex flex-col justify-between"
            >
              <div className="text-[11px] font-semibold text-slate-200 truncate">{s.title}</div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                <span>{s.domain || s.engine}</span>
                <span className="text-emerald-400/80 flex items-center gap-1">
                  {s.engine} <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
