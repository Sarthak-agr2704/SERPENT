from typing import List, Dict
from collections import defaultdict
import re
from backend.models.schemas import Source, SourceLineage

WIRE_INDICATORS = [
    "reuters", "bloomberg", "pti", "ani", "press trust of india",
    "pr newswire", "businesswire", "globenewswire", "press release",
    "spokesperson stated", "announced in a release", "according to a statement"
]

class LineageDetector:
    @staticmethod
    def detect_lineage(sources: List[Source]) -> List[SourceLineage]:
        """
        Detects syndicated wire stories and corporate press release repetition.
        Clusters derivative articles into single independent lineage groups so
        20 articles echoing 1 press release aren't falsely counted as 20 independent proofs.
        """
        lineages: List[SourceLineage] = []
        if not sources:
            return lineages

        # Cluster by snippet similarity and wire markers
        clusters: Dict[str, List[Source]] = defaultdict(list)
        
        for source in sources:
            text = f"{source.title} {source.snippet}".lower()
            detected_wire = None
            for wire in WIRE_INDICATORS:
                if wire in text:
                    detected_wire = wire.title()
                    break

            if detected_wire:
                cluster_key = f"WIRE::{detected_wire}"
                clusters[cluster_key].append(source)
            else:
                # Key phrase signature (first 4 significant words)
                words = re.findall(r'\b[a-z]{4,}\b', text)
                sig = " ".join(words[:4]) if len(words) >= 4 else "general"
                clusters[sig].append(source)

        for key, clustered_sources in clusters.items():
            if len(clustered_sources) >= 2:
                # We found a lineage chain!
                is_wire = key.startswith("WIRE::")
                root_name = key.replace("WIRE::", "").title() if is_wire else clustered_sources[0].domain.title()
                
                lineage_id = f"lin-{len(lineages) + 1}"
                for s in clustered_sources:
                    s.lineage_id = lineage_id

                lineage = SourceLineage(
                    id=lineage_id,
                    root_source_title=clustered_sources[0].title,
                    root_origin=f"{root_name} Syndication" if is_wire else f"Primary Corporate Release ({root_name})",
                    derivative_source_ids=[s.id for s in clustered_sources],
                    articles_count=len(clustered_sources),
                    repeated_claim=clustered_sources[0].snippet[:120] + "...",
                    explanation=f"{len(clustered_sources)} separate publications cite the same underlying {root_name} wire/statement. SERPENT consolidates them into 1 independent evidence chain."
                )
                lineages.append(lineage)

        return lineages
