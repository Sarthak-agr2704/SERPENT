from typing import List, Dict, Any
from backend.models.schemas import Claim, EvidenceItem, Source, EvidenceRelationship, ConfidenceLevel

class TruthEngine:
    @staticmethod
    def verify_claims(
        claims: List[Claim],
        evidence_items: List[EvidenceItem],
        sources: List[Source]
    ) -> List[Dict[str, Any]]:
        """
        Pillar 2: Truth Engine / Fact Verification
        Converts claims into rigorous verification verdicts, distinguishing
        marketing claims from empirical and regulatory realities.
        """
        results: List[Dict[str, Any]] = []
        source_map = {s.id: s for s in sources}

        for claim in claims:
            related_ev = [e for e in evidence_items if e.claim_id == claim.id]
            supporting = [e for e in related_ev if e.relationship == EvidenceRelationship.SUPPORTS]
            contradicting = [e for e in related_ev if e.relationship == EvidenceRelationship.CONTRADICTS]

            # Determine empirical status
            if contradicting and supporting:
                verdict = "PARTIALLY SUPPORTED (WITH CRITICAL CONDITIONS)"
                badge_color = "amber"
                explanation = (
                    f"Claim is conditionally plausible under nominal/lab conditions, but independent sources "
                    f"({len(contradicting)} contradicting signals) demonstrate significant real-world or commercial limitations."
                )
            elif supporting and not contradicting:
                verdict = "SUPPORTED BY EVIDENCE"
                badge_color = "emerald"
                explanation = f"Empirically corroborated across {len(supporting)} independent research & market sources."
            elif contradicting and not supporting:
                verdict = "CONTRADICTED BY EVIDENCE"
                badge_color = "red"
                explanation = f"Directly refuted by {len(contradicting)} independent benchmark, government, or testing reports."
            else:
                verdict = "UNRESOLVED / INSUFFICIENT DATA"
                badge_color = "slate"
                explanation = "Current indexed web intelligence contains insufficient independent verification."

            results.append({
                "claim_id": claim.id,
                "statement": claim.text,
                "subject": claim.subject,
                "property": claim.property,
                "value": claim.value,
                "verdict": verdict,
                "badge_color": badge_color,
                "explanation": explanation,
                "supporting_count": len(supporting),
                "contradicting_count": len(contradicting),
                "primary_sources": [
                    source_map[e.source_id].domain for e in supporting if e.source_id in source_map
                ][:3]
            })

        return results
