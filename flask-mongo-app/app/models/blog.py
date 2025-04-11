from datetime import datetime
from bson import ObjectId

class Blog:
    def __init__(self, db):
        self.db = db
        self.collection = db.blogs

    def create_blog(self, data):
        blog = {
            "title": data["title"],
            "content": data["content"],
            "user_id": ObjectId(data["user_id"]),
            "image_url": data.get("image_url"),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "views": 0,
            "likes": 0
        }
        return self.collection.insert_one(blog)

    def update_existing_blogs(self):
        """Add view and like counts to existing blogs"""
        self.collection.update_many(
            {"views": {"$exists": False}},
            {"$set": {"views": 0, "likes": 0}}
        )

    def toggle_like(self, blog_id, user_id):
        """Toggle like status for a blog"""
        # Check if user already liked the blog
        like = self.db.blog_likes.find_one({
            "blog_id": ObjectId(blog_id),
            "user_id": ObjectId(user_id)
        })

        if like:
            # Unlike: Remove like and decrement count
            self.db.blog_likes.delete_one({
                "blog_id": ObjectId(blog_id),
                "user_id": ObjectId(user_id)
            })
            self.collection.update_one(
                {"_id": ObjectId(blog_id)},
                {"$inc": {"likes": -1}}
            )
            return False
        else:
            # Like: Add like and increment count
            self.db.blog_likes.insert_one({
                "blog_id": ObjectId(blog_id),
                "user_id": ObjectId(user_id),
                "created_at": datetime.utcnow()
            })
            self.collection.update_one(
                {"_id": ObjectId(blog_id)},
                {"$inc": {"likes": 1}}
            )
            return True

    def is_liked_by_user(self, blog_id, user_id):
        """Check if a blog is liked by a specific user"""
        like = self.db.blog_likes.find_one({
            "blog_id": ObjectId(blog_id),
            "user_id": ObjectId(user_id)
        })
        return bool(like)