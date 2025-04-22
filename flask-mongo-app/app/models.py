from pymongo import MongoClient
from config import Config
from datetime import datetime
from bson import ObjectId

client = MongoClient(Config.MONGO_URI)
db = client.get_database('mydb')  # Replace with your database name if needed

class YourModel:
    def __init__(self):
        self.collection = db['Blogs']  # Replace with your collection name

    def insert_one(self, document):
        return self.collection.insert_one(document)

    def find_one(self, query):
        return self.collection.find_one(query)

    def find_all(self):
        return self.collection.find()

    def update_one(self, query, update):
        return self.collection.update_one(query, update)

    def delete_one(self, query):
        return self.collection.delete_one(query)

class UserModel:
    def __init__(self):
        self.collection = db['users']  # Use the "users" collection

    def find_by_credentials(self, username, password):
        # In a real-world system, you'd use hashed passwords
        return self.collection.find_one({"username": username, "password": password})

    def insert_user(self, user_data):
        return self.collection.insert_one(user_data)

class BlogInteractionsModel:
    def __init__(self):
        self.blogs_collection = db['blogs']
        self.comments_collection = db['blog_comments']

    def add_comment(self, blog_id, user_id, content):
        """Add a comment to a blog"""
        comment = {
            "blog_id": ObjectId(blog_id),
            "user_id": ObjectId(user_id),
            "content": content,
            "created_at": datetime.utcnow()
        }
        result = self.comments_collection.insert_one(comment)
        
        # Increment comment count in blog document
        self.blogs_collection.update_one(
            {"_id": ObjectId(blog_id)},
            {"$inc": {"comments_count": 1}}
        )
        return str(result.inserted_id)

    def get_blog_comments(self, blog_id):
        """Get all comments for a blog with user details"""
        comments = self.comments_collection.aggregate([
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
                "content": 1,
                "created_at": 1,
                "user_name": "$user.username",
                "user_image": "$user.profile.profile_pic_url",
                "user_id": "$user._id"
            }},
            {"$sort": {"created_at": -1}}
        ])
        return list(comments)

class BlogInteractions:
    def __init__(self, db):
        self.db = db
        self.blogs_collection = db.blogs
        self.likes_collection = db.blog_likes
        
    def toggle_like(self, blog_id, user_id):
        """Toggle like status for a blog"""
        try:
            # Check if user already liked the blog
            existing_like = self.likes_collection.find_one({
                "blog_id": ObjectId(blog_id),
                "user_id": ObjectId(user_id)
            })

            if existing_like:
                # Unlike: Remove like and decrement count
                self.likes_collection.delete_one({
                    "blog_id": ObjectId(blog_id),
                    "user_id": ObjectId(user_id)
                })
                self.blogs_collection.update_one(
                    {"_id": ObjectId(blog_id)},
                    {"$inc": {"likes_count": -1}}
                )
                return {"is_liked": False}
            else:
                # Like: Add like and increment count
                self.likes_collection.insert_one({
                    "blog_id": ObjectId(blog_id),
                    "user_id": ObjectId(user_id),
                    "created_at": datetime.utcnow()
                })
                self.blogs_collection.update_one(
                    {"_id": ObjectId(blog_id)},
                    {"$inc": {"likes_count": 1}}
                )
                return {"is_liked": True}
        except Exception as e:
            print(f"Error toggling like: {str(e)}")
            raise