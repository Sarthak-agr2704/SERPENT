"use client";

import React, { useState, useEffect } from "react";
import { X, Key, ShieldCheck, AlertCircle, ExternalLink, Check } from "lucide-react";
import { getSettings, updateSettings } from "@/lib/api";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function SettingsModal({ isOpen, onClose, onSaved }: SettingsModalProps) {
  const [serpApiKey, setSerpApiKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [status, setStatus] = useState<{ has_serpapi_key: boolean; serpapi_masked?: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      getSettings()
        .then((data) => setStatus(data))
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateSettings({
        serpapi_key: serpApiKey.trim() || undefined,
        gemini_key: geminiKey.trim() || undefined,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSaved();
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Failed to update configuration");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-sm border border-[rgba(198,169,107,0.35)] bg-[#0b0c09] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#ddd3bb] hover:text-[var(--gold)] text-2xl font-light leading-none p-1 transition"
          aria-label="Close settings"
        >
          ×
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-sm bg-[rgba(198,169,107,0.12)] border border-[rgba(198,169,107,0.3)] text-[var(--gold)]">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-[0.2em] text-[var(--gold)] block">
              SYSTEM CONFIGURATION
            </span>
            <h2 className="text-2xl font-serif font-medium text-[#f0e4c4]">
              API Key Credentials
            </h2>
          </div>
        </div>

        {/* Status Callout */}
        <div className="mb-6 p-4 rounded-sm border border-[rgba(210,191,143,0.18)] bg-[rgba(5,6,5,0.7)] text-xs font-mono space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#a6a193]">SerpApi Connection:</span>
            {status?.has_serpapi_key ? (
              <span className="text-[var(--green-light)] flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> ACTIVE ({status.serpapi_masked})
              </span>
            ) : (
              <span className="text-[var(--gold)] flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Demo Cache Active
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#898678] leading-relaxed">
            SERPENTES operates on high-fidelity, verified pre-indexed intelligence when no live key is configured.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[10px] font-mono text-[#c6c0ad] tracking-wider uppercase">
                SerpApi Key (Live Multi-Engine Search)
              </label>
              <a
                href="https://serpapi.com/manage-api-key"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono text-[var(--gold)] hover:underline flex items-center gap-1"
              >
                Get Free Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder="Paste SERPAPI_KEY"
              value={serpApiKey}
              onChange={(e) => setSerpApiKey(e.target.value)}
              className="w-full px-3.5 py-3 rounded-none bg-[rgba(5,6,5,0.8)] border-b border-[rgba(210,191,143,0.25)] focus:border-[var(--gold)] text-sm text-[#eee9da] font-mono placeholder:text-[#706f63] outline-none transition"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[10px] font-mono text-[#c6c0ad] tracking-wider uppercase">
                Gemini API Key (Optional LLM Synthesis)
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono text-[var(--gold)] hover:underline flex items-center gap-1"
              >
                Get Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder="Paste GEMINI_API_KEY (optional)"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full px-3.5 py-3 rounded-none bg-[rgba(5,6,5,0.8)] border-b border-[rgba(210,191,143,0.25)] focus:border-[var(--gold)] text-sm text-[#eee9da] font-mono placeholder:text-[#706f63] outline-none transition"
            />
          </div>

          {error && (
            <div className="p-3 rounded-sm bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-sm bg-[rgba(79,139,72,0.2)] border border-[var(--green-light)] text-[var(--green-light)] text-xs font-mono flex items-center gap-2">
              <Check className="w-4 h-4" />
              Settings successfully applied to SERPENTES runtime.
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-[rgba(210,191,143,0.12)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[rgba(210,191,143,0.2)] hover:border-[rgba(210,191,143,0.4)] text-[10px] font-mono tracking-wider text-[#a6a193] transition"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-full border border-[rgba(198,169,107,0.7)] bg-[rgba(198,169,107,0.2)] hover:bg-[rgba(198,169,107,0.35)] text-[#f0e4c4] text-[10px] font-mono tracking-widest uppercase transition disabled:opacity-50"
            >
              {saving ? "SAVING..." : "SAVE & APPLY KEYS"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
