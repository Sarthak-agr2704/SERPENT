import pytest
import time
from backend.models.schemas import (
    InvestigationRequest, InvestigationMode, Source, SourceType,
    EvidenceRelationship, ConfidenceLevel
)
from backend.agents.swarm import IntentAnalyzerAgent
from backend.serp.cache import SerpCache
from backend.serp.client import SerpApiClient
from backend.evidence.claim_extractor import ClaimExtractor
from backend.evidence.lineage_detector import LineageDetector
from backend.evidence.contradiction_detector import ContradictionDetector
from backend.evidence.confidence_scorer import ConfidenceScorer
from backend.intelligence.war_room import WarRoomEngine
from backend.intelligence.time_machine import TimeMachineEngine
from backend.intelligence.mission_control import MissionControlEngine
from backend.orchestrator.orchestrator import SerpentOrchestrator

def test_intent_analyzer_mode_detection():
    # 1. EV Threat -> INTELLIGENCE
    res1 = IntentAnalyzerAgent.analyze("Is BYD becoming a serious threat to Indian EV manufacturers?")
    assert res1.detected_mode == InvestigationMode.INTELLIGENCE
    assert "BYD Auto" in res1.entities

    # 2. Battery Claim -> VERIFY
    res2 = IntentAnalyzerAgent.analyze("Is the claim that this battery doubles EV range true?")
    assert res2.detected_mode == InvestigationMode.VERIFY

    # 3. Robotics Trip -> MISSION
    res3 = IntentAnalyzerAgent.analyze("Plan a 3-day robotics competition trip to Bengaluru under ₹30,000")
    assert res3.detected_mode == InvestigationMode.MISSION

    # 4. History/Timeline -> TRACE
    res4 = IntentAnalyzerAgent.analyze("How did this company's competitive position change from 2023 to 2026?")
    assert res4.detected_mode == InvestigationMode.TRACE

def test_serp_cache():
    cache = SerpCache()
    key = cache.generate_key("google", f"test battery range {time.time()}", num=5)
    test_payload = {"test": 123}
    cache.set(key, "google", "test battery range", test_payload)
    retrieved = cache.get(key)
    assert retrieved is not None
    assert retrieved["test"] == 123

def test_serp_client_budget_and_demo():
    client = SerpApiClient(budget=5)
    # Use un-cached unique query to test live budget tracking
    unique_q = f"Unique query test {time.time()}"
    sources = client.search(unique_q, engine="google", force_demo=True)
    assert len(sources) > 0
    assert client.searches_conducted == 1
    assert sources[0].engine == "google"

def test_source_lineage_clustering():
    sources = [
        Source(
            id="s1",
            title="BYD Expands Across India, Reuters Reports",
            url="https://site1.com/byd",
            snippet="According to Reuters, BYD is expanding into new tier-1 cities with electric SUVs.",
            query="byd"
        ),
        Source(
            id="s2",
            title="Reuters Wire: BYD Accelerates India Push",
            url="https://site2.com/byd",
            snippet="Reuters reports BYD is expanding into new tier-1 cities with electric SUVs.",
            query="byd"
        ),
        Source(
            id="s3",
            title="Independent Autocar Review",
            url="https://autocar.com/review",
            snippet="Our test drivers evaluated the Atto 3 chassis dynamics in Mumbai traffic.",
            query="byd"
        )
    ]
    lineages = LineageDetector.detect_lineage(sources)
    assert len(lineages) >= 1
    assert lineages[0].articles_count >= 2
    assert "Reuters" in lineages[0].root_origin

def test_claim_extraction_and_contradiction():
    sources = [
        Source(
            id="s1",
            title="Company Claims 1,000 km Range",
            url="https://pr.com",
            snippet="Startup achieves 1,000 km range on single charge.",
            query="range"
        ),
        Source(
            id="s2",
            title="Lab Test Reveals Severe Range Drop",
            url="https://lab.org",
            snippet="Independent chassis dyno reveals real-world range drops 32% under load.",
            query="range"
        )
    ]
    claims, ev_items, entities, rels = ClaimExtractor.extract_claims_and_entities(
        "Is battery 1000 km range true?",
        sources
    )
    assert len(claims) > 0
    assert len(ev_items) > 0
    assert len(entities) > 0

    contradictions = ContradictionDetector.detect_contradictions(claims, ev_items, sources)
    assert len(contradictions) >= 1
    assert "DISAGREEMENT DETECTED" in contradictions[0].debate_notes

def test_confidence_scorer():
    sources = [
        Source(id=f"s{i}", title=f"Source {i}", url=f"https://s{i}.com", snippet="...", query="q")
        for i in range(8)
    ]
    claims, ev_items, _, _ = ClaimExtractor.extract_claims_and_entities("BYD EV threat", sources)
    conf_level, conf_expl = ConfidenceScorer.calculate_confidence(sources, ev_items)
    assert conf_level in [ConfidenceLevel.HIGH, ConfidenceLevel.MEDIUM]
    assert "Evidence Confidence:" in conf_expl

def test_war_room_radar():
    radar = WarRoomEngine.generate_competitive_radar("BYD vs Tata")
    assert "BYD Auto" in radar.entities
    assert "Tata Motors" in radar.entities
    assert len(radar.dimensions) == 6
    assert len(radar.comparison_table) >= 4

def test_time_machine():
    timeline = TimeMachineEngine.construct_timeline("EV history 2022 to 2026")
    assert len(timeline) >= 4
    assert timeline[0].period == "2022"
    comparison = TimeMachineEngine.compare_periods("2024", "2026")
    assert len(comparison.what_changed) >= 2

def test_mission_control_and_what_if():
    plan = MissionControlEngine.generate_mission_plan(
        objective="Robotics trip to Bengaluru",
        budget=30000.0,
        duration_days=3
    )
    assert plan.selected_option_id == "opt-a"
    assert plan.options[0].is_feasible is True
    assert plan.options[1].is_feasible is False  # Fails distance and budget

    # What-If scenario
    scenario = MissionControlEngine.calculate_what_if_scenario(plan, "What if the budget drops to ₹25,000?")
    assert "₹25,000" in scenario.recalculated_metrics["New Budget"]
    assert "PASS" in scenario.strategic_verdict

def test_end_to_end_scenario_1_ev_threat():
    req = InvestigationRequest(
        query="Is BYD becoming a serious threat to Indian EV manufacturers?",
        mode=InvestigationMode.AUTO,
        is_demo_force=True
    )
    inv = SerpentOrchestrator.run_investigation(req)
    assert inv.status == "COMPLETED"
    assert inv.mode == InvestigationMode.INTELLIGENCE
    assert len(inv.sources) >= 4
    assert len(inv.claims) >= 3
    assert inv.competitive_radar is not None
    assert inv.report is not None
    assert len(inv.trail) >= 5
    assert len(inv.replay) >= 4

def test_end_to_end_scenario_2_battery_claim():
    req = InvestigationRequest(
        query="Is the claim that this new battery doubles EV range true?",
        mode=InvestigationMode.VERIFY,
        is_demo_force=True
    )
    inv = SerpentOrchestrator.run_investigation(req)
    assert inv.status == "COMPLETED"
    assert len(inv.claims) >= 2
    assert len(inv.contradictions) >= 1
    assert "PARTIALLY SUPPORTED" in inv.report.verdict

def test_end_to_end_scenario_3_robotics_mission():
    req = InvestigationRequest(
        query="Plan a 3-day robotics competition trip to Bengaluru for 4 students under ₹30,000",
        mode=InvestigationMode.MISSION,
        is_demo_force=True
    )
    inv = SerpentOrchestrator.run_investigation(req)
    assert inv.status == "COMPLETED"
    assert inv.mission_plan is not None
    assert inv.mission_plan.selected_option_id == "opt-a"
    assert "FEASIBLE" in inv.report.verdict
