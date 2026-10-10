from typing import Dict, Any, List
import re

DEMO_SCENARIO_RESULTS: Dict[str, Dict[str, Any]] = {
    "byd_ev": {
        "google": [
            {
                "title": "BYD India: Electric Passenger Vehicles, Atto 3, Seal & eMax 7",
                "link": "https://www.bydautoindia.com/",
                "snippet": "BYD India offers premium electric passenger vehicles including the Atto 3 SUV, Seal luxury sedan, and eMax 7 MPV. Expanding dealership network across 26 cities in India.",
                "source": "BYD Official"
            },
            {
                "title": "Tata Motors Dominates India's EV Market with Over 68% Share",
                "link": "https://www.autocarpro.in/news/tata-motors-ev-market-share-2025-report",
                "snippet": "Tata Motors maintains a dominant position in India's electric passenger car market with models like Nexon.ev, Punch.ev, and Tiago.ev, capturing roughly 68% market share.",
                "source": "Autocar Professional"
            },
            {
                "title": "Mahindra INGLO Platform & BE 6e Rollout Challenges Global Rivals",
                "link": "https://www.financialexpress.com/auto/mahindra-be6e-xev9e-market-impact",
                "snippet": "Mahindra & Mahindra's aggressive launch of the BE 6e and XEV 9e electric SUVs aims directly at mid-tier luxury EV competitors, leveraging localized battery packaging.",
                "source": "Financial Express"
            },
            {
                "title": "India Rejects BYD's $1 Billion EV Manufacturing Proposal Citing Security",
                "link": "https://www.reuters.com/business/autos-transportation/india-rejects-byd-investment-proposal-2023",
                "snippet": "India's government denied security clearance for BYD's proposed $1 billion investment to build electric cars and batteries in partnership with Megha Engineering.",
                "source": "Reuters"
            },
            {
                "title": "Import Tariffs of 70-100% Constrain BYD's Mass-Market Strategy in India",
                "link": "https://economictimes.indiatimes.com/industry/auto/ev-import-tariffs-impact-byd",
                "snippet": "Due to high customs duties on Completely Built Units (CBU), BYD vehicles are priced above ₹25 Lakh, preventing direct competition with Tata's sub-₹15 Lakh mass vehicles.",
                "source": "The Economic Times"
            }
        ],
        "news": [
            {
                "title": "BYD Unveils Ultra-Fast Blade Battery 2.0 with 10-Minute Rapid Charge",
                "link": "https://www.bloomberg.com/news/articles/byd-blade-battery-gen2-announcement",
                "snippet": "BYD has announced its second-generation Blade Battery offering higher volumetric density and sub-10 minute 10-80% fast charging, putting technological pressure on competitors.",
                "date": "2 days ago",
                "source": "Bloomberg"
            },
            {
                "title": "Tata Motors Cuts EV Prices by Up to ₹1.2 Lakh to Counter Influx",
                "link": "https://timesofindia.indiatimes.com/auto/news/tata-ev-price-drop-competition",
                "snippet": "In response to tightening competition and declining battery cell costs, Tata Motors has trimmed prices across the Nexon.ev and Punch.ev lineups.",
                "date": "1 week ago",
                "source": "Times of India"
            },
            {
                "title": "Government Evaluates Reduced Tariffs for Foreign EV Makers Investing $500M",
                "link": "https://www.livemint.com/industry/india-new-ev-policy-concessional-duty",
                "snippet": "India's updated EV policy offers reduced 15% import tariffs for global automakers committing minimum $500M in local manufacturing over three years.",
                "date": "3 weeks ago",
                "source": "LiveMint"
            }
        ],
        "shopping": [
            {
                "title": "Tata Nexon.ev Empowered Plus (40.5 kWh)",
                "price": "₹16,99,000",
                "merchant": "Tata Motors Dealership",
                "rating": 4.4,
                "reviews": 1280
            },
            {
                "title": "BYD Atto 3 Dynamic (49.92 kWh)",
                "price": "₹24,99,000",
                "merchant": "BYD India Authorized",
                "rating": 4.6,
                "reviews": 340
            },
            {
                "title": "Mahindra BE 6e Pack ONE (59 kWh)",
                "price": "₹18,90,000",
                "merchant": "Mahindra Prime",
                "rating": 4.5,
                "reviews": 215
            }
        ],
        "scholar": [
            {
                "title": "Total Cost of Ownership and Battery Degradation in Emerging EV Markets: A Case Study of India",
                "authors": "R. Sharma, S. Banerjee, V. K. Iyer",
                "publication": "Journal of Cleaner Production, 2024",
                "snippet": "Analysis shows that while LFP chemistry (BYD Blade) offers superior thermal stability in tropical climates, localized manufacturing subsidies determine consumer adoption rate over chemical efficiency.",
                "citations": 42
            }
        ]
    },
    "battery_claim": {
        "google": [
            {
                "title": "Solid-State Battery Developer Claims 1,000 km Range on Single Charge",
                "link": "https://www.techcrunch.com/2024/08/solid-state-battery-1000km-range-claims",
                "snippet": "Startup QuantumCharge issued a press release claiming their new semi-solid pouch cell achieved 1,000 km range in proprietary test track conditions under 25°C.",
                "source": "TechCrunch"
            },
            {
                "title": "Independent Testing Reveals Real-World Range Drops 32% Under Highway Load",
                "link": "https://www.caranddriver.com/reviews/ev-range-real-world-vs-laboratory-test",
                "snippet": "Independent chassis dyno testing by automotive labs found that the 1,000 km claim reflects ultra-low speed constant 40 km/h cruising. At 110 km/h highway speeds with HVAC, range was 680 km.",
                "source": "Car and Driver"
            },
            {
                "title": "Chemistry Breakdown: Silicon-Carbon Anode vs Pure Lithium Metal",
                "link": "https://arstechnica.com/science/2024/battery-tech-claims-reality-check",
                "snippet": "The cell utilizes a 15% silicon-doped graphite anode rather than a true solid-state lithium metal electrolyte, meaning cycle degradation after 500 cycles remains unverified.",
                "source": "Ars Technica"
            }
        ],
        "scholar": [
            {
                "title": "Energy Density Limits and Volumetric Expansion in High-Silicon Anode Lithium-Ion Cells",
                "authors": "Dr. E. Thorne, K. M. Zhao, L. Zhang",
                "publication": "Nature Energy, 2024",
                "snippet": "We demonstrate that gravimetric densities exceeding 400 Wh/kg exhibit severe capacity fade after 420 cycles due to mechanical micro-cracking and SEI layer instability without high external pressure.",
                "citations": 118
            },
            {
                "title": "Standardized WLTP vs Real-World EV Range Discrepancies in Extreme Ambient Temperatures",
                "authors": "H. Schmidt, M. Rossi",
                "publication": "IEEE Transactions on Transportation Electrification",
                "snippet": "Laboratory WLTP and CLTC cycle ratings consistently overestimate driving distance by 25-38% compared to real-world highway driving profiles with active auxiliary thermal loads.",
                "citations": 64
            }
        ],
        "news": [
            {
                "title": "Automaker CEO Clarifies 1,000 km Range Applies to Upcoming Luxury Halo Trim Only",
                "link": "https://www.reuters.com/business/autos-transportation/battery-range-specs-clarified-ceo-interview",
                "snippet": "In an earnings interview, the automaker conceded that the 150 kWh pack delivering 1,000 km adds 640 kg of weight and will be limited to a niche trim priced above $90,000.",
                "date": "4 days ago",
                "source": "Reuters"
            }
        ]
    },
    "robotics_mission": {
        "google": [
            {
                "title": "National Student Robotics Championship 2026 - IISc Bengaluru",
                "link": "https://iisc.ac.in/events/robotics-championship-2026",
                "snippet": "Annual collegiate robotics competition hosted at the JN Tata Auditorium, Indian Institute of Science (IISc), Bengaluru. Event dates: March 14-16, 2026.",
                "source": "IISc Portal"
            },
            {
                "title": "Student Travel Subsidies and Budget Dormitory Guide for IISc Visitors",
                "link": "https://bangalorestudentguide.org/stay-near-iisc",
                "snippet": "Guide for visiting students to Mathikere, Malleshwaram, and Yeshwanthpur near IISc. Budget rooms average ₹1,200 to ₹1,800/night with dormitory beds starting at ₹450.",
                "source": "Bangalore Guide"
            }
        ],
        "maps": [
            {
                "title": "Zostel Bengaluru (Indiranagar / Central Hub)",
                "address": "8th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka",
                "rating": 4.6,
                "user_ratings_total": 1420,
                "price_level": "Budget",
                "distance_km": 8.5,
                "cost_estimate_inr": 7200,
                "category": "Hostel / Dorm"
            },
            {
                "title": "Mathikere Comfort Youth Lodge (Near IISc Gate 2)",
                "address": "1st Cross, Mathikere Extension, Bengaluru, Karnataka",
                "rating": 4.2,
                "user_ratings_total": 410,
                "price_level": "Budget",
                "distance_km": 1.1,
                "cost_estimate_inr": 5400,
                "category": "Student Hotel"
            },
            {
                "title": "Yeshwanthpur Grand Transit Residency",
                "address": "Near Yeshwanthpur Railway Station, Bengaluru",
                "rating": 3.9,
                "user_ratings_total": 890,
                "price_level": "Budget",
                "distance_km": 2.8,
                "cost_estimate_inr": 6800,
                "category": "Hotel"
            },
            {
                "title": "The Lalit Ashok Bengaluru",
                "address": "Kumara Krupa High Grounds, Bengaluru",
                "rating": 4.5,
                "user_ratings_total": 3100,
                "price_level": "Luxury",
                "distance_km": 5.2,
                "cost_estimate_inr": 28500,
                "category": "Luxury Hotel"
            }
        ],
        "shopping": [
            {
                "title": "Sleeper Class Train Tickets (Round Trip, 4 Students)",
                "price": "₹4,800",
                "merchant": "IRCTC",
                "rating": 4.1
            },
            {
                "title": "AC 3-Tier Train Tickets (Round Trip, 4 Students)",
                "price": "₹12,400",
                "merchant": "IRCTC",
                "rating": 4.5
            },
            {
                "title": "Robotics Competition Team Registration Kit",
                "price": "₹3,500",
                "merchant": "RoboFest Organizing Committee",
                "rating": 4.8
            }
        ]
    },
    "timeline_trace": {
        "google": [
            {
                "title": "2022 Milestone: Initial Market Genesis and Early EV Adopters",
                "link": "https://www.autocarindia.com/industry-analysis/2022-indian-ev-milestone",
                "snippet": "In 2022, EV sales accounted for under 1.2% of Indian passenger cars. Tata Motors held over 82% share with early Nexon EV models. Global automakers remained skeptical.",
                "source": "Autocar India"
            },
            {
                "title": "2023 Milestone: BYD Enters with Atto 3 and Seal Debut",
                "link": "https://economictimes.indiatimes.com/auto/2023-byd-expansion",
                "snippet": "In 2023, BYD showcased full lineup at Auto Expo and commenced local assembly of the Atto 3. Government scrutiny increased on Chinese investment proposals.",
                "source": "The Economic Times"
            },
            {
                "title": "2024 Milestone: Price Wars and FAME-II Subsidy Transition",
                "link": "https://www.reuters.com/business/autos/india-ev-subsidy-transition-2024",
                "snippet": "2024 saw the expiration of FAME-II subsidies, replaced by the EMPS scheme. Domestic manufacturers slashed prices by 10-15% as lithium carbonate prices dropped 60%.",
                "source": "Reuters"
            },
            {
                "title": "2025-2026 Milestone: Dedicated Born-EV Architecture Deployments",
                "link": "https://www.financialexpress.com/auto/born-ev-platforms-india-2025-2026",
                "snippet": "Transition from converted ICE platforms to native born-electric skateboards (Mahindra INGLO, Tata acti.ev). Tier-2 charging infrastructure expanded by 240%.",
                "source": "Financial Express"
            }
        ],
        "news": [
            {
                "title": "Policy Shift: New 2024 EV Scheme Opens Door to Global Entrants",
                "link": "https://pib.gov.in/PressReleaseIframePage.aspx?PRID=2014766",
                "snippet": "Ministry of Heavy Industries notified concessional customs duty scheme linked to domestic value addition commitments of 50% within five years.",
                "date": "March 2024",
                "source": "Press Information Bureau"
            }
        ]
    }
}

def match_scenario(query: str) -> str:
    q = query.lower()
    if any(k in q for k in ["byd", "tata", "mahindra", "threat", "indian ev"]):
        return "byd_ev"
    elif any(k in q for k in ["battery", "range", "1000", "1,000", "double", "doubles", "solid-state"]):
        return "battery_claim"
    elif any(k in q for k in ["robotics", "trip", "bengaluru", "bangalore", "30,000", "30000", "students", "plan"]):
        return "robotics_mission"
    elif any(k in q for k in ["timeline", "change", "2022", "2023", "2024", "2026", "history", "evolve"]):
        return "timeline_trace"
    return "byd_ev"  # default rich fallback

def get_demo_results(engine: str, query: str) -> List[Dict[str, Any]]:
    scenario_key = match_scenario(query)
    scenario_data = DEMO_SCENARIO_RESULTS.get(scenario_key, DEMO_SCENARIO_RESULTS["byd_ev"])
    
    # Try specific engine, fallback to google
    results = scenario_data.get(engine.lower()) or scenario_data.get("google", [])
    
    # If query is asking about a specific entity or sub-question, adapt snippet
    filtered = []
    for r in results:
        item = dict(r)
        item["query_matched"] = query
        filtered.append(item)
    return filtered
