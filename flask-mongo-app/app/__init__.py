from flask import Flask
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import Config
from flask_cors import CORS
from cloudinary_config import configure_cloudinary

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes
    
    # Configure Cloudinary
    configure_cloudinary()
    
    return app

app = create_app()

# Initialize MongoDB client
client = MongoClient(Config.MONGO_URI, server_api=ServerApi('1'))
db = client.get_database('mydb')  # Replace 'mydb' with your actual database name

# Register the blueprint once
from app.routes import bp
app.register_blueprint(bp, url_prefix='')  # Note: empty url_prefix

if __name__ == "__main__":
    app.run(debug=True)