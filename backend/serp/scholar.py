from typing import List
from backend.models.schemas import Source
from backend.serp.client import SerpApiClient

class GoogleScholarService:
    def __init__(self, client: SerpApiClient):
        self.client = client

    def search(self, query: str, is_reserve: bool = False, force_demo: bool = False) -> List[Source]:
        """
        Executes Google Scholar Search via SerpApi for academic papers, peer-reviewed
        benchmarks, and scientific verification.
        """
        return self.client.search(
            query=query,
            engine="google_scholar",
            params={"hl": "en"},
            is_reserve=is_reserve,
            force_demo=force_demo
        )
