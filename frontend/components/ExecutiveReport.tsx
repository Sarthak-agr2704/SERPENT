"use client";

import React from "react";
import {
  IntelligenceReport,
  SourceLineage,
  Source,
  Claim,
  ConfidenceLevel,
} from "@/types/investigation";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  Layers,
  Compass,
  Sparkles,
  BarChart3,
  Globe2,
  Scale
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
          bg: "bg-[rgba(79,139,72,0.15)] border-[var(--green-light)] text-[var(--green-light)]",
          icon: <ShieldCheck className="w-4 h-4 text-[var(--green-light)]" />,
        };
      case "MEDIUM":
        return {
          bg: "bg-[rgba(198,169,107,0.15)] border-[var(--gold)] text-[#f0e4c4]",
          icon: <ShieldCheck className="w-4 h-4 text-[var(--gold)]" />,
        };
      case "LOW":
        return {
          bg: "bg-[rgba(180,100,50,0.15)] border-[rgba(210,191,143,0.5)] text-[#ded7c5]",
          icon: <ShieldAlert className="w-4 h-4 text-[var(--gold)]" />,
        };
      default:
        return {
          bg: "bg-[rgba(12,14,11,0.6)] border-[rgba(210,191,143,0.2)] text-[#a6a193]",
          icon: <HelpCircle className="w-4 h-4 text-[#898678]" />,
        };
    }
  };

  const confBadge = getConfidenceBadge(report.confidence_level);

  // Verdict category styling for glanceability
  const getVerdictCategoryBadge = () => {
    const cat = report.verdict_category || "VERIFIED";
    if (cat === "VERIFIED") {
      return {
        label: "FACTUALLY CONFIRMED",
        bg: "bg-[rgba(79,139,72,0.2)] border-[var(--green-light)] text-[var(--green-light)]",
      };
    }
    if (cat === "CONTESTED") {
      return {
        label: "DISPUTED / CONFLICTING",
        bg: "bg-[rgba(220,50,50,0.2)] border-red-500 text-red-300",
      };
    }
    return {
      label: "CONDITIONALLY SUPPORTED",
      bg: "bg-[rgba(198,169,107,0.2)] border-[var(--gold)] text-[#f0e4c4]",
    };
  };

  const verdictCatBadge = getVerdictCategoryBadge();

  return (
    <div className="w-full space-y-8 font-mono">
      {/* 1. HERO AT-A-GLANCE EXECUTIVE BRIEFING CARD */}
      <div className="rounded-sm border border-[rgba(210,191,143,0.35)] bg-gradient-to-br from-[#12140e] via-[#0b0c09] to-[#070806] p-7 md:p-8 shadow-2xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(ellipse_at_top_right,rgba(198,169,107,0.15),transparent_70%)] pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(210,191,143,0.15)] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--gold)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--gold)]"></span>
            </span>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[var(--gold)] font-medium">
              EXECUTIVE BRIEFING • AT A GLANCE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] px-3.5 py-1 rounded-full border font-medium tracking-wider uppercase ${verdictCatBadge.bg}`}
            >
              {verdictCatBadge.label}
            </span>
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-medium tracking-wider ${confBadge.bg}`}
            >
              {confBadge.icon}
              <span>CONFIDENCE: {report.confidence_level}</span>
            </div>
          </div>
        </div>

        {/* TL;DR Direct Core Answer */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-[#a6a193]">
            Bottom Line Verdict:
          </span>
          <h2 className="text-xl md:text-2xl font-serif text-[#f7f3e8] leading-snug tracking-wide">
            {report.tldr || report.verdict}
          </h2>
        </div>

        {/* Quick Glance Key Metrics Bar */}
        {report.quick_stats && report.quick_stats.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-[rgba(210,191,143,0.15)]">
            {report.quick_stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-sm bg-[rgba(5,6,5,0.7)] border border-[rgba(210,191,143,0.14)] space-y-1"
              >
                <div className="text-[9px] uppercase tracking-wider text-[#898678] font-mono flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[var(--gold)]" />
                  {stat.label}
                </div>
                <div className="text-xs md:text-sm font-medium text-[#f0e4c4] font-mono truncate">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Executive Assessment & Detailed Context */}
      <div className="rounded-sm border border-[rgba(210,191,143,0.22)] bg-[#0b0c09] p-7 md:p-8 shadow-xl space-y-5">
        <div>
          <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--gold)] font-medium block">
            DETAILED SYNTHESIS
          </span>
          <h3 className="text-lg md:text-xl font-serif font-medium text-[#f0e4c4] tracking-wide mt-1">
            {report.verdict}
          </h3>
        </div>

        {/* Executive Summary Paragraph */}
        <p className="text-sm md:text-base text-[#ded7c5] leading-relaxed font-sans font-normal">
          {report.executive_summary}
        </p>

        {/* Explainable Confidence Breakdown */}
        <div className="p-4 rounded-sm bg-[rgba(5,6,5,0.7)] border border-[rgba(210,191,143,0.15)] text-xs text-[#a6a193] leading-relaxed whitespace-pre-line font-mono">
          {report.confidence_explanation}
        </div>
      </div>

      {/* 3. Source Lineage Warning */}
      {lineages.length > 0 && (
        <div className="rounded-sm border border-[rgba(198,169,107,0.3)] bg-[rgba(12,14,11,0.8)] p-6 space-y-3">
          <div className="flex items-center space-x-2 text-[var(--gold)] text-xs font-medium tracking-wider">
            <Layers className="w-4 h-4" />
            <span>
              SOURCE LINEAGE CLUSTERS ({lineages.length} INDEPENDENT EVIDENCE CHAINS)
            </span>
          </div>
          <p className="text-xs text-[#898678] font-sans">
            SERPENT identifies when multiple publications echo identical wire feeds or PR distributions, preventing repeated citations from artificially inflating empirical verification scores.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {lineages.map((lin) => {
              // Sanitize root origin
              const cleanedOrigin = lin.root_origin
                .replace(/Www\./gi, "")
                .replace(/\bPti\b/g, "PTI")
                .replace(/\bAni\b/g, "ANI")
                .replace(/\bAp\b/g, "AP");

              // Determine display claim, guarding against empty quotes or lone ellipses
              const rawClaim = (lin.repeated_claim || "").trim();
              const isOnlyEllipsis = !rawClaim || /^[\.\s]+$/.test(rawClaim);
              const displayClaim = isOnlyEllipsis
                ? lin.root_source_title || "Syndicated press distribution across multiple publications."
                : rawClaim;

              return (
                <div
                  key={lin.id}
                  className="p-3.5 rounded-sm bg-[rgba(5,6,5,0.8)] border border-[rgba(210,191,143,0.15)] text-xs space-y-2 hover:border-[rgba(210,191,143,0.3)] transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--gold)] font-medium text-[11px]">
                      {cleanedOrigin}
                    </span>
                    <span className="text-[10px] text-[#706f63]">
                      {lin.articles_count} publications clustered
                    </span>
                  </div>
                  <p className="text-[#ded7c5] text-xs font-sans line-clamp-2 leading-relaxed">
                    "{displayClaim}"
                  </p>
                  <span className="text-[10px] text-[#898678] block">
                    {lin.explanation.replace(/Www\./gi, "").replace(/\bPti\b/g, "PTI").replace(/\bAni\b/g, "ANI")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Structured Key Findings Cards (Formatted for Instant Scanning) */}
      <div className="rounded-sm border border-[rgba(210,191,143,0.2)] bg-[#080907] p-7 space-y-4">
        <h3 className="text-xs font-medium text-[#f0e4c4] uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
          Key Intelligence Takeaways
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {report.key_findings.map((finding, idx) => {
            const match = finding.match(/^\[(.*?)\]\s*(.*)$/);
            const tag = match ? match[1] : null;
            const text = match ? match[2] : finding;

            return (
              <div
                key={idx}
                className="p-4 rounded-sm border border-[rgba(210,191,143,0.15)] bg-[rgba(12,14,11,0.6)] text-xs text-[#ded7c5] font-sans leading-relaxed flex items-start gap-3 hover:border-[rgba(210,191,143,0.35)] transition"
              >
                <CheckCircle2 className="w-4 h-4 text-[var(--green-light)] shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  {tag && (
                    <span className="inline-block text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-xs bg-[rgba(198,169,107,0.12)] text-[var(--gold)] border border-[rgba(198,169,107,0.25)] font-medium">
                      {tag}
                    </span>
                  )}
                  <p className="text-[#ded7c5] leading-relaxed">{text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Supporting vs Contradicting Evidence Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supporting Evidence */}
        <div className="rounded-sm border border-[rgba(163,200,121,0.25)] bg-[#080a07] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(210,191,143,0.15)] pb-3">
            <h4 className="text-xs font-medium text-[#a3c879] uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--green-light)]" /> Supporting Evidence ({report.supporting_evidence.length})
            </h4>
            <span className="text-[10px] text-[#898678]">Corroborated</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {report.supporting_evidence.map((ev, i) => (
              <div
                key={i}
                className="p-3.5 rounded-sm bg-[rgba(5,6,5,0.7)] border border-[rgba(210,191,143,0.12)] text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[var(--gold)] font-medium">{ev.domain}</span>
                  <span className="text-[#706f63]">{ev.source_type}</span>
                </div>
                <p className="text-[#ded7c5] text-xs font-sans">"{ev.quote}"</p>
                {ev.url && (
                  <a
                    href={ev.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-[#898678] hover:text-[var(--gold)] flex items-center gap-1 pt-1"
                  >
                    Inspect citation <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contradicting Evidence */}
        <div className="rounded-sm border border-[rgba(198,169,107,0.25)] bg-[#090807] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(210,191,143,0.15)] pb-3">
            <h4 className="text-xs font-medium text-[#f0e4c4] uppercase tracking-wider flex items-center gap-2">
              <XCircle className="w-4 h-4 text-[var(--gold)]" /> Contradicting / Friction Evidence ({report.contradicting_evidence.length})
            </h4>
            <span className="text-[10px] text-[#898678]">Empirical Limits</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {report.contradicting_evidence.length > 0 ? (
              report.contradicting_evidence.map((ev, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-sm bg-[rgba(5,6,5,0.7)] border border-[rgba(210,191,143,0.12)] text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#f0e4c4] font-medium">{ev.domain}</span>
                    <span className="text-[#706f63]">{ev.source_type}</span>
                  </div>
                  <p className="text-[#ded7c5] text-xs font-sans">"{ev.quote}"</p>
                  {ev.url && (
                    <a
                      href={ev.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-[#898678] hover:text-[var(--gold)] flex items-center gap-1 pt-1"
                    >
                      Inspect citation <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 rounded-sm bg-[rgba(5,6,5,0.4)] border border-[rgba(210,191,143,0.1)] text-xs text-[#706f63]">
                No direct contradictory evidence discovered in indexed sources.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. What Remains Uncertain & Recommended Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-sm border border-[rgba(210,191,143,0.2)] bg-[#080907] p-6 space-y-3">
          <h4 className="text-xs font-medium text-[#f0e4c4] uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[var(--gold)]" /> What Remains Uncertain (Scientific Humility)
          </h4>
          <ul className="space-y-2.5 text-xs text-[#a6a193] font-sans">
            {report.what_remains_uncertain.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-[var(--gold)] font-mono">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-sm border border-[rgba(210,191,143,0.2)] bg-[#080907] p-6 space-y-3">
          <h4 className="text-xs font-medium text-[#a3c879] uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-[var(--green-light)]" /> Recommended Follow-Up Investigations
          </h4>
          <ul className="space-y-2.5 text-xs text-[#a6a193] font-sans">
            {report.recommended_next_investigation.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-[var(--green-light)] font-mono">→</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 7. Sources Reference List */}
      <div className="rounded-sm border border-[rgba(210,191,143,0.2)] bg-[#080907] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[rgba(210,191,143,0.15)] pb-3">
          <h4 className="text-xs font-medium text-[#f0e4c4] uppercase tracking-wider">
            Verified Citations & Sources Indexed ({sources.length})
          </h4>
          <span className="text-[10px] text-[#706f63]">Empirical Lineage</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1">
          {sources.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-sm border border-[rgba(210,191,143,0.15)] hover:border-[var(--gold)] bg-[rgba(12,14,11,0.6)] hover:bg-[rgba(12,14,11,0.9)] transition flex flex-col justify-between"
            >
              <div className="text-[11px] font-medium text-[#eee9da] truncate">{s.title}</div>
              <div className="flex items-center justify-between text-[10px] text-[#706f63] mt-2">
                <span>{s.domain || s.engine}</span>
                <span className="text-[var(--gold)] flex items-center gap-1">
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
