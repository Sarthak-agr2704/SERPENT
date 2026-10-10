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
        is_demo_byd = any(w in q_lower for w in ["byd", "tata motors", "blade battery"]) and any(w in q_lower for w in ["ev", "electric", "threat", "market share"])
        is_demo_bat = (any(w in q_lower for w in ["1000", "1,000", "doubles", "double", "quantumcharge"]) and any(w in q_lower for w in ["battery", "range", "km", "ev"])) or ("battery" in q_lower and "range" in q_lower)
        is_demo_trip = any(w in q_lower for w in ["robotics", "iisc", "mathikere"]) and any(w in q_lower for w in ["bengaluru", "bangalore", "trip", "30,000", "30000"])
        is_demo_trace = (("2022" in q_lower or "2023" in q_lower) and "2026" in q_lower) or ("timeline" in q_lower and "ev" in q_lower) or ("competitive position" in q_lower and "change" in q_lower)

        if requested_mode != InvestigationMode.AUTO:
            mode = requested_mode
        elif is_demo_trip or has_any_word(["trip", "itinerary", "hostel", "budget", "venue", "pack"]):
            mode = InvestigationMode.MISSION
        elif is_demo_trace or has_any_word(["timeline", "history", "evolve", "evolution", "chronology", "milestone"]):
            mode = InvestigationMode.TRACE
        elif is_demo_byd or has_any_word(["vs", "versus", "competitor", "market share", "benchmark", "rival"]):
            mode = InvestigationMode.INTELLIGENCE
        elif is_demo_bat or has_any_word(["true", "fact", "myth", "fake", "hoax", "verify", "claim", "is it true", "allegation", "debunk"]):
            mode = InvestigationMode.VERIFY
        else:
            mode = InvestigationMode.INVESTIGATE

        # 2. Identify Entities, Engines, and Agents
        entities: List[str] = []
        queries: List[str] = []
        engines = ["google", "google_news"]
        agents = [AgentName.DISCOVERY.value, AgentName.VERIFICATION.value, AgentName.SYNTHESIS.value]

        # Preset showcase demo queries (only when explicitly matching demo keywords)
        if is_demo_byd:
            entities = ["BYD Auto", "Tata Motors", "Mahindra & Mahindra", "Indian EV Market"]
            queries = [
                "BYD India EV sales market share",
                "Tata Motors electric vehicle passenger dominance",
                "India EV import tariffs CBU policy",
                "BYD Blade Battery 2.0 specifications fast charging"
            ]
            engines.extend(["google_shopping"])
            agents.extend([AgentName.NEWS.value, AgentName.MARKET_INTELLIGENCE.value, AgentName.TIMELINE.value])

        elif is_demo_bat:
            entities = ["Semi-Solid Battery", "1000 km EV Range", "Silicon Anode Chemistry"]
            queries = [
                "1000 km range solid state battery independent tests",
                "Silicon anode energy density degradation cycles",
                "WLTP highway vs laboratory range discrepancy"
            ]
            engines.append("google_scholar")
            agents.extend([AgentName.RESEARCH_SCHOLAR.value, AgentName.NEWS.value, AgentName.DETECTIVE.value])

        elif is_demo_trip:
            entities = ["IISc JN Tata Auditorium", "Bengaluru Student Accommodation", "IRCTC Trains"]
            queries = [
                "Budget youth hostel lodging Mathikere near IISc Bengaluru",
                "Train tickets IRCTC sleeper AC 3 tier Bengaluru",
                "Student travel costs robotics competition Bengaluru"
            ]
            engines.extend(["google_maps", "google_shopping"])
            agents.extend([AgentName.LOCAL_MAPS.value, AgentName.COMMERCE_PRODUCT.value, AgentName.MISSION_PLANNER.value])

        elif is_demo_trace:
            entities = ["Indian EV Sector 2022", "New EV Policy 2024", "Born EV Skateboards 2026"]
            queries = [
                "Indian EV market milestone 2022 FAME subsidy",
                "India New EV Policy March 2024 concessional tariff",
                "Mahindra INGLO Tata acti.ev platform launches 2025 2026"
            ]
            agents.extend([AgentName.TIMELINE.value, AgentName.NEWS.value, AgentName.MARKET_INTELLIGENCE.value])

        else:
            # DYNAMIC GENERATION FOR ANY GENERAL QUERY
            clean_q = query.strip()
            # Extract candidate entities from query words / capitalized phrases
            extracted_words = [w for w in re.split(r"[,\s;]+", clean_q) if len(w) > 2 and w.lower() not in {"what", "when", "where", "which", "does", "with", "from", "about", "that", "this", "have", "more"}]
            if extracted_words:
                entities = [w.capitalize() for w in extracted_words[:4]]
            else:
                entities = [clean_q.capitalize()]

            # Build multi-engine targeted queries based on user's exact input
            queries = [
                clean_q,
                f"{clean_q} latest news analysis",
                f"{clean_q} facts evidence review",
                f"{clean_q} independent verification"
            ]

            if mode == InvestigationMode.INTELLIGENCE or "vs" in q_lower or "versus" in q_lower:
                queries.append(f"{clean_q} market competition comparison")
                engines.append("google_shopping")
                agents.extend([AgentName.MARKET_INTELLIGENCE.value, AgentName.NEWS.value])
            elif mode == InvestigationMode.VERIFY:
                queries.append(f"{clean_q} fact check debunk empirical studies")
                engines.append("google_scholar")
                agents.extend([AgentName.RESEARCH_SCHOLAR.value, AgentName.DETECTIVE.value])
            elif mode == InvestigationMode.MISSION:
                queries.append(f"{clean_q} rates cost reviews locations")
                engines.append("google_maps")
                agents.extend([AgentName.LOCAL_MAPS.value, AgentName.MISSION_PLANNER.value])
            elif mode == InvestigationMode.TRACE:
                queries.append(f"{clean_q} timeline milestones chronology history")
                agents.extend([AgentName.TIMELINE.value, AgentName.NEWS.value])
            else:
                agents.extend([AgentName.NEWS.value, AgentName.DETECTIVE.value])

        return IntentDetection(
            detected_mode=mode,
            primary_intent=f"Decomposed '{query}' into {mode.value} multi-agent investigative trajectory.",
            entities=entities,
            missing_info=["Independent empirical verification", "Primary source disclosures"],
            required_agents=agents,
            serp_engines=list(dict.fromkeys(engines)),
            generated_queries=queries
        )
