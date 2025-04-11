import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from config import Config
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime

def migrate():
    try:
        # Use the same connection settings as your main app
        client = MongoClient(Config.MONGO_URI, server_api=ServerApi('1'))
        db = client.get_database('mydb')

        # Add views and likes fields to existing blogs
        result = db.blogs.update_many(
            {"views": {"$exists": False}},
            {
                "$set": {
                    "views": 0,
                    "likes": 0,
                    "updated_at": datetime.utcnow()
                }
            }
        )

        print(f"Successfully updated {result.modified_count} blogs")
        print("Migration completed successfully")

    except Exception as e:
        print(f"Error during migration: {str(e)}")
        sys.exit(1)
    finally:
        client.close()

if __name__ == "__main__":
    print("Starting migration...")
    migrate()