from flask import Flask
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from config import Config

app = Flask(__name__)

# Initialize MongoDB client
client = MongoClient(Config.MONGO_URI, server_api=ServerApi('1'))
db = client.get_database('mydb')  # Replace with your database name if needed

# Register routes
from app.routes import bp as main_bp
app.register_blueprint(main_bp)

if __name__ == "__main__":
    app.run(debug=True)