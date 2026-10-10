import httpx
import time
from typing import List, Dict, Any, Optional
from urllib.parse import urlparse
from backend.config import Config
from backend.serp.cache import cache
from backend.serp.demo_data import get_demo_results
from backend.models.schemas import Source, SourceType

class SerpApiClient:
    def __init__(self, budget: int = Config.DEFAULT_SEARCH_BUDGET, runtime_key: Optional[str] = None):
        self.budget = budget
        self.reserve_budget = 2
        self.searches_conducted = 0
        self.runtime_key = runtime_key
        self.call_history: List[Dict[str, Any]] = []

    def get_effective_key(self) -> str:
        if self.runtime_key and self.runtime_key.strip():
            return self.runtime_key.strip()
        return Config.get_serpapi_key()

    def has_budget(self, is_reserve: bool = False) -> bool:
        allowed = self.budget if not is_reserve else (self.budget + self.reserve_budget)
        return self.searches_conducted < allowed

    def search(
        self,
        query: str,
        engine: str = "google",
        params: Optional[Dict[str, Any]] = None,
        is_reserve: bool = False,
        force_demo: bool = False
    ) -> List[Source]:
        """
        Executes a search via SerpApi with caching, budget checking, normalization,
        and graceful demo fallback.
        """
        if not self.has_budget(is_reserve=is_reserve):
            print(f"[Search Budget Reached] Skipping search: '{query}' ({engine})")
            return []

        search_params = params or {}
        cache_key = cache.generate_key(engine, query, **search_params)
        
        # 1. Check persistent cache
        cached_data = cache.get(cache_key)
        if cached_data:
            print(f"[SerpCache HIT] {engine}: '{query}'")
            return self._normalize_results(cached_data, engine, query, is_demo=cached_data.get("_is_demo", False))

        api_key = self.get_effective_key()
        sources: List[Source] = []
        is_demo = False

        # 2. If no API key or forced demo, use realistic demo data
        if not api_key or force_demo:
            is_demo = True
            raw_results = get_demo_results(engine, query)
            payload = {"raw_results": raw_results, "_is_demo": True}
            cache.set(cache_key, engine, query, payload)
            sources = self._normalize_results(payload, engine, query, is_demo=True)
            self.searches_conducted += 1
            self.call_history.append({
                "engine": engine,
                "query": query,
                "cached": False,
                "demo": True,
                "results_count": len(sources),
                "timestamp": time.time()
            })
            return sources

        # 3. Live SerpApi execution
        try:
            req_params = {
                "api_key": api_key,
                "engine": engine,
                "q": query,
                **search_params
            }
            # Engine-specific param tweaks
            if engine in ["google_news", "news"]:
                req_params["engine"] = "google_news"
            elif engine in ["google_scholar", "scholar"]:
                req_params["engine"] = "google_scholar"
            elif engine in ["google_shopping", "shopping"]:
                req_params["engine"] = "google_shopping"
            elif engine in ["google_maps", "maps"]:
                req_params["engine"] = "google_maps"

            with httpx.Client(timeout=12.0) as client:
                resp = client.get(Config.SERPAPI_BASE_URL, params=req_params)
                if resp.status_code == 200:
                    data = resp.json()
                    data["_is_demo"] = False
                    cache.set(cache_key, engine, query, data)
                    sources = self._normalize_results(data, engine, query, is_demo=False)
                    self.searches_conducted += 1
                    self.call_history.append({
                        "engine": engine,
                        "query": query,
                        "cached": False,
                        "demo": False,
                        "results_count": len(sources),
                        "timestamp": time.time()
                    })
                    return sources
                else:
                    print(f"[SerpApi Error] Status {resp.status_code}: {resp.text[:200]}")
                    # Fallback to demo data on API error so application never crashes
                    raw_results = get_demo_results(engine, query)
                    payload = {"raw_results": raw_results, "_is_demo": True}
                    sources = self._normalize_results(payload, engine, query, is_demo=True)
                    self.searches_conducted += 1
                    return sources

        except Exception as ex:
            print(f"[SerpApi Exception] {ex}. Using graceful fallback.")
            raw_results = get_demo_results(engine, query)
            payload = {"raw_results": raw_results, "_is_demo": True}
            sources = self._normalize_results(payload, engine, query, is_demo=True)
            self.searches_conducted += 1
            return sources

    def _determine_source_type(self, domain: str, engine: str) -> SourceType:
        d = domain.lower()
        if any(g in d for g in [".gov", ".nic.in", "pib.gov"]):
            return SourceType.GOVERNMENT
        elif any(a in d for a in [".edu", ".ac.in", "nature.com", "ieee.org", "arxiv.org", "sciencedirect.com"]):
            return SourceType.ACADEMIC
        elif any(n in d for n in ["reuters.com", "bloomberg.com", "financialexpress.com", "economictimes", "autocar", "thehindu", "timesofindia", "livemint"]):
            return SourceType.NEWS
        elif any(c in d for c in ["bydauto", "tatamotors", "mahindra.com", "tesla.com"]):
            return SourceType.COMPANY
        elif any(u in d for u in ["reddit.com", "x.com", "twitter.com", "youtube.com", "forum"]):
            return SourceType.UGC
        elif engine == "google_scholar":
            return SourceType.ACADEMIC
        elif engine == "google_news":
            return SourceType.NEWS
        return SourceType.INDEPENDENT

    def _normalize_results(self, data: Dict[str, Any], engine: str, query: str, is_demo: bool = False) -> List[Source]:
        sources: List[Source] = []

        # Case 1: Custom demo format
        if "raw_results" in data:
            for item in data["raw_results"]:
                link = item.get("link", "https://example.com/source")
                parsed_domain = urlparse(link).netloc or "web.intelligence"
                stype = self._determine_source_type(parsed_domain, engine)
                sources.append(Source(
                    title=item.get("title", "Untitled Discovery"),
                    url=link,
                    snippet=item.get("snippet", item.get("address", item.get("price", "No details"))),
                    engine=engine,
                    query=query,
                    source_type=stype,
                    domain=parsed_domain,
                    published_date=item.get("date"),
                    is_demo=is_demo
                ))
            return sources

        # Case 2: Organic google search results
        organic = data.get("organic_results", [])
        for item in organic:
            link = item.get("link", "")
            domain = urlparse(link).netloc
            stype = self._determine_source_type(domain, engine)
            sources.append(Source(
                title=item.get("title", "Search Discovery"),
                url=link,
                snippet=item.get("snippet", ""),
                engine=engine,
                query=query,
                source_type=stype,
                domain=domain,
                published_date=item.get("date"),
                is_demo=is_demo
            ))

        # Case 3: Google News results
        news_results = data.get("news_results", [])
        for item in news_results:
            link = item.get("link", "")
            domain = urlparse(link).netloc
            sources.append(Source(
                title=item.get("title", "News Item"),
                url=link,
                snippet=item.get("snippet", ""),
                engine="google_news",
                query=query,
                source_type=SourceType.NEWS,
                domain=domain,
                published_date=item.get("date"),
                is_demo=is_demo
            ))

        # Case 4: Google Scholar results
        scholar_results = data.get("organic_results", []) if "scholar" in engine else []
        if "scholar" in engine:
            for item in scholar_results:
                link = item.get("link", "")
                domain = urlparse(link).netloc
                sources.append(Source(
                    title=item.get("title", "Academic Paper"),
                    url=link,
                    snippet=item.get("snippet", ""),
                    engine="google_scholar",
                    query=query,
                    source_type=SourceType.ACADEMIC,
                    domain=domain,
                    published_date=item.get("publication_info", {}).get("summary"),
                    is_demo=is_demo
                ))

        # Case 5: Shopping / Local
        shopping_results = data.get("shopping_results", [])
        for item in shopping_results:
            sources.append(Source(
                title=item.get("title", "Product Comparison"),
                url=item.get("link", ""),
                snippet=f"Price: {item.get('price', 'N/A')} - Merchant: {item.get('merchant', 'N/A')} - Rating: {item.get('rating', 'N/A')}",
                engine="google_shopping",
                query=query,
                source_type=SourceType.INDEPENDENT,
                domain=urlparse(item.get("link", "")).netloc or "shopping.google.com",
                is_demo=is_demo
            ))

        # Case 6: Local results (Google Maps)
        local_results = data.get("local_results", [])
        for item in local_results:
            sources.append(Source(
                title=item.get("title", "Local Place"),
                url=item.get("links", {}).get("website", ""),
                snippet=f"Address: {item.get('address', 'N/A')} - Rating: {item.get('rating', 'N/A')} ({item.get('reviews', 0)} reviews)",
                engine="google_maps",
                query=query,
                source_type=SourceType.INDEPENDENT,
                domain="maps.google.com",
                is_demo=is_demo
            ))

        return sources
