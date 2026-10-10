from typing import List
from backend.models.schemas import Source
from backend.serp.client import SerpApiClient

class GoogleShoppingService:
    def __init__(self, client: SerpApiClient):
        self.client = client

    def search(self, query: str, is_reserve: bool = False, force_demo: bool = False) -> List[Source]:
        """
        Executes Google Shopping Search via SerpApi for product comparisons,
        pricing, seller ratings, and real-world specs.
        """
        return self.client.search(
            query=query,
            engine="google_shopping",
            params={"gl": "in", "hl": "en"},
            is_reserve=is_reserve,
            force_demo=force_demo
        )
