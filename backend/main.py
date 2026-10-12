import os
import sys
from pathlib import Path

# Ensure the repository root directory is in sys.path so backend.* imports work
# regardless of whether the working directory is the repo root or the backend folder
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes import router as api_router
from backend.config import Config

app = FastAPI(
    title="SERPENT - Search Evidence & Research Platform for Exploration, Networked Thinking",
    description="Autonomous Multi-Agent Web Intelligence & Investigative Reasoning Platform powered by SerpApi",
    version="1.0.0"
)

# Support CORS for development and deployed frontend (Render, Vercel, Netlify, custom domain)
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
if allowed_origins_env == "*":
    allow_origins = ["*"]
    allow_credentials = False
else:
    allow_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]
    allow_credentials = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/")
def root():
    return {
        "platform": "SERPENT",
        "tagline": "Follow the search. Find the truth.",
        "description": "Every search result is a clue, not an answer.",
        "version": "1.0.0",
        "status": "operational",
        "serpapi_connected": Config.has_serpapi_key()
    }

@app.get("/health")
def health():
    """Root health check endpoint for Render and container orchestrators"""
    return {
        "status": "healthy",
        "platform": "SERPENT",
        "serpapi_connected": Config.has_serpapi_key(),
        "gemini_connected": Config.has_gemini_key()
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    reload = os.environ.get("ENVIRONMENT", "development").lower() == "development"
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=reload)
