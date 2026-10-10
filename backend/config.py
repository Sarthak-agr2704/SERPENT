import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env if present
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class Config:
    SERPAPI_KEY: str = os.getenv("SERPAPI_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    BASE_DIR = Path(__file__).resolve().parent.parent
    DATA_DIR = BASE_DIR / "database"
    CACHE_DIR = DATA_DIR / "cache"
    
    DEFAULT_SEARCH_BUDGET: int = 20
    CACHE_TTL_SECONDS: int = 86400 * 7  # 7 days for research caching
    SERPAPI_BASE_URL: str = "https://serpapi.com/search"
    
    # In-memory runtime override keys for users testing in the browser
    RUNTIME_SERPAPI_KEY: str = ""
    RUNTIME_GEMINI_API_KEY: str = ""
    
    @classmethod
    def get_serpapi_key(cls) -> str:
        return cls.RUNTIME_SERPAPI_KEY or cls.SERPAPI_KEY
        
    @classmethod
    def get_gemini_key(cls) -> str:
        return cls.RUNTIME_GEMINI_API_KEY or cls.GEMINI_API_KEY
        
    @classmethod
    def has_serpapi_key(cls) -> bool:
        key = cls.get_serpapi_key().strip()
        return bool(key) and key != "your_serpapi_key_here"
        
    @classmethod
    def has_gemini_key(cls) -> bool:
        key = cls.get_gemini_key().strip()
        return bool(key) and key != "your_gemini_key_here"

# Ensure cache dirs exist
Config.DATA_DIR.mkdir(parents=True, exist_ok=True)
Config.CACHE_DIR.mkdir(parents=True, exist_ok=True)
