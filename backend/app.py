import os
import random
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Supabase Config
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    try:
        # Direct REST API call to Supabase
        url = f"{SUPABASE_URL}/rest/v1/alerts?select=*&order=created_at.desc"
        res = requests.get(url, headers=HEADERS)
        return jsonify(res.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/alerts/<int:alert_id>', methods=['PATCH'])
def update_alert(alert_id):
    try:
        data = request.json
        url = f"{SUPABASE_URL}/rest/v1/alerts?id=eq.{alert_id}"
        res = requests.patch(url, headers=HEADERS, json=data)
        return jsonify({"status": "success"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/alerts/reset', methods=['DELETE'])
def reset_alerts():
    """Delete ALL alerts from Supabase — use to start fresh."""
    try:
        # Supabase requires a filter for DELETE; 'id=gte.0' matches all rows
        url = f"{SUPABASE_URL}/rest/v1/alerts?id=gte.0"
        res = requests.delete(url, headers=HEADERS)
        return jsonify({"status": "cleared", "code": res.status_code}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/teams', methods=['GET'])
def get_teams():
    try:
        url = f"{SUPABASE_URL}/rest/v1/response_teams?select=*"
        res = requests.get(url, headers=HEADERS)
        return jsonify(res.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def simulator():
    print("Simulator Started...")
    while True:
        socketio.sleep(45)   # ⬆ Was 10s — now fires every 45 seconds

        incident_types = [
            ("Fire Incident", "Major fire reported in a residential building."),
            ("Road Accident", "Multi-vehicle collision on the main highway."),
            ("Medical Emergency", "Individual collapsed in a public space."),
            ("Gas Leak", "Strong smell of gas reported in the industrial area."),
            ("Power Outage", "Grid failure affecting multiple city blocks."),
            ("Water Main Burst", "Flooding on the streets due to pipeline rupture.")
        ]
        weights = [5, 1, 5, 3, 4, 4]
        selected_type, selected_desc = random.choices(incident_types, weights=weights, k=1)[0]

        new_alert = {
            "title": f"{selected_type} #{random.randint(100, 999)}",
            "description": selected_desc,
            "severity": random.choice(['Low', 'Medium', 'High', 'Critical']),
            "source": random.choice(['Twitter', 'Instagram', 'Facebook', 'WhatsApp', 'SMS Gateway', 'Mobile App']),
            "lat": 19.75 + (random.random() - 0.5) * 4,
            "lng": 75.71 + (random.random() - 0.5) * 4
        }
        try:
            # --- Keep DB clean: delete oldest alerts beyond 30 ---
            count_res = requests.get(
                f"{SUPABASE_URL}/rest/v1/alerts?select=id&order=created_at.asc",
                headers=HEADERS
            )
            all_ids = [row["id"] for row in count_res.json() if isinstance(count_res.json(), list)]
            if len(all_ids) >= 30:
                oldest_id = all_ids[0]
                requests.delete(
                    f"{SUPABASE_URL}/rest/v1/alerts?id=eq.{oldest_id}",
                    headers=HEADERS
                )
                print(f"Trimmed oldest alert #{oldest_id} (keeping max 30)")

            # Post new alert
            url = f"{SUPABASE_URL}/rest/v1/alerts"
            res = requests.post(url, headers=HEADERS, json=new_alert)

            if res.status_code == 201 and res.text:
                data_list = res.json()
                if data_list and len(data_list) > 0:
                    data = data_list[0]
                    socketio.emit('newAlert', data)
                    print(f"Emitted: {data['title']}")
            else:
                print(f"Post failed or empty: {res.status_code} - {res.text}")
        except Exception as e:
            print(f"Sim Error: {e}")

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    socketio.start_background_task(simulator)
    is_prod = os.environ.get("FLASK_ENV") == "production"
    socketio.run(app, host="0.0.0.0", port=port, debug=not is_prod)

