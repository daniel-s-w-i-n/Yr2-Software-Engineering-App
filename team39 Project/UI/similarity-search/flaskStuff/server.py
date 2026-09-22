from flask import Flask, request, jsonify
from similarity_search_function import find_close_users
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

@app.route('/api/search', methods=['POST', 'GET'])
def perform_search():
    if request.method == 'POST':
        data = request.json
        target_user_id = data.get('userId')
        limit = data.get('limit', 10)
        try:
            results = find_close_users(target_user_id, limit)
            return jsonify(results), 200
        except TypeError as e:
            logging.error(f"Type error in perform_search: {str(e)}")
            return jsonify({'error': f"Data type mismatch: {str(e)}"}), 500
        except Exception as e:
            logging.error(f"Exception in perform_search: {str(e)}")
            return jsonify({'error': str(e)}), 500
    elif request.method == 'GET':
        return jsonify({"message": "This is a GET request. Use POST to perform a search."})

@app.route('/')
def home():
    return "Welcome to the Similarity Search API!"

if __name__ == "__main__":
    app.run(debug=True)
