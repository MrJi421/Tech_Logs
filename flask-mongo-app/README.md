# Flask MongoDB Application

This project is a simple Flask application that integrates with MongoDB. It demonstrates how to set up a Flask app, connect to a MongoDB database, and define routes and models for handling data.

## Project Structure

```
flask-mongo-app
├── app
│   ├── __init__.py
│   ├── routes.py
│   └── models.py
├── config.py
├── requirements.txt
└── README.md
```

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd flask-mongo-app
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install the required packages**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure your MongoDB connection**:
   Update the `config.py` file with your MongoDB URI.

5. **Run the application**:
   ```bash
   flask run
   ```

## Usage

Once the application is running, you can access it at `http://127.0.0.1:5000`. You can interact with the defined routes to perform CRUD operations on the MongoDB database.

## Dependencies

- Flask
- PyMongo

## License

This project is licensed under the MIT License.