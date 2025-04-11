from datetime import datetime
from bson import ObjectId

class Comment:
    def __init__(self, db):
        self.db = db
        self.collection = db.comments

    def create_comment(self, blog_id, user_id, content):
        comment = {
            "blog_id": ObjectId(blog_id),
            "user_id": ObjectId(user_id),
            "content": content,
            "created_at": datetime.utcnow()
        }
        return self.collection.insert_one(comment)

    def get_blog_comments(self, blog_id):
        """Get all comments for a blog with user details"""
        comments = self.collection.aggregate([
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
                "user_image": "$user.profile.profile_pic_url"
            }},
            {"$sort": {"created_at": -1}}
        ])
        return list(comments)