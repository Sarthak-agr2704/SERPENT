import { Investigation, InvestigationRequest, WhatIfScenario } from "@/types/investigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
}

export async function getSettings() {
  const res = await fetch(`${API_BASE}/settings`);
  if (!res.ok) throw new Error("Settings fetch failed");
  return res.json();
}

export async function updateSettings(settings: { serpapi_key?: string; gemini_key?: string }) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Settings update failed");
  return res.json();
}

export async function startInvestigation(req: InvestigationRequest): Promise<Investigation> {
  const res = await fetch(`${API_BASE}/investigations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Investigation execution failed");
  }
  return res.json();
}

export async function getInvestigation(id: string): Promise<Investigation> {
  const res = await fetch(`${API_BASE}/investigations/${id}`);
  if (!res.ok) throw new Error("Investigation fetch failed");
  return res.json();
}

export async function getInvestigationGraph(id: string) {
  const res = await fetch(`${API_BASE}/investigations/${id}/graph`);
  if (!res.ok) throw new Error("Investigation graph fetch failed");
  return res.json();
}

export async function runWhatIfScenario(id: string, prompt: string): Promise<WhatIfScenario> {
  const res = await fetch(`${API_BASE}/investigations/${id}/scenario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error("Scenario execution failed");
  return res.json();
}

export async function goDeeper(id: string, entity: string) {
  const res = await fetch(`${API_BASE}/investigations/${id}/deeper`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entity }),
  });
  if (!res.ok) throw new Error("Drilldown execution failed");
  return res.json();
}
