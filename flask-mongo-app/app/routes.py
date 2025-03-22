from flask import Blueprint, request, jsonify
from app.models import YourModel  # Replace with your actual model name
from app import app

bp = Blueprint('main', __name__)

@bp.route('/get_items', methods=['GET'])
def get_items():
    items = YourModel().find_all()  # Replace with your actual method to get items
    return jsonify(list(items)), 200

@bp.route('/create_item', methods=['POST'])
def create_item():
    data = request.get_json()
    new_item = YourModel().insert_one(data)  # Replace with your actual method to create an item
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