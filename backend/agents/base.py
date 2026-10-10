from abc import ABC, abstractmethod
from typing import Dict, Any, List
from backend.models.schemas import Investigation, AgentName

class BaseAgent(ABC):
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description

    @abstractmethod
    def run(self, investigation: Investigation, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute agent task and modify or enrich investigation state.
        """
        pass
