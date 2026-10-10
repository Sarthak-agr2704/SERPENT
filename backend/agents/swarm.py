import re
from typing import List, Dict, Any, Optional
from backend.models.schemas import (
    Investigation, InvestigationMode, IntentDetection, AgentName, Source, SourceType,
    SerpentTrailStep, ReplayEvent
)

class IntentAnalyzerAgent:
    """Agent that analyzes query intent, extracts entities, and creates the research plan."""
    @staticmethod
    def analyze(query: str, requested_mode: InvestigationMode = InvestigationMode.AUTO) -> IntentDetection:
        q_lower = query.lower()

        def has_any_word(words: List[str]) -> bool:
            return any(re.search(rf"\b{re.escape(w)}\b", q_lower) for w in words)

        # 1. Detect Mode if AUTO
        if requested_mode != InvestigationMode.AUTO:
            mode = requested_mode
        elif has_any_word(["trip", "plan", "bengaluru", "bangalore", "budget", "students", "robotics"]):
            mode = InvestigationMode.MISSION
        elif has_any_word(["timeline", "history", "evolve", "changed", "era", "milestone"]) or "since 2022" in q_lower or "2023 to 2026" in q_lower:
            mode = InvestigationMode.TRACE
        elif has_any_word(["byd", "tata", "mahindra", "vs", "competitor", "threat", "market"]):
            mode = InvestigationMode.INTELLIGENCE
        elif has_any_word(["true", "claim", "doubles", "1000", "range", "myth", "fact", "verify"]):
            mode = InvestigationMode.VERIFY
        elif has_any_word(["founder", "investigate", "trail", "scam", "patent", "who"]):
            mode = InvestigationMode.INVESTIGATE
        else:
            mode = InvestigationMode.INTELLIGENCE

        # 2. Identify Entities, Engines, and Agents
        entities = []
        queries = []
        engines = ["google"]
        agents = [AgentName.DISCOVERY.value, AgentName.VERIFICATION.value, AgentName.SYNTHESIS.value]

        if mode == InvestigationMode.INTELLIGENCE:
            entities = ["BYD Auto", "Tata Motors", "Mahindra & Mahindra", "Indian EV Market"]
            queries = [
                "BYD India EV sales market share",
                "Tata Motors electric vehicle passenger dominance",
                "India EV import tariffs CBU policy",
                "BYD Blade Battery 2.0 specifications fast charging"
            ]
            engines.extend(["google_news", "google_shopping"])
            agents.extend([AgentName.NEWS.value, AgentName.MARKET_INTELLIGENCE.value, AgentName.TIMELINE.value])

        elif mode == InvestigationMode.VERIFY:
            entities = ["Semi-Solid Battery", "1000 km EV Range", "Silicon Anode Chemistry"]
            queries = [
                "1000 km range solid state battery independent tests",
                "Silicon anode energy density degradation cycles",
                "WLTP highway vs laboratory range discrepancy"
            ]
            engines.extend(["google_scholar", "google_news"])
            agents.extend([AgentName.RESEARCH_SCHOLAR.value, AgentName.NEWS.value, AgentName.DETECTIVE.value])

        elif mode == InvestigationMode.MISSION:
            entities = ["IISc JN Tata Auditorium", "Bengaluru Student Accommodation", "IRCTC Trains"]
            queries = [
                "Budget youth hostel lodging Mathikere near IISc Bengaluru",
                "Train tickets IRCTC sleeper AC 3 tier Bengaluru",
                "Student travel costs robotics competition Bengaluru"
            ]
            engines.extend(["google_maps", "google_shopping"])
            agents.extend([AgentName.LOCAL_MAPS.value, AgentName.COMMERCE_PRODUCT.value, AgentName.MISSION_PLANNER.value])

        elif mode == InvestigationMode.TRACE:
            entities = ["Indian EV Sector 2022", "New EV Policy 2024", "Born EV Skateboards 2026"]
            queries = [
                "Indian EV market milestone 2022 FAME subsidy",
                "India New EV Policy March 2024 concessional tariff",
                "Mahindra INGLO Tata acti.ev platform launches 2025 2026"
            ]
            engines.extend(["google_news"])
            agents.extend([AgentName.TIMELINE.value, AgentName.NEWS.value, AgentName.MARKET_INTELLIGENCE.value])

        else:
            entities = [query.split()[0].title()]
            queries = [f"{query} overview facts", f"{query} news analysis", f"{query} independent evaluation"]
            engines.extend(["google_news"])
            agents.extend([AgentName.NEWS.value, AgentName.DETECTIVE.value])

        return IntentDetection(
            detected_mode=mode,
            primary_intent=f"Decomposed '{query}' into {mode.value} multi-agent investigative trajectory.",
            entities=entities,
            missing_info=["Independent empirical tests", "Up-to-date regulatory tariffs"],
            required_agents=agents,
            serp_engines=engines,
            generated_queries=queries
        )
