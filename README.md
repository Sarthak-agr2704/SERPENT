# S.E.R.P.E.N.T.

### **Search Evidence & Research Platform for Exploration, Networked Thinking**

> **Tagline:** *"Follow the search. Find the truth."*  
> **Core Concept:** *"Every search result is a clue, not an answer."*

---

## 1. What SERPENT Is

**SERPENT** is an autonomous multi-agent web intelligence and investigative reasoning platform. It transforms traditional, passive web searching into an active AI-driven intelligence organization. 

Rather than functioning as a standard chatbot or wrapping a search box with a superficial LLM summary, SERPENT is engineered around **multi-source search, forensic investigation, structured claim extraction, source lineage detection, and networked reasoning**.

When given a complex real-world question, SERPENT:
1. Decomposes it into specialized research tasks.
2. Uses **SerpApi** as its real-time web intelligence and perception layer across multiple search engines and verticals (Google Organic, News, Scholar, Shopping, Maps, Video, Finance).
3. Deploys an orchestrator-directed swarm of specialized agents.
4. Traces relationships between entities, claims, and empirical evidence.
5. Flags contradictions and syndicated press release repetition.
6. Solves real-world constraints for missions and competitive market war rooms.
7. Generates an executive-grade, evidence-backed intelligence report.

---

## 2. The Problem

Traditional web search is broken for complex, high-stakes investigations:
* **The Manual Labor Trap:** A user enters a query, gets 10 blue links, opens 20 tabs, and must personally synthesize findings, evaluate credibility, and detect factual conflicts.
* **The "Echo Chamber" Illusion:** 25 news sites frequently copy-paste the exact same wire release. Users and naive AI chatbots treat this as "25 independent confirmations," when it is merely 1 single claim syndicated 25 times.
* **The Chatbot Hallucination Trap:** Generic LLM search chatbots summarize a single search query with unsupported certainty, inventing citations or claiming causality without empirical evidence.
* **Search Blindspots:** Real-world questions span academic research, current news, regulatory filings, product pricing, and geographic constraints simultaneously. Single-engine queries miss the complete picture.

---

## 3. The Solution

SERPENT replaces the passive user workflow with an autonomous investigative swarm:

```
User Question
    ↓
Intent Detection & Query Decomposition
    ↓
Agent Router & Search Budget Allocation
    ↓
SerpApi Multi-Engine Perception Layer (Google, News, Scholar, Shopping, Maps)
    ↓
Result Normalization & Source Lineage Clustering
    ↓
Structured Claim & Entity Extraction
    ↓
Contradiction Detection & Multi-Agent Debate
    ↓
Reserve Search Budget / Second-Order "Go Deeper" Trail
    ↓
Interactive Evidence Graph & Entity Network
    ↓
Synthesis Engine & Executive Intelligence Report
    ↓
Actionable Mission Plans / What-If Simulations
```

---

## 4. Why Search Alone Is Insufficient

A raw search result is merely raw telemetry. It lacks:
1. **Ontological Structure:** Search engines return unstructured HTML snippets, not structured triples (`subject`, `property`, `value`).
2. **Lineage Awareness:** Search engines cannot discern whether an article is independent journalism or a syndicated PR wire.
3. **Causal Reasoning:** Search results do not separate empirical evidence from promotional claims.
4. **Constraint Optimization:** Search engines cannot compute multi-variable constraints (e.g., lodging proximity, transit schedules, and budget buffers).

---

## 5. System Architecture

SERPENT uses a clean, production-grade decoupled monorepo:

```
SERPENT/
│
├── backend/
│   ├── api/             # FastAPI REST endpoints & route handlers
│   ├── agents/          # Specialized agent swarm & intent analyzer
│   ├── orchestrator/    # Autonomous investigation orchestrator & replay recorder
│   ├── serp/            # SerpApi service layer (Google, News, Scholar, Shopping, Maps, Cache)
│   ├── evidence/        # Claim extractor, Lineage detector, Contradiction detector, Graph builder
│   ├── intelligence/    # 6 Core Pillar engines (Truth, Detective, War Room, Time Machine, Mission Control, Synthesis)
│   ├── models/          # Pydantic data schemas & enums
│   ├── config.py        # Environment variables & key manager
│   └── main.py          # FastAPI application entrypoint
│
├── frontend/
│   ├── app/             # Next.js App Router (page.tsx, layout.tsx, globals.css)
│   ├── components/      # UI components (Header, SwarmStatus, SerpentTrail, EvidenceGraph, WarRoom, TimeMachine, MissionControl)
│   ├── lib/             # API client & data fetchers
│   └── types/           # TypeScript data interfaces
│
├── database/            # SQLite persistent search cache (serp_cache.db)
├── tests/               # Pytest suite & live HTTP integration tests
├── .env.example         # Environment variable template
├── docker-compose.yml   # Multi-container orchestration
├── backend.Dockerfile   # Python FastAPI container
└── README.md
```

---

## 6. The Six Core Pillars

### **Pillar 1: Autonomous Search + Multi-Agent Swarm**
An orchestrator coordinates specialized agents:
* **Intent Analyzer Agent:** Classifies question intent and generates focused, atomic search queries.
* **Discovery Agent:** Sweeps organic Google search.
* **News Agent:** Retrieves time-sensitive developments from Google News.
* **Research/Scholar Agent:** Scans Google Scholar for peer-reviewed papers.
* **Market Intelligence Agent:** Evaluates industry momentum and regulatory tariffs.
* **Commerce Agent:** Compares Google Shopping prices and merchant availability.
* **Local/Maps Agent:** Analyzes Google Maps spatial venues, ratings, and travel distances.
* **Detective Agent:** Follows second-order entity hops and causal clues.
* **Verification Agent:** Extracts claims, measures source authority, and computes confidence.
* **Timeline Agent:** Reconstructs chronological milestones.
* **Mission Planning Agent:** Solves hard and soft logistics constraints.
* **Synthesis Agent:** Produces the executive-grade intelligence report.

### **Pillar 2: Truth Engine (Fact Verification)**
Converts statements into structured ontological claims:
* `subject`: Company X
* `object`: battery
* `property`: range
* `value`: 1,000 km
* `time`: current

Distinguishes between **Primary, Secondary, Independent, Academic, Government, Company, News, and UGC** sources. Classifies evidence into **SUPPORTS, CONTRADICTS, PARTIALLY SUPPORTS, NEUTRAL, and IRRELEVANT**.

### **Pillar 3: Digital Detective (Deep Investigation & Serpent Trail)**
Implements **Second-Order Search**:
```
Company X → Founder → Previous Venture → Patent → Supplier → Policy → Competitor
```
Allows users to click **[GO DEEPER]**, **[WHY?]**, or **[FOLLOW ENTITY]** on any clue to launch a secondary investigation without losing context.

### **Pillar 4: War Room (Market & Competitive Intelligence)**
* **Competitive Radar:** Multi-dimensional benchmark radar chart (Product Breadth, Price Competitiveness, Market Momentum, Geographic Expansion, Technology Edge, Customer Signals).
* **Head-to-Head Architectural Matrix:** Direct spec and strategy comparison (e.g., BYD vs Tata Motors vs Mahindra).
* **"What Changed?":** Chronological delta of recent price cuts, policy schemes, and platform transitions.
* *Note: Strictly strategic intelligence. Never provides personalized investment or financial trading advice.*

### **Pillar 5: Internet Time Machine (Timeline Engine)**
* Chronological reconstruction across annual eras (2022 → 2023 → 2024 → 2025 → 2026).
* Milestone cards detailing structural impacts with *"Why did this happen?"* drilldowns.
* **Compare Periods Diff:** Dynamic side-by-side comparison of 2024 vs 2026 identifying what changed, what remained, price trends, and new technologies.

### **Pillar 6: Mission Control (Real-World Planning & What-If Simulator)**
* Extracts: Objective, Location, Headcount, Budget, Duration, Constraints.
* Evaluates options against **Hard Constraints** (budget ceiling, venue proximity, capacity) and **Soft Constraints** (ratings, comfort).
* Explains why an option was selected (e.g., Plan Alpha PASSES at ₹21,500, Plan Bravo FAILS budget & distance).
* **Dynamic What-If Engine:** Recalculates variables under hypotheticals (*"What if the budget drops to ₹25,000?"*, *"What if two more students join?"*, *"What if prices fall 15%?"*) clearly labeled as `SCENARIO / SIMULATION`.

---

## 7. Deep SerpApi Integration

> *"SerpApi acts as SERPENT's real-time perception layer. Rather than using a single search query, SERPENT dynamically routes research tasks across relevant search verticals and feeds the resulting structured evidence into its multi-agent investigation pipeline."*

### Supported SerpApi Verticals:
1. **Google Search (`engine="google"`):** High-level discovery, company profiles, and knowledge graphs.
2. **Google News (`engine="google_news"`):** Real-time corporate announcements, policy shifts, and recent developments.
3. **Google Scholar (`engine="google_scholar"`):** Scientific papers, battery chemistry studies, and peer-reviewed dyno benchmarks.
4. **Google Shopping (`engine="google_shopping"`):** Commercial price points, merchant ratings, and product specifications.
5. **Google Maps (`engine="google_maps"`):** Venues, student lodges, coordinates, distances, and spatial verification.
6. **YouTube/Video (`engine="youtube"`):** Teardown demonstrations, expert reviews, and visual evidence.

### Search Budget Manager & Query Caching:
* **Budget Tracking:** Enforces a configurable query ceiling (e.g., 20 searches) with a dedicated **reserve budget** (2 queries) unlocked only when factual contradictions arise.
* **Persistent SQLite Cache (`serp_cache.db`):** Caches identical queries across `(engine, query, params)` using SHA-256 hashes with 7-day TTL, preventing duplicate API credit usage.
* **Graceful Demo Mode:** When `SERPAPI_KEY` is not provided, SERPENT seamlessly runs on high-fidelity, verified real-world pre-indexed intelligence for all hackathon demo scenarios, explicitly tagged `[Demo Mode Active]`.

---

## 8. Source Lineage: Combating Wire Repetition

When 20 different digital news publishers republish the exact same Reuters wire story or corporate press release:
* Traditional AI counts this as 20 separate confirmations.
* **SERPENT clusters them into 1 single source lineage chain.**
* The evidence confidence scorer treats syndicated copies as a single independent source.

---

## 9. Contradiction Detection & Multi-Agent Debate

When indexed sources conflict (e.g., marketing claims of 1,000 km range vs laboratory dyno tests showing 680 km at highway speeds):
1. SERPENT flags: **`DISAGREEMENT DETECTED`**.
2. Synthesizes conflicting claims into structured debate notes.
3. Unlocks the **Reserve Search Budget** to deploy targeted queries.
4. Marks the verdict as **PARTIALLY SUPPORTED** or **UNRESOLVED**, transparently explaining the empirical discrepancy.

---

## 10. Technology Stack

* **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Recharts (Radar charts), Framer Motion.
* **Backend:** Python 3.13, FastAPI, Uvicorn, Pydantic v2, HTTPX, Requests, BeautifulSoup4, SQLite3.
* **Testing:** Pytest (12 automated unit and integration tests).
* **Containerization:** Docker, Docker Compose.

---

## 11. Quickstart & Installation

### Prerequisites:
* Python 3.11+
* Node.js 18+ and npm

### 1. Clone & Setup Backend:
```bash
# Clone the repository
git clone https://github.com/your-username/SERPENT.git
cd SERPENT

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# (Optional) Edit .env and paste your SERPAPI_KEY and GEMINI_API_KEY
```

### 2. Setup Frontend:
```bash
cd frontend
npm install --legacy-peer-deps
cd ..
```

### 3. Run the Application:

**Terminal 1 (Backend):**
```bash
uvicorn backend.main:app --port 8000 --host 0.0.0.0 --reload
```
*Backend runs on: `http://localhost:8000` (API documentation at `http://localhost:8000/docs`)*

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev -- -p 3000
```
*Frontend runs on: `http://localhost:3000`*

---

### Deploy Backend to Render:

#### Option A: 1-Click Blueprint Deploy
1. Push your repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com/), click **New +** > **Blueprint**.
3. Connect your repository. Render automatically reads [`render.yaml`](file:///render.yaml) and configures the service.
4. (Optional) Provide your `SERPAPI_KEY` and `GEMINI_API_KEY` in the environment variables prompt.

#### Option B: Manual Web Service
1. In Render, select **New +** > **Web Service**.
2. Connect your repository.
3. Configure settings:
   * **Language / Runtime:** `Python 3`
   * **Build Command:** `pip install -r requirements.txt`
   * **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   * **Health Check Path:** `/health`
4. Under **Environment Variables**, add:
   * `PYTHON_VERSION`: `3.11.9`
   * `ALLOWED_ORIGINS`: `*` (or your frontend deployment URL)
   * `SERPAPI_KEY`: *(your SerpApi key)*
   * `GEMINI_API_KEY`: *(optional Gemini key)*

---

## 12. Running Tests

Run the full automated test suite covering all 6 pillars and end-to-end scenarios:
```bash
# Run pytest test suite
python -m pytest tests/test_serpent_core.py -v

# Run live HTTP API integration test
python tests/test_live_api.py
```

---

## 13. Featured Hackathon Demo Scenarios

SERPENT includes 4 pre-configured, one-click demo investigations:

| Scenario | Mode | Key Discovery Vector |
| :--- | :--- | :--- |
| **"Is BYD becoming a serious threat to Indian EV manufacturers?"** | War Room (Pillar 4) | 70-100% CBU tariffs, $1B JV rejection, Tata ~68% share, Blade 2.0 tech gap |
| **"Is the claim that this new battery doubles EV range true?"** | Truth Engine (Pillar 2) | 1,000 km achieved only at 40 km/h; drops 32% on highway; Nature Energy degradation |
| **"Plan a 3-day robotics competition trip to Bengaluru for 4 students under ₹30,000"** | Mission Control (Pillar 6) | Mathikere lodge (1.1 km, ₹21,500) vs Indiranagar hostel (₹34,100, 8.5 km, FAILS) |
| **"How did this company's competitive position change from 2023 to 2026?"** | Time Machine (Pillar 5) | Era shifts from FAME subsidies to native born-EV skateboards and 2024 vs 2026 diff |

---

## 14. Limitations & Ethical Standards

* **No Financial Advice:** The War Room provides market research and competitive telemetry only. It never gives stock buy/sell advice.
* **Transparent Fallbacks:** In the absence of an active SerpApi key, SERPENT transparently reports `[Demo Mode Active]` rather than fabricating search citations.
* **Honest Uncertainty:** When empirical evidence is inconclusive, SERPENT outputs `UNRESOLVED` rather than hallucinating certainty.

---

## 15. Future Roadmap

* **Multimodal Visual Evidence:** Automated OCR and chart extraction from academic PDF attachments.
* **Persistent Knowledge Graph:** Long-term vector and graph memory for institutional intelligence teams.
* **Webhook Alerting:** Continuous background monitoring that notifies researchers when a verified claim experiences a contradictory market development.
