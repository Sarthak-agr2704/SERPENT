from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from enum import Enum
import uuid
import time

class InvestigationMode(str, Enum):
    AUTO = "AUTO"
    VERIFY = "VERIFY"             # Truth Engine / Fact Verification
    INVESTIGATE = "INVESTIGATE"   # Digital Detective / Swarm Deep Dive
    INTELLIGENCE = "INTELLIGENCE" # War Room / Competitive Analysis
    TRACE = "TRACE"               # Internet Time Machine / Timeline
    MISSION = "MISSION"           # Mission Control / Real-World Planning
    SYNTHESIZE = "SYNTHESIZE"     # Cross-Source Intelligence Report

class SourceType(str, Enum):
    PRIMARY = "PRIMARY"
    SECONDARY = "SECONDARY"
    INDEPENDENT = "INDEPENDENT"
    COMPANY = "COMPANY"
    GOVERNMENT = "GOVERNMENT"
    ACADEMIC = "ACADEMIC"
    NEWS = "NEWS"
    UGC = "UGC"

class EvidenceRelationship(str, Enum):
    SUPPORTS = "SUPPORTS"
    CONTRADICTS = "CONTRADICTS"
    PARTIALLY_SUPPORTS = "PARTIALLY_SUPPORTS"
    NEUTRAL = "NEUTRAL"
    IRRELEVANT = "IRRELEVANT"

class ConfidenceLevel(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    UNRESOLVED = "UNRESOLVED"

class EntityCategory(str, Enum):
    PERSON = "PERSON"
    COMPANY = "COMPANY"
    PRODUCT = "PRODUCT"
    ORGANIZATION = "ORGANIZATION"
    LOCATION = "LOCATION"
    EVENT = "EVENT"
    RESEARCH_PAPER = "RESEARCH_PAPER"
    POLICY = "POLICY"
    TECHNOLOGY = "TECHNOLOGY"

class AgentName(str, Enum):
    INTENT_ANALYZER = "Intent Analyzer"
    DISCOVERY = "Discovery Agent"
    WEB_RESEARCH = "Web Research Agent"
    NEWS = "News Agent"
    RESEARCH_SCHOLAR = "Research/Scholar Agent"
    COMMERCE_PRODUCT = "Commerce/Product Agent"
    MARKET_INTELLIGENCE = "Market Intelligence Agent"
    LOCAL_MAPS = "Local/Maps Agent"
    MEDIA_VIDEO = "Media/Video Agent"
    DETECTIVE = "Detective Agent"
    VERIFICATION = "Verification Agent"
    TIMELINE = "Timeline Agent"
    MISSION_PLANNER = "Mission Planning Agent"
    SYNTHESIS = "Synthesis Agent"

class Source(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    title: str
    url: str
    snippet: str
    engine: str = "google"
    query: str
    source_type: SourceType = SourceType.SECONDARY
    domain: str = ""
    published_date: Optional[str] = None
    recency_score: float = 0.8
    authority_score: float = 0.8
    independence_score: float = 0.8
    lineage_id: Optional[str] = None
    is_demo: bool = False

class Claim(BaseModel):
    id: str = Field(default_factory=lambda: f"claim-{str(uuid.uuid4())[:6]}")
    subject: str
    object: str
    property: str
    value: str
    time_period: str = "Current"
    original_source: str = "Discovered in search"
    text: str
    status: EvidenceRelationship = EvidenceRelationship.NEUTRAL
    confidence: ConfidenceLevel = ConfidenceLevel.MEDIUM
    lineage_group_id: Optional[str] = None

class EvidenceItem(BaseModel):
    id: str = Field(default_factory=lambda: f"ev-{str(uuid.uuid4())[:6]}")
    claim_id: str
    source_id: str
    relationship: EvidenceRelationship
    quote: str
    rationale: str
    directness_score: float = 0.8

class Entity(BaseModel):
    id: str = Field(default_factory=lambda: f"ent-{str(uuid.uuid4())[:6]}")
    name: str
    category: EntityCategory
    attributes: Dict[str, Any] = Field(default_factory=dict)
    first_seen_source_id: Optional[str] = None

class EntityRelationship(BaseModel):
    id: str = Field(default_factory=lambda: f"rel-{str(uuid.uuid4())[:6]}")
    source_entity_id: str
    target_entity_id: str
    relationship_type: str  # FOUNDED, OWNS, PARTNERS_WITH, COMPETES_WITH, LOCATED_IN, LAUNCHED, MENTIONED_IN, RESEARCHED_BY, RELATED_TO
    evidence_source_ids: List[str] = Field(default_factory=list)
    confidence: float = 0.85

class SourceLineage(BaseModel):
    id: str = Field(default_factory=lambda: f"lineage-{str(uuid.uuid4())[:6]}")
    root_source_title: str
    root_origin: str        # e.g., "Company Press Release" or "Reuters Wire"
    derivative_source_ids: List[str] = Field(default_factory=list)
    articles_count: int = 1
    repeated_claim: str
    explanation: str

class Contradiction(BaseModel):
    id: str = Field(default_factory=lambda: f"contra-{str(uuid.uuid4())[:6]}")
    claim_id: str
    claim_text: str
    supporting_source_ids: List[str] = Field(default_factory=list)
    contradicting_source_ids: List[str] = Field(default_factory=list)
    nature_of_conflict: str
    resolution_status: str = "UNRESOLVED"  # RESOLVED, PARTIAL, UNRESOLVED
    debate_notes: str

class TimelineEvent(BaseModel):
    id: str = Field(default_factory=lambda: f"time-{str(uuid.uuid4())[:6]}")
    period: str  # e.g., "2023", "2024 Q2"
    date_str: str
    title: str
    description: str
    entities_involved: List[str] = Field(default_factory=list)
    impact: str
    evidence_source_ids: List[str] = Field(default_factory=list)

class PeriodComparison(BaseModel):
    period_a: str
    period_b: str
    what_changed: List[str] = Field(default_factory=list)
    what_remained: List[str] = Field(default_factory=list)
    new_entities: List[str] = Field(default_factory=list)
    disappeared_entities: List[str] = Field(default_factory=list)
    price_movements: List[str] = Field(default_factory=list)
    technological_shifts: List[str] = Field(default_factory=list)
    regulatory_changes: List[str] = Field(default_factory=list)

class CompetitiveRadar(BaseModel):
    entities: List[str] = Field(default_factory=list)
    dimensions: List[str] = Field(default_factory=lambda: [
        "Product Breadth",
        "Price Competitiveness",
        "Market Momentum",
        "Geographic Expansion",
        "Technology Edge",
        "Customer Signals"
    ])
    scores: Dict[str, Dict[str, float]] = Field(default_factory=dict)
    comparison_table: List[Dict[str, Any]] = Field(default_factory=list)
    what_changed: List[str] = Field(default_factory=list)

class MissionConstraintEvaluation(BaseModel):
    name: str
    is_hard: bool
    target_value: str
    actual_value: str
    passed: bool
    explanation: str

class MissionOption(BaseModel):
    id: str
    name: str
    total_cost: float
    currency: str = "INR"
    distance_km: float
    capacity: int
    rating: float
    category: str
    breakdown: Dict[str, float] = Field(default_factory=dict)
    constraint_evaluations: List[MissionConstraintEvaluation] = Field(default_factory=list)
    is_feasible: bool = True
    selection_score: float = 0.0
    pros: List[str] = Field(default_factory=list)
    cons: List[str] = Field(default_factory=list)

class MissionPlan(BaseModel):
    objective: str
    location: str
    people_count: int
    budget: float
    duration_days: int
    options: List[MissionOption] = Field(default_factory=list)
    selected_option_id: Optional[str] = None
    explanation: str = ""
    itinerary: List[Dict[str, Any]] = Field(default_factory=list)
    budget_breakdown: Dict[str, float] = Field(default_factory=dict)

class WhatIfScenario(BaseModel):
    id: str = Field(default_factory=lambda: f"whatif-{str(uuid.uuid4())[:6]}")
    name: str
    prompt: str
    delta_description: str
    recalculated_metrics: Dict[str, Any] = Field(default_factory=dict)
    impact_summary: str
    strategic_verdict: str

class SerpentTrailStep(BaseModel):
    step_num: int
    timestamp_rel: str
    phase: str
    title: str
    description: str
    clue: str
    action_type: str
    new_entities: List[str] = Field(default_factory=list)
    contradiction_found: bool = False

class ReplayEvent(BaseModel):
    timestamp_ms: int
    time_label: str
    agent: str
    action: str
    detail: str
    count_summary: Dict[str, int] = Field(default_factory=dict)

class IntelligenceReport(BaseModel):
    question: str
    executive_summary: str
    verdict: str
    confidence_level: ConfidenceLevel
    confidence_explanation: str
    key_findings: List[str] = Field(default_factory=list)
    supporting_evidence: List[Dict[str, Any]] = Field(default_factory=list)
    contradicting_evidence: List[Dict[str, Any]] = Field(default_factory=list)
    what_remains_uncertain: List[str] = Field(default_factory=list)
    recommended_next_investigation: List[str] = Field(default_factory=list)
    tldr: Optional[str] = None
    verdict_category: Optional[str] = "VERIFIED"
    quick_stats: Optional[List[Dict[str, str]]] = Field(default_factory=list)

class IntentDetection(BaseModel):
    detected_mode: InvestigationMode
    primary_intent: str
    entities: List[str] = Field(default_factory=list)
    missing_info: List[str] = Field(default_factory=list)
    required_agents: List[str] = Field(default_factory=list)
    serp_engines: List[str] = Field(default_factory=list)
    generated_queries: List[str] = Field(default_factory=list)

class InvestigationRequest(BaseModel):
    query: str
    mode: InvestigationMode = InvestigationMode.AUTO
    budget: int = 20
    serpapi_key: Optional[str] = None
    gemini_key: Optional[str] = None
    is_demo_force: Optional[bool] = None

class Investigation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: float = Field(default_factory=time.time)
    query: str
    mode: InvestigationMode
    status: str = "INITIALIZING" # INITIALIZING, PLANNING, SEARCHING, ANALYZING, DEEP_SEARCH, SYNTHESIZING, COMPLETED, FAILED
    
    intent: Optional[IntentDetection] = None
    search_budget: int = 20
    search_count: int = 0
    reserve_budget: int = 2
    
    active_agents: List[str] = Field(default_factory=list)
    completed_agents: List[str] = Field(default_factory=list)
    
    sources: List[Source] = Field(default_factory=list)
    claims: List[Claim] = Field(default_factory=list)
    evidence_items: List[EvidenceItem] = Field(default_factory=list)
    entities: List[Entity] = Field(default_factory=list)
    relationships: List[EntityRelationship] = Field(default_factory=list)
    contradictions: List[Contradiction] = Field(default_factory=list)
    lineages: List[SourceLineage] = Field(default_factory=list)
    
    trail: List[SerpentTrailStep] = Field(default_factory=list)
    replay: List[ReplayEvent] = Field(default_factory=list)
    
    # Pillar specific data
    competitive_radar: Optional[CompetitiveRadar] = None
    timeline: List[TimelineEvent] = Field(default_factory=list)
    period_comparison: Optional[PeriodComparison] = None
    mission_plan: Optional[MissionPlan] = None
    scenarios: List[WhatIfScenario] = Field(default_factory=list)
    
    report: Optional[IntelligenceReport] = None
    
    is_demo_mode: bool = False
    error: Optional[str] = None
