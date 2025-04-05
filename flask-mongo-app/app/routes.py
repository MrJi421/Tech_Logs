from flask import Blueprint, request, jsonify
from app.models import YourModel, UserModel  # Make sure these are imported correctly
from app import app

bp = Blueprint('main', __name__)

@bp.route('/get_items', methods=['GET'])
def get_items():
    items = YourModel().find_all()
    return jsonify(list(items)), 200

@bp.route('/create_item', methods=['POST'])
def create_item():
    data = request.get_json()
    new_item = YourModel().insert_one(data)
    return jsonify({"inserted_id": str(new_item.inserted_id)}), 201

@bp.route('/get_item/<id>', methods=['GET'])
def get_item(id):
    item = YourModel().find_one({"_id": id})  # Replace with your actual method to get an item by ID
    if item:
        return jsonify(item), 200
    return jsonify({'error': 'Item not found'}), 404

@bp.route('/update_item/<id>', methods=['PUT'])
def update_item(id):
    data = request.get_json()
    updated_item = YourModel().update_one({"_id": id}, {"$set": data})  # Replace with your actual method to update an item
    if updated_item.modified_count > 0:
        return jsonify({'message': 'Item updated'}), 200
    return jsonify({'error': 'Item not found'}), 404

@bp.route('/delete_item/<id>', methods=['DELETE'])
def delete_item(id):
    success = YourModel().delete_one({"_id": id})  # Replace with your actual method to delete an item
    if success.deleted_count > 0:
        return jsonify({'message': 'Item deleted'}), 204
    return jsonify({'error': 'Item not found'}), 404

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = UserModel().find_by_credentials(username, password)
    if user:
        return jsonify({"message": "Login successful", "user": {"username": user.get('username')}}), 200
    return jsonify({"error": "Invalid credentials"}), 401

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are required"}), 400

    # Check if the user already exists
    user_model = UserModel()
    existing_user = user_model.collection.find_one({"username": username})
    if existing_user:
        return jsonify({"error": "User already exists"}), 409

    # In production, remember to hash passwords!
    user_data = {"username": username, "email": email, "password": password}
    result = user_model.insert_user(user_data)
    
    if result.inserted_id:
        return jsonify({"message": "Registration successful", "user": {"username": username}}), 201
    else:
        return jsonify({"error": "Registration failed"}), 500

your_model = YourModel()

@app.route('/add', methods=['POST'])
def add_document():
    data = request.json
    result = your_model.insert_one(data)
    return jsonify({"inserted_id": str(result.inserted_id)}), 201

@app.route('/get/<name>', methods=['GET'])
def get_document(name):
    document = your_model.find_one({"name": name})
    if document:
        return jsonify(document), 200
    else:
        return jsonify({"error": "Document not found"}), 404