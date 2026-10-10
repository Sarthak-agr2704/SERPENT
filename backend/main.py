from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes import router as api_router
from backend.config import Config

app = FastAPI(
    title="SERPENT - Search Evidence & Research Platform for Exploration, Networked Thinking",
    description="Autonomous Multi-Agent Web Intelligence & Investigative Reasoning Platform powered by SerpApi",
    version="1.0.0"
)

# Enable CORS for local Next.js frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
