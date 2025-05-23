from flask import Blueprint, request, jsonify, redirect, url_for
from flask_cors import cross_origin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
from functools import wraps
import cloudinary
import cloudinary.uploader
from bson import ObjectId, json_util
from bson.json_util import dumps
from models import YourModel, UserModel, BlogInteractionsModel, BlogInteractions  # Make sure these are imported correctly
# from app.models import BlogInteractionsModel
# from models.contact import Contact
from app import app
from app import db  # Assuming you have MongoDB connection in __init__.py
import os
from werkzeug.utils import secure_filename

bp = Blueprint('main', __name__)
auth_bp = Blueprint('auth', __name__)

# JWT Configuration
JWT_SECRET = 'your-secret-key'  # Move to config in production
JWT_EXPIRATION = 24 * 60 * 60  # 24 hours in seconds

# Collection
users = db.users

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS # type: ignore

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

@bp.route('/get-user-blogs', methods=['GET'])
@cross_origin()
def get_user_blogs():
    try:
        user_id = request.headers.get('user-id')
        if not user_id:
            return jsonify({"error": "User ID required"}), 400

        # Find all blogs and sort by creation date (newest first)
        blogs = list(db.blogs.find({}).sort("created_at", -1))
        
        # Convert ObjectIds to strings and add isOwner flag
        for blog in blogs:
            blog['_id'] = str(blog['_id'])
            blog['user_id'] = str(blog['user_id'])
            # Set isOwner to True if the blog belongs to the current user
            blog['isOwner'] = str(blog['user_id']) == str(user_id)
        
        return jsonify({
            "message": "Blogs fetched successfully",
            "blogs": blogs
        }), 200
        
    except Exception as e:
        print(f"Error fetching blogs: {str(e)}")
        return jsonify({"error": "Failed to fetch blogs"}), 500

@bp.route('/create-blog', methods=['POST'])
@cross_origin()
def create_blog():
    if not request.headers.get('user-id'):
        return jsonify({"error": "User ID required"}), 400

    try:
        user_id = request.headers.get('user-id')
        title = request.form.get('title')
        content = request.form.get('content')
        
        if not title or not content:
            return jsonify({"error": "Title and content are required"}), 400

        blog_data = {
            "user_id": ObjectId(user_id),
            "title": title,
            "content": content,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        # Handle image upload with Cloudinary
        if 'image' in request.files:
            file = request.files['image']
            if file:
                try:
                    # Upload to Cloudinary
                    response = cloudinary.uploader.upload(
                        file,
                        folder="blog_images",
                        unique_filename=True,
                        overwrite=True,
                        eager=[{
                            "width": 800,  # Blog image width
                            "height": 400,  # Blog image height
                            "crop": "fill",
                            "gravity": "auto"
                        }]
                    )
                    # Get optimized image URL
                    blog_data['image_url'] = response['eager'][0]['secure_url']
                except Exception as e:
                    print(f"Cloudinary upload error: {str(e)}")
                    return jsonify({"error": "Failed to upload image"}), 500

        # Insert blog post
        result = db.blogs.insert_one(blog_data)
        
        # Convert ObjectId to string for JSON response
        blog_data['_id'] = str(result.inserted_id)
        blog_data['user_id'] = str(blog_data['user_id'])

        return jsonify({
            "message": "Blog created successfully",
            "blog": blog_data
        }), 201

    except Exception as e:
        print(f"Error creating blog: {str(e)}")
        return jsonify({"error": "Failed to create blog"}), 500

@bp.route('/delete-blog/<blog_id>', methods=['DELETE'])
@cross_origin()
def delete_blog(blog_id):
    try:
        user_id = request.headers.get('user-id')
        if not user_id:
            return jsonify({"error": "User ID required"}), 400

        # Find the blog and verify ownership
        blog = db.blogs.find_one({
            "_id": ObjectId(blog_id),
            "user_id": ObjectId(user_id)
        })

        if not blog:
            return jsonify({"error": "Blog not found or unauthorized"}), 404

        # Delete the blog
        db.blogs.delete_one({"_id": ObjectId(blog_id)})

        # Delete image from Cloudinary if exists
        if blog.get('image_url'):
            # Extract public_id from URL
            public_id = blog['image_url'].split('/')[-1].split('.')[0]
            cloudinary.uploader.destroy(f"blog_images/{public_id}")

        return jsonify({"message": "Blog deleted successfully"}), 200

    except Exception as e:
        print(f"Error deleting blog: {str(e)}")
        return jsonify({"error": "Failed to delete blog"}), 500

@bp.route('/get-blog/<blog_id>', methods=['GET'])
@cross_origin()
def get_blog(blog_id):
    try:
        # Get user_id if available but don't require it
        user_id = request.headers.get('user-id')

        # Find the blog
        blog = db.blogs.find_one({"_id": ObjectId(blog_id)})
        
        if not blog:
            return jsonify({"error": "Blog not found"}), 404

        # Convert ObjectId to string
        blog['_id'] = str(blog['_id'])
        blog['user_id'] = str(blog['user_id'])
        
        # Add ownership flag only if user is logged in
        blog['isOwner'] = user_id and blog['user_id'] == user_id

        return jsonify({
            "message": "Blog fetched successfully",
            "blog": blog
        }), 200

    except Exception as e:
        print(f"Error fetching blog: {str(e)}")
        return jsonify({"error": "Failed to fetch blog"}), 500

@bp.route('/public-blogs', methods=['GET'])
@cross_origin()
def get_public_blogs():
    try:
        # Get user_id if available but don't require it
        user_id = request.headers.get('user-id')

        # Find all blogs and sort by creation date (newest first)
        blogs = list(db.blogs.find({}).sort("created_at", -1))
        
        # Convert ObjectIds to strings and add isOwner flag if user is logged in
        for blog in blogs:
            blog['_id'] = str(blog['_id'])
            blog['user_id'] = str(blog['user_id'])
            blog['isOwner'] = user_id and str(blog['user_id']) == str(user_id)
        
        return jsonify({
            "message": "Blogs fetched successfully",
            "blogs": blogs
        }), 200
        
    except Exception as e:
        print(f"Error fetching blogs: {str(e)}")
        return jsonify({"error": "Failed to fetch blogs"}), 500

@bp.route('/change-password', methods=['PUT', 'OPTIONS'])
@cross_origin()
def change_password():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    try:
        user_id = request.headers.get('user-id')
        if not user_id:
            return jsonify({"error": "User ID required"}), 400
            
        # Validate ObjectId format
        if not ObjectId.is_valid(user_id):
            return jsonify({"error": "Invalid user ID format"}), 400

        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        current_password = data.get('current_password')
        new_password = data.get('new_password')

        if not current_password or not new_password:
            return jsonify({"error": "Both current and new passwords are required"}), 400

        # Find user with validated ObjectId
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Verify current password
        if not check_password_hash(user['password'], current_password):
            return jsonify({"error": "Current password is incorrect"}), 401

        # Update password
        hashed_password = generate_password_hash(new_password)
        result = db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"password": hashed_password}}
        )

        if result.modified_count > 0:
            return jsonify({"message": "Password updated successfully"}), 200
        else:
            return jsonify({"error": "Failed to update password"}), 500

    except Exception as e:
        print(f"Error changing password: {str(e)}")
        return jsonify({"error": str(e)}), 500

@bp.route('/search-blogs', methods=['GET'])
@cross_origin()
def search_blogs():
    try:
        query = request.args.get('q', '')
        if not query:
            return jsonify({"blogs": []}), 200

        # Search blogs by title using case-insensitive regex
        blogs = list(db.blogs.find({
            "title": {"$regex": query, "$options": "i"}
        }).sort("created_at", -1))

        # Convert ObjectIds to strings
        for blog in blogs:
            blog['_id'] = str(blog['_id'])
            blog['user_id'] = str(blog['user_id'])

        return jsonify({
            "message": "Search completed successfully",
            "blogs": blogs
        }), 200

    except Exception as e:
        print(f"Error searching blogs: {str(e)}")
        return jsonify({"error": "Failed to search blogs"}), 500

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

@bp.route('/blog-interaction/<blog_id>', methods=['POST'])
@cross_origin()
def handle_blog_interaction():
    try:
        blog_id = request.args.get('blog_id')
        interaction_type = request.json.get('type')  # 'view' or 'like'
        user_id = request.headers.get('user-id')

        if interaction_type == 'view':
            # Increment view count
            db.blogs.update_one(
                {"_id": ObjectId(blog_id)},
                {"$inc": {"views": 1}}
            )
        elif interaction_type == 'like':
            if not user_id:
                return jsonify({"error": "Authentication required for likes"}), 401
            
            # Check if user already liked
            liked = db.blog_likes.find_one({
                "blog_id": ObjectId(blog_id),
                "user_id": ObjectId(user_id)
            })

            if liked:
                # Unlike
                db.blog_likes.delete_one({
                    "blog_id": ObjectId(blog_id),
                    "user_id": ObjectId(user_id)
                })
                db.blogs.update_one(
                    {"_id": ObjectId(blog_id)},
                    {"$inc": {"likes": -1}}
                )
            else:
                # Like
                db.blog_likes.insert_one({
                    "blog_id": ObjectId(blog_id),
                    "user_id": ObjectId(user_id),
                    "created_at": datetime.utcnow()
                })
                db.blogs.update_one(
                    {"_id": ObjectId(blog_id)},
                    {"$inc": {"likes": 1}}
                )

        return jsonify({"message": "Interaction recorded successfully"}), 200

    except Exception as e:
        print(f"Error handling blog interaction: {str(e)}")
        return jsonify({"error": "Failed to handle interaction"}), 500

@bp.route('/blog/<blog_id>/like', methods=['GET', 'POST'])
@cross_origin()
def handle_like(blog_id):
    try:
        user_id = request.headers.get('user-id')
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401

        interactions = BlogInteractions(db)
        
        if request.method == 'GET':
            # Check if user has liked the blog
            like = interactions.likes_collection.find_one({
                "blog_id": ObjectId(blog_id),
                "user_id": ObjectId(user_id)
            })
            return jsonify({"is_liked": bool(like)})
            
        elif request.method == 'POST':
            result = interactions.toggle_like(blog_id, user_id)
            return jsonify(result)

    except Exception as e:
        print(f"Error handling like: {str(e)}")
        return jsonify({"error": "Failed to process like"}), 500

@bp.route('/blog/<blog_id>/comments', methods=['GET', 'POST'])
@cross_origin()
def handle_comments(blog_id):
    try:
        if request.method == 'GET':
            pipeline = [
                {"$match": {"blog_id": ObjectId(blog_id)}},
                {"$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "user"
                }},
                {"$unwind": "$user"},
                {"$project": {
                    "_id": 1,
                    "blog_id": 1,
                    "user_id": 1,
                    "content": 1,
                    "created_at": 1,
                    "username": "$user.username"
                }}
            ]
            comments = list(db.blog_comments.aggregate(pipeline))
            
            # Convert ObjectIds to strings
            for comment in comments:
                comment['_id'] = str(comment['_id'])
                comment['blog_id'] = str(comment['blog_id'])
                comment['user_id'] = str(comment['user_id'])
                
            return jsonify({'comments': comments})

        elif request.method == 'POST':
            user_id = request.headers.get('user-id')
            if not user_id:
                return jsonify({"error": "User ID required"}), 401

            data = request.get_json()
            if not data or 'content' not in data:
                return jsonify({"error": "Comment content required"}), 400

            comment = {
                "blog_id": ObjectId(blog_id),
                "user_id": ObjectId(user_id),
                "content": data['content'],
                "created_at": datetime.utcnow()
            }

            result = db.blog_comments.insert_one(comment)
            return jsonify({
                "message": "Comment added successfully",
                "comment_id": str(result.inserted_id)
            }), 201

    except Exception as e:
        print(f"Error handling comments: {str(e)}")
        return jsonify({"error": str(e)}), 500

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