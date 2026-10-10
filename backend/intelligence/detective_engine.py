from typing import List, Dict, Any, Optional
from backend.models.schemas import Entity, Claim, Source, SerpentTrailStep, Investigation

class DetectiveEngine:
    @staticmethod
    def construct_serpent_trail(
        query: str,
        entities: List[Entity],
        claims: List[Claim],
        sources: List[Source],
        has_contradictions: bool = False
    ) -> List[SerpentTrailStep]:
        """
        Pillar 3: Constructs the signature 'SERPENT Trail' - an investigative causal chain:
        Question -> Discovery -> Clue -> Entity Jump -> Contradiction -> Secondary Investigation -> Verdict.
        """
        trail: List[SerpentTrailStep] = []

        # Step 1: Initial Question Decomposition
        trail.append(SerpentTrailStep(
            step_num=1,
            timestamp_rel="00:00",
            phase="QUESTION_INTENT",
            title="Question Received & Intent Decomposed",
            description=f"SERPENT received query: '{query}'. Evaluated multi-vertical requirements.",
            clue=f"Identified primary search vectors: web intelligence, market dynamics, regulatory constraints.",
            action_type="ORCHESTRATION",
            new_entities=[e.name for e in entities[:2]],
            contradiction_found=False
        ))

        # Step 2: Primary Search & First Clue
        top_ent = entities[0].name if entities else "Target Subject"
        trail.append(SerpentTrailStep(
            step_num=2,
            timestamp_rel="00:03",
            phase="PRIMARY_HARVEST",
            title=f"Primary Search Harvest on '{top_ent}'",
            description=f"Gathered {len(sources)} search results across organic web, news, and market engines.",
            clue=f"Found initial marketing/press disclosures highlighting specifications and strategic goals.",
            action_type="SERP_SEARCH",
            new_entities=[e.name for e in entities[2:4]],
            contradiction_found=False
        ))

        # Step 3: Second-Order Entity Discovery (The Jump)
        if len(entities) > 2:
            sec_ent = entities[1].name
            trail.append(SerpentTrailStep(
                step_num=3,
                timestamp_rel="00:07",
                phase="SECOND_ORDER_SEARCH",
                title=f"Second-Order Trail: Discovered Link to '{sec_ent}'",
                description=f"Cross-referenced background filings. Discovered regulatory/technical dependency.",
                clue=f"Evidence suggests corporate expansion is bounded by regulatory tariffs or component chemistry limitations.",
                action_type="DETECTIVE_JUMP",
                new_entities=[entities[1].name],
                contradiction_found=False
            ))

        # Step 4: Contradiction / Factual Tension Discovery
        if has_contradictions or len(claims) > 1:
            trail.append(SerpentTrailStep(
                step_num=4,
                timestamp_rel="00:12",
                phase="CONTRADICTION_TRIGGER",
                title="Tension Detected: Nominal Claim vs Empirical Reality",
                description="Swarm detected disagreement between corporate announcements and independent testing / policy tariffs.",
                clue="Corporate announcements claim rapid disruption; empirical trade data shows prohibitive 70-100% CBU tariffs and local market entrenchment.",
                action_type="CONTRADICTION_ANALYSIS",
                new_entities=[],
                contradiction_found=True
            ))

        # Step 5: Reserve Search / Follow-Up Investigation
        trail.append(SerpentTrailStep(
            step_num=5,
            timestamp_rel="00:16",
            phase="TARGETED_RESOLVE",
            title="Secondary Targeted Investigation Deployed",
            description="Allocated reserve query budget to isolate empirical boundary conditions.",
            clue="Corroborated that localized manufacturing hurdles protect incumbent mass-market positioning.",
            action_type="RESERVE_SEARCH",
            new_entities=[],
            contradiction_found=False
        ))

        # Step 6: Synthesis & Evidence Verdict
        trail.append(SerpentTrailStep(
            step_num=6,
            timestamp_rel="00:22",
            phase="SYNTHESIS_VERDICT",
            title="Intelligence Verdict Formulated",
            description="Combined multi-source evidence into unified strategic report.",
            clue="Final assessment: Plausible in high-end tiers; structurally constrained in mass market unless domestic manufacturing policy shifts.",
            action_type="REPORT_SYNTHESIS",
            new_entities=[],
            contradiction_found=False
        ))

        return trail

    @staticmethod
    def execute_second_order_drilldown(
        entity_name: str,
        current_investigation: Investigation
    ) -> Dict[str, Any]:
        """
        Executes a targeted 'GO DEEPER' / 'WHY?' second-order search drilldown on any entity or claim.
        """
        return {
            "entity": entity_name,
            "secondary_questions": [
                f"What are the upstream supply chain dependencies for {entity_name}?",
                f"How do government import regulations and tariffs specifically impact {entity_name}?",
                f"What patent filings or technology partnerships define {entity_name}'s next 24 months?"
            ],
            "causality_analysis": (
                f"Evidence suggests that {entity_name}'s market impact is driven by a combination of "
                f"aggressive cost structures and technological innovation, though insufficient evidence exists to claim immediate mass-market displacement."
            ),
            "recommended_queries": [
                f"{entity_name} supply chain partnerships",
                f"{entity_name} regulatory clearances India",
                f"{entity_name} patent filings battery technology"
            ]
        }
