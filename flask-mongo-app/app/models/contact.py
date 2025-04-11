from datetime import datetime
from bson import ObjectId

class Contact:
    def __init__(self, db):
        self.db = db
        self.collection = db.contacts

    def create_contact(self, data):
        contact = {
            "name": data["name"],
            "email": data["email"],
            "subject": data["subject"],
            "message": data["message"],
            "created_at": datetime.utcnow(),
            "status": "unread"  # can be 'unread', 'read', 'replied'
        }
        return self.collection.insert_one(contact)