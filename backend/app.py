from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Make sure uploads folder exists
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# In-memory storage for athletes
athletes_db = []
athlete_id_counter = 1

# Helper function to calculate performance rating
def calculate_performance_rating(speed_score, strength_score, endurance_score):
    """
    Calculate overall performance rating based on scores.
    Returns: Beginner, Intermediate, Advanced, or Elite
    """
    # Average of the three scores
    avg_score = (speed_score + strength_score + endurance_score) / 3
    
    if avg_score >= 85:
        return "Elite"
    elif avg_score >= 70:
        return "Advanced"
    elif avg_score >= 50:
        return "Intermediate"
    else:
        return "Beginner"

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

# Athlete endpoints
@app.route('/api/athletes', methods=['GET'])
def get_athletes():
    """Get all athletes"""
    return jsonify({
        'athletes': athletes_db,
        'count': len(athletes_db)
    })

@app.route('/api/athletes', methods=['POST'])
def create_athlete():
    """Create a new athlete"""
    global athlete_id_counter
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'age', 'gender', 'sport', 'height', 'weight', 
                       'speed_score', 'strength_score', 'endurance_score']
    
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Create athlete object
    athlete = {
        'id': athlete_id_counter,
        'name': data['name'],
        'age': int(data['age']),
        'gender': data['gender'],
        'sport': data['sport'],
        'height': float(data['height']),
        'weight': float(data['weight']),
        'speed_score': float(data['speed_score']),
        'strength_score': float(data['strength_score']),
        'endurance_score': float(data['endurance_score']),
        'created_at': datetime.now().isoformat()
    }
    
    athletes_db.append(athlete)
    athlete_id_counter += 1
    
    return jsonify({
        'message': 'Athlete created successfully',
        'athlete': athlete
    }), 201

@app.route('/api/athletes/<int:athlete_id>', methods=['GET'])
def get_athlete(athlete_id):
    """Get a specific athlete by ID"""
    athlete = next((a for a in athletes_db if a['id'] == athlete_id), None)
    
    if not athlete:
        return jsonify({'error': 'Athlete not found'}), 404
    
    return jsonify({'athlete': athlete})

@app.route('/api/analysis/<int:athlete_id>', methods=['GET'])
def get_athlete_analysis(athlete_id):
    """Get performance analysis for a specific athlete"""
    athlete = next((a for a in athletes_db if a['id'] == athlete_id), None)
    
    if not athlete:
        return jsonify({'error': 'Athlete not found'}), 404
    
    # Calculate performance rating
    rating = calculate_performance_rating(
        athlete['speed_score'],
        athlete['strength_score'],
        athlete['endurance_score']
    )
    
    avg_score = (athlete['speed_score'] + athlete['strength_score'] + athlete['endurance_score']) / 3
    
    analysis = {
        'athlete_id': athlete_id,
        'athlete_name': athlete['name'],
        'performance_rating': rating,
        'average_score': round(avg_score, 2),
        'speed_score': athlete['speed_score'],
        'strength_score': athlete['strength_score'],
        'endurance_score': athlete['endurance_score'],
        'recommendations': generate_recommendations(rating, athlete)
    }
    
    return jsonify({'analysis': analysis})

def generate_recommendations(rating, athlete):
    """Generate recommendations based on rating and athlete data"""
    recommendations = []
    
    if rating == "Beginner":
        recommendations.append("Focus on building fundamental skills and conditioning")
        recommendations.append("Consider working with a coach to develop proper technique")
    elif rating == "Intermediate":
        recommendations.append("Continue building strength and endurance")
        recommendations.append("Focus on sport-specific training drills")
    elif rating == "Advanced":
        recommendations.append("Fine-tune technique and optimize performance")
        recommendations.append("Consider competitive opportunities")
    elif rating == "Elite":
        recommendations.append("Maintain peak performance through advanced training")
        recommendations.append("Consider professional or elite-level competition")
    
    # Sport-specific recommendations
    if athlete['speed_score'] < athlete['strength_score']:
        recommendations.append("Focus on speed and agility training")
    elif athlete['strength_score'] < athlete['speed_score']:
        recommendations.append("Incorporate strength training into your routine")
    
    return recommendations

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
