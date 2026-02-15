from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Make sure uploads folder exists
if not os.path.exists("uploads"):
    os.makedirs("uploads")

@app.route('/api/message', methods=['GET'])
def get_message():
    return jsonify({'message': 'Backend connected successfully!'})

@app.route('/api/upload', methods=['POST'])
def upload():
    file = request.files['video']
    filepath = os.path.join("uploads", file.filename)
    file.save(filepath)

    return jsonify({
        "message": "Video uploaded successfully",
        "score": 78   # dummy score
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
