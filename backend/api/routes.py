from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Dict, Any, Optional
from pydantic import BaseModel
from backend.models.schemas import Investigation, InvestigationRequest, WhatIfScenario
from backend.orchestrator.orchestrator import SerpentOrchestrator
from backend.evidence.graph_builder import GraphBuilder
from backend.intelligence.detective_engine import DetectiveEngine
from backend.intelligence.mission_control import MissionControlEngine
from backend.intelligence.truth_engine import TruthEngine
from backend.config import Config

router = APIRouter(prefix="/api")

# In-memory storage for investigations
investigations_store: Dict[str, Investigation] = {}

class ScenarioRequest(BaseModel):
    prompt: str

class DeeperRequest(BaseModel):
    entity: str

class SettingsRequest(BaseModel):
    serpapi_key: Optional[str] = None
    gemini_key: Optional[str] = None

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SERPENT Intelligence Engine",
        "serpapi_configured": Config.has_serpapi_key(),
        "gemini_configured": Config.has_gemini_key()
    }

@router.get("/settings")
def get_settings():
    return {
        "has_serpapi_key": Config.has_serpapi_key(),
        "has_gemini_key": Config.has_gemini_key(),
        "serpapi_masked": f"...{Config.get_serpapi_key()[-4:]}" if Config.has_serpapi_key() else "",
        "gemini_masked": f"...{Config.get_gemini_key()[-4:]}" if Config.has_gemini_key() else ""
    }

@router.post("/settings")
def update_settings(req: SettingsRequest):
    if req.serpapi_key is not None:
        Config.RUNTIME_SERPAPI_KEY = req.serpapi_key.strip()
    if req.gemini_key is not None:
        Config.RUNTIME_GEMINI_KEY = req.gemini_key.strip()
    return {
        "success": True,
        "has_serpapi_key": Config.has_serpapi_key(),
        "has_gemini_key": Config.has_gemini_key()
    }

@router.post("/investigations", response_model=Investigation)
def create_investigation(req: InvestigationRequest):
    """
    Starts an autonomous multi-agent investigation.
    Deploys swarm, queries SerpApi, extracts claims, builds evidence graph,
    and synthesizes intelligence report.
    """
    try:
        investigation = SerpentOrchestrator.run_investigation(req)
        investigations_store[investigation.id] = investigation
        return investigation
    except Exception as ex:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(ex))

@router.get("/investigations/{inv_id}", response_model=Investigation)
def get_investigation(inv_id: str):
    if inv_id not in investigations_store:
        raise HTTPException(status_code=404, detail="Investigation not found")
    return investigations_store[inv_id]

@router.get("/investigations/{inv_id}/graph")
def get_investigation_graph(inv_id: str):
    if inv_id not in investigations_store:
        raise HTTPException(status_code=404, detail="Investigation not found")
    inv = investigations_store[inv_id]
    return GraphBuilder.build_network_graph(
        entities=inv.entities,
        relationships=inv.relationships,
        claims=inv.claims,
        evidence_items=inv.evidence_items,
        sources=inv.sources
    )

@router.post("/investigations/{inv_id}/deeper")
def go_deeper(inv_id: str, req: DeeperRequest):
    """
    Pillar 3: Go Deeper / Second-order drilldown on a discovered entity or clue.
    """
    if inv_id not in investigations_store:
        raise HTTPException(status_code=404, detail="Investigation not found")
    inv = investigations_store[inv_id]
    return DetectiveEngine.execute_second_order_drilldown(req.entity, inv)

@router.post("/investigations/{inv_id}/scenario")
def run_scenario(inv_id: str, req: ScenarioRequest):
    """
    Pillar 6 & 4: What-If Scenario simulation engine.
    Recalculates mission and market impacts without fabricating baseline facts.
    """
    if inv_id not in investigations_store:
        raise HTTPException(status_code=404, detail="Investigation not found")
    inv = investigations_store[inv_id]
    scenario = MissionControlEngine.calculate_what_if_scenario(inv.mission_plan, req.prompt)
    inv.scenarios.append(scenario)
    return scenario

@router.get("/investigations/{inv_id}/verify")
def get_verification_details(inv_id: str):
    """
    Pillar 2: Detailed truth engine verification and empirical breakdowns.
    """
    if inv_id not in investigations_store:
        raise HTTPException(status_code=404, detail="Investigation not found")
    inv = investigations_store[inv_id]
    return TruthEngine.verify_claims(
        claims=inv.claims,
        evidence_items=inv.evidence_items,
        sources=inv.sources
    )
