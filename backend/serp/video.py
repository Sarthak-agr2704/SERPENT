from typing import List
from backend.models.schemas import Source, SourceType
from backend.serp.client import SerpApiClient

class VideoSearchService:
    def __init__(self, client: SerpApiClient):
        self.client = client

    def search(self, query: str, is_reserve: bool = False, force_demo: bool = False) -> List[Source]:
        """
        Executes YouTube / Video search via SerpApi for teardowns, test-drives,
        and visual evidence.
        """
        sources = self.client.search(
            query=f"{query} review test",
            engine="youtube",
            is_reserve=is_reserve,
            force_demo=force_demo
        )
        for s in sources:
            s.source_type = SourceType.UGC
        return sources

class FinanceSearchService:
    def __init__(self, client: SerpApiClient):
        self.client = client

    def search(self, query: str, is_reserve: bool = False, force_demo: bool = False) -> List[Source]:
        """
        Executes Google Finance / market search for corporate quarterly earnings,
        delivery numbers, and industry momentum (strictly market intelligence, not financial advice).
        """
        sources = self.client.search(
            query=f"{query} earnings deliveries market share",
            engine="google",
            is_reserve=is_reserve,
            force_demo=force_demo
        )
        return sources
