from flask import Blueprint, request, jsonify, redirect, url_for
from flask_cors import cross_origin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
from functools import wraps
import cloudinary
import cloudinary.uploader
from bson import ObjectId
from app.models import YourModel, UserModel  # Make sure these are imported correctly
from app import app
from app import db  # Assuming you have MongoDB connection in __init__.py

bp = Blueprint('main', __name__)
auth_bp = Blueprint('auth', __name__)

# JWT Configuration
JWT_SECRET = 'your-secret-key'  # Move to config in production
JWT_EXPIRATION = 24 * 60 * 60  # 24 hours in seconds

# Collection
users = db.users

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            token = token.split(' ')[1]  # Remove 'Bearer ' prefix
            data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            current_user = users.find_one({'_id': data['user_id']})
        except:
            return jsonify({'message': 'Invalid token'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

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

@bp.route('/register', methods=['POST'])
@cross_origin()
def register():
    data = request.get_json()
    
    if users.find_one({"email": data['email']}):
        return jsonify({"error": "Email already exists"}), 400

    new_user = {
        "_id": ObjectId(),  # Generate ID explicitly
        "username": data['username'],
        "email": data['email'],
        "password": generate_password_hash(data['password']),
        "created_at": datetime.utcnow(),
        "profile": {
            "full_name": "",
            "bio": "",
            "location": "",
            "profile_pic_url": ""
        }
    }
    
    users.insert_one(new_user)
    return jsonify({
        "message": "Registration successful",
        "user_id": str(new_user['_id'])
    }), 201

@bp.route('/login', methods=['POST'])
@cross_origin()
def login():
    data = request.get_json()
    email = data.get('email')  # Change from username to email since registration uses email
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        # Find user by email
        user = db.users.find_one({"email": email})
        
        if user and check_password_hash(user['password'], password):
            # Convert ObjectId to string for JSON serialization
            user_id = str(user['_id'])
            
            return jsonify({
                "message": "Login successful",
                "user_id": user_id,
                "username": user['username']
            }), 200
        
        return jsonify({"error": "Invalid email or password"}), 401
        
    except Exception as e:
        print(f"Login error: {str(e)}")  # For debugging
        return jsonify({"error": "Login failed"}), 500

@bp.route('/update-profile', methods=['PUT', 'OPTIONS'])
@cross_origin()
def update_profile():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    data = request.get_json()
    user_id = request.headers.get('user-id')
    
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    
    try:
        # Convert string ID to ObjectId
        user_id = ObjectId(user_id)
        
        update_data = {
            "profile.full_name": data['full_name'],
            "profile.bio": data['bio'],
            "profile.location": data['location'],
            "profile.updated_at": datetime.utcnow()
        }
        
        result = db.users.update_one(
            {"_id": user_id},
            {"$set": update_data}
        )
        
        if result.modified_count:
            return jsonify({"message": "Profile updated successfully"}), 200
        return jsonify({"error": "User not found"}), 404
        
    except Exception as e:
        print(f"Update profile error: {str(e)}")  # For debugging
        return jsonify({"error": "Failed to update profile"}), 500

@bp.route('/upload-profile-pic', methods=['POST'])
@cross_origin()
def upload_profile_pic():
    user_id = request.headers.get('user-id')
    
    if not user_id:
        return jsonify({"error": "User ID required"}), 400
        
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    
    try:
        # Upload to Cloudinary with transformations
        response = cloudinary.uploader.upload(
            file,
            folder="profile_pics",
            unique_filename=True,
            overwrite=True,
            eager=[{
                "width": 200,
                "height": 200,
                "crop": "fill",
                "gravity": "face"
            }]
        )

        # Get optimized image URL
        image_url = response['eager'][0]['secure_url']
        
        # Update user document with new profile pic URL
        result = db.users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "profile.profile_pic_url": image_url,
                    "profile.profile_pic_updated_at": datetime.utcnow()
                }
            }
        )

        if result.modified_count == 0:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "message": "Profile picture updated",
            "url": image_url
        }), 200

    except Exception as e:
        print(f"Upload error: {str(e)}")  # For debugging
        return jsonify({"error": "Upload failed"}), 500

@bp.route('/get-profile', methods=['GET'])
@cross_origin()
def get_profile():
    user_id = request.headers.get('user-id')
    
    if not user_id:
        return jsonify({"error": "User ID required"}), 400
        
    try:
        user = db.users.find_one({"_id": ObjectId(user_id)}, 
            {"password": 0})  # Exclude password from response
        
        if user:
            user['_id'] = str(user['_id'])  # Convert ObjectId to string
            return jsonify(user), 200
            
        return jsonify({"error": "User not found"}), 404
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/debug/routes', methods=['GET'])
def list_routes():
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            "endpoint": rule.endpoint,
            "methods": list(rule.methods),
            "path": str(rule)
        })
    return jsonify(routes)

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