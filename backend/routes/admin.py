from flask import Blueprint, jsonify, request

from backend.auth import create_admin_token
from backend.config import Config

admin_bp = Blueprint("admin", __name__)


@admin_bp.post("/login")
def admin_login():
    data = request.get_json(silent=True) or {}
    password = data.get("password", "")

    if password != Config.ADMIN_PASSWORD:
        return jsonify({"error": "Invalid admin credentials."}), 401

    return jsonify({"token": create_admin_token(), "message": "Authenticated"})


@admin_bp.get("/verify")
def admin_verify():
    from backend.auth import verify_admin_token

    auth_header = request.headers.get("Authorization", "")
    token = auth_header.removeprefix("Bearer ").strip() if auth_header else ""
    if not verify_admin_token(token):
        return jsonify({"authenticated": False}), 401
    return jsonify({"authenticated": True})
