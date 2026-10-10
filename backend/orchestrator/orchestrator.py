import time
from typing import List, Dict, Any, Optional
from backend.models.schemas import (
    Investigation, InvestigationRequest, InvestigationMode, IntentDetection,
    AgentName, ReplayEvent, Source, Claim, EvidenceItem, Entity,
    EntityRelationship, Contradiction, SourceLineage, SerpentTrailStep,
    ConfidenceLevel
)
from backend.serp.client import SerpApiClient
from backend.agents.swarm import IntentAnalyzerAgent
from backend.evidence.claim_extractor import ClaimExtractor
from backend.evidence.lineage_detector import LineageDetector
from backend.evidence.contradiction_detector import ContradictionDetector
from backend.evidence.confidence_scorer import ConfidenceScorer
from backend.evidence.graph_builder import GraphBuilder
from backend.intelligence.truth_engine import TruthEngine
from backend.intelligence.detective_engine import DetectiveEngine
from backend.intelligence.war_room import WarRoomEngine
from backend.intelligence.time_machine import TimeMachineEngine
from backend.intelligence.mission_control import MissionControlEngine
from backend.intelligence.synthesis_engine import SynthesisEngine

class SerpentOrchestrator:
    """
    Core Multi-Agent Orchestrator for SERPENT.
    Controls the entire lifecycle of an autonomous investigation:
    Intent -> Planning -> Swarm Deployment -> SerpApi Harvesting ->
    Lineage Clustering -> Contradiction Detection -> Second-Order Drilldown ->
    Graph Construction -> Pillar Execution -> Synthesis.
    """
    @staticmethod
    def run_investigation(req: InvestigationRequest) -> Investigation:
        start_time = time.time()
        
        # 1. Initialize Investigation Model
        investigation = Investigation(
            query=req.query,
            mode=req.mode,
            status="INITIALIZING",
            search_budget=req.budget
        )

        def add_replay(agent: str, action: str, detail: str):
            elapsed_sec = int(time.time() - start_time)
            mins = elapsed_sec // 60
            secs = elapsed_sec % 60
            investigation.replay.append(ReplayEvent(
                timestamp_ms=int((time.time() - start_time) * 1000),
                time_label=f"{mins:02d}:{secs:02d}",
                agent=agent,
                action=action,
                detail=detail,
                count_summary={
                    "sources": len(investigation.sources),
                    "claims": len(investigation.claims),
                    "entities": len(investigation.entities),
                    "contradictions": len(investigation.contradictions)
                }
            ))

        add_replay(AgentName.INTENT_ANALYZER.value, "RECEIVE_QUERY", f"Investigation requested: '{req.query}'")

        # 2. Intent Analysis & Agent Selection
        investigation.status = "PLANNING"
        intent = IntentAnalyzerAgent.analyze(req.query, requested_mode=req.mode)
        investigation.intent = intent
        investigation.mode = intent.detected_mode
        investigation.active_agents = intent.required_agents

        add_replay(
            AgentName.INTENT_ANALYZER.value,
            "INTENT_IDENTIFIED",
            f"Mode detected: {investigation.mode.value}. Deployed agents: {', '.join(intent.required_agents[:4])}."
        )

        # 3. Initialize SerpApiClient
        serp_client = SerpApiClient(
            budget=req.budget,
            runtime_key=req.serpapi_key
        )
        force_demo = req.is_demo_force if req.is_demo_force is not None else False

        # 4. Multi-Agent Search Swarm Execution across Verticals
        investigation.status = "SEARCHING"
        all_sources: List[Source] = []

        # Dispatch primary queries to SerpApi engines
        for query_str in intent.generated_queries:
            # Query organic Google
            g_sources = serp_client.search(
                query=query_str,
                engine="google",
                force_demo=force_demo
            )
            all_sources.extend(g_sources)

            # Query secondary engines based on intent
            if "google_news" in intent.serp_engines:
                n_sources = serp_client.search(
                    query=query_str,
                    engine="google_news",
                    force_demo=force_demo
                )
                all_sources.extend(n_sources)

            if "google_scholar" in intent.serp_engines:
                s_sources = serp_client.search(
                    query=query_str,
                    engine="google_scholar",
                    force_demo=force_demo
                )
                all_sources.extend(s_sources)

            if "google_shopping" in intent.serp_engines:
                sh_sources = serp_client.search(
                    query=query_str,
                    engine="google_shopping",
                    force_demo=force_demo
                )
                all_sources.extend(sh_sources)

            if "google_maps" in intent.serp_engines:
                m_sources = serp_client.search(
                    query=query_str,
                    engine="google_maps",
                    force_demo=force_demo
                )
                all_sources.extend(m_sources)

        # Deduplicate sources by URL
        seen_urls = set()
        unique_sources: List[Source] = []
        for s in all_sources:
            if s.url not in seen_urls:
                seen_urls.add(s.url)
                unique_sources.append(s)

        investigation.sources = unique_sources
        investigation.search_count = serp_client.searches_conducted
        investigation.is_demo_mode = any(s.is_demo for s in unique_sources)

        add_replay(
            AgentName.DISCOVERY.value,
            "SOURCES_INDEXED",
            f"Retrieved {len(unique_sources)} sources across {len(intent.serp_engines)} SerpApi engines (Search count: {investigation.search_count})."
        )

        # 5. Extract Structured Claims and Entities
        investigation.status = "ANALYZING"
        claims, ev_items, entities, relationships = ClaimExtractor.extract_claims_and_entities(
            query=req.query,
            sources=unique_sources
        )
        investigation.claims = claims
        investigation.evidence_items = ev_items
        investigation.entities = entities
        investigation.relationships = relationships

        add_replay(
            AgentName.VERIFICATION.value,
            "CLAIMS_EXTRACTED",
            f"Extracted {len(claims)} structured claims and {len(entities)} contextual entities."
        )

        # 6. Source Lineage Detection (Wire / Press Release clustering)
        lineages = LineageDetector.detect_lineage(unique_sources)
        investigation.lineages = lineages
        if lineages:
            add_replay(
                AgentName.VERIFICATION.value,
                "LINEAGE_DETECTED",
                f"Identified {len(lineages)} source lineage chains (syndicated wire / corporate press releases)."
            )

        # 7. Contradiction Detection & Multi-Agent Debate
        contradictions = ContradictionDetector.detect_contradictions(
            claims=claims,
            evidence_items=ev_items,
            sources=unique_sources
        )
        investigation.contradictions = contradictions

        # If contradictions found, trigger second-order reserve searches
        if contradictions:
            add_replay(
                AgentName.DETECTIVE.value,
                "CONTRADICTION_FOUND",
                f"Tension detected: '{contradictions[0].nature_of_conflict}'. Launching targeted reserve search."
            )
            # Use reserve search budget
            reserve_query = f"{req.query} empirical test regulatory limits"
            reserve_sources = serp_client.search(
                query=reserve_query,
                engine="google",
                is_reserve=True,
                force_demo=force_demo
            )
            investigation.sources.extend(reserve_sources)
            investigation.search_count = serp_client.searches_conducted

        # 8. Calculate Evidence Confidence
        conf_level, conf_expl = ConfidenceScorer.calculate_confidence(
            sources=investigation.sources,
            evidence_items=ev_items
        )

        # 9. Construct the Signature SERPENT Trail
        trail = DetectiveEngine.construct_serpent_trail(
            query=req.query,
            entities=entities,
            claims=claims,
            sources=investigation.sources,
            has_contradictions=bool(contradictions)
        )
        investigation.trail = trail

        # 10. Execute Pillar-Specific Engines
        if investigation.mode in [InvestigationMode.INTELLIGENCE, InvestigationMode.AUTO]:
            investigation.competitive_radar = WarRoomEngine.generate_competitive_radar(req.query)

        if investigation.mode in [InvestigationMode.TRACE, InvestigationMode.INTELLIGENCE, InvestigationMode.AUTO]:
            investigation.timeline = TimeMachineEngine.construct_timeline(req.query)
            investigation.period_comparison = TimeMachineEngine.compare_periods("2024", "2026")

        if investigation.mode in [InvestigationMode.MISSION]:
            mission = MissionControlEngine.generate_mission_plan(
                objective=req.query,
                budget=30000.0,
                duration_days=3
            )
            investigation.mission_plan = mission

        # 11. Final Synthesis Report
        investigation.status = "SYNTHESIZING"
        report = SynthesisEngine.generate_report(
            question=req.query,
            claims=claims,
            sources=investigation.sources,
            evidence_items=ev_items,
            contradictions=contradictions,
            confidence_level=conf_level,
            confidence_explanation=conf_expl
        )
        investigation.report = report

        add_replay(
            AgentName.SYNTHESIS.value,
            "SYNTHESIS_COMPLETE",
            f"Intelligence Report finalized with verdict: '{report.verdict[:60]}...'."
        )

        investigation.status = "COMPLETED"
        investigation.completed_agents = list(set(investigation.active_agents))
        return investigation
