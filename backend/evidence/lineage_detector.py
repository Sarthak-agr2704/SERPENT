from typing import List, Dict, Optional
from collections import defaultdict
import re
from backend.models.schemas import Source, SourceLineage

# Wire indicators with word boundaries and canonical casing
WIRE_RULES = [
    (r"\breuters\b", "Reuters"),
    (r"\bbloomberg\b", "Bloomberg"),
    (r"\bpress trust of india\b|\bpti\b", "PTI"),
    (r"\basian news international\b|\bani\b", "ANI"),
    (r"\bassociated press\b|\bap news\b", "AP"),
    (r"\bpr newswire\b", "PR Newswire"),
    (r"\bbusinesswire\b", "Business Wire"),
    (r"\bglobenewswire\b", "GlobeNewswire"),
    (r"\bpress release\b|\bmedia release\b", "Press Release"),
    (r"\bspokesperson stated\b|\bannounced in a release\b|\baccording to a statement\b", "Corporate Statement"),
]

def clean_publisher_name(domain: str) -> str:
    """Formats raw web domains into clean, professional publication / brand names."""
    if not domain:
        return "Corporate Publisher"
    d = re.sub(r'^(?:https?://)?(?:www\.)?', '', domain.lower().strip())
    d = d.split('/')[0]
    base = re.sub(r'\.(?:com|org|net|in|co\.[a-z]{2}|[a-z]{2,4})$', '', d)
    parts = base.split('.')
    main_part = parts[-1] if len(parts) > 1 and parts[-1] not in ["corp", "inc", "ltd"] else parts[0]

    brand_map = {
        "jdpower": "J.D. Power",
        "honda": "Honda",
        "tatamotors": "Tata Motors",
        "byd": "BYD",
        "mahindra": "Mahindra",
        "autocarindia": "Autocar India",
        "autocar": "Autocar",
        "reuters": "Reuters",
        "bloomberg": "Bloomberg",
        "economictimes": "Economic Times",
        "livemint": "LiveMint",
        "moneycontrol": "Moneycontrol",
        "timesofindia": "Times of India",
        "financialexpress": "Financial Express",
        "businesstoday": "Business Today",
        "siam": "SIAM",
    }
    for k, v in brand_map.items():
        if k in d:
            return v
    return main_part.title()

def extract_meaningful_claim(sources: List[Source]) -> str:
    """
    Finds the most complete and informative sentence across clustered sources.
    Guarantees the result is never empty or an uninformative ellipsis like '...'.
    """
    candidates: List[str] = []
    
    # Check snippets first
    for s in sources:
        snip = (s.snippet or "").strip()
        # Clean off leading/trailing ellipses and brackets
        cleaned = re.sub(r'^[\.·\s\-–—]+', '', snip)
        cleaned = re.sub(r'[\.·\s\-–—]+$', '', cleaned).strip()
        if len(cleaned) >= 30 and not all(c in '. ' for c in cleaned):
            candidates.append(cleaned)

    # Check titles as fallback
    if not candidates:
        for s in sources:
            t = (s.title or "").strip()
            cleaned = re.sub(r'^[\.·\s\-–—]+', '', t)
            cleaned = re.sub(r'[\.·\s\-–—]+$', '', cleaned).strip()
            if len(cleaned) >= 20 and not all(c in '. ' for c in cleaned):
                candidates.append(cleaned)

    if not candidates:
        return f"Syndicated announcement reported across {len(sources)} separate digital publications."

    # Pick candidate with best balance of length and completeness
    best = max(candidates, key=len)

    # Format cleanly up to 140 chars at word boundary
    if len(best) > 140:
        cutoff = best[:140].rfind(' ')
        best = (best[:cutoff] if cutoff > 40 else best[:140]).rstrip(' ,;:-') + "..."
    else:
        best = best.rstrip(' ,;:-')

    return best


class LineageDetector:
    @staticmethod
    def detect_lineage(sources: List[Source]) -> List[SourceLineage]:
        """
        Detects syndicated wire stories and corporate press release repetition.
        Clusters derivative articles into single independent lineage groups so
        multiple articles echoing 1 press release aren't falsely counted as independent proofs.
        """
        lineages: List[SourceLineage] = []
        if not sources:
            return lineages

        # 1. Cluster by detected wire or shared publisher domain
        clusters: Dict[str, List[Source]] = defaultdict(list)
        
        for source in sources:
            text = f"{source.title} {source.snippet}".lower()
            detected_wire: Optional[str] = None

            # Word-bounded matching to prevent false positives (e.g. 'competition' matching 'pti')
            for pattern, canonical_name in WIRE_RULES:
                if re.search(pattern, text, flags=re.IGNORECASE):
                    detected_wire = canonical_name
                    break

            if detected_wire:
                cluster_key = f"WIRE::{detected_wire}"
                clusters[cluster_key].append(source)
            elif source.domain:
                # Group by canonical publisher to avoid duplicate cards for same domain
                pub_clean = clean_publisher_name(source.domain)
                cluster_key = f"DOMAIN::{pub_clean}"
                clusters[cluster_key].append(source)
            else:
                words = re.findall(r'\b[a-z]{4,}\b', text)
                if len(words) >= 5:
                    sig = " ".join(words[:5])
                    clusters[f"PHRASE::{sig}"].append(source)

        # 2. Convert qualified clusters (>= 2 sources) into SourceLineage objects
        seen_origins = set()

        for key, clustered_sources in clusters.items():
            if len(clustered_sources) >= 2:
                is_wire = key.startswith("WIRE::")
                is_domain = key.startswith("DOMAIN::")
                
                if is_wire:
                    wire_name = key.replace("WIRE::", "")
                    root_origin = f"{wire_name} Syndication"
                    explanation = f"{len(clustered_sources)} separate publications cite the same underlying {wire_name} wire/statement. SERPENT consolidates them into 1 independent evidence chain."
                elif is_domain:
                    pub_name = key.replace("DOMAIN::", "")
                    root_origin = f"Primary Corporate Release ({pub_name})"
                    explanation = f"{len(clustered_sources)} separate publications cite the same underlying {pub_name} press release/data. SERPENT consolidates them into 1 independent evidence chain."
                else:
                    pub_name = clean_publisher_name(clustered_sources[0].domain)
                    root_origin = f"Syndicated Release ({pub_name})"
                    explanation = f"{len(clustered_sources)} separate publications repeat identical syndicated phrasing. SERPENT consolidates them into 1 independent evidence chain."

                # Avoid duplicate clusters with identical origin titles
                if root_origin in seen_origins:
                    continue
                seen_origins.add(root_origin)

                lineage_id = f"lin-{len(lineages) + 1}"
                for s in clustered_sources:
                    s.lineage_id = lineage_id

                repeated_claim = extract_meaningful_claim(clustered_sources)

                lineage = SourceLineage(
                    id=lineage_id,
                    root_source_title=clustered_sources[0].title,
                    root_origin=root_origin,
                    derivative_source_ids=[s.id for s in clustered_sources],
                    articles_count=len(clustered_sources),
                    repeated_claim=repeated_claim,
                    explanation=explanation
                )
                lineages.append(lineage)

        return lineages
