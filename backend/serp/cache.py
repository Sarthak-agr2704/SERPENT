import sqlite3
import json
import hashlib
import time
from typing import Optional, Dict, Any
from pathlib import Path
from backend.config import Config

class SerpCache:
    def __init__(self, db_path: Optional[Path] = None):
        self.db_path = db_path or (Config.DATA_DIR / "serp_cache.db")
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS search_cache (
                    cache_key TEXT PRIMARY KEY,
                    engine TEXT,
                    query TEXT,
                    response_json TEXT,
                    created_at REAL
                )
            """)
            conn.commit()

    @staticmethod
    def generate_key(engine: str, query: str, **params) -> str:
        param_str = json.dumps(params, sort_keys=True)
        raw = f"{engine.lower()}::{query.lower().strip()}::{param_str}"
        return hashlib.sha256(raw.encode("utf-8")).hexdigest()

    def get(self, cache_key: str) -> Optional[Dict[str, Any]]:
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT response_json, created_at FROM search_cache WHERE cache_key = ?",
                    (cache_key,)
                )
                row = cursor.fetchone()
                if row:
                    response_json, created_at = row
                    # Check TTL
                    if time.time() - created_at < Config.CACHE_TTL_SECONDS:
                        return json.loads(response_json)
        except Exception as e:
            print(f"[Cache Error] Read failed: {e}")
        return None

    def set(self, cache_key: str, engine: str, query: str, data: Dict[str, Any]):
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    """
                    INSERT OR REPLACE INTO search_cache (cache_key, engine, query, response_json, created_at)
                    VALUES (?, ?, ?, ?, ?)
                    """,
                    (cache_key, engine, query, json.dumps(data), time.time())
                )
                conn.commit()
        except Exception as e:
            print(f"[Cache Error] Write failed: {e}")

# Global cache instance
cache = SerpCache()
