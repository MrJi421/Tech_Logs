from flask import Flask
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from config import Config

app = Flask(__name__)

# Initialize MongoDB client
client = MongoClient(Config.MONGO_URI, server_api=ServerApi('1'))
db = client.get_database('mydb')  # Replace with your database name if needed

# Register routes
from app.routes import bp as main_bp
app.register_blueprint(main_bp)

from flask import Blueprint, request, jsonify
from app.models import YourModel  # Replace with your actual model name

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

if __name__ == "__main__":
    app.run(debug=True)