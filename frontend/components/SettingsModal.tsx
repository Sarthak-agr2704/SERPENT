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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-emerald-900/60 bg-[#0c0e14] p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-mono">SERPENT Intelligence Settings</h2>
            <p className="text-xs text-slate-400 font-mono">Configure perception layer & model keys</p>
          </div>
        </div>

        {/* Status Callout */}
        <div className="mb-6 p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 text-xs font-mono space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">SerpApi Connection:</span>
            {status?.has_serpapi_key ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> ACTIVE ({status.serpapi_masked})
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Demo Cache Active
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">
            SERPENT automatically uses high-fidelity pre-indexed real-world intelligence for demo scenarios when no key is set.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium">SerpApi Key (Optional / Live)</label>
              <a
                href="https://serpapi.com/manage-api-key"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono text-emerald-400 hover:underline flex items-center gap-1"
              >
                Get Free Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder="Paste SERPAPI_KEY (e.g. 58f...)"
              value={serpApiKey}
              onChange={(e) => setSerpApiKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-sm text-white font-mono placeholder:text-slate-600 outline-none transition"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium">Gemini API Key (Optional)</label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono text-emerald-400 hover:underline flex items-center gap-1"
              >
                Get Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder="Paste GEMINI_API_KEY (optional)"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-sm text-white font-mono placeholder:text-slate-600 outline-none transition"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              Settings successfully saved to SERPENT runtime.
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-xs font-mono text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-semibold text-xs font-mono transition shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Apply Keys"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
