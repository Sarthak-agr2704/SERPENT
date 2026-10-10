from typing import List, Dict, Any, Optional
from backend.models.schemas import Source
from backend.serp.client import SerpApiClient

class GoogleSearchService:
    def __init__(self, client: SerpApiClient):
        self.client = client

    def search(self, query: str, num: int = 8, is_reserve: bool = False, force_demo: bool = False) -> List[Source]:
        """
        Executes Google Web Search via SerpApi for discovery, primary source tracking,
        and general web intelligence.
        """
        params = {"num": num}
        return self.client.search(
            query=query,
            engine="google",
            params=params,
            is_reserve=is_reserve,
            force_demo=force_demo
        )
