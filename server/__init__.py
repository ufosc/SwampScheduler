"""Main file for the server."""
import requests

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

import rate_my_professor

rpm = rate_my_professor.RateMyProfessor()
APP = Flask(__name__)
CORS(APP)

@APP.route('/teacher-ratings/', methods=['GET'])
@cross_origin()
def get_teacher_ratings():
    """Returns a teacher's rating data based on their name."""
    teacher_name = request.args.get('name')
    teacher_id = rpm.search_teachers(teacher_name)[teacher_name]
    return jsonify(rpm.get_teacher_ratings(teacher_id))

@APP.route('/schedule/', methods=['GET'])
@cross_origin()
def get_schedule():
    """
    Returns schedule data by proxing UF SOC API
    using same query parameters as accesed with this URL.
    ."""
    payload = request.args
    response = requests.get(
        "https://one.ufl.edu/apix/soc/schedule/",
        params=payload,
        timeout=10,
    )
    return jsonify(response.json())

if __name__ == '__main__':
    APP.run(debug=True)
