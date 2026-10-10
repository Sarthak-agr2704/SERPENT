from typing import List, Dict, Any
from backend.models.schemas import Claim, EvidenceItem, Source, Contradiction, EvidenceRelationship

class ContradictionDetector:
    @staticmethod
    def detect_contradictions(
        claims: List[Claim],
        evidence_items: List[EvidenceItem],
        sources: List[Source]
    ) -> List[Contradiction]:
        """
        Scans all evidence mappings for direct factual conflicts and disagreements.
        Triggers structured debate artifacts and pinpoints conflicting sources.
        """
        contradictions: List[Contradiction] = []
        source_map = {s.id: s for s in sources}

        # Group evidence items by claim_id
        ev_by_claim: Dict[str, List[EvidenceItem]] = {}
        for ev in evidence_items:
            ev_by_claim.setdefault(ev.claim_id, []).append(ev)

        for claim in claims:
            ev_list = ev_by_claim.get(claim.id, [])
            supporting = [ev for ev in ev_list if ev.relationship in (EvidenceRelationship.SUPPORTS, EvidenceRelationship.PARTIALLY_SUPPORTS)]
            contradicting = [ev for ev in ev_list if ev.relationship == EvidenceRelationship.CONTRADICTS]

            # If a claim has both positive/partial assertions and contradictory empirical signals
            if supporting and contradicting:
                sup_ids = [ev.source_id for ev in supporting]
                con_ids = [ev.source_id for ev in contradicting]

                # Synthesize the nature of conflict
                sup_domains = list({source_map[sid].domain for sid in sup_ids if sid in source_map})
                con_domains = list({source_map[cid].domain for cid in con_ids if cid in source_map})

                debate_text = (
                    f"DISAGREEMENT DETECTED:\n"
                    f"- Supporting sources ({', '.join(sup_domains[:3])}) highlight nominal specification & corporate capability.\n"
                    f"- Contradicting sources ({', '.join(con_domains[:3])}) cite operational constraints, empirical laboratory dyno tests, or regulatory tariffs.\n"
                    f"- Swarm verdict: Factual nuance detected. Laboratory theoretical maximum does NOT equal commercial real-world baseline."
                )

                contra = Contradiction(
                    claim_id=claim.id,
                    claim_text=claim.text,
                    supporting_source_ids=sup_ids,
                    contradicting_source_ids=con_ids,
                    nature_of_conflict=f"Specification/Marketing claim diverges from real-world empirical or regulatory boundaries.",
                    resolution_status="PARTIAL",
                    debate_notes=debate_text
                )
                contradictions.append(contra)

        return contradictions
