from pymongo import MongoClient
from config import Config

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