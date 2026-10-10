import httpx
import sys

# Ensure UTF-8 output on Windows console
if sys.stdout.encoding.lower() != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def main():
    client = httpx.Client(base_url="http://127.0.0.1:8000")

    # 1. Health
    health = client.get("/api/health").json()
    print("[1] Health Check:", health)
    assert health["status"] == "healthy"

    # 2. Start Investigation (BYD vs Tata EV)
    req_data = {
        "query": "Is BYD becoming a serious threat to Indian EV manufacturers?",
        "mode": "AUTO",
        "budget": 20,
        "is_demo_force": True
    }
    res = client.post("/api/investigations", json=req_data)
    inv = res.json()
    inv_id = inv["id"]
    print("[2] Investigation ID:", inv_id)
    print("    Status:", inv["status"])
    print("    Mode:", inv["mode"])
    print("    Sources Count:", len(inv["sources"]))
    print("    Claims Count:", len(inv["claims"]))
    print("    Entities Count:", len(inv["entities"]))
    print("    Verdict:", inv["report"]["verdict"])
    assert inv["status"] == "COMPLETED"

    # 3. Test Graph
    graph = client.get(f"/api/investigations/{inv_id}/graph").json()
    print("[3] Graph Nodes:", len(graph["nodes"]), "Edges:", len(graph["edges"]))
    assert len(graph["nodes"]) > 0

    # 4. Test Go Deeper Drilldown
    deeper = client.post(f"/api/investigations/{inv_id}/deeper", json={"entity": "BYD Auto"}).json()
    print("[4] Deeper Questions:", len(deeper["secondary_questions"]))
    assert len(deeper["secondary_questions"]) >= 2

    # 5. Test What-If Scenario
    scenario = client.post(f"/api/investigations/{inv_id}/scenario", json={"prompt": "What if prices fall 15%?"}).json()
    print("[5] Scenario Name:", scenario["name"])
    print("    Scenario Verdict:", scenario["strategic_verdict"])
    assert "PARTIAL THREAT" in scenario["strategic_verdict"]

    # 6. Test Scenario 2 (Robotics Trip Mission Control)
    req_mission = {
        "query": "Plan a 3-day robotics competition trip to Bengaluru for 4 students under ₹30,000",
        "mode": "MISSION",
        "budget": 20,
        "is_demo_force": True
    }
    res_m = client.post("/api/investigations", json=req_mission)
    inv_m = res_m.json()
    print("[6] Mission Control Options:", len(inv_m["mission_plan"]["options"]))
    print("    Recommended:", inv_m["mission_plan"]["selected_option_id"])
    print("    Verdict:", inv_m["report"]["verdict"][:60])
    assert inv_m["mission_plan"]["selected_option_id"] == "opt-a"

    # 7. Test Frontend HTML
    fe_res = httpx.get("http://127.0.0.1:3000")
    print("[7] Frontend Status:", fe_res.status_code, "HTML Length:", len(fe_res.text))
    assert fe_res.status_code == 200

    print("\n>>> ALL LIVE HTTP API & FRONTEND INTEGRATIONS PASSED SUCCESSFULLY! <<<")

if __name__ == "__main__":
    main()
