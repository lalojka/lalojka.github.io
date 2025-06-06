from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)
DATA_FILE = "users.json"

def load_users():
    if not os.path.isfile(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(DATA_FILE, "w") as f:
        json.dump(users, f, indent=2)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/users", methods=["POST"])
def create_or_update_user():
    data = request.json
    required = {"email", "facebook_id", "access_token"}
    if not data or not required.issubset(data):
        return jsonify({"error": "Missing required fields"}), 400

    users = load_users()
    # Buscar si ya existe el usuario
    found = next((u for u in users if u["email"] == data["email"]), None)
    if found:
        found.update(data)
    else:
        users.append(data)
    save_users(users)
    return jsonify({"ok": True, "user": data})

@app.route("/users/<email>", methods=["GET"])
def get_user(email):
    users = load_users()
    user = next((u for u in users if u["email"] == email), None)
    if user:
        return jsonify(user)
    return jsonify({"error": "User not found"}), 404

@app.route("/users/<email>", methods=["DELETE"])
def delete_user(email):
    users = load_users()
    new_users = [u for u in users if u["email"] != email]
    if len(users) == len(new_users):
        return jsonify({"error": "User not found"}), 404
    save_users(new_users)
    return jsonify({"ok": True})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)