from typing import List, Dict, Any
from backend.models.schemas import TimelineEvent, PeriodComparison

class TimeMachineEngine:
    @staticmethod
    def construct_timeline(query: str) -> List[TimelineEvent]:
        """
        Pillar 5: Internet Time Machine
        Reconstructs the chronological evolution of a market or topic across annual milestones.
        """
        events = [
            TimelineEvent(
                id="time-2022",
                period="2022",
                date_str="Early 2022",
                title="Genesis Phase: FAME-II Subsidies & Tata Dominance",
                description="Indian EV penetration hovered under 1.2%. Tata Motors held 82% market dominance with the first-gen Nexon EV. Global automakers remained conservative.",
                entities_involved=["Tata Motors", "Ministry of Heavy Industries"],
                impact="Established consumer familiarity with electric powertrains but highlighted charging anxiety.",
                evidence_source_ids=[]
            ),
            TimelineEvent(
                id="time-2023",
                period="2023",
                date_str="January 2023",
                title="Global Entry: BYD Showcases Lineup & Auto Expo Debut",
                description="BYD unveiled the Atto 3 and Seal sedan in India, aiming at premium segments. Meanwhile, the Indian government denied security clearance for BYD's $1B factory JV with Megha Engineering.",
                entities_involved=["BYD Auto", "Megha Engineering", "Ministry of Commerce"],
                impact="Forced BYD to rely on CBU/SKD imports with 70-100% tariffs, protecting domestic mass manufacturing.",
                evidence_source_ids=[]
            ),
            TimelineEvent(
                id="time-2024",
                period="2024",
                date_str="March 2024",
                title="Policy Overhaul & Domestic Price War",
                description="India notified the New EV Policy offering 15% concessional customs duties for foreign makers investing $500M locally. Simultaneously, Tata cut EV prices up to 8% as battery cell costs plunged.",
                entities_involved=["Tata Motors", "Tesla", "Government of India"],
                impact="Triggered aggressive price positioning in the ₹10L-₹15L bracket.",
                evidence_source_ids=[]
            ),
            TimelineEvent(
                id="time-2025",
                period="2025",
                date_str="Mid 2025",
                title="Born-EV Skateboard Transition: Mahindra INGLO & Tata acti.ev",
                description="Shift from converted ICE platforms to ground-up native EV skateboards (Mahindra BE 6e, XEV 9e, Tata Curvv.ev). Tier-2 fast-charging density expanded significantly.",
                entities_involved=["Mahindra & Mahindra", "Tata Motors"],
                impact="Domestic models achieved 450+ km real-world range, narrowing the gap with luxury imports.",
                evidence_source_ids=[]
            ),
            TimelineEvent(
                id="time-2026",
                period="2026",
                date_str="Present (2026)",
                title="Technological Showdown: 10-Minute Charging & Ultra-Fast Blade Cells",
                description="BYD introduced Blade Battery 2.0 with sub-10 minute charging. Market matured into a bifurcated landscape: domestic mass dominance vs global luxury technological benchmark.",
                entities_involved=["BYD Auto", "Tata Motors", "Mahindra & Mahindra"],
                impact="Current status: BYD exerts high technological influence in premium tiers, but domestic players retain >75% volume.",
                evidence_source_ids=[]
            )
        ]
        return events

    @staticmethod
    def compare_periods(period_a: str = "2024", period_b: str = "2026") -> PeriodComparison:
        """
        Pillar 5: Compare Periods (e.g. 2024 vs 2026).
        Isolates what changed, what remained unchanged, price shifts, and tech transitions.
        """
        return PeriodComparison(
            period_a=period_a,
            period_b=period_b,
            what_changed=[
                "Shift from converted ICE platforms to native ground-up born-electric skateboards (acti.ev & INGLO).",
                "Tata EV entry price point dropped from ₹12.5 Lakh to ₹7.99 Lakh (Tiago/Punch).",
                "Charging speeds accelerated from 50-minute DC fast charge to sub-15 minute ultra-fast architectures.",
                "FAME-II subsidy ended; market transitioned to unsubsidized commercial competitiveness."
            ],
            what_remained=[
                "High customs duties (70-100%) on non-localized foreign Completely Built Units (CBU).",
                "Tata Motors' top market share position (>65% passenger EV volume).",
                "Heavy concentration of DC fast chargers along Golden Quadrilateral highways."
            ],
            new_entities=[
                "Mahindra BE 6e & XEV 9e",
                "BYD eMax 7 MPV",
                "Second-Generation Blade Battery 2.0",
                "India New EV Policy ($500M Scheme)"
            ],
            disappeared_entities=[
                "FAME-II Subsidies (Phased out)",
                "Converted Gen-1 Tigor EV fleet models"
            ],
            price_movements=[
                "Battery pack cost per kWh dropped from ~$110/kWh to ~$72/kWh.",
                "Mass-market EV purchase parity with petrol vehicles narrowed to within ₹1.5 Lakh."
            ],
            technological_shifts=[
                "Widespread adoption of LFP (Lithium Iron Phosphate) cell chemistry for thermal safety in tropical climates.",
                "Silicon-anode doping increasing energy density toward 300 Wh/kg."
            ],
            regulatory_changes=[
                "AIS-156 Amendment III battery safety standards made mandatory.",
                "Mandatory recycling and battery materials tracking policy enacted."
            ]
        )
