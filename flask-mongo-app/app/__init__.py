from flask import Flask
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from config import Config
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes
    return app

app = create_app()

# Initialize MongoDB client
client = MongoClient(Config.MONGO_URI, server_api=ServerApi('1'))
db = client.get_database('mydb')  # Replace 'mydb' with your actual database name

# Register the blueprint once
from app.routes import bp as main_bp
app.register_blueprint(main_bp)

if __name__ == "__main__":
    app.run(debug=True)