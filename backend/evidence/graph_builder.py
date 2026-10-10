from typing import List, Dict, Any
from backend.models.schemas import Entity, EntityRelationship, Claim, EvidenceItem, Source, EvidenceRelationship

class GraphBuilder:
    @staticmethod
    def build_network_graph(
        entities: List[Entity],
        relationships: List[EntityRelationship],
        claims: List[Claim],
        evidence_items: List[EvidenceItem],
        sources: List[Source]
    ) -> Dict[str, Any]:
        """
        Constructs React Flow / SVG-compatible node-edge graph structures
        for the interactive Evidence Graph and Entity Network.
        """
        nodes: List[Dict[str, Any]] = []
        edges: List[Dict[str, Any]] = []
        source_map = {s.id: s for s in sources}

        # Category color tokens
        color_map = {
            "COMPANY": "#10b981",       # Emerald
            "PRODUCT": "#06b6d4",       # Cyan
            "TECHNOLOGY": "#8b5cf6",    # Purple
            "POLICY": "#f59e0b",        # Amber
            "LOCATION": "#3b82f6",      # Blue
            "ORGANIZATION": "#ec4899",  # Pink
            "RESEARCH_PAPER": "#6366f1" # Indigo
        }

        # 1. Entity Nodes (Left Zone: columns at x: 160 and x: 440)
        for i, ent in enumerate(entities):
            col = i % 2
            row = i // 2
            nodes.append({
                "id": ent.id,
                "type": "entityNode",
                "label": ent.name,
                "category": ent.category.value,
                "color": color_map.get(ent.category.value, "#10b981"),
                "attributes": ent.attributes,
                "radius": 44,
                "position": {"x": 160 + col * 260, "y": 90 + row * 150}
            })

        # 2. Entity-Entity Edges
        for rel in relationships:
            edges.append({
                "id": rel.id,
                "source": rel.source_entity_id,
                "target": rel.target_entity_id,
                "label": rel.relationship_type.replace("_", " "),
                "type": "entityEdge",
                "style": {"stroke": "#6ee7b7", "strokeWidth": 2}
            })

        # 3. Claim Nodes (Middle-Right Zone: columns at x: 860 and x: 1140 - safe 420px gap from entities)
        for j, claim in enumerate(claims):
            status_color = "#10b981" if claim.status == EvidenceRelationship.SUPPORTS else (
                "#ef4444" if claim.status == EvidenceRelationship.CONTRADICTS else "#f59e0b"
            )
            col = j % 2
            row = j // 2
            nodes.append({
                "id": claim.id,
                "type": "claimNode",
                "label": f"[{claim.property}] {claim.value}",
                "fullText": claim.text,
                "category": "CLAIM",
                "color": status_color,
                "status": claim.status.value,
                "radius": 48,
                "position": {"x": 860 + col * 280, "y": 100 + row * 160}
            })

        # 4. Evidence-Source Link Edges
        for k, ev in enumerate(evidence_items[:24]):  # cap to top 24 for UI clarity
            edge_color = "#10b981" if ev.relationship == EvidenceRelationship.SUPPORTS else (
                "#ef4444" if ev.relationship == EvidenceRelationship.CONTRADICTS else "#f59e0b"
            )
            edges.append({
                "id": ev.id,
                "source": ev.claim_id,
                "target": ev.source_id,
                "label": ev.relationship.value,
                "type": "evidenceEdge",
                "quote": ev.quote,
                "style": {
                    "stroke": edge_color,
                    "strokeWidth": 2,
                    "strokeDasharray": "5,5" if ev.relationship == EvidenceRelationship.CONTRADICTS else None
                }
            })

        # 5. Top Source Nodes (Far-Right Zone: x: 1420)
        for m, src in enumerate(sources[:8]):
            nodes.append({
                "id": src.id,
                "type": "sourceNode",
                "label": src.domain or src.engine,
                "fullTitle": src.title,
                "category": "SOURCE",
                "sourceType": src.source_type.value,
                "color": "#94a3b8",
                "radius": 40,
                "position": {"x": 1420, "y": 90 + m * 120}
            })

        # 6. Multi-Pass Collision Avoidance Relaxation Pass
        import math
        padding = 35.0
        for _ in range(50):
            for a_idx in range(len(nodes)):
                for b_idx in range(a_idx + 1, len(nodes)):
                    a = nodes[a_idx]
                    b = nodes[b_idx]
                    dx = b["position"]["x"] - a["position"]["x"]
                    dy = b["position"]["y"] - a["position"]["y"]
                    dist = math.hypot(dx, dy)
                    min_dist = a.get("radius", 45) + b.get("radius", 45) + padding
                    if dist < min_dist:
                        if dist == 0:
                            dx = 1.0
                            dist = 1.0
                        overlap = (min_dist - dist) * 0.5
                        nx = dx / dist
                        ny = dy / dist
                        a["position"]["x"] -= nx * overlap
                        a["position"]["y"] -= ny * overlap
                        b["position"]["x"] += nx * overlap
                        b["position"]["y"] += ny * overlap

        return {
            "nodes": nodes,
            "edges": edges,
            "counts": {
                "entities": len(entities),
                "claims": len(claims),
                "sources": len(sources),
                "edges": len(edges)
            }
        }
