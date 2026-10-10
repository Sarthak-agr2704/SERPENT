export type InvestigationMode =
  | "AUTO"
  | "VERIFY"
  | "INVESTIGATE"
  | "INTELLIGENCE"
  | "TRACE"
  | "MISSION"
  | "SYNTHESIZE";

export type SourceType =
  | "PRIMARY"
  | "SECONDARY"
  | "INDEPENDENT"
  | "COMPANY"
  | "GOVERNMENT"
  | "ACADEMIC"
  | "NEWS"
  | "UGC";

export type EvidenceRelationship =
  | "SUPPORTS"
  | "CONTRADICTS"
  | "PARTIALLY_SUPPORTS"
  | "NEUTRAL"
  | "IRRELEVANT";

export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW" | "UNRESOLVED";

export interface Source {
  id: string;
  title: string;
  url: string;
  snippet: string;
  engine: string;
  query: string;
  source_type: SourceType;
  domain: string;
  published_date?: string;
  recency_score: number;
  authority_score: number;
  independence_score: number;
  lineage_id?: string;
  is_demo: boolean;
}

export interface Claim {
  id: string;
  subject: string;
  object: string;
  property: string;
  value: string;
  time_period: string;
  original_source: string;
  text: string;
  status: EvidenceRelationship;
  confidence: ConfidenceLevel;
  lineage_group_id?: string;
}

export interface EvidenceItem {
  id: string;
  claim_id: string;
  source_id: string;
  relationship: EvidenceRelationship;
  quote: string;
  rationale: string;
  directness_score: number;
}

export interface Entity {
  id: string;
  name: string;
  category: string;
  attributes: Record<string, any>;
  first_seen_source_id?: string;
}

export interface EntityRelationship {
  id: string;
  source_entity_id: string;
  target_entity_id: string;
  relationship_type: string;
  evidence_source_ids: string[];
  confidence: number;
}

export interface SourceLineage {
  id: string;
  root_source_title: string;
  root_origin: string;
  derivative_source_ids: string[];
  articles_count: number;
  repeated_claim: string;
  explanation: string;
}

export interface Contradiction {
  id: string;
  claim_id: string;
  claim_text: string;
  supporting_source_ids: string[];
  contradicting_source_ids: string[];
  nature_of_conflict: string;
  resolution_status: string;
  debate_notes: string;
}

export interface TimelineEvent {
  id: string;
  period: string;
  date_str: string;
  title: string;
  description: string;
  entities_involved: string[];
  impact: string;
  evidence_source_ids: string[];
}

export interface PeriodComparison {
  period_a: string;
  period_b: string;
  what_changed: string[];
  what_remained: string[];
  new_entities: string[];
  disappeared_entities: string[];
  price_movements: string[];
  technological_shifts: string[];
  regulatory_changes: string[];
}

export interface CompetitiveRadar {
  entities: string[];
  dimensions: string[];
  scores: Record<string, Record<string, number>>;
  comparison_table: Array<Record<string, any>>;
  what_changed: string[];
}

export interface MissionConstraintEvaluation {
  name: string;
  is_hard: boolean;
  target_value: string;
  actual_value: string;
  passed: boolean;
  explanation: string;
}

export interface MissionOption {
  id: string;
  name: string;
  total_cost: number;
  currency: string;
  distance_km: number;
  capacity: number;
  rating: number;
  category: string;
  breakdown: Record<string, number>;
  constraint_evaluations: MissionConstraintEvaluation[];
  is_feasible: boolean;
  selection_score: number;
  pros: string[];
  cons: string[];
}

export interface MissionPlan {
  objective: string;
  location: string;
  people_count: number;
  budget: number;
  duration_days: number;
  options: MissionOption[];
  selected_option_id?: string;
  explanation: string;
  itinerary: Array<{
    day: string;
    morning: string;
    afternoon: string;
    evening: string;
  }>;
  budget_breakdown: Record<string, number>;
}

export interface WhatIfScenario {
  id: string;
  name: string;
  prompt: string;
  delta_description: string;
  recalculated_metrics: Record<string, any>;
  impact_summary: string;
  strategic_verdict: string;
}

export interface SerpentTrailStep {
  step_num: number;
  timestamp_rel: string;
  phase: string;
  title: string;
  description: string;
  clue: string;
  action_type: string;
  new_entities: string[];
  contradiction_found: boolean;
}

export interface ReplayEvent {
  timestamp_ms: number;
  time_label: string;
  agent: string;
  action: string;
  detail: string;
  count_summary: Record<string, number>;
}

export interface IntelligenceReport {
  question: string;
  executive_summary: string;
  verdict: string;
  confidence_level: ConfidenceLevel;
  confidence_explanation: string;
  key_findings: string[];
  supporting_evidence: Array<Record<string, any>>;
  contradicting_evidence: Array<Record<string, any>>;
  what_remains_uncertain: string[];
  recommended_next_investigation: string[];
  tldr?: string;
  verdict_category?: string;
  quick_stats?: Array<{ label: string; value: string; type?: string }>;
}

export interface IntentDetection {
  detected_mode: InvestigationMode;
  primary_intent: string;
  entities: string[];
  missing_info: string[];
  required_agents: string[];
  serp_engines: string[];
  generated_queries: string[];
}

export interface InvestigationRequest {
  query: string;
  mode?: InvestigationMode;
  budget?: number;
  serpapi_key?: string;
  gemini_key?: string;
  is_demo_force?: boolean;
}

export interface Investigation {
  id: string;
  created_at: number;
  query: string;
  mode: InvestigationMode;
  status: string;
  intent?: IntentDetection;
  search_budget: number;
  search_count: number;
  reserve_budget: number;
  active_agents: string[];
  completed_agents: string[];
  sources: Source[];
  claims: Claim[];
  evidence_items: EvidenceItem[];
  entities: Entity[];
  relationships: EntityRelationship[];
  contradictions: Contradiction[];
  lineages: SourceLineage[];
  trail: SerpentTrailStep[];
  replay: ReplayEvent[];
  competitive_radar?: CompetitiveRadar;
  timeline: TimelineEvent[];
  period_comparison?: PeriodComparison;
  mission_plan?: MissionPlan;
  scenarios: WhatIfScenario[];
  report?: IntelligenceReport;
  is_demo_mode: boolean;
  error?: string;
}
