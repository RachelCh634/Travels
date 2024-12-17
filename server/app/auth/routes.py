from flask import Blueprint, request, jsonify
from pymysql.cursors import DictCursor
from app.db import get_db_connection
from app.auth.token import encode_auth_token
import logging
logging.basicConfig(level=logging.DEBUG)

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/addUser', methods=['POST'])
def add_user():
    try:
        data = request.get_json()
        name = data['name']
        email = data['email']
        city = data['city']
        phone = data['phone']
        password = data['password']

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT * FROM users WHERE password = %s", (password,))
        existing_password = cursor.fetchone()

        if existing_password:
            cursor.close()
            connection.close()
            return jsonify({"error": "Password already exists"}), 400

        cursor.execute(
            "INSERT INTO users (name, email, city, phone, password) VALUES (%s, %s, %s, %s, %s)",
            (name, email, city, phone, password),
        )
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({"message": "User added successfully"}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500


@auth_bp.route('/getUser', methods=['POST'])
def get_user():
    try:
        data = request.get_json()
        name = data['name']
        password = data['password']

        connection = get_db_connection()
        cursor = connection.cursor(DictCursor)

        cursor.execute(
            "SELECT * FROM users WHERE name = %s AND password = %s",
            (name, password)
        )
        user = cursor.fetchone()

        cursor.close()
        connection.close()

        if user:
            user_id = user['id']
            token = encode_auth_token(user_id)
            return jsonify({"message": "User found", "token": token}), 200
        else:
            return jsonify({"message": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
