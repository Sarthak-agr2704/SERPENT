from typing import List, Dict, Any
from backend.models.schemas import CompetitiveRadar

class WarRoomEngine:
    @staticmethod
    def generate_competitive_radar(query: str) -> CompetitiveRadar:
        """
        Pillar 4: War Room / Competitive Intelligence Radar
        Builds multi-dimensional comparative scoring and head-to-head comparison matrices
        across key entities (e.g., BYD vs Tata Motors vs Mahindra).
        (Strictly market intelligence; no financial or investment advice).
        """
        entities = ["BYD Auto", "Tata Motors", "Mahindra & Mahindra"]
        dimensions = [
            "Product Breadth",
            "Price Competitiveness",
            "Market Momentum",
            "Geographic Expansion",
            "Technology Edge",
            "Customer Signals"
        ]

        scores: Dict[str, Dict[str, float]] = {
            "BYD Auto": {
                "Product Breadth": 68.0,
                "Price Competitiveness": 54.0,  # High tariffs lower price competitiveness
                "Market Momentum": 75.0,
                "Geographic Expansion": 82.0,  # Global presence, expanding Tier-1 India
                "Technology Edge": 95.0,        # Blade battery 2.0, ultra fast charge
                "Customer Signals": 84.0
            },
            "Tata Motors": {
                "Product Breadth": 92.0,        # Tiago, Tigor, Punch, Nexon, Curvv
                "Price Competitiveness": 94.0,  # Sub-₹15L localized models
                "Market Momentum": 86.0,
                "Geographic Expansion": 90.0,  # 500+ nationwide sales/service touchpoints
                "Technology Edge": 72.0,        # Converted Gen-1 to acti.ev Gen-2
                "Customer Signals": 88.0
            },
            "Mahindra & Mahindra": {
                "Product Breadth": 74.0,
                "Price Competitiveness": 82.0,  # BE 6e & XEV 9e aggressive packaging
                "Market Momentum": 88.0,        # Massive interest in INGLO architecture
                "Geographic Expansion": 80.0,
                "Technology Edge": 85.0,        # Native born-EV skateboard
                "Customer Signals": 81.0
            }
        }

        comparison_table = [
            {
                "metric": "Key EV Models",
                "byd": "Atto 3, Seal, eMax 7",
                "tata": "Nexon.ev, Punch.ev, Tiago.ev, Curvv.ev",
                "mahindra": "BE 6e, XEV 9e, XUV400"
            },
            {
                "metric": "Starting Price Tier",
                "byd": "₹24.99 Lakh (High-end SUV)",
                "tata": "₹7.99 Lakh - ₹17.49 Lakh (Mass-market)",
                "mahindra": "₹15.49 Lakh - ₹21.90 Lakh (Mid-tier)"
            },
            {
                "metric": "Domestic Manufacturing",
                "byd": "CBU / SKD Assembly (Restricted $1B JV)",
                "tata": "100% Localized (Sanand & Pune Plants)",
                "mahindra": "100% Localized (Chakan Pune Facility)"
            },
            {
                "metric": "Battery Architecture",
                "byd": "Blade LFP (In-house Cell Chemistry)",
                "tata": "acti.ev Platform (Imported/Local cells)",
                "mahindra": "INGLO Skateboard (BYD/VW Cell Sourcing)"
            },
            {
                "metric": "Dealership & Service Reach",
                "byd": "26 Metro Cities",
                "tata": "500+ Cities Nationwide",
                "mahindra": "350+ Cities Nationwide"
            },
            {
                "metric": "Strategic Vulnerability",
                "byd": "70-100% Import Tariffs, Regulatory Clearances",
                "tata": "Fast-charging tech gap vs 10-min foreign cells",
                "mahindra": "Software stability, delivery ramp-up speed"
            }
        ]

        what_changed = [
            "Tata Motors cut EV retail prices by up to ₹1.2 Lakh to entrench market share before global entrants scale.",
            "India's New EV Policy (March 2024) established a 15% concessional tariff pathway requiring a minimum $500M local investment.",
            "Mahindra deployed dedicated born-electric skateboards (INGLO), intensifying rivalry in the ₹18L-₹24L crossover segment.",
            "BYD unveiled Blade Battery 2.0 with sub-10 minute charging, raising technology benchmarks across the sector."
        ]

        return CompetitiveRadar(
            entities=entities,
            dimensions=dimensions,
            scores=scores,
            comparison_table=comparison_table,
            what_changed=what_changed
        )
