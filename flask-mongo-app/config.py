from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    # SECRET_KEY = os.getenv('SECRET_KEY') or 'your_default_secret_key'
    MONGO_URI = os.getenv('MONGO_URI') or 'mongodb+srv://22bcaf29:3JM6SZo1aHWOm7lX@mycluster.jk3bu.mongodb.net/mydb?retryWrites=true&w=majority&appName=myCluster'