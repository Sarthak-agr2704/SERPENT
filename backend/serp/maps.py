from typing import List
from backend.models.schemas import Source
from backend.serp.client import SerpApiClient

class GoogleMapsService:
    def __init__(self, client: SerpApiClient):
        self.client = client

    def search(self, query: str, location: str = "Bengaluru", is_reserve: bool = False, force_demo: bool = False) -> List[Source]:
        """
        Executes Google Maps / Local Place Search via SerpApi for hotels, venues,
        transit hubs, and real-world spatial constraints.
        """
        return self.client.search(
            query=query,
            engine="google_maps",
            params={"q": f"{query} {location}".strip()},
            is_reserve=is_reserve,
            force_demo=force_demo
        )
